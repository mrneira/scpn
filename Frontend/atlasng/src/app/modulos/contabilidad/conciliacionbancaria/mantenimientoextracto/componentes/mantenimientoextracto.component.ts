import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';
import { LovCuentasContablesComponent } from '../../../../contabilidad/lov/cuentascontables/componentes/lov.cuentasContables.component';

@Component({
  selector: 'app-mantenimientoextracto',
  templateUrl: 'mantenimientoextracto.html'
})
export class MantenimientoextractoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  lovPersonas: LovPersonasComponent;

  @ViewChild(LovCuentasContablesComponent)
  lovCuentasContables: LovCuentasContablesComponent;

  public lestadoconciliacion: SelectItem[] = [{ label: '...', value: null }];

  fecha = new Date();
  public lcuentasbancarias: any[];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tconextractobancario', 'EXTRACTO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.mcampos.fechainicial = new Date(
      Number(
        this.dtoServicios.mradicacion.fcontable.toString().substring(0, 4)
      ),
      Number(
        this.dtoServicios.mradicacion.fcontable.toString().substring(4, 6)
      ) - 1,
      1
    );
    this.mcampos.fechafinal = this.stringToFecha(
      this.integerToFormatoFecha(this.dtoServicios.mradicacion.fcontable)
    );
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
  }

  actualizar() {
    if (this.registro.montocredito != 0 && this.registro.montodebito != 0) {
      this.mostrarMensajeError("EXTRACTO NO PUEDE CONTENER VALOR DE CRÉDITO Y DÉBITO A LA VEZ.");
    }
    if (this.registro.montocredito === 0 && this.registro.montodebito === 0) {
      this.mostrarMensajeError("EXTRACTO DEBE TENER AL MENOS UN VALOR DE CRÉDITO O DÉBITO.");
    }
    super.actualizar();
    this.registrarEtiqueta(this.registro, this.lestadoconciliacion, "estadoconciliacioncdetalle", "ncatalogoestado");
    //this.registro.fecha= this.fechaToInteger(this.registro.mdatos.fechaDate);//CCA cambios conciliacion No funciona esta linea
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  consultar() {
    if (this.mcampos.ccuenta != undefined && this.mcampos.fechainicial != undefined && this.mcampos.fechafinal != undefined) {
      if (this.mcampos.fechafinal < this.mcampos.fechainicial) {
        this.mostrarMensajeError("LA FECHA FINAL DEBE SER IGUAL O MAYOR A LA FECHA INICIAL");
        return;
      }
      this.crearDtoConsulta();
      super.consultar();
    }
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    this.mfiltros.ajusteextracto = false;
    this.mfiltros.conciliado = false;
    
    let filteredElements=this.lcuentasbancarias.filter(element => element.ccuenta == this.mfiltros.ccuentabanco);
    this.mfiltros.ccuentabanco = filteredElements[0].ccuentabanco;
    let lfechainicial: number = (this.mcampos.fechainicial.getFullYear() * 10000) + ((this.mcampos.fechainicial.getMonth() + 1) * 100) + this.mcampos.fechainicial.getDate();
    let lfechafinal: number = (this.mcampos.fechafinal.getFullYear() * 10000) + ((this.mcampos.fechafinal.getMonth() + 1) * 100) + this.mcampos.fechafinal.getDate();
    this.mfiltrosesp.fmovimiento = 'between ' + lfechainicial + ' and ' + lfechafinal + ' ';
   
    const consulta = new Consulta(this.entityBean, 'Y', 't.cextractobancario', this.mfiltros, this.mfiltrosesp);
    consulta.cantidad = 10000;
    this.addConsulta(consulta);
    return consulta;
  }

 

  private fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    //this.gene (this.registro);
  }

  grabar(): void {
    this.lmantenimiento = []; 
    this.crearDtoMantenimiento();
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  mostrarLovCuentasContables(): void {
    this.lovCuentasContables.showDialog(true); // con true solo muestra cuentas de movimiento.
  }

  fijarLovCuentasContablesSelec(reg: any): void {

    if (reg.registro !== undefined) {

      this.msgs = [];
      this.mfiltros.ccuentabanco = reg.registro.ccuenta
      this.mcampos.ccuenta = reg.registro.ccuenta;
      this.mcampos.ncuenta = reg.registro.nombre;
      //this.consultar();

    }
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
    
    const mfiltroscuenta: any = { ccuenta: this.mfiltros.ccuentabanco };
    const conDestino = new Consulta('tconbanco', 'Y', 't.ccuentabanco', mfiltroscuenta, {});
    conDestino.cantidad = 5;
    this.addConsultaCatalogos('CUENTASBANCARIAS', conDestino, this.lcuentasbancarias, this.llenarCuentasBancarias, '', this.componentehijo);

    this.ejecutarConsultaCatalogos();
  }

  public llenarCuentasBancarias(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    this.componentehijo.lcuentasbancarias = pListaResp;
  }

  private manejaRespuestaCatalogos(resp: any) {
    if (resp.cod === 'OK') {

      this.llenaListaCatalogo(this.lestadoconciliacion, resp.ESTADOCONCILIACION, 'cdetalle');

    }
    this.lconsulta = [];
  }

  cerrarDialogo ()
  {}
}
