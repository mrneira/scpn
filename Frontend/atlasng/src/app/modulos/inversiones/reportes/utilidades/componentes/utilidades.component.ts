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
  selector: 'app-utilidades',
  templateUrl: 'utilidades.html'
})
export class UtilidadesComponent extends BaseComponent implements OnInit, AfterViewInit {

  public lAnio: SelectItem[] = [{ label: '...', value: null }];

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'CAJA', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.fcorte = new Date();
    this.llenarAnio();
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


    this.jasper.nombreArchivo = 'rptInvUtilidades';

    this.jasper.formatoexportar = resp;

    // Agregar parametros

    this.jasper.parametros['@iEjercicio'] = Number(this.mcampos.anio);
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvUtilidades';
    this.jasper.generaReporteCore();

  }

  validarCabecera(): string {

    let lmensaje: string = "";

    
      if (this.estaVacio(this.mcampos.anio)) {
        lmensaje = "EJERCICIO OBLIGATORIO";
      }  

      return lmensaje;
  }

  llenarAnio() {
    this.lAnio = [];
    this.lAnio.push({ label: '...', value: null });

    let lIndice: number = 1990;
    let lstranio: string = null;
    while (lIndice < 3000)
    {
      lstranio = String(lIndice);
      this.lAnio.push({ label: lstranio, value: lstranio });
      lIndice++;
    }
  }

}
