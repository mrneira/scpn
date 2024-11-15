import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';

@Component({
  selector: 'app-tabla-acciones-judiciales',
  templateUrl: '_tablaAccionesJudiciales.html'
})
export class TablaAccionesJudicialesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public mtotales: any = {};

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcobCobranzaLegal', 'TABLA', false, false);
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.secuencia desc', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'netapa', 'i.cdetalle = t.cdetalleetapa and i.ccatalogo = t.ccatalogoetapa');
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
