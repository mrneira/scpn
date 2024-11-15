import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';

import { LovPersonasComponent } from '../../../personas/lov/personas/componentes/lov.personas.component';
import { LovSegurosComponent } from '../../lov/seguros/componentes/lov.seguros.component';
import { DatosOperacionComponent } from '../submodulos/datosOperacion/componentes/_datosOperacion.component'
import { DatosGarantiaComponent } from '../submodulos/datosGarantia/componentes/_datosGarantia.component'
import { DatosGeneralesComponent } from '../submodulos/datosgenerales/componentes/_datosGenerales.component';
import { OperacionGarComponent } from '../submodulos/datosgenerales/componentes/_operacionGar.component';
import { CamposGarComponent } from '../submodulos/datosgenerales/componentes/_camposGar.component';
@Component({
  selector: 'app-renovacion-seguro',
  templateUrl: 'renovacionSeguro.html'
})
export class RenovacionSeguroComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  lovPersonas: LovPersonasComponent;

  @ViewChild(LovSegurosComponent)
  lovSeguros: LovSegurosComponent;

  @ViewChild(DatosOperacionComponent)
  operacionComponent: DatosOperacionComponent;

  @ViewChild(DatosGarantiaComponent)
  garantiaComponent: DatosGarantiaComponent;
  
  @ViewChild(DatosGeneralesComponent)
  generalComponent: DatosGeneralesComponent;

  @ViewChild(OperacionGarComponent)
  garComponent: OperacionGarComponent;

  @ViewChild(CamposGarComponent)
  camposComponent: CamposGarComponent;
  public habilitagrabar = true;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TsgsSeguro', 'SEGURO', true, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    this.consultarCatalogos();
    super.init();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    // super.crearNuevo();
  }

  actualizar() {
    // super.actualizar();
  }

  habilitarEdicion() {
    if (this.estaVacio(this.mfiltros.coperacioncartera)) {
      super.mostrarMensajeInfo('NÚMERO DE OPERACIÓN REQUERIDA');
      return;
    }

    return super.habilitarEdicion();
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (this.estaVacio(this.mfiltros.coperacioncartera)) {
      super.mostrarMensajeInfo('NÚMERO DE OPERACIÓN REQUERIDA');
      return;
    }

    this.fijarFiltrosConsulta();

    // Consulta datos.
    const conOperacion = this.operacionComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.operacionComponent.alias, conOperacion);

    const conGarantia = this.garantiaComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.garantiaComponent.alias, conGarantia);

    const conAvaluo = this.garantiaComponent.avaluoComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.garantiaComponent.avaluoComponent.alias, conAvaluo);

    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    const consulta = new Consulta(this.entityBean, 'Y', 't.coperacioncartera', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TsgsTipoSeguroDetalle', 'nombre', 'ntiposeguro', 'i.ctiposeguro = t.ctiposeguro and i.verreg = 0');
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.operacionComponent.mfiltros.coperacion = this.mfiltros.coperacioncartera;
    this.garantiaComponent.mfiltros.coperacion = this.mfiltros.coperaciongarantia;
    this.garantiaComponent.avaluoComponent.mfiltros.coperacion = this.mfiltros.coperaciongarantia;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.operacionComponent.postQuery(resp);
    this.garantiaComponent.postQuery(resp);
    this.garComponent.postQuery(resp);
    this.camposComponent.postQuery(resp);
    this.garComponent.mfiltros.ctipogarantia =  resp.OPERACIONGARANTIA[0].ctipogarantia;
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************


  // Inicia MANTENIMIENTO *********************
  grabar(): void {
     this.lmantenimiento = []; // Encerar Mantenimiento
    super.addMantenimientoPorAlias(this.garComponent.alias, this.garComponent.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.camposComponent.alias, this.camposComponent.getMantenimiento(2));
    this.rqMantenimiento.mdatos.cpersona = this.mcampos.cpersona;
    this.rqMantenimiento.mdatos.coperacioncartera = this.mfiltros.coperacioncartera;
    this.rqMantenimiento.mdatos.coperaciongarantia =  this.mfiltros.coperaciongarantia;
    this.rqMantenimiento.mdatos.coperaciongarantianterior = this.garComponent.registro.coperacionanterior;
    this.crearDtoMantenimiento();

    if(this.estaVacio(this.garComponent.registro.coperacionanterior)){
      super.mostrarMensajeError("NO HA SELECCIONADO LA GARANTIA ANTERIOR");
      return;
    }
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  validaGrabar() {
    return this.garComponent.validaGrabar() && this.camposComponent.validaGrabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod === "OK"){
      this.habilitagrabar = false;
      
    }
  }

  /**Muestra lov de personas */
  mostrarlovpersona(): void {
    this.lovPersonas.mfiltros.csocio = 1;
    this.lovPersonas.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.nombre = reg.registro.nombre;
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.garComponent.registro.cpersona = reg.registro.cpersona;
      this.garComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.mostrarLovSeguros();
    }
  }

  /**Muestra lov de seguros */
  mostrarLovSeguros(): void {
    if (this.estaVacio(this.mcampos.cpersona)) {
      super.mostrarMensajeInfo('PERSONA REQUERIDA');
      return;
    }
    this.lovSeguros.mfiltros.cpersona = this.mcampos.cpersona;
    // this.lovSeguros.mfiltrosesp.frecepcion = 'is null';
    this.lovSeguros.consultar();
    this.lovSeguros.showDialog();
  }


  /**Retorno de lov de operaciones. */
  fijarLovSegurosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.coperacioncartera = reg.registro.coperacioncartera;
      this.mfiltros.coperaciongarantia = reg.registro.coperaciongarantia;
      this.mcampos.ntipoprod = reg.registro.mdatos.nproducto + ' - ' + reg.registro.mdatos.ntipoproducto;
      this.habilitagrabar = true;
      this.consultar();
    }
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
