import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-ajustesflujo',
  templateUrl: 'ajustesflujo.html'
})
export class AjustesFlujoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  public ltipodocumentocdetalle: SelectItem[] = [{ label: '...', value: null }];
  private catalogoDetalle: CatalogoDetalleComponent;
  public lcatalogoestado: SelectItem[] = [{ label: '...', value: null }];
  public ltipoefectivo: SelectItem[] = [{ label: '...', value: null }];
  public ltipoplancuentas: SelectItem[] = [{label: '...', value: null}];
  public totalCredito: Number = 0;
  public totalDebito: Number = 0;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tconflujoefectivo', 'AJUSTES', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
    this.mcampos.aniofin = this.anioactual;
    //this.consultar();  // para ejecutar consultas automaticas.
  }

  ngAfterViewInit() {
    this.consultarCatalogos();
  }

  crearNuevo() {
    super.crearNuevo();
    this.mostrarDialogoGenerico = true;
  }

  actualizar() {
    super.actualizar();
    this.calcularTotalAjustes(this.lregistros);
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    this.encerarMensajes();
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
    this.mostrarDialogoGenerico = true;
    this.calcularTotalAjustes(this.lregistros);
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (this.estaVacio(this.mcampos.tipoplancuenta)) {
      this.mostrarMensajeError("DEBE SELECCIONAR EL TIPO DE CUENTA");
        return;
      }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.ccuenta', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tconcatalogo', 'nombre', 'nnombre', 'i.ccuenta = t.ccuenta');
    consulta.cantidad = 200;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.anioinicio =  (this.mcampos.aniofin -1) +'1231';
    this.mfiltros.aniofin =  this.mcampos.aniofin + '1231';
    this.mfiltros.tipoplanccatalogo = 1001;
    this.mfiltros.tipoplancdetalle = this.mcampos.tipoplancuenta;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    this.calcularTotalAjustes(this.lregistros);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.calcularTotalAjustes(this.lregistros);
    if (this.redondear(Number(this.totalCredito),2) - this.redondear(Number(this.totalDebito),2) != 0) {
        this.mostrarMensajeError("NO CUMPLE EL CONTROL DE PARTIDA DOBLE");
        return;
    }
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.mdatos.anioinicio =  (this.mcampos.aniofin -1) +'1231';
    this.rqMantenimiento.mdatos.aniofin =  this.mcampos.aniofin + '1231';
    this.rqMantenimiento.mdatos.tipoplanccatalogo = 1001;
    this.rqMantenimiento.mdatos.tipoplancdetalle = this.mcampos.tipoplancuenta;
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  cerrarDialogo() {
  }

  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.ltipoplancuentas, resp.TIPOPLANCUENTA, 'cdetalle');
    }
    this.lconsulta = [];
  }

  llenarConsultaCatalogos(): void {
    const mfiltrosEstUsr: any = {'ccatalogo': 1001};
    const consultaTipoPlanCuenta = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstUsr, {});
    consultaTipoPlanCuenta.cantidad = 50;
    this.addConsultaPorAlias('TIPOPLANCUENTA', consultaTipoPlanCuenta);
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

  public calcularTotalAjustes(lista: any) {
    this.totalCredito = 0;
    this.totalDebito = 0;
    for (const i in lista) {
      const reg = lista[i];
      this.totalCredito += reg.ajustehaber;
      this.totalDebito += reg.ajustedebe;
    }
  }
}

