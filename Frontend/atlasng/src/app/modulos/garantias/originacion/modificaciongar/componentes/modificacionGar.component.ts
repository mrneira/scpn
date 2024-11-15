import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';
import { DatosGeneralesComponent } from '../../modificaciongar/submodulos/datosgenerales/componentes/_datosGenerales.component';
import { OperacionGarComponent } from '../../modificaciongar/submodulos/datosgenerales/componentes/_operacionGar.component';
import { CamposGarComponent } from '../../modificaciongar/submodulos/datosgenerales/componentes/_camposGar.component';
import { LovOperacionGarComponent } from '../../../lov/operacion/componentes/lov.operacionGar.component';

@Component({
  selector: 'app-solicitud-modificacion',
  templateUrl: 'modificacionGar.html'
})

export class ModificacionGarComponent extends BaseComponent implements OnInit, AfterViewInit {

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

  private coperacion = 0;
  public visible = true;
  public habilitagrabar = true;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CREASOLICITUDINGRESO', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    this.consultarCatalogos();
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
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

  }

  private fijarFiltrosConsulta() {
    this.garComponent.mfiltros.coperacion = this.coperacion;
    this.garComponent.mfiltros.cpersona = this.mcampos.cpersona;
    this.garComponent.fijarFiltrosConsulta();

    this.camposComponent.mfiltros.coperacion = this.coperacion;
    this.camposComponent.fijarFiltrosConsulta();
  }

  validaFiltrosConsulta(): boolean {
    return this.garComponent.validaFiltrosRequeridos() &&
      this.camposComponent.validaFiltrosRequeridos() ;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.garComponent.postQuery(resp);
    this.camposComponent.postQuery(resp);

    if (this.mcampos.coperacion !== 0) {
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

    super.addMantenimientoPorAlias(this.garComponent.alias, this.garComponent.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.camposComponent.alias, this.camposComponent.getMantenimiento(2));
    super.grabar();
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  validaGrabar() {
    return this.garComponent.validaGrabar() && this.camposComponent.validaGrabar() ;
  }

  public postCommit(resp: any) {
    this.garComponent.postCommit(resp, this.getDtoMantenimiento(this.garComponent.alias));
    this.camposComponent.postCommit(resp, this.getDtoMantenimiento(this.camposComponent.alias));

    if (resp.cod === 'OK') {
      this.mcampos.coperacion = this.garComponent.registro.coperacion;
      this.coperacion = this.garComponent.registro.coperacion;
      this.visible = false;
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
      this.coperacion = 0;
      this.mcampos.coperacion = null;

      this.lovOperacion.mfiltros.cpersona = this.mcampos.cpersona;
    }
    this.visible = true;
  }

  /**Muestra lov de operaciones de cartera. */
  mostrarLovOperacion(): void {
    if (this.mcampos.cpersona === undefined) {
      this.mostrarMensajeInfo('SELECCIONE UN CLIENTE');
      return;
    }
    this.lovOperacion.mfiltrosesp.cestatus = 'in (\'VIG\')';
    this.lovOperacion.mfiltros.cpersona = this.mcampos.cpersona;
    this.lovOperacion.consultar();
    this.lovOperacion.showDialog();
  }

  /**Retorno de lov de operacion de cartera. */
  fijarLovOperacionSelec(reg: any): void {
    this.mcampos.coperacion = reg.registro.coperacion;
    this.coperacion = reg.registro.coperacion;
    if (!this.estaVacio(this.mcampos.coperacion)) {
      this.visible = false;
    }
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
