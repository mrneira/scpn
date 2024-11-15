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
  selector: 'app-activosfijos',
  templateUrl: 'activosfijos.html'
})
export class ActivosfijosComponent extends BaseComponent implements OnInit, AfterViewInit {

  public lEmisor: SelectItem[] = [{ label: '...', value: null }];

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'ACTIVOSFIJOS', false);
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

    let mensaje: string = this.validarCabecera();

    if (!this.estaVacio(mensaje)) {
      this.mostrarMensajeError(mensaje);
      return;
    }

    this.jasper.nombreArchivo = 'rptInvActivosFijos';

  
    this.jasper.formatoexportar = resp;

    // Agregar parametros

    this.jasper.parametros['@i_fvigente'] = this.mcampos.fcorte;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvActivosFijos';
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
