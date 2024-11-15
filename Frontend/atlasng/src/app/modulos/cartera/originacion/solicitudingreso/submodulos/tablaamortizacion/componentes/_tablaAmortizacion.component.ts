import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta, Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';


@Component({
  selector: 'app-tabla-amortizacion',
  templateUrl: '_tablaAmortizacion.html'
})
export class TablaAmortizacionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public lmoneda: SelectItem[] = [{label: '...', value: null}];
  public lsaldo: SelectItem[] = [{label: '...', value: null}];


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'TABLA', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);

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
    if (this.mcampos.csolicitud === 0 || this.mcampos.csolicitud === undefined) {
      this.mostrarMensajeError('SOLICITUD REQUERIDA');
      return;
    }
    this.rqConsulta.mdatos.csolicitud = this.mcampos.csolicitud;
    this.rqConsulta.mdatos.CODIGOCONSULTA = 'TABLASOLICITUDCREDITO';
    const consulta = new Consulta(this.entityBean, 'Y', '', this.mfiltros, this.mfiltrosesp);
    this.addConsulta(consulta);
    super.consultar();
  }

  public consultarAnterior() {
    if (this.mcampos.csolicitud === 0 || this.mcampos.csolicitud === undefined) {
      this.mostrarMensajeError('SOLICITUD REQUERIDA');
      return;
    }
    super.consultarAnterior();
  }

  public consultarSiguiente() {
    if (this.mcampos.csolicitud === 0 || this.mcampos.csolicitud === undefined) {
      this.mostrarMensajeError('SOLICITUD REQUERIDA');
      return;
    }
    super.consultarSiguiente();
  }

  public fijarFiltrosConsulta() {
    // No existe para la consulta de tabla amortizacion
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
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
