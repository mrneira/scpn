import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { LovInversionesComponent } from '../../../../inversiones/lov/inversiones/componentes/lov.inversiones.component';

@Component({
  selector: 'app-recuperacion',
  templateUrl: 'recuperacion.html'
})
export class RecuperacionComponent extends BaseComponent implements OnInit, AfterViewInit {

  public lEmisor: SelectItem[] = [{ label: '...', value: null }];
  public lInstrumento: SelectItem[] = [{ label: '...', value: null }];

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovInversionesComponent)
  private lovInversiones: LovInversionesComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'RECUPERACION', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.camposfecha.finicio = new Date();
    this.mcampos.camposfecha.ffin = new Date();
    this.consultarCatalogos();
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


  llenarConsultaCatalogos(): void {

    const mfiltrosEmisor: any = { 'ccatalogo': 1213 };
    const consultaEmisor = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEmisor, {});
    consultaEmisor.cantidad = 50;
    this.addConsultaPorAlias('EMISOR', consultaEmisor);

    const mfiltrosInstrumento: any = { 'ccatalogo': 1202 };
    const consultaInstrumento = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosInstrumento, {});
    consultaInstrumento.cantidad = 50;
    this.addConsultaPorAlias('INSTRUMENTO', consultaInstrumento);
  }


  ngAfterViewInit() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  imprimir(resp: any): void {

    this.jasper.nombreArchivo = 'rptInvRecuperacionesDeInversiones';

    let lfinicio: number = 0;
    let lffin: number = 99990101;

    let lcinversion: number = -1;

    if (!this.estaVacio(this.mcampos.cinversion)) {
      lcinversion = this.mcampos.cinversion;
    }


    let lemisorcdetalle: string = "||";
    
    if (!this.estaVacio(this.registro.emisorcdetalle)) {
      lemisorcdetalle = this.registro.emisorcdetalle;
    }

    let linstrumentocdetalle: string = "||";

    if (!this.estaVacio(this.registro.instrumentocdetalle)) {
      linstrumentocdetalle = this.registro.instrumentocdetalle;
    }

    if (this.mcampos.finicio === undefined || this.mcampos.finicio === null) {
      lfinicio = 0
    }
    else {
      lfinicio = (this.mcampos.finicio.getFullYear() * 10000) + ((this.mcampos.finicio.getMonth() + 1) * 100) + this.mcampos.finicio.getDate();
    }

    if (this.mcampos.ffin === undefined || this.mcampos.ffin === null) {
      lffin = 99990101
    }
    else {
      lffin = (this.mcampos.ffin.getFullYear() * 10000) + ((this.mcampos.ffin.getMonth() + 1) * 100) + this.mcampos.ffin.getDate();
    }

    this.jasper.formatoexportar = resp;

    // Agregar parametros
    this.jasper.parametros['@i_cinversion'] = lcinversion;
    this.jasper.parametros['@i_instrumentocdetalle'] = linstrumentocdetalle;
    this.jasper.parametros['@i_fdesde'] = lfinicio;
    this.jasper.parametros['@i_fhasta'] = lffin;
    this.jasper.parametros['@i_emisorcdetalle'] = lemisorcdetalle;
    
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvRecuperacionesDeInversiones';
    this.jasper.generaReporteCore();

  }


  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.lInstrumento, resp.INSTRUMENTO, 'cdetalle');
      this.llenaListaCatalogo(this.lEmisor, resp.EMISOR, 'cdetalle');
    }
    this.lconsulta = [];
  }
  /**Muestra lov de cuentas contables */

  mostrarLovInversiones(): void {
    this.lovInversiones.showDialog();
  }

  fijarLovInversionesSelec(reg: any): void {
    if (reg.registro !== undefined) {

      this.msgs = [];
      this.mcampos.cinversion = reg.registro.cinversion;
      this.mcampos.codigotitulo = reg.registro.codigotitulo;

    }

  }

}
