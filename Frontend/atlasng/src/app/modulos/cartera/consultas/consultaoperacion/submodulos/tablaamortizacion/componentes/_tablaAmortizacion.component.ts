import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { JasperComponent } from '../../../../../../../util/componentes/jasper/componentes/jasper.component';


@Component({
  selector: 'app-tabla-amortizacion',
  templateUrl: '_tablaAmortizacion.html'
})
export class TablaAmortizacionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild('tblapagos')
  public jaspertblapagos: JasperComponent;

  public mtotales: any = {};
  public habilitaImprimir = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'TABLA', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
    if (sessionStorage.getItem('t') === "1001" && sessionStorage.getItem('m') === "7") {
      this.habilitaImprimir = true;
    }
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
    if (this.mfiltros.coperacion === 0 || this.mfiltros.coperacion === undefined) {
      this.mostrarMensajeError('OPERACIÓN REQUERIDA');
      return;
    }
    this.rqConsulta.coperacion = this.mfiltros.coperacion;
    this.rqConsulta.mdatos.CODIGOCONSULTA = 'CONSULTATABLAPAGOSCARTERA';
    super.consultar();
  }

  public consultarAnterior() {
    if (this.mfiltros.coperacion === 0 || this.mfiltros.coperacion === undefined) {
      this.mostrarMensajeError('OPERACIÓN REQUERIDA');
      return;
    }
    super.consultarAnterior();
  }

  public consultarSiguiente() {
    if (this.mfiltros.coperacion === 0 || this.mfiltros.coperacion === undefined) {
      this.mostrarMensajeError('OPERACIÓN REQUERIDA');
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

    if (resp.cod !== 'OK') {
      return;
    }
    this.lregistros = resp.TABLA;
    this.mtotales = resp.TOTALES[0];
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

  descargarReporteTablaPagos(reg: any): void {
    this.jaspertblapagos.formatoexportar = reg;
    this.jaspertblapagos.parametros['@i_coperacion'] = this.mfiltros.coperacion;
    this.jaspertblapagos.parametros['@i_usuario'] = this.dtoServicios.mradicacion.np;
    this.jaspertblapagos.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestamos/rptCarDocumentoOperacionAmortizacion';
    this.jaspertblapagos.generaReporteCore();
  }
  //NCH 20220211
  descargarReporteTablaEstado(reg: any): void {
    this.jaspertblapagos.formatoexportar = reg;
    this.jaspertblapagos.parametros['@i_coperacion'] = this.mfiltros.coperacion;
    this.jaspertblapagos.parametros['@i_usuario'] = this.dtoServicios.mradicacion.np;
    this.jaspertblapagos.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestamos/rptCarDocumentoOperacioEstadoCuenta';
    this.jaspertblapagos.generaReporteCore();
  }

}
