import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';

import {JasperComponent} from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-reporte-logDocumentosElectronicos',
  templateUrl: 'logDocumentosElectronicos.html'
})
export class LogDocumentosElectronicosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  
  @ViewChild(JasperComponent)
  public jasper: JasperComponent;
 
  public lregistros: SelectItem[] = [{ label: '...', value: null }];
  
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tcellogdocumentos', 'TCELLOGDOCUMENTOS', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);  
  }

  ngAfterViewInit() {
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
      super.postQueryEntityBean(resp);
      //this.fijarListaAgencias();
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }
  consultar(): void {
    this.consultarTabla();
  }

  consultarTabla() {
    this.rqConsulta.CODIGOCONSULTA = 'FCE_LOGDOCELECTRONICOS';
    this.rqConsulta.storeprocedure = "sp_CelConLogDocElectronicos";
    this.rqConsulta.parametro_finicio = this.mfiltros.finicio === undefined ? "" : this.mfiltros.finicio;
    this.rqConsulta.parametro_ffin = this.mfiltros.ffin === undefined ? "" : this.mfiltros.ffin;
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuestaMensajes(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  private manejaRespuestaMensajes(resp: any) {
    this.lregistros = [];
    if (resp.cod === 'OK') {
      this.lregistros = resp.FCE_LOGDOCELECTRONICOS;
    }
  }

  //llenarConsultaCatalogos(): void {
    //const consultaNivel = new Consulta('tacftipoproducto', 'Y', 't.ctipoproducto', {}, {});
    //consultaNivel.cantidad = 100;
    //this.addConsultaPorAlias('TIPO',consultaNivel)
  //}

  //private manejaRespuestaCatalogos(resp: any) {
    //const msgs = [];
    //if (resp.cod === 'OK') {
      //this.llenaListaCatalogo(this.lregistros, resp.TIPO, 'ctipoproducto');
    //}
    //this.lconsulta = [];
  //}

  descargarReporte(reg: any): void {

    //this.jasper.nombreReporteJasper = 'lazos/facturacion/ventas.jasper';
    this.jasper.formatoexportar=reg;
    this.jasper.nombreArchivo = 'ReporteLogDocumentosElectronicos';

    if (this.mfiltros.finicio === undefined || this.mfiltros.finicio === null  || this.mfiltros.finicio > this.mfiltros.ffin) {
      this.mostrarMensajeError("EL CAMPO DE FECHAS SON INCORRECTAS.");
      return;
    }
    if (this.mfiltros.ffin === undefined || this.mfiltros.ffin === null || this.mfiltros.finicio > this.mfiltros.ffin) {
      this.mostrarMensajeError("EL CAMPO DE FECHAS SON INCORRECTAS.");
      return;
    }
    
    // Agregar parametros
    //this.jasper.parametros['@i_tipo'] = this.mfiltros.ctipoproducto;
    this.jasper.parametros['@i_finicio'] = this.mfiltros.finicio;
    this.jasper.parametros['@i_ffin'] = this.mfiltros.ffin;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/FacturacionElectronica/rptCel_LogDocumentosElectronicos';
    this.jasper.generaReporteCore();
  }


}
