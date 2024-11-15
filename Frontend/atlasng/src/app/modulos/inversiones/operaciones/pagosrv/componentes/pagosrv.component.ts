
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { LovInversionesrvComponent } from '../../../../inversiones/lov/inversionesrv/componentes/lov.inversionesrv.component';

@Component({
  selector: 'app-pagosrv',
  templateUrl: 'pagosrv.html'
})
export class PagosrvComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovInversionesrvComponent)
  lovInversiones: LovInversionesrvComponent;

  public lbancos: SelectItem[] = [{ label: '...', value: null }];

  fecha = new Date();

  public edited = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tinvinversionrentavariable', 'RENTAVARIABLE', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
    this.consultar();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {

    super.crearNuevo();
    this.mcampos.ncodigotitulo = null;
    this.registro.estadoccatalogo = 1218;
    this.registro.estadocdetalle = 'PEN';
    this.registro.fingreso = this.fecha;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;

  }

  actualizar() {

    let lpagoEfectivo: number = 0;
    let lpagoAcciones: number = 0;


    if (!this.estaVacio(this.registro.pagoefectivo) && Number(this.registro.pagoefectivo) != 0) lpagoEfectivo = Number(this.registro.pagoefectivo);

    if (!this.estaVacio(this.registro.pagoaccionespreciounitario) && Number(this.registro.pagoaccionespreciounitario) != 0 &&
      !this.estaVacio(this.registro.pagoaccionesnumeroacciones) && Number(this.registro.pagoaccionesnumeroacciones) != 0) {
      lpagoAcciones = Number(this.registro.pagoaccionespreciounitario) * Number(this.registro.pagoaccionesnumeroacciones);
    }

    if (lpagoEfectivo <= 0 && lpagoAcciones <= 0) {
      this.mostrarMensajeError("LOS VALORES A REGISTRAR DEBEN SER POSITIVOS");
      return;
    }

    this.encerarMensajes();

    super.actualizar();
    this.registro.mdatos.ncodigotitulo = this.mcampos.ncodigotitulo;

    if (!this.estaVacio(this.registro.bancocdetalle)) {
      this.registro.bancoccatalogo = 1224;
    }
    else {
      this.registro.bancoccatalogo = null;
    }

    if (!this.estaVacio(this.registro.pagoaccionespreciounitario) &&
      this.registro.pagoaccionespreciounitario != 0 &&
      !this.estaVacio(this.registro.pagoaccionesnumeroacciones) &&
      this.registro.pagoaccionesnumeroacciones != 0) {
      this.registro.pagoaccionesmontototal = this.registro.pagoaccionespreciounitario * this.registro.pagoaccionesnumeroacciones;
    }
    else {
      this.registro.pagoaccionesmontototal = null;
    }

  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
    this.mcampos.ncodigotitulo = this.registro.mdatos.ncodigotitulo;


  }

  // Inicia CONSULTA *********************
  consultar() {
    if (!this.validaFiltrosConsulta()) {
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cinversion', {}, this.mfiltrosesp);
    consulta.addSubquery('tinvinversion', 'codigotitulo', 'ncodigotitulo', 'i.cinversion = t.cinversion');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nbanco', 'i.ccatalogo = t.bancoccatalogo and i.cdetalle = t.bancocdetalle');
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {

    this.mfiltrosesp.estadocdetalle = ' in (\'PEN\',\'DEV\')';
  }

  validaFiltrosConsulta(): boolean {
    return true;

  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
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

  mostrarLovInversiones(): void {
   
    this.lovInversiones.mfiltros.estadocdetalle = 'APR';
    this.lovInversiones.showDialog();
  }

  fijarLovInversionesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cinversion = reg.registro.cinversion;

      this.mcampos.ncodigotitulo = reg.registro.codigotitulo;

    }
  }

  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.encerarMensajes();
          this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
          this.manejaRespuestaCatalogos(resp);

        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  llenarConsultaCatalogos(): void {


    const mfiltrosBanco: any = { 'ccatalogo': 1224 };
    const consultaBanco = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosBanco, {});
    consultaBanco.cantidad = 200;
    this.addConsultaPorAlias('BANCO', consultaBanco);


  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    if (resp.cod === 'OK') {

      this.llenaListaCatalogo(this.lbancos, resp.BANCO, 'cdetalle');

    }
    this.lconsulta = [];
  }

}
