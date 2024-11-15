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
  selector: 'app-reporte-historialcompromiso',
  templateUrl: 'historialCompromiso.html'
})
export class HistorialCompromisoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild('tblhistorial')
  public jasper2: JasperComponent;

  
  public totalDebito: Number = 0;
  public totalCredito: Number = 0;
  public codigoDetalle: String = "";
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

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

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

  borrarParametrosRqConsulta(){
    delete this.rqConsulta.parametro_ccomprobante;
    delete this.rqConsulta.parametro_finicio ;
    delete this.rqConsulta.parametro_ffin ;
    delete this.rqConsulta.parametro_compromiso ;
    delete this.rqConsulta.parametro_opcion ;
  }

  consultarCompromisos() {
    this.borrarParametrosRqConsulta();
    this.rqConsulta.CODIGOCONSULTA = 'PPT_HISTORIALCOMPROMISO';
    this.rqConsulta.storeprocedure = "sp_PptRptHistorialCompromiso";
    this.rqConsulta.parametro_finicio =  this.mfiltros.finicio;
    this.rqConsulta.parametro_ffin = this.mfiltros.ffin;
    this.rqConsulta.parametro_opcion = 1;
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuestaCompromisos(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  private manejaRespuestaCompromisos(resp: any) {
    this.lregistros = [];
    if (resp.cod !== 'OK') {
      super.mostrarMensajeError(resp.msgusu);
      return;
    }
    this.lregistros = resp.PPT_HISTORIALCOMPROMISO;
  }


  public seleccionarDetalle(reg: any) {
    this.mostrarMensajeSuccess("Selecciono un registro con código: " + reg.data.Compromiso);
    this.consultarComprobantesDetalle(reg.data.Compromiso);
  }


  consultarComprobantesDetalle(reg: any) {
    this.borrarParametrosRqConsulta();
    this.rqConsulta.CODIGOCONSULTA = null;
    this.rqConsulta.CODIGOCONSULTA = 'PPT_HISTORIALCOMPROMISO';
    this.rqConsulta.storeprocedure = "sp_PptRptHistorialCompromisoDetalle";
    this.rqConsulta.parametro_compromiso = reg;
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
      this.lregistroDetalle = resp.PPT_HISTORIALCOMPROMISO;

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

  visualizar(reg: any) {
    this.regconsulta = [];
    this.regconsulta.push({ 'coment': reg.Comentario});
    this.infoadicional = true;
  }

  descargarCompromiso(reg: any) {
   
    if(reg.Estado==="CERTIF")
    {
      this.mostrarMensajeSuccess("Selecciono un registro con código: " + reg.Compromiso);    
        this.jasper2.formatoexportar ='pdf';
        this.jasper2.nombreArchivo = 'rptPptCertificacionPresupuestaria';
        // Agregar parametros
        this.jasper2.parametros['@i_ccompromiso'] =  reg.Compromiso;
        this.jasper2.parametros['archivoReporteUrl'] = '/CesantiaReportes/Presupuesto/rptPptCertificacionPresupuestaria';
        this.jasper2.generaReporteCore();
    }
    else if(reg.Estado==="DEVENG" || reg.Estado==="PAGADO" )
    {
      this.mostrarMensajeSuccess("Selecciono un registro con código: " + reg.Compromiso);    
        this.jasper2.formatoexportar = 'pdf';
        this.jasper2.nombreArchivo = 'rptPptAfectacionPresupuestaria';
        // Agregar parametros
        this.jasper2.parametros['@i_ccompromiso'] = reg.Compromiso;
        this.jasper2.parametros['archivoReporteUrl'] = '/CesantiaReportes/Presupuesto/rptPptAfectacionPresupuestaria';
        this.jasper2.generaReporteCore();
    }
    else if(reg.Estado=="LIBERA")
    {
      this.mostrarMensajeSuccess("Selecciono un registro con código: " + reg.Compromiso);  
      this.jasper2.formatoexportar = 'pdf';
      this.jasper2.nombreArchivo = 'rptPptAnulacionPresupuestaria';
      // Agregar parametros
      this.jasper2.parametros['@i_ccompromiso'] = reg.Compromiso;
      this.jasper2.parametros['archivoReporteUrl'] = '/CesantiaReportes/Presupuesto/rptPptAnulacionPresupuestaria';
      this.jasper2.generaReporteCore();
    }
    else
    {
      this.mostrarMensajeSuccess("Selecciono un registro con código: " + reg.data.Compromiso);
    }

  }
  
  descargarReporte(): void {
    this.jasper.parametros['@i_finicio'] = this.mfiltros.finicio;
    this.jasper.parametros['@i_ffin'] = this.mfiltros.ffin;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Presupuesto/rptPptHistorialCompromiso';
    this.jasper.generaReporteCore();
  }
}
