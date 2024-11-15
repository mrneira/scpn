
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
  selector: 'app-portafoliohistoricorf',
  templateUrl: 'portafoliohistoricorf.html'
})
export class PortafoliohistoricorfComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  private maxDateValue: Date = new Date();

  selectedmodelo: string;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'PORTAFOLIOHISTORICORF', false);
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
      this.jasper.nombreArchivo = 'rptInvPortafolioHistoricoRentaFija_'+lFvaloracion;
    }
    else if (this.selectedmodelo === 'modelo2' )  
    {
      this.jasper.nombreArchivo = 'rptInvPortafolioHistoricoRentaFijaSector_'+lFvaloracion;
    }
    else if (this.selectedmodelo === 'modelo3' )  
    {
      this.jasper.nombreArchivo = 'rptInvPortafolioHistoricoRentaFijaEmisor_'+lFvaloracion;
    }
    else
    {
      this.mostrarMensajeError('SELECCIONE EL TIPO DE REPORTE');
      return;
    }
    
    


    let lfvaloracion: number = 0;
    let lfcorte: number = 99990101;

    lfvaloracion = (this.mcampos.fvaloracion.getFullYear() * 10000) + ((this.mcampos.fvaloracion.getMonth() + 1) * 100) + this.mcampos.fvaloracion.getDate();


    this.jasper.formatoexportar = resp;

    // Agregar parametros
    this.jasper.parametros['@i_fvaloracion'] = lfvaloracion;

    if (this.selectedmodelo === 'modelo1' )  
    {
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvPortafolioHistoricoRentaFija';
    }
    else if (this.selectedmodelo === 'modelo2' )  
    {
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvPortafolioHistoricoRentaFijaSector';
    }
    else if (this.selectedmodelo === 'modelo3' )  
    {
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvPortafolioHistoricoRentaFijaEmisor';
    }


    this.jasper.generaReporteCore();

  }

}
