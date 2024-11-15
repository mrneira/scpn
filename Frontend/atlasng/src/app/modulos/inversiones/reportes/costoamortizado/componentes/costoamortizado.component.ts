
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem, SpinnerModule, FieldsetModule } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { LovInversionesComponent } from '../../../../inversiones/lov/inversiones/componentes/lov.inversiones.component';

@Component({
  selector: 'app-costoamortizado',
  templateUrl: 'costoamortizado.html'
})
export class CostoAmortizadoComponent extends BaseComponent implements OnInit, AfterViewInit {

  public lEmisor: SelectItem[] = [{ label: '...', value: null }];

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;
  @ViewChild(LovInversionesComponent) private lovInversiones: LovInversionesComponent;
  

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'CAJA', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.fcorte = new Date();
  }

  ngAfterViewInit() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  mostrarLovInversiones(): void {


  this.lovInversiones.mfiltrosesp.tir = ' > 0 ';

  this.lovInversiones.mfiltros.tasaclasificacioncdetalle = "FIJA";

  this.lovInversiones.showDialog();
}

fijarLovInversionesSelec(reg: any): void {
  if (reg.registro !== undefined) {

    this.msgs = [];
    this.mcampos.cinversion = reg.registro.cinversion;
    this.mcampos.codigotitulo = reg.registro.codigotitulo;
    this.mcampos.nemisor= reg.registro.mdatos.nnombre;
    this.consultar();
  }
}

  imprimir(resp: any): void {

    let mensaje: string = this.validarCabecera();

    if (!this.estaVacio(mensaje)) {
      this.mostrarMensajeError(mensaje);
      return;
    }

    this.jasper.nombreArchivo = "TABLA-"+this.mcampos.nemisor;

    this.jasper.formatoexportar = resp;

    // Agregar parametros

    this.jasper.parametros['@i_cinversion'] = this.mcampos.cinversion;

    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvCostoAmortizado';
    this.jasper.generaReporteCore();

  }

  validarCabecera(): string {

    let lmensaje: string = "";

    
      if (this.estaVacio(this.mcampos.cinversion)) {
        lmensaje = "SELECCIONE LA INVERSIÓN";
      }  
    return lmensaje;
  }

  

}
