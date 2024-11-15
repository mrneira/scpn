import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';
import { DatosGeneralesComponent } from '../../ingresogar/submodulos/datosgenerales/componentes/_datosGenerales.component';
import { OperacionGarComponent } from '../../ingresogar/submodulos/datosgenerales/componentes/_operacionGar.component';
import { CamposGarComponent } from '../../ingresogar/submodulos/datosgenerales/componentes/_camposGar.component';
import { AvaluoComponent } from '../../ingresogar/submodulos/avaluo/componentes/_avaluo.component';
import { InscripcionComponent } from '../../inscripciongar/submodulos/inscripcion/componentes/_inscripcion.component';
import { LovOperacionGarComponent } from '../../../lov/operacion/componentes/lov.operacionGar.component';

@Component({
  selector: 'app-aceptar-gar',
  templateUrl: 'aceptarGar.html'
})
export class AceptarGarComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  @ViewChild(LovOperacionGarComponent)
  private lovOperacion: LovOperacionGarComponent;

  @ViewChild(DatosGeneralesComponent)
  datosGeneralesComponent: DatosGeneralesComponent;

  @ViewChild(OperacionGarComponent)
  garComponent: OperacionGarComponent;

  @ViewChild(CamposGarComponent)
  camposComponent: CamposGarComponent;

  @ViewChild(AvaluoComponent)
  avaluo: AvaluoComponent;

  @ViewChild(InscripcionComponent)
  inscripcion: InscripcionComponent;

  private coperacion = 0;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CREASOLICITUDINGRESO', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    this.consultarCatalogos();
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
    this.datosGeneralesComponent.formeditable = false;
    this.datosGeneralesComponent.operaciongar.formeditable = false;
    this.avaluo.formeditable = false;
    this.inscripcion.formeditable = false;
  }

  selectRegistro(registro: any) {
    // No existe para el padre
  }

  crearNuevo() {
    // No existe para el padre
  }

  actualizar() {
    // No existe para el padre
  }

  eliminar() {
    // No existe para el padre
  }

  cancelar() {
    // No existe para el padre
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();

    // Consulta datos.
    const conSol = this.garComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.garComponent.alias, conSol);

    const conDatos = this.camposComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.camposComponent.alias, conDatos);

    const conAval = this.avaluo.crearDtoConsulta();
    this.addConsultaPorAlias(this.avaluo.alias, conAval);

    const conIns = this.inscripcion.crearDtoConsulta();
    this.addConsultaPorAlias(this.inscripcion.alias, conIns);
  }

  private fijarFiltrosConsulta() {
    this.garComponent.mfiltros.coperacion = this.coperacion;
    this.garComponent.mfiltros.cpersona = this.mcampos.cpersona;
    this.garComponent.fijarFiltrosConsulta();

    this.camposComponent.mfiltros.coperacion = this.coperacion;
    this.camposComponent.fijarFiltrosConsulta();

    this.avaluo.mfiltros.coperacion = this.coperacion;
    this.avaluo.fijarFiltrosConsulta();

    this.inscripcion.mfiltros.coperacion = this.coperacion;
    this.inscripcion.fijarFiltrosConsulta();
  }

  validaFiltrosConsulta(): boolean {
    return this.garComponent.validaFiltrosRequeridos() && this.camposComponent.validaFiltrosRequeridos();
  }

  public postQuery(resp: any) {
    this.garComponent.postQuery(resp);
    this.camposComponent.postQuery(resp);
    this.avaluo.postQuery(resp);
    this.inscripcion.postQuery(resp);

    if (this.coperacion !== 0) {
      this.editable = false;
    }
  }

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    if (sessionStorage.getItem('t') === '120' && this.mcampos.coperacion === undefined) {
      super.mostrarMensajeError('INGRESE EL NUMERO DE OPERACION');
      return;
    }
    if (!this.estaVacio(this.mcampos.coperacion)) {
      this.rqMantenimiento.coperacion = this.mcampos.coperacion;
    }

    if (this.tran === '2') {
      this.garComponent.selectRegistro(this.garComponent.registro);
      this.garComponent.registro.cestatus = 'ANU';
      this.garComponent.actualizar();
    }
    super.addMantenimientoPorAlias(this.garComponent.alias, this.garComponent.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.camposComponent.alias, this.camposComponent.getMantenimiento(2));
    super.addMantenimientoPorAlias(this.avaluo.alias, this.avaluo.getMantenimiento(3));
    super.addMantenimientoPorAlias(this.inscripcion.alias, this.inscripcion.getMantenimiento(4));

    if (this.tran === '2') {
      super.grabar(false);
    } else {
      super.grabar();
    }
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  validaGrabar() {
    return this.garComponent.validaGrabar() && this.camposComponent.validaGrabar() && this.avaluo.validaGrabar();
  }

  public postCommit(resp: any) {
    this.garComponent.postCommit(resp, this.getDtoMantenimiento(this.garComponent.alias));
    this.camposComponent.postCommit(resp, this.getDtoMantenimiento(this.camposComponent.alias));
    this.avaluo.postCommit(resp, this.getDtoMantenimiento(this.avaluo.alias));
    this.inscripcion.postCommit(resp, this.getDtoMantenimiento(this.inscripcion.alias));

    if (resp.cod === 'OK') {
      this.mcampos.coperacion = this.garComponent.registro.coperacion;
      this.coperacion = this.garComponent.registro.coperacion;
    }
  }

  /**Muestra lov de personas */
  mostrarLovPersona(): void {
    this.lovPersonas.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.nombre = reg.registro.nombre;
      this.mcampos.identificacion = reg.registro.identificacion;

      this.garComponent.registro.cpersona = reg.registro.cpersona;
      this.garComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.avaluo.mcampos.cpersona = reg.registro.cpersona;
      this.inscripcion.mcampos.cpersona = reg.registro.cpersona;

      this.coperacion = 0;
      this.mcampos.coperacion = null;

      this.lovOperacion.mfiltros.cpersona = this.mcampos.cpersona;
      this.mostrarLovOperacion();
    }
  }

  /**Muestra lov de operaciones de cartera. */
  mostrarLovOperacion(): void {
    if (this.mcampos.cpersona === undefined) {
      this.mostrarMensajeInfo('SELECCIONE UN CLIENTE');
      return;
    }
    this.lovOperacion.mfiltrosesp.cestatus = 'in (\'ING\')';
    this.lovOperacion.mfiltros.cpersona = this.mcampos.cpersona;
    this.lovOperacion.consultar();
    this.lovOperacion.showDialog();
  }

  /**Retorno de lov de operacion de cartera. */
  fijarLovOperacionSelec(reg: any): void {
    this.mcampos.coperacion = reg.registro.coperacion;
    this.coperacion = reg.registro.coperacion;
    this.consultar();
  }

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosProd: any = { 'cmodulo': 9 };
    const consultaProd = new Consulta('TgenProducto', 'Y', 't.nombre', mfiltrosProd, {});
    consultaProd.cantidad = 100;
    this.addConsultaCatalogos('PRODUCTO', consultaProd, this.garComponent.lproducto, this.llenaListaProd, 'cproducto', this.componentehijo, false);

    const mfiltrosTipoProd: any = { 'cmodulo': 9 };
    const consultaTipoProd = new Consulta('TgenTipoProducto', 'Y', 't.nombre', mfiltrosTipoProd, {});
    consultaTipoProd.cantidad = 100;
    this.addConsultaCatalogos('TIPOPRODUCTO', consultaTipoProd, this.garComponent.lproducto, this.llenarTipoProducto, '', this.componentehijo, false);

    const consultaTipogar = new Consulta('TgarTipoGarantia', 'Y', 't.nombre', null, null);
    consultaTipogar.cantidad = 50;
    this.addConsultaCatalogos('TIPOGAR', consultaTipogar, this.garComponent.ltipogarantia, super.llenaListaCatalogo, 'ctipogarantia', this.componentehijo, false);

    const consultaTipoBean = new Consulta('TgarTipoBien', 'Y', 't.nombre', null, null);
    consultaTipoBean.cantidad = 50;
    this.addConsultaCatalogos('TIPOBIEN', consultaTipoBean, null, this.llenaListaTipoBien, 'ctipobien', this.componentehijo, false);

    const consultaClasif = new Consulta('TgarClasificacion', 'Y', 't.nombre', null, null);
    consultaClasif.cantidad = 50;
    this.addConsultaCatalogos('CLASIF', consultaClasif, this.garComponent.lclasificacion, super.llenaListaCatalogo, 'cclasificacion');

    this.ejecutarConsultaCatalogos();
  }

  public llenaListaProd(pLista: any, pListaResp, campopk = 'pk', agregaRegistroVacio = true, componentehijo = null): any {
    super.llenaListaCatalogo(pLista, pListaResp, campopk, agregaRegistroVacio, componentehijo);
    componentehijo.garComponent.registro.cproducto = pLista[0].value;
  }

  public llenarTipoProducto(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    componentehijo.garComponent.ltipoproductototal = pListaResp;
    componentehijo.garComponent.cambiarTipoProducto();
  }

  public llenaListaTipoBien(pLista: any, pListaResp, campopk = 'pk', agregaRegistroVacio = true, componentehijo = null): any {
    componentehijo.garComponent.ltiposbien = pListaResp;
    componentehijo.garComponent.cambiaTipoGarantia();
  }


}
