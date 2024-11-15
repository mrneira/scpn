import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta, Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';


@Component({
  selector: 'app-val-vencidos',
  templateUrl: '_valVencidos.html'
})
export class ValVencidosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public cxp = null;
  public totalvencido = 0;


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'VALVENCIDOS', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
    this.mcampos.ffvencimiento = new Date(this.integerToDate(this.dtoServicios.mradicacion.fcontable));
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    // No existe para la consulta de tabla amortizacion
  }

  actualizar() {
    // No existe para la consulta de tabla amortizacion
  }

  eliminar() {
    // No existe para la consulta de tabla amortizacion
  }

  cancelar() {
    // No existe para la consulta de tabla amortizacion
  }

  public selectRegistro(registro: any) {
    // No existe para la consulta de tabla amortizacion
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.rqConsulta.coperacion = this.mfiltros.coperacion;
    this.rqConsulta.ffvencimiento = this.fechaToInteger(this.mcampos.ffvencimiento);
    this.rqConsulta.mdatos.CODIGOCONSULTA = 'CONSULTARUBROSVENCIDOSCARTERA';
    super.consultar();
  }

  public consultarAnterior() {
    // No existe para el padre
  }

  public consultarSiguiente() {
    // No existe para el padre
  }

  public fijarFiltrosConsulta() {

  }

  validaFiltrosConsulta(): boolean {
    if (this.mfiltros.coperacion === 0 || this.mfiltros.coperacion === undefined) {
      this.mostrarMensajeError('OPERACIÓN REQUERIDA');
      return;
    }
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    if (resp.cod !== 'OK') {
      return;
    }
    this.lregistros = resp.RUBROS;
    this.cxp = resp.CXP;
    this.totalvencido = resp.TOTALVENCIDO;
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    // No existe para la consulta de tabla amortizacion
  }

  public crearDtoMantenimiento() {
    // No existe para la consulta de tabla amortizacion
  }

  public postCommit(resp: any) {
    // No existe para la consulta de tabla amortizacion
  }


}
