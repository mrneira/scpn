
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
  selector: 'app-portafoliototal',
  templateUrl: 'portafoliototal.html'
})
export class PortafolioTotalComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  private maxDateValue: Date = new Date();

  selectedmodelo: string;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'PORTAFOLIOTOTAL', false);
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

   

    let lfvaloracion: number = 0;
    let lfcorte: number = 99990101;

    lfvaloracion =this.fechaToInteger(this.mcampos.fvaloracion)

    //lfcorte = (this.mcampos.fcorte.getFullYear() * 10000) + ((this.mcampos.fcorte.getMonth() + 1) * 100) + this.mcampos.fcorte.getDate();

    this.jasper.formatoexportar = resp;

    // Agregar parametros
    this.jasper.parametros['@i_fproceso'] = lfvaloracion;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvPortafolioTotal';
   


    this.jasper.generaReporteCore();

  }

}
