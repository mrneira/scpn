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
  selector: 'app-portafolioinversiones',
  templateUrl: 'portafolioinversiones.html'
})
export class PortafolioinversionesComponent extends BaseComponent implements OnInit, AfterViewInit {

  public lEmisor: SelectItem[] = [{ label: '...', value: null }];

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  //selectedmodelo: string;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'PORTAFOLIOINVERSIONES', false);
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

  imprimir(resp: any): void {

    let mensaje: string = this.validarCabecera();

    if (!this.estaVacio(mensaje)) {
      this.mostrarMensajeError(mensaje);
      return;
    }

      this.jasper.nombreArchivo = 'rptInvMatPortafolio';

    let lfdesde: number = (this.mcampos.fdesde.getFullYear() * 10000) + ((this.mcampos.fdesde.getMonth() + 1) * 100) + this.mcampos.fdesde.getDate();
    let lfhasta: number = (this.mcampos.fhasta.getFullYear() * 10000) + ((this.mcampos.fcorte.getMonth() + 1) * 100) + this.mcampos.fcorte.getDate();

    this.jasper.formatoexportar = resp;

    // Agregar parametros

    this.jasper.parametros['@i_fcontabledesde'] = lfdesde;
    this.jasper.parametros['@i_fcontablehasta'] = lfhasta;
    this.jasper.parametros['@i_fapertura'] = lfdesde;

    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvMatPortafolio';

    this.jasper.generaReporteCore();

  }

  validarCabecera(): string {

    let lmensaje: string = "";

    
      if (this.estaVacio(this.mcampos.fdesde) || this.estaVacio(this.mcampos.fhasta)) {
        lmensaje = "FECHAS SON OBLIGATORIAS";
      }  

      return lmensaje;
  }

}