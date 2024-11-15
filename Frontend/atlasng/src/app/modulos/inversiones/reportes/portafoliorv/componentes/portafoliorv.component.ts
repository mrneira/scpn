
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
  selector: 'app-portafoliorv',
  templateUrl: 'portafoliorv.html'
})
export class PortafoliorvComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  private maxDateValue: Date = new Date();

  constructor(router: Router, dtoServicios: DtoServicios) {
    //super(router, dtoServicios, '', 'PORTAFOLIORF', false);
    //this.componentehijo = this;
    super(router, dtoServicios, 'tconestadopatrominio', 'EstadoPatrimonio', false, true);
    this.componentehijo = this;
  }
  public lemisor: SelectItem[] = [{ label: '...', value: null }];
  ngOnInit() {
    super.init();
    this.mcampos.camposfecha.fvaloracion = new Date();
    this.mcampos.camposfecha.fcorte = new Date();
    let fechatmp = this.integerToFormatoFecha(this.dtoServicios.mradicacion.fcontable)
    let fehcha = new Date(fechatmp);
    this.maxDateValue.setDate(fehcha.getDate() + 1);
   this.consultarCatalogos();

  }

  
  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    const mfiltrosUbicacion: any = { 'ccatalogo': 1213 };
    const mfiltrosespecial: any ={'cdetalle':"in (SELECT DISTINCT  emisorcdetalle FROM tinvinversion WHERE tasaclasificacioncdetalle ='VAR')"} 
    const consultaUbicacion = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosUbicacion, mfiltrosespecial);
    consultaUbicacion.cantidad = 50;
    this.addConsultaCatalogos('EMISOR', consultaUbicacion, this.lemisor, super.llenaListaCatalogo, 'cdetalle');   
    
    this.ejecutarConsultaCatalogos();
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

    if (this.estaVacio(this.mcampos.fcorte)) {
      this.mostrarMensajeError('FECHA DE CORTE REQUERIDA');
      return;
    }

    let lFecha: number = (this.maxDateValue.getFullYear() * 10000) + ((this.maxDateValue.getMonth() + 1) * 100) + this.maxDateValue.getDate();

    let lFvaloracion: number = (this.mcampos.fvaloracion.getFullYear() * 10000) + ((this.mcampos.fvaloracion.getMonth() + 1) * 100) + this.mcampos.fvaloracion.getDate();

    if (lFvaloracion >= lFecha) {
      this.mostrarMensajeError('LA FECHA DE VALORACIÓN DEBE SER MENOR A LA FECHA ACTUAL');
      return;
    }

    let lCorte: number = (this.mcampos.fcorte.getFullYear() * 10000) + ((this.mcampos.fcorte.getMonth() + 1) * 100) + this.mcampos.fcorte.getDate();

  


    this.jasper.nombreArchivo = 'rptInvPortafolioRentaVariable';

    let lfvaloracion: number = 0;
    let lfcorte: number = 99990101;

    lfvaloracion = (this.mcampos.fvaloracion.getFullYear() * 10000) + ((this.mcampos.fvaloracion.getMonth() + 1) * 100) + this.mcampos.fvaloracion.getDate();

    lfcorte = (this.mcampos.fcorte.getFullYear() * 10000) + ((this.mcampos.fcorte.getMonth() + 1) * 100) + this.mcampos.fcorte.getDate();

    this.jasper.formatoexportar = resp;

    // Agregar parametros
    this.jasper.parametros['@i_fvaloracion'] = lfvaloracion;
    this.jasper.parametros['@i_fcorte'] = lfcorte;
    this.jasper.parametros['@i_cemisor'] = this.estaVacio(this.mcampos.cemisor)!?'V':this.mcampos.cemisor;
    
    this.jasper.parametros['@o_valorMercado'] = 0;
    this.jasper.parametros['@i_noGeneraPortafolio'] = 0;

    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvPortafolioRentaVariable';
    this.jasper.generaReporteCore();

  }

}
