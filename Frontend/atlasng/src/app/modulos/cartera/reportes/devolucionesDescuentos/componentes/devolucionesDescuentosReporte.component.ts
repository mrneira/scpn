import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-acciones-devolucion-reporte',
  templateUrl: 'devolucionesDescuentosReporte.html'
})
export class DevolucionesDescuentosReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public ldevoluciones: SelectItem[] = [{ label: "...", value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'REPORTEGENERICO', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.finicio = new Date();
    this.mcampos.ffin = new Date();
  }

  ngAfterViewInit() {
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (this.estaVacio(this.mcampos.finicio) || this.estaVacio(this.mcampos.ffin)) {
      super.mostrarMensajeError('FECHAS SON REQUERIDOS');
      return;
    }

    this.fijarFiltrosConsulta();
    this.rqConsulta.mdatos.CODIGOCONSULTA = 'REPORTEGENERICO';
    this.rqConsulta.storeprocedure = "sp_CobConReporteDescuentos";
    super.consultar();
  }

  private fijarFiltrosConsulta() {
    super.encerarConsulta();
    this.rqConsulta = { 'mdatos': {} };

    this.rqConsulta.parametro_i_tipo = 'C';
    this.rqConsulta.parametro_i_finicio = this.fechaToInteger(this.mcampos.finicio);
    this.rqConsulta.parametro_i_ffin = this.fechaToInteger(this.mcampos.ffin);
    this.rqConsulta.parametro_i_fcontable = 0;
    this.rqConsulta.parametro_i_mensaje = '';
    this.rqConsulta.parametro_i_ccomprobante = '';
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  public imprimir(resp: any): void {
    this.jasper.nombreArchivo = 'DEVOLUCIONES_' + resp.fdevolucion + '_' + resp.ccomprobante;

    // Agregar parametros
    this.jasper.parametros['@i_tipo'] = 'R';
    this.jasper.parametros['@i_finicio'] = 0;
    this.jasper.parametros['@i_ffin'] = 0;
    this.jasper.parametros['@i_fcontable'] = resp.fdevolucion;
    this.jasper.parametros['@i_mensaje'] = resp.mensaje;
    this.jasper.parametros['@i_ccomprobante'] = resp.ccomprobante;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestamos/rpt_DevolucionesDescuentos';
    this.jasper.formatoexportar = 'xls';
    this.jasper.generaReporteCore();
  }

}
