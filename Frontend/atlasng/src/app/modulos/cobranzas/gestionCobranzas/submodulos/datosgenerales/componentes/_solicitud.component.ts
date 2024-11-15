import {Component, OnInit, AfterViewInit} from '@angular/core';
import {Router} from '@angular/router';
import {DtoServicios} from '../../../../../../util/servicios/dto.servicios';
import {BaseComponent} from '../../../../../../util/shared/componentes/base.component';

@Component({
  selector: 'app-solicitud',
  template: ''
})
export class SolicitudComponent extends BaseComponent implements OnInit, AfterViewInit {

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'RUBROS', 'DtoRubro', true, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.camposfecha.faprobacion = null;
    this.mcampos.camposfecha.fapertura = null;
    this.mcampos.camposfecha.fvencimiento = null;
    this.mcampos.camposfecha.fcancelacion = null;
  }

  ngAfterViewInit() {}

  crearNuevo() {}

  actualizar() {}

  eliminar() {
    super.eliminar();
  }

  cancelar() {}

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  consultar() {
    if (this.estaVacio(this.mfiltros.coperacion)) {
      return false;
    }
    this.rqConsulta.CODIGOCONSULTA = 'CONSULTAOPERACIONCARTERA';
    this.rqConsulta.coperacion = this.mfiltros.coperacion;
    super.consultar();
  }

  public fijarFiltrosConsulta() {}

  validaFiltrosConsulta(): boolean {
    if (this.estaVacio(this.mfiltros.coperacion)) {
      this.mostrarMensajeError('OPERACIÓN REQUERIDA');
      return false;
    }
    return true;
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    if (resp.cod !== 'OK') {
      return;
    }
    const moperacion = resp.OPERACION != null ? resp.OPERACION[0] : null;
    const mtcaroperacion = resp.TCAROPERACION != null ? resp.TCAROPERACION[0] : null;
    super.crearnuevoRegistro();
    this.registro = Object.assign(this.registro, moperacion, mtcaroperacion);
    this.generaCamposFechaRegistro(this.registro);
  }
  
  grabar(): void {}

  validaGrabar() {
    return super.validaGrabar('NO HA REALIZADADO LA VALIDACIÓN DEL FORMULARIO[DATOS GENERAL]');
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any, dtoext = null) {
    super.postCommitEntityBean(resp, dtoext);
  }
}