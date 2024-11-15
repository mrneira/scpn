import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { JasperComponent } from '../../../../../../util/componentes/jasper/componentes/jasper.component';


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
    if (sessionStorage.getItem('t') === "7" && sessionStorage.getItem('m') === "8") {
      this.habilitaImprimir = true;
    }
  }

  crearNuevo() {}

  actualizar() {}

  eliminar() {}

  cancelar() {}

  public selectRegistro(registro: any) {}

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

  public fijarFiltrosConsulta() {}

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
  
  grabar(): void {}

  public crearDtoMantenimiento() {}

  public postCommit(resp: any) {}

  descargarReporteTablaPagos(reg: any): void {
    if (!this.validaFiltrosRequeridos()) {
      return;
    }
    this.jaspertblapagos.formatoexportar = reg;
    this.jaspertblapagos.parametros['@i_coperacion'] = this.mfiltros.coperacion;
    this.jaspertblapagos.parametros['@i_usuario'] = this.dtoServicios.mradicacion.np;
    this.jaspertblapagos.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestamos/rptCarDocumentoOperacionAmortizacion';
    this.jaspertblapagos.generaReporteCore();
  }
  
  descargarReporteTablaEstado(reg: any): void {
    if (!this.validaFiltrosRequeridos()) {
      return;
    }
    this.jaspertblapagos.formatoexportar = reg;
    this.jaspertblapagos.parametros['@i_coperacion'] = this.mfiltros.coperacion;
    this.jaspertblapagos.parametros['@i_usuario'] = this.dtoServicios.mradicacion.np;
    this.jaspertblapagos.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestamos/rptCarDocumentoOperacioEstadoCuenta';
    this.jaspertblapagos.generaReporteCore();
  }
}