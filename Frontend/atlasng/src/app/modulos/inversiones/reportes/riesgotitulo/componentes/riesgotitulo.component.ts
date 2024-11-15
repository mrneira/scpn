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
  selector: 'app-riesgotitulo',
  templateUrl: 'riesgotitulo.html'
})
export class RiesgotituloComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovInversionesComponent)
  private lovInversiones: LovInversionesComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'RIESGOTITULO', false);
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

    this.jasper.nombreArchivo = 'rptInvRiesgosPorTitulo';

    let lfcorte: number = (this.mcampos.fcorte.getFullYear() * 10000) + ((this.mcampos.fcorte.getMonth() + 1) * 100) + this.mcampos.fcorte.getDate();

    this.jasper.formatoexportar = resp;

    // Agregar parametros
    this.jasper.parametros['@i_cinversion'] = this.mcampos.cinversion;
    this.jasper.parametros['@i_diaslaborables'] = this.mcampos.diaslaborables + 1;
    this.jasper.parametros['@i_fechacorte'] = lfcorte;
    this.jasper.parametros['@i_cusuarioing'] = this.dtoServicios.mradicacion.cusuario;;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvRiesgosPorTitulo';
    this.jasper.generaReporteCore();

  }


  /**Muestra lov de cuentas contables */
  mostrarLovInversiones(): void {
    this.encerarMensajes();

    this.lovInversiones.mfiltros.tasaclasificacioncdetalle = "FIJA";
    this.lovInversiones.showDialog();
  }

  fijarLovInversionesSelec(reg: any): void {
    if (reg.registro !== undefined) {

      this.msgs = [];
      this.mcampos.cinversion = reg.registro.cinversion;
      this.mcampos.codigotitulo = reg.registro.codigotitulo;

    }

  }


  validarCabecera(): string {

    let lmensaje: string = "";

    if (this.estaVacio(this.mcampos.cinversion)) {
      lmensaje = "DEBE ESCOGER UNA INVERSIÓN";
    }
    else if (this.estaVacio(this.mcampos.fcorte)) {
      lmensaje = "FECHA DE CORTE OBLIGATORIA";
    }
    else if (this.estaVacio(this.mcampos.diaslaborables) || this.mcampos.diaslaborables <= 0) {
      lmensaje = "EL NÚMERO DE DÍAS LABORABLES DEBE SER UN NÚMERO ENTERO POSITIVO";
    }
    return lmensaje;
  }
}
