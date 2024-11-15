
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
  selector: 'app-portafoliorendevolucion',
  templateUrl: 'portafoliorendevolucion.html'
})
export class PortafoliorendevolucionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  private maxDateValue: Date = new Date();

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'PORTAFOLIORF', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.camposfecha.fvaloracion = new Date();
    this.mcampos.camposfecha.fcorte = new Date();
    let fechatmp = this.integerToFormatoFecha(this.dtoServicios.mradicacion.fcontable)
    let fehcha = new Date(fechatmp);
    this.maxDateValue.setDate(fehcha.getDate() + 1);
   

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

  

    let lFecha: number = (this.maxDateValue.getFullYear() * 10000) + ((this.maxDateValue.getMonth() + 1) * 100) + this.maxDateValue.getDate();

    let lFvaloracion: number = (this.mcampos.fvaloracion.getFullYear() * 10000) + ((this.mcampos.fvaloracion.getMonth() + 1) * 100) + this.mcampos.fvaloracion.getDate();

    if (lFvaloracion >= lFecha) {
      this.mostrarMensajeError('LA FECHA DE VALORACIÓN DEBE SER MENOR A LA FECHA ACTUAL DEL SISTEMA');
      return;
    }

    //let lCorte: number = (this.mcampos.fcorte.getFullYear() * 10000) + ((this.mcampos.fcorte.getMonth() + 1) * 100) + this.mcampos.fcorte.getDate();

  


    this.jasper.nombreArchivo = 'rptInvPortafolioredevolucion';

    let lfvaloracion: number = 0;
    let lfcorte: number = 99990101;

    lfvaloracion = (this.mcampos.fvaloracion.getFullYear() * 10000) + ((this.mcampos.fvaloracion.getMonth() + 1) * 100) + this.mcampos.fvaloracion.getDate();

    //lfcorte = (this.mcampos.fcorte.getFullYear() * 10000) + ((this.mcampos.fcorte.getMonth() + 1) * 100) + this.mcampos.fcorte.getDate();

    this.jasper.formatoexportar = resp;

    // Agregar parametros
    this.jasper.parametros['@i_fhasta'] = lfvaloracion;
    this.jasper.parametros['@i_usuario'] =this.dtoServicios.mradicacion.cusuario;
    //this.jasper.parametros['@o_valorMercado'] = 0;
   // this.jasper.parametros['@i_noGeneraPortafolio'] = 0;

    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvPortafolioredevolucion';
    this.jasper.generaReporteCore();

  }

}
