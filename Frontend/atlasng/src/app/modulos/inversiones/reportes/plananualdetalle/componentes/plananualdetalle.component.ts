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
  selector: 'app-plananualdetalle',
  templateUrl: 'plananualdetalle.html'
})
export class PlananualdetalleComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'PORTAFOLIORF', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    let fvaloracion = new Date();
    this.mcampos.anio = fvaloracion.getFullYear();
  }

  ngAfterViewInit() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  imprimir(resp: any): void {

    if (this.estaVacio(this.mcampos.anio)) {
      this.mostrarMensajeError('AÑO REQUERIDO');
      return;
    }

   

    this.jasper.nombreArchivo = 'PLAN-PRIVATIVAS'+this.mcampos.anio;

   
    this.jasper.formatoexportar = resp;

    // Agregar parametros
    this.jasper.parametros['@i_anio'] = this.mcampos.anio;
  
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvPlanAnualdetalle';
    this.jasper.generaReporteCore();

  }

}
