
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
  selector: 'app-fondoliquidez',
  templateUrl: 'fondoliquidez.html'
})
export class FondoliquidezComponent extends BaseComponent implements OnInit, AfterViewInit {

  public lEmisor: SelectItem[] = [{ label: '...', value: null }];

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'fondoliquidez', false);
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

    this.jasper.nombreArchivo = 'rptInvFondoLiquidez';

    let lfdesde: number = (this.mcampos.fdesde.getFullYear() * 10000) + ((this.mcampos.fdesde.getMonth() + 1) * 100) + this.mcampos.fdesde.getDate();
    let lfhasta: number = (this.mcampos.fhasta.getFullYear() * 10000) + ((this.mcampos.fhasta.getMonth() + 1) * 100) + this.mcampos.fhasta.getDate();

    this.jasper.formatoexportar = resp;

    // Agregar parametros

    this.jasper.parametros['@i_fdesde'] = lfdesde;
    this.jasper.parametros['@i_fhasta'] = lfhasta;
    this.jasper.parametros['@i_usuario'] = this.dtoServicios.mradicacion.cusuario;;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvFondoLiquidez';
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
