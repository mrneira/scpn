import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component'

@Component({
  selector: 'app-usuario-reporte',
  templateUrl: 'prestacionesnReclamadasReporte.html'
})
export class PrestacionesnReclamadasReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovPersonasComponent)
  public lovPersonas: LovPersonasComponent;

  public ljerarquias: SelectItem[] = [{ label: '...', value: null }];

  private selectedmodelo: string = "";

  private archivoReporteUrl: string = "";

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'PRESTACIONESNRECLAMADASREPORTE', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.camposfecha.FechaInicio = new Date();
    this.mcampos.camposfecha.FechaFin = new Date();
    this.selectedmodelo = "opt1";
    this.consultarCatalogos();

  }

  ngAfterViewInit() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  grabar(): void {
    this.lmantenimiento = [];
    const cmoduloorg = sessionStorage.getItem('m');
    const ctransaccionorg = sessionStorage.getItem('t');
    this.rqMantenimiento['CODMODULOORIGEN'] = cmoduloorg;
    this.rqMantenimiento['CODTRANSACCIONORIGEN'] = ctransaccionorg;
    this.rqMantenimiento['cmodulo'] = 28;
    this.rqMantenimiento['ctransaccion'] = 46;
    super.grabar();
  }



  imprimir(resp: any): void {
    this.lmantenimiento = [];
    //this.jasper.nombreReporteJasper = 'lazos/facturacion/ventas.jasper';
    this.jasper.nombreArchivo = 'ReportePrestacionesNoReclamadas';
    if ((this.mcampos.FechaInicio != null && this.mcampos.FechaFin == null) || (this.mcampos.FechaInicio == null && this.mcampos.FechaFin != null) || (this.mcampos.FechaInicio > this.mcampos.FechaFin)) {
      this.mostrarMensajeError("EL CAMPO DE FECHAS SON INCORRECTAS.");

    } else {
      if (this.mcampos.FechaInicio === undefined || this.mcampos.FechaInicio === null) {
        this.mcampos.FechaInicio = null
      }

      if (this.mcampos.ffin === undefined || this.mcampos.ffin === null) {
        this.mcampos.ffin = null
      }
      if (this.mcampos.jerarquia === undefined || this.mcampos.jerarquia === null) {
        this.mcampos.jerarquia = '';
      }

      if (this.selectedmodelo === "opt1") {
        this.archivoReporteUrl = "/CesantiaReportes/Prestaciones/Pre_NoReclamadas";
      } else {
        this.archivoReporteUrl = "/CesantiaReportes/Prestaciones/Pre_NoReclamadasCes";
      }

      // Agregar parametros
      this.jasper.parametros['@i_fIniExp'] = this.mcampos.FechaInicio;
      this.jasper.parametros['@i_fFinExp'] = this.mcampos.FechaFin;
      this.jasper.parametros['@i_jerarquia'] = this.mcampos.jerarquia;
      this.jasper.parametros['@w_usuario'] = this.dtoServicios.mradicacion.np;
      this.jasper.parametros['archivoReporteUrl'] = this.archivoReporteUrl;
      this.jasper.formatoexportar = resp;
      this.jasper.generaReporteCore();
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

    const mfiltrosEstUsr: any = { 'ccatalogo': 2701 };
    const consultaJerarquia = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstUsr, {});
    consultaJerarquia.cantidad = 50;
    this.addConsultaPorAlias('JERARQUIA', consultaJerarquia);

  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.ljerarquias, resp.JERARQUIA, 'cdetalle');
    }
    this.lconsulta = [];
  }
}
