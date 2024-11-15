import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem, SpinnerModule, FieldsetModule } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-portafoliorfyrv',
  templateUrl: 'portafoliorfyrv.html'
})
export class PortafolioRfyRvComponent extends BaseComponent implements OnInit, AfterViewInit {

  public lEmisor: SelectItem[] = [{ label: '...', value: null }];

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'PORTAFOLIO', false);
    this.componentehijo = this;
  }
  //RNI 20240716
  ngOnInit() {
    super.init();
    this.mcampos.fcorte = new Date();
    0
  }

  ngAfterViewInit() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  imprimir(resp: any): void {

    var myDate        = new Date();
    var lfechaactual  = this.fechaToInteger(myDate);
    let lfechacorte   = this.fechaToInteger(this.mcampos.fcorte);
    if (lfechacorte >= lfechaactual) {
      super.mostrarMensajeError('LA FECHA DE VALORACIÓN DEBE SER MENOR A LA FECHA ACTUAL DEL SISTEMA');
      return; 
    }
    
    this.jasper.nombreArchivo = 'RptLimitesDeInversiones';
    this.jasper.formatoexportar = resp;
    this.jasper.parametros['@i_fvaloracion']    = lfechacorte;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvPortafolioRentaFijayVariable';
    this.jasper.generaReporteCore(); 
  }

  validarCabecera(): string {

    let lmensaje: string = "";

   
      if (this.estaVacio(this.mcampos.fcorte)) {
        lmensaje = "FECHA DE CORTE OBLIGATORIA";
      }  
    return lmensaje;
  }
}
