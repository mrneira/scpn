import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-reporte-historialreformas',
  templateUrl: 'historialReformas.html'
})
export class HistorialReformasComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;
  public totalDebito: Number = 0;
  public totalCredito: Number = 0;
  public codigoDetalle: String = "";
  public lregistro: SelectItem[] = [{ label: '...', value: null }];
  public lregistro1: SelectItem[] = [{ label: '...', value: null }];
  public lregistro2: SelectItem[] = [{ label: '...', value: null }];
  public lregistroDetalle: SelectItem[] = [{ label: '...', value: null }];

  public regconsulta: any = [];
  public infoadicional = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tconcomprobante', 'COMPROBANTECONTALBE', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    this.regconsulta.push({ 'coment': null, 'userIn': null, 'dateIn': null, 'userMod': null, 'dateMod':null });
    super.init(this.formFiltros);
    let finicio = new Date(this.anioactual, this.fechaactual.getMonth(), 1);
    this.mfiltros.finicio = finicio;
    this.mfiltros.ffin = this.fechaactual;



  }

  ngAfterViewInit() {
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  // Inicia CONSULTA *********************
  consultar() {

    if (this.mfiltros.finicio === undefined || this.mfiltros.finicio === null || this.mfiltros.finicio > this.mfiltros.ffin) {
      this.mostrarMensajeError("INGRESE LA FECHA DE INICIO");
      return;
    }
    if (this.mfiltros.ffin === undefined || this.mfiltros.ffin === null || this.mfiltros.finicio > this.mfiltros.ffin) {
      this.mostrarMensajeError("INGRESE LA FECHA DE FIN");
      return;
    }
    this.consultarCompromisos();
  }

  consultarCompromisos() {
    this.rqConsulta.CODIGOCONSULTA = 'PPT_HISTORIALREFORMA';
    this.rqConsulta.storeprocedure = "sp_PptRptHistorialReformas";
    delete this.rqConsulta.parametro_creforma;
    let lfdesde: number = this.mfiltros.finicio === undefined ? "" : (this.mfiltros.finicio.getFullYear() * 10000) + ((this.mfiltros.finicio.getMonth() + 1) * 100) + this.mfiltros.finicio.getDate();
    let lfhasta: number = this.mfiltros.ffin === undefined ? "" : (this.mfiltros.ffin.getFullYear() * 10000) + ((this.mfiltros.ffin.getMonth() + 1) * 100) + this.mfiltros.ffin.getDate();

    this.rqConsulta.parametro_finicio =  this.mfiltros.finicio;
    this.rqConsulta.parametro_ffin = this.mfiltros.ffin;
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuestaReformas(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  private manejaRespuestaReformas(resp: any) {
    this.lregistros = [];
    if (resp.cod !== 'OK') {
      super.mostrarMensajeError(resp.msgusu);
      return;
    }
    this.lregistros = resp.PPT_HISTORIALREFORMA;
  }



  public seleccionarDetalle(reg: any) {
    this.mostrarMensajeSuccess("Seleccionó un registro con código: " + reg.data.Codigo);
    this.consultarComprobantesDetalle(reg.data.Codigo);
  }


  consultarComprobantesDetalle(reg: any) {
    this.rqConsulta.CODIGOCONSULTA = null;
    delete this.rqConsulta.parametro_ffin;
    delete this.rqConsulta.parametro_finicio;
    this.rqConsulta.CODIGOCONSULTA = 'PPT_HISTORIALREFORMA';
    this.rqConsulta.storeprocedure = "sp_PptRptHistorialReformasDetalle";


    this.rqConsulta.parametro_creforma = reg;
    this.codigoDetalle = reg;
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuestaCompromisoDetalle(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  private manejaRespuestaCompromisoDetalle(resp: any) {
    this.lregistroDetalle = [];
    this.totalCredito = 0;
    this.totalDebito = 0;
    if (resp.cod === 'OK') {
      this.lregistroDetalle = resp.PPT_HISTORIALREFORMA;

    }
    else {
      super.mostrarMensajeError(resp.msgusu);
      return;
    }

  }




  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.ckardex', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tconcomprobante', 'codigo', 'nombre', 'i.cproducto = t.cproducto');

    this.addConsulta(consulta);
    return consulta;
  }
  private fijarFiltrosConsulta() {
  }
  descargarReporte(reg: any): void {

    if (this.mfiltros.finicio === undefined || this.mfiltros.finicio === null || this.mfiltros.finicio > this.mfiltros.ffin) {
      this.mostrarMensajeError("INGRESE LA FECHA DE INICIO");
      return;
    }
    if (this.mfiltros.ffin === undefined || this.mfiltros.ffin === null || this.mfiltros.finicio > this.mfiltros.ffin) {
      this.mostrarMensajeError("INGRESE LA FECHA DE FIN");
      return;
    }
    this.jasper.formatoexportar = reg;
    this.jasper.nombreArchivo = 'rptConComprobantesContables';
    let lfdesde: number = this.mfiltros.finicio === undefined ? "" : (this.mfiltros.finicio.getFullYear() * 10000) + ((this.mfiltros.finicio.getMonth() + 1) * 100) + this.mfiltros.finicio.getDate();
    let lfhasta: number = this.mfiltros.ffin === undefined ? "" : (this.mfiltros.ffin.getFullYear() * 10000) + ((this.mfiltros.ffin.getMonth() + 1) * 100) + this.mfiltros.ffin.getDate();

    // Agregar parametros
    this.jasper.parametros = new Object();
    this.jasper.parametros['@i_fdesde'] = lfdesde;
    this.jasper.parametros['@i_fhasta'] = lfhasta;

    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptConComprobantesContables';
    this.jasper.generaReporteCore();
  }

  visualizar(reg: any) {
    this.regconsulta = [];
    this.regconsulta.push({ 'coment': reg.Comentario});
    this.infoadicional = true;
  }

  descargarReforma(reg: any): void {
    this.mostrarMensajeSuccess("Selecciono un registro con código: " + reg.Compromiso);     
    this.jasper.formatoexportar = 'pdf';
    this.jasper.nombreArchivo = 'rptPptReformaPresupuestaria';

    // Agregar parametros
    this.jasper.parametros['@i_creforma'] = reg.Codigo;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Presupuesto/rptPptReformaPresupuestaria';
    this.jasper.generaReporteCore();
  }

}
