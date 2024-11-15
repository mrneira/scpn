import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { BitwiseOperator } from 'typescript';
import { Binary } from '@angular/compiler';

@Component({
  selector: 'app-reporte-detallecomprobantescontables',
  templateUrl: 'detalleComprobantesContablesReporte.html'
})
export class DetalleComprobantesContablesReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild('jasper')
  public jasper: JasperComponent;

  public lComprobante: SelectItem[] = [{ label: '...', value: null }];
  public lregistro: SelectItem[] = [{ label: '...', value: null }];
  public lregistro1: SelectItem[] = [{ label: '...', value: null }];
  public lregistro2: SelectItem[] = [{ label: '...', value: null }];
  public lregistroDetalle: SelectItem[] = [{ label: '...', value: null }];
  public codigoDetalle: String = "";
  public totalDebito: Number = 0;
  public totalCredito: Number = 0;

  public regconsulta: any = [];
  public infoadicional = false;

  // RRO 20210421 ------------------------------------------------------------------
  public lmodulo: SelectItem[] = [{label: '...', value: null}];
  public lTransaccion: SelectItem[] = [{ label: '...', value: null }];
  public usuario: String = "";
  // RRO 20210421 ------------------------------------------------------------------

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tconcomprobante', 'COMPROBANTECONTALBE', false);
    this.componentehijo = this;
    const mradicacion = JSON.parse(sessionStorage.getItem('mradicacion'));// RRO 20210421
    this.usuario = mradicacion.cu;   // RRO 20210421
  }

  ngOnInit() {
    this.regconsulta.push({ 'coment': null, 'userIn': null, 'dateIn': null, 'userMod': null, 'dateMod':null });
    super.init(this.formFiltros);
    let finicio = new Date(this.anioactual, this.fechaactual.getMonth(), 1);
    this.mfiltros.finicio = finicio;
    this.mfiltros.ffin = this.fechaactual;
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  validaFiltrosConsulta(): boolean {
    return true
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.lregistros = [];
    delete this.rqConsulta.parametro_fdesde;
    delete this.rqConsulta.parametro_fhasta;
    delete this.rqConsulta.parametro_automatico;
    delete this.rqConsulta.parametro_mayorizado;
    delete this.rqConsulta.parametro_anulado;
    delete this.rqConsulta.parametro_eliminado;
    delete this.rqConsulta.parametro_tipoComprobante;
    // RRO 20210421 -------------------------------------------
    delete this.rqConsulta.parametro_xausuario;
    delete this.rqConsulta.parametro_xmodulo;
    delete this.rqConsulta.parametro_xtransaccion;
    // RRO 20210421 -------------------------------------------
    this.consultarComprobantes();
  }

  consultarComprobantes() {
    this.rqConsulta.CODIGOCONSULTA = 'CON_DETALLECOMPROBANTES';
    this.rqConsulta.storeprocedure = "sp_ConRptDetalleComprobantesContables";
    delete this.rqConsulta.parametro_fdesde;
    delete this.rqConsulta.parametro_fhasta;
    delete this.rqConsulta.parametro_tipoComprobante;
    // RRO 20210421 -------------------------------------------
    delete this.rqConsulta.parametro_xausuario;
    delete this.rqConsulta.parametro_xmodulo;
    delete this.rqConsulta.parametro_xtransaccion;
    // RRO 20210421 -------------------------------------------

    let lfdesde: number = this.fechaToInteger(this.mfiltros.finicio); //=== undefined ? "" : (this.mfiltros.finicio.getFullYear() * 10000) + ((this.mfiltros.finicio.getMonth() + 1) * 100) + this.mfiltros.finicio.getDate();
    let lfhasta: number = this.fechaToInteger(this.mfiltros.ffin); //=== undefined ? "" : (this.mfiltros.ffin.getFullYear() * 10000) + ((this.mfiltros.ffin.getMonth() + 1) * 100) + this.mfiltros.ffin.getDate();

    this.rqConsulta.parametro_fdesde = lfdesde;
    this.rqConsulta.parametro_fhasta = lfhasta;
    this.rqConsulta.parametro_tipoComprobante = this.mfiltros.tipodocumentocdetalle === null? undefined:this.mfiltros.tipodocumentocdetalle;

    // RRO 20210421 -------------------------------------------
    this.rqConsulta.parametro_xausuario = this.usuario;
    this.rqConsulta.parametro_xmodulo = this.mfiltros.cmodulo === null ? undefined: this.mfiltros.cmodulo;
    this.rqConsulta.parametro_xtransaccion = this.mfiltros.ctransaccion === null? undefined: this.mfiltros.ctransaccion;
     // RRO 20210421 -------------------------------------------

    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuestaComprobantes(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  private manejaRespuestaComprobantes(resp: any) {
    this.lregistros = [];

    if (resp.cod === 'OK') {
      this.lregistros = resp.CON_DETALLECOMPROBANTES;
    }
    else {
      super.mostrarMensajeError(resp.msgusu);
      return;
    }
  }



  public seleccionarDetalle(reg: any) {
    this.consultarComprobantesDetalle(reg.data.Comprobante);
  }


  consultarComprobantesDetalle(reg: any) {
    this.rqConsulta.CODIGOCONSULTA = null;
    delete this.rqConsulta.parametro_fdesde;
    delete this.rqConsulta.parametro_fhasta;
    delete this.rqConsulta.parametro_tipoComprobante;
    // RRO 20210421 -------------------------------------------
    delete this.rqConsulta.parametro_xausuario;
    delete this.rqConsulta.parametro_xmodulo;
    delete this.rqConsulta.parametro_xtransaccion;
    // RRO 20210421 -------------------------------------------

    this.rqConsulta.CODIGOCONSULTA = 'CON_COMPROBANTESDETALLE';
    this.rqConsulta.storeprocedure = "sp_ConRptComprobantesContablesDetalle";


    this.rqConsulta.parametro_ccomprobante = reg;
    this.codigoDetalle = reg;
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuestaComprobantesDetalle(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  private manejaRespuestaComprobantesDetalle(resp: any) {
    this.lregistroDetalle = [];
    this.totalCredito = 0;
    this.totalDebito = 0;

    if (resp.cod === 'OK') {
      this.lregistroDetalle = resp.CON_COMPROBANTESDETALLE;

      for (const i in resp.CON_COMPROBANTESDETALLE) {
        const reg = resp.CON_COMPROBANTESDETALLE[i];

        this.totalDebito += reg.Debito;
        this.totalCredito += reg.Credito;
      }
      this.lregistroDetalle.push({ label: 'totalDebito', value: this.totalDebito });
      this.lregistroDetalle.push({ label: 'totalCredito', value: this.totalCredito });

    }
    else {
      super.mostrarMensajeError(resp.msgusu);
      return;
    }

  }

  visualizar(reg: any) {
    this.regconsulta = [];
    this.regconsulta.push({ 'coment': reg.Comentario, 'userIn': reg.UsuarioIngreso, 'dateIn': reg.FechaIngreso, 'userMod': reg.UsuarioModifico, 'dateMod': reg.FechaModificacion });
    this.infoadicional = true;
  }

  private fijarFiltrosConsulta() {
  }
  descargarReporte(reg: any): void {

    if (this.estaVacio(this.mfiltros.finicio)){
      this.mostrarMensajeError("INGRESE LA FECHA DE INICIO");
      return;
    }
    if (this.estaVacio(this.mfiltros.ffin)){
      this.mostrarMensajeError("INGRESE LA FECHA DE FIN");
      return;
    }

    this.jasper.formatoexportar = reg;      
    this.jasper.nombreArchivo = 'ComprobanteContable';
    this.jasper.parametros['@i_fdesde'] = this.fechaToInteger(this.mfiltros.finicio);
    this.jasper.parametros['@i_fhasta'] = this.fechaToInteger(this.mfiltros.ffin);
    this.jasper.parametros['@i_tipoComprobante'] = this.mfiltros.tipodocumentocdetalle;
    // RRO 20210421 -------------------------------------------------------------
    this.jasper.parametros['@i_usuario'] = this.usuario;        
    this.jasper.parametros['@i_modulo'] = this.mfiltros.cmodulo;
    this.jasper.parametros['@i_transaccion'] = this.mfiltros.ctransaccion;   
     // RRO 20210421 -------------------------------------------------------------
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/ComprobanteContableTodo';
    this.jasper.generaReporteCore();
  }


  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.encerarMensajes();
        this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
        this.manejaRespuestaCatalogos(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  llenarConsultaCatalogos(): void {
    const mfiltroscomprobante = { 'ccatalogo': 1003 };
    const consComprobante = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroscomprobante, {});
    consComprobante.cantidad = 100;
    this.addConsultaPorAlias('COMPROBANTE', consComprobante);
    // RRO 20210421 ---------------------------------------------------
    const consultaModulo = new Consulta('TgenModulo', 'Y', 't.nombre', {}, {});
    consultaModulo.cantidad = 100;
    this.addConsultaCatalogos('MODULO', consultaModulo, this.lmodulo, super.llenaListaCatalogo, 'cmodulo');
     // RRO 20210421 ---------------------------------------------------

    this.ejecutarConsultaCatalogos();
  }

  // RRO 20210421 --------------------------------------------------------------
  /**
   * Funcion: Carga combo transaccion por modulo
   * @param event 
   */
  public filtrarTransaccion(event: any): any {
    this.lTransaccion = [{ label: '...', value: null }];

    if(event.value != null){
      const consultaTransaccion = new Consulta('TgenTransaccion', 'Y', 't.nombre', { 'cmodulo': event.value }, {});
      consultaTransaccion.cantidad = 100;
      this.addConsultaCatalogos('TRANSACCION', consultaTransaccion, this.lTransaccion, super.llenaListaCatalogo, 'ctransaccion');
      this.ejecutarConsultaCatalogos();  
    }
  } 
  // RRO 20210421 --------------------------------------------------------------


  private manejaRespuestaCatalogos(resp: any) {

    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.lComprobante, resp.COMPROBANTE, 'cdetalle');
    }
    else {
      super.mostrarMensajeError(resp.msgusu);
      return;
    }

    this.lconsulta = [];
  }


}
