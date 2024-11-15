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
import { LovRentavariableComponent } from '../../../../inversiones/lov/rentavariable/componentes/lov.rentavariable.component';

@Component({
  selector: 'app-riesgoemisor',
  templateUrl: 'riesgoemisor.html'
})
export class RiesgoemisorComponent extends BaseComponent implements OnInit, AfterViewInit {

  public lEmisor: SelectItem[] = [{ label: '...', value: null }];

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovInversionesComponent)
  private lovInversiones: LovInversionesComponent;

  @ViewChild(LovRentavariableComponent) private lovRentaVariable: LovRentavariableComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'RIESGOTITULO', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.fcorte = new Date();
    this.consultarCatalogos();
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

    this.jasper.nombreArchivo = 'rptInvRiesgosPorEmisor';

    let lfcorte: number = (this.mcampos.fcorte.getFullYear() * 10000) + ((this.mcampos.fcorte.getMonth() + 1) * 100) + this.mcampos.fcorte.getDate();

    this.jasper.formatoexportar = resp;

    // Agregar parametros
    this.jasper.parametros['@i_emisorcdetalle'] = this.registro.emisorcdetalle;
    this.jasper.parametros['@i_diaslaborables'] = this.mcampos.diaslaborables + 1;
    this.jasper.parametros['@i_fechacorte'] = lfcorte;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvRiesgosPorEmisor';
    this.jasper.generaReporteCore();

  }

  validarCabecera(): string {

    let lmensaje: string = "";

    if (this.estaVacio(this.registro.emisorcdetalle)) {
      lmensaje = "SELECCIONE UN EMISOR";
    }
    else {
      if (this.estaVacio(this.mcampos.fcorte)) {
        lmensaje = "FECHA DE CORTE OBLIGATORIA";
      }
      else {
        if (this.estaVacio(this.mcampos.diaslaborables) || this.mcampos.diaslaborables <= 0) {
          lmensaje = "EL NÚMERO DE DÍAS LABORABLES DEBE SER UN NÚMERO ENTERO POSITIVO";
        }

      }
    }
    return lmensaje;
  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.lEmisor, resp.EMISOR, 'cdetalle');
    }
    this.lconsulta = [];
  }

  llenarConsultaCatalogos(): void {

    const mfiltrosEmisor: any = { 'ccatalogo': 1213 };
    const consultaEmisor = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEmisor, {});
    consultaEmisor.cantidad = 1000000;
    this.addConsultaPorAlias('EMISOR', consultaEmisor);

  }

  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.encerarMensajes();
        this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
        this.manejaRespuestaCatalogos(resp);

      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }
}
