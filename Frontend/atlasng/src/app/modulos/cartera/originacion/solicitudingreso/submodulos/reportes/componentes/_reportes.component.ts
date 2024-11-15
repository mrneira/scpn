import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { AccionesReporteComponent } from '../../../../../../../util/shared/componentes/accionesReporte.component';

@Component({
  selector: 'app-reportes',
  templateUrl: '_reportes.html'
})

export class ReportesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(AccionesReporteComponent)
  accionesReporteComponent: AccionesReporteComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tcarsolicituddocumentos', 'REPORTES', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
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
    if (!this.validaFiltrosRequeridos()) {
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.csolicitud', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgendocumentos', 'nombre', 'nreporte', 't.cdocumento = i.cdocumento and i.cmodulo = 7');
    consulta.addSubquery('tgendocumentos', 'descripcion', 'ndescripcion', 't.cdocumento = i.cdocumento and i.cmodulo = 7');
    consulta.addSubquery('tgendocumentos', 'reporte', 'reporte', 't.cdocumento = i.cdocumento and i.cmodulo = 7');
    consulta.addSubquery('tgendocumentos', 'nombredescarga', 'nombredescarga', 't.cdocumento = i.cdocumento and i.cmodulo = 7');
    consulta.cantidad = 100;
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
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

  descargarReporte(reg: any): void {
    this.actualizar();
    this.accionesReporteComponent.nombreArchivo = reg.csolicitud + '-' + reg.mdatos.nombredescarga;
    this.accionesReporteComponent.cdocumento = reg.cdocumento;
    this.accionesReporteComponent.csolicitud = reg.csolicitud;

    // Agregar parametros
    this.accionesReporteComponent.parametros['@i_csolicitud'] = reg.csolicitud;
    this.accionesReporteComponent.parametros['@i_usuario'] = this.dtoServicios.mradicacion.np;
    this.accionesReporteComponent.parametros['archivoReporteUrl'] = reg.mdatos.reporte;
    this.accionesReporteComponent.generaReporteCore(sessionStorage.getItem('m'), 611);
  }

}
