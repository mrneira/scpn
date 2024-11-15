
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
  selector: 'app-historicoportafoliorf',
  templateUrl: 'historicoportafoliorf.html'
})
export class HistoricoportafoliorfComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  private maxDateValue: Date = new Date();

  selectedmodelo: string;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'HISTORICOPORTAFOLIORF', false);
    this.componentehijo = this;
  }

  fmax = new Date();

  ngOnInit() {
    super.init();
    this.mcampos.camposfecha.fvaloracion = new Date();
    this.fmax = new Date();
    this.fmax.setDate(this.fmax.getDate() - 1);
  }

  ngAfterViewInit() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  imprimir(resp: any): void {

    if (this.estaVacio(this.mcampos.fvaloracion)) {
      this.mostrarMensajeError('FECHA DE VALORACIÓN REQUERIDA');
      return;
    }

    let lFvaloracion: number = (this.mcampos.fvaloracion.getFullYear() * 10000) + ((this.mcampos.fvaloracion.getMonth() + 1) * 100) + this.mcampos.fvaloracion.getDate();
    
    if (this.selectedmodelo === 'modelo1' )  
    {
      this.jasper.nombreArchivo = 'rptInvPortafolioRentaFija_'+lFvaloracion;
    }
    else if (this.selectedmodelo === 'modelo2' )  
    {
      this.jasper.nombreArchivo = 'rptInvPortafolioRentaFijaSector_'+lFvaloracion;
    }
    else if (this.selectedmodelo === 'modelo3' )  
    {
      this.jasper.nombreArchivo = 'rptInvPortafolioRentaFijaEmisor_'+lFvaloracion;
    }
    else
    {
      this.mostrarMensajeError('SELECCIONE EL TIPO DE REPORTE');
      return;
    }
    
    
    //this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptConBalanceGeneralModelo1';

    //if (this.selectedmodelo === 'modelo2' )  this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptConBalanceGeneralModelo2';


    let lfvaloracion: number = 0;
    let lfcorte: number = 99990101;

    lfvaloracion = (this.mcampos.fvaloracion.getFullYear() * 10000) + ((this.mcampos.fvaloracion.getMonth() + 1) * 100) + this.mcampos.fvaloracion.getDate();

    //lfcorte = (this.mcampos.fcorte.getFullYear() * 10000) + ((this.mcampos.fcorte.getMonth() + 1) * 100) + this.mcampos.fcorte.getDate();

    this.jasper.formatoexportar = resp;

    // Agregar parametros
    this.jasper.parametros['@i_fvaloracion'] = lfvaloracion;
    //this.jasper.parametros['@i_fcorte'] = lfcorte;
    //this.jasper.parametros['@o_valorMercado'] = 0;
    //this.jasper.parametros['@i_noGeneraPortafolio'] = 0;

    if (this.selectedmodelo === 'modelo1' )  
    {
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvPortafolioRentaFija';
    }
    else if (this.selectedmodelo === 'modelo2' )  
    {
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvPortafolioRentaFijaSector';
    }
    else if (this.selectedmodelo === 'modelo3' )  
    {
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvPortafolioRentaFijaEmisor';
    }


    this.jasper.generaReporteCore();

  }

}
