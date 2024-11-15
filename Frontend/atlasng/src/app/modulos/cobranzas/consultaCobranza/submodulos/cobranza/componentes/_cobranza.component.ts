import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta, Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';

@Component({
  selector: 'app-tabla-cobranza',
  templateUrl: '_cobranza.html'
})
export class CobranzaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcobCobranza', 'CONSULTACOBRANZA', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    // No existe para la consulta de tabla cobranza
  }

  actualizar() {
    // No existe para la consulta de tabla cobranza
  }

  eliminar() {
    // No existe para la consulta de tabla cobranza
  }

  cancelar() {
    // No existe para la consulta de tabla cobranza
  }

  public selectRegistro(registro: any) {
    // No existe para la consulta de tabla cobranza
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (!this.validaFiltrosRequeridos()) {
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.coperacion', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tcobestatus', 'nombre', 'nstatus', 'i.cestatus = t.cestatus');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  public consultarAnterior() {
    if (!this.validaFiltrosRequeridos()) {
      return;
    }
    super.consultarAnterior();
  }

  public consultarSiguiente() {
    if (!this.validaFiltrosRequeridos()) {
      return;
    }
    super.consultarSiguiente();
  }

  public fijarFiltrosConsulta() {

  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    this.mcampos.fingreso = super.integerToFormatoFecha(this.registro.fingreso);
    this.mcampos.fasignacion = super.integerToFormatoFecha(this.registro.fasignacion);
    this.mcampos.fultmodificacion = super.integerToFormatoFecha(this.registro.fultmodificacion);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    // No existe para la consulta de tabla cobranza
  }

  public crearDtoMantenimiento() {
    // No existe para la consulta de tabla cobranza
  }

  public postCommit(resp: any) {
    // No existe para la consulta de tabla cobranza
  }


}
