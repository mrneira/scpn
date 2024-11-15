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
  selector: 'app-inversionesportipo',
  templateUrl: 'inversionesportipo.html'
})
export class InversionesPorTipoComponent extends BaseComponent implements OnInit, AfterViewInit {

  public lEmisor: SelectItem[] = [{ label: '...', value: null }];

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'INVERSIONESPORTIPO', false);
    this.componentehijo = this;
  }

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
    
    this.jasper.nombreArchivo = 'RptInversionesPorTipo';
    this.jasper.formatoexportar = resp;
    this.jasper.parametros['@i_fcorte']         = lfechacorte;
    this.jasper.parametros['@i_usuario']        = this.dtoServicios.mradicacion.cusuario;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvInversionesPorTipo';
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
