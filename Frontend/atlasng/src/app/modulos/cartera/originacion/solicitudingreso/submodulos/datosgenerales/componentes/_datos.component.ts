import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta, Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { TipoProductoComponent } from '../../../../../../generales/tipoproducto/componentes/tipoProducto.component';

@Component({
  selector: 'app-datos',
  templateUrl: '_datos.html'
})
export class DatosComponent extends BaseComponent implements OnInit, AfterViewInit {

  public cflujo;
  public habilitagarantias = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarSolicitud', 'TCARSOLICITUD', true, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.camposfecha.fingreso = null;
    this.mcampos.camposfecha.finiciopagos = null;
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
  }

  actualizar() {
    super.actualizar();
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

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'N', 't.csolicitud', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenProducto', 'nombre', 'nproducto', 'i.cmodulo = t.cmodulo and i.cproducto = t.cproducto');
    consulta.addSubquery('TgenTipoProducto', 'nombre', 'ntipoproducto', 'i.cmodulo = t.cmodulo and i.cproducto = t.cproducto and i.ctipoproducto = t.ctipoproducto');
    consulta.addSubquery('TcarEstatusSolicitud', 'nombre', 'nestatussolicitud', 'i.cestatussolicitud = t.cestatussolicitud');
    consulta.addSubquery('TcarEstadoOperacion', 'nombre', 'nestadooperacion', 'i.cestadooperacion = t.cestadooperacion');
    consulta.addSubquery('TgenSucursal', 'nombre', 'nsucursal', 'i.csucursal = t.csucursal');
    consulta.addSubquery('TgenAgencia', 'nombre', 'nagencia', 'i.cagencia = t.cagencia and i.csucursal = t.csucursal');
    consulta.addSubquery('TgenFrecuencia', 'nombre', 'nfrecuencia', 'i.cfrecuecia = t.cfrecuecia');
    consulta.addSubquery('TcarTipoTablaAmortizacion', 'nombre', 'ntipotabla', 'i.ctabla = t.ctabla');
    consulta.addSubquery('TgenBaseCalculo', 'nombre', 'nbasecalculo', 'i.cbasecalculo = t.cbasecalculo');
    consulta.addSubquery('TcarProducto', 'exigegarantia', 'exigegarantia', 'i.cmodulo = t.cmodulo and i.cproducto = t.cproducto and i.ctipoproducto = t.ctipoproducto and i.verreg = 0');
    consulta.addSubquery('TcarOperacionArregloPago', 'ctipoarreglopago', 'tipoarreglo', 'i.csolicitud = t.csolicitud');
    consulta.addSubquery('TcarProducto', 'cflujo', 'cflujo', 'i.cmodulo = t.cmodulo and i.cproducto = t.cproducto and i.ctipoproducto = t.ctipoproducto and i.verreg = 0');
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {

  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  habilitarEdicion() {
    if (!this.validaFiltrosRequeridos()) {
      return;
    }
    super.habilitarEdicion();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    if (resp.cod === 'OK') {
      this.cflujo = resp.TCARSOLICITUD.mdatos.cflujo;
      const exigegararantia = resp.TCARSOLICITUD.mdatos.exigegarantia;
      this.habilitagarantias = (exigegararantia === null) ? false : exigegararantia;
    }
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
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

  validaGrabar() {
    return super.validaGrabar('NO HA REALIZADADO LA VALIDACIÓN DEL FORMULARIO[DATOS GENERAL]');
  }
  // Fin MANTENIMIENTO *********************

}