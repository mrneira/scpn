import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { LovPersonasComponent } from '../../../../../personas/lov/personas/componentes/lov.personas.component';
import { AccionesReporteComponent } from '../../../../../../util/shared/componentes/accionesReporte.component';

@Component({
  selector: 'app-documentos',
  templateUrl: 'documentos.html'
})
export class DocumentosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  lovPersonas: LovPersonasComponent;

  @ViewChild(AccionesReporteComponent)
  accionesReporteComponent: AccionesReporteComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tgendocumentos', 'DOC', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
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

  // Inicia CONSULTA *********************
  consultar() {
    if (!this.validaFiltrosConsulta()) {
      return;
    }
    this.crearDtoConsulta();
    super.consultar();

  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cdocumento', this.mfiltros, this.mfiltrosesp);

    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.activo = true;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  public limpiar() {
    this.lregistros = [];
  }
  // Fin CONSULTA *********************
  descargarReporte(reg: any): void {
    this.accionesReporteComponent.nombreArchivo = reg.nombredescarga;
    this.accionesReporteComponent.cdocumento = reg.cdocumento;
    // // Agregar parametros
    if(reg.cdocumento === 1){
      this.accionesReporteComponent.parametros['@i_cdetalletipoexp'] = this.mcampos.cdetalletipoexp;
    }
    this.accionesReporteComponent.parametros['@i_identificacion'] = this.mcampos.identificacion;
    this.accionesReporteComponent.parametros['@w_usuario'] = this.dtoServicios.mradicacion.np;
    this.accionesReporteComponent.parametros['archivoReporteUrl'] = reg.reporte;
    this.accionesReporteComponent.generaReporteCore(0, 100);
  }
}
