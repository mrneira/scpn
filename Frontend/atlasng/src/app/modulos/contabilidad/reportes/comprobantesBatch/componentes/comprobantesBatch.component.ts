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
  selector: 'app-comprobantesBatch',
  templateUrl: 'comprobantesBatch.html'
})
export class ComprobantesBatchComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  
  public jasper: JasperComponent;
  comportamiento: boolean = false;
  public totalDebito: Number = 0;
  public totalCredito: Number = 0;
  lregistrosoperaciones:any = [];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tconcomprobanteprevio', 'COMPROBANTEPREVIO', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.mfiltros.fcontable = this.dtoServicios.mradicacion.fcontable;
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
    this.consultarComprobantes();
  }

  consultarComprobantes() {
    this.borrarParametros();
    this.rqConsulta.CODIGOCONSULTA = 'CON_OPERATIVOCONTABLE';
    this.rqConsulta.storeprocedure = "sp_ConRptOperativoContable";
    this.rqConsulta.parametro_fcontable = this.mfiltros.fcontable;
    this.rqConsulta.parametro_ccomprobante = this.mfiltros.ccomprobante;
    this.rqConsulta.parametro_cmodulo = this.mfiltros.cmodulo;
    this.rqConsulta.parametro_ctransaccion = this.mfiltros.ctransaccion;
    this.rqConsulta.parametro_cproducto = this.mfiltros.cproducto;
    this.rqConsulta.parametro_ctipoproducto = this.mfiltros.ctipoproducto;
    this.rqConsulta.parametro_ccuenta = this.mfiltros.ccuenta;
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
    if (resp.cod !== 'OK') {
      super.mostrarMensajeError(resp.msgusu);
      return;
    }
    this.lregistros = resp.CON_OPERATIVOCONTABLE;
    this.calcularTotales(this.lregistros); 
  }

  public calcularTotales(lista: any){
    this.totalDebito=0;
    this.totalCredito=0;
    for (const i in lista) {
      const reg = lista[i];
      this.totalDebito+= reg.montodebito;
      this.totalCredito+=reg.montocredito;
    }
  }

  public seleccionarDetalle(reg: any) {
    this.comportamiento = true;
    this.consultarMovimientosCuadre(reg.data);
  }


  consultarMovimientosCuadre(reg: any) {
    this.rqConsulta.CODIGOCONSULTA = 'MOVIMIENTOSCUADRE';
    this.rqConsulta.mdatos.registroSeguro = reg;
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuestaMovimientosCuadre(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  private manejaRespuestaMovimientosCuadre(resp: any) {
    this.lregistrosoperaciones = resp.MOVIMIENTOSCUADRE;
  }

  public crearDtoConsulta() {
    const consulta = new Consulta(this.entityBean, 'Y', 't.cregistro', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tconregistrolote', 'ccomprobante', 'ccomprobante', 'i.cregistro = t.cregistro');
    consulta.cantidad = 1000;
    this.addConsulta(consulta);
    return consulta;
  }

  consultarComentario(reg:any){
    this.mcampos.comentario = "";
    this.comportamiento=true;
  } 

  descargarReporte(reg: any): void {
  }

  visualizar(reg: any) {
  }

  descargarReporteDetalle(reg: any): void {

    this.jasper.formatoexportar = reg;
    this.jasper.nombreArchivo = 'rptConDetalleDetalleComprobantes';

    // Agregar parametros
    this.jasper.parametros = new Object();
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptConDetalleDetalleComprobantes';
    this.jasper.generaReporteCore();
  }

  borrarParametros(){
    this.rqConsulta.CODIGOCONSULTA = undefined;
    this.rqConsulta.storeprocedure = undefined;    
    this.rqConsulta.parametro_fcontable = undefined;
    this.rqConsulta.parametro_ccomprobante = undefined;
    this.rqConsulta.parametro_cmodulo = undefined;
    this.rqConsulta.parametro_ctransaccion = undefined;
    this.rqConsulta.parametro_cproducto = undefined;
    this.rqConsulta.parametro_ctipoproducto = undefined;
    this.rqConsulta.parametro_ccuenta = undefined; 
  }
}
