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
  selector: 'app-reporte-comprobantescontables',
  templateUrl: 'comprobantesContablesReporte.html'
})
export class ComprobantesContablesReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

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
    this.consultarComprobantes();
  }

  consultarComprobantes() {
    this.rqConsulta.CODIGOCONSULTA = 'CON_COMPROBANTESCONTABLES';
    this.rqConsulta.storeprocedure = "sp_ConRptComprobantesContables";
    delete this.rqConsulta.parametro_ccomprobante;
    let lfdesde: number = this.mfiltros.finicio === undefined ? "" : (this.mfiltros.finicio.getFullYear() * 10000) + ((this.mfiltros.finicio.getMonth() + 1) * 100) + this.mfiltros.finicio.getDate();
    let lfhasta: number = this.mfiltros.ffin === undefined ? "" : (this.mfiltros.ffin.getFullYear() * 10000) + ((this.mfiltros.ffin.getMonth() + 1) * 100) + this.mfiltros.ffin.getDate();

    this.rqConsulta.parametro_finicio = lfdesde;
    this.rqConsulta.parametro_ffin = lfhasta;
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
    this.lregistros = resp.CON_COMPROBANTESCONTABLES;
    this.lregistro1 = [];
    this.lregistro2 = [];
    for (const i in this.lregistros) {
      const reg = this.lregistros[i];
      if (reg.actualizosaldo) {
        this.lregistro1.push(reg);
      }
      else {
        this.lregistro2.push(reg);
      }
    }
  }



  public seleccionarDetalle(reg: any) {
    this.mostrarMensajeSuccess("Selecciono un registro con código: " + reg.data.Comprobante);
    this.consultarComprobantesDetalle(reg.data.Comprobante);
  }


  consultarComprobantesDetalle(reg: any) {
    this.rqConsulta.CODIGOCONSULTA = null;
    delete this.rqConsulta.parametro_ffin;
    delete this.rqConsulta.parametro_finicio;
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
    this.regconsulta.push({ 'coment': reg.Comentario, 'userIn': reg.UsuarioIngreso, 'dateIn': reg.FechaIngreso, 'userMod': reg.UsuarioModifico, 'dateMod': reg.FechaModificacion });
    this.infoadicional = true;
  }
  descargarReporteDetalle(reg: any): void {
    if (this.mfiltros.finicio === undefined || this.mfiltros.finicio === null || this.mfiltros.finicio > this.mfiltros.ffin) {
      this.mostrarMensajeError("INGRESE LA FECHA DE INICIO");
      return;
    }
    if (this.mfiltros.ffin === undefined || this.mfiltros.ffin === null || this.mfiltros.finicio > this.mfiltros.ffin) {
      this.mostrarMensajeError("INGRESE LA FECHA DE FIN");
      return;
    }
    this.jasper.formatoexportar = reg;
    this.jasper.nombreArchivo = 'rptConDetalleCompletoComprobantes';
    let lfdesde: number = this.mfiltros.finicio === undefined ? "" : (this.mfiltros.finicio.getFullYear() * 10000) + ((this.mfiltros.finicio.getMonth() + 1) * 100) + this.mfiltros.finicio.getDate();
    let lfhasta: number = this.mfiltros.ffin === undefined ? "" : (this.mfiltros.ffin.getFullYear() * 10000) + ((this.mfiltros.ffin.getMonth() + 1) * 100) + this.mfiltros.ffin.getDate();
    // Agregar parametros
    this.jasper.parametros = new Object();
    this.jasper.parametros['@i_fdesde'] = lfdesde;
    this.jasper.parametros['@i_fhasta'] = lfhasta;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptConDetalleCompletoComprobantes';
    this.jasper.generaReporteCore();
  }

}
