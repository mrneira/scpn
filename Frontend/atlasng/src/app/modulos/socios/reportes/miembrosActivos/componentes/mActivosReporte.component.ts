import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
//import {VisorPdfComponent} from '../../../../../util/componentes/pdfViwer/componentes/visorPdf.component';
@Component({
  selector: 'app-perfiles-reporte',
  templateUrl: 'mActivosReporte.html'
})
export class MActivosReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public ljerarquia: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'REPORTEMIEMBROSACTIVOS', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  descargarReporte(): void {
    //this.jasper.nombreReporteJasper = 'lazos/facturacion/ventas.jasper';

    this.jasper.nombreArchivo = 'ReporteMiembrosActivos';
    var CurrentDate = new Date().getFullYear();
    var periodo = this.mcampos.fperiodo;
    var anio = this.mcampos.fanio;
    if (periodo >= 1950 && periodo <= CurrentDate || periodo === undefined || periodo === null || periodo === ""
    ) {

    if (periodo === undefined || periodo === null || periodo === "") {
      periodo = -1
    }
    if (anio === undefined || anio === null || anio === "") {
      anio = -1
    }
    if (this.mcampos.jerarquia === undefined || this.mcampos.jerarquia === null) {
      this.mcampos.jerarquia = ''
    }
    // Agregar parametros
    this.jasper.parametros['@jerarquia'] = this.mcampos.jerarquia;
    this.jasper.parametros['@i_anioAlta'] = periodo;
    this.jasper.parametros['@i_anioServicio'] = anio;
    this.jasper.parametros['@i_usuariolog'] = this.dtoServicios.mradicacion.np;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Socios/Miembros_Activos';


    this.jasper.generaReporteCore();
  }
  else{
    this.mostrarMensajeError("AÑO INGRESADO INCORRECTO RANGOS ENTRE 1950 Y AÑO ACTUAL "+CurrentDate);
    return;
  }

  }

  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuestaCatalogos(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }
  llenarConsultaCatalogos(): void {
    const mfiltrosEstUsr: any = {'ccatalogo': 2701};
    const consultaJerarquia = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstUsr, {});
    consultaJerarquia.cantidad = 100;
    this.addConsultaPorAlias('JERARQUIA', consultaJerarquia);
  }
/**Manejo respuesta de consulta de catalogos. */
private manejaRespuestaCatalogos(resp: any) {
  const msgs = [];
  if (resp.cod === 'OK') {
    this.llenaListaCatalogo(this.ljerarquia, resp.JERARQUIA, 'cdetalle');
  }
  this.lconsulta = [];
}

}
