import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-rendimientoymaduracionrentafija',
  templateUrl: 'rendimientoymaduracionrentafija.html'
})
export class RendimientoMaduracionRentaFija extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;
  public lInstrumento: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'TINVINVERSION', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.camposfecha.fvaloracion = new Date();
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.encerarMensajes();
        this.dtoServicios.llenarMensaje(resp, false); 
        this.manejaRespuestaCatalogos(resp);

      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.lInstrumento, resp.INSTRUMENTO, 'cdetalle');
    }
    this.lconsulta = [];
  }

  llenarConsultaCatalogos(): void {
    
        const mfiltrosInstrumento: any = { 'ccatalogo': 1202 };
        const consultaInstrumento = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosInstrumento, {});
        consultaInstrumento.cantidad = 50;
        this.addConsultaPorAlias('INSTRUMENTO', consultaInstrumento);
    
  }

  imprimir(resp: any): void {

    let linstrumentocdetalle: string;

    if (this.estaVacio(this.mcampos.fvaloracion)) {
      this.mostrarMensajeError('FECHA DE VALORACIÓN REQUERIDA');
      return;
    }

    if (!this.estaVacio(this.registro.instrumentocdetalle)) {
      linstrumentocdetalle = this.registro.instrumentocdetalle;
    }

    this.jasper.nombreArchivo = 'rptInvRendimientoMaduracionRentaFija';

    let lfvaloracion: number = 0;


    lfvaloracion = (this.mcampos.fvaloracion.getFullYear() * 10000) + ((this.mcampos.fvaloracion.getMonth() + 1) * 100) + this.mcampos.fvaloracion.getDate();

   
    this.jasper.formatoexportar = resp;


    this.jasper.parametros['@i_fvaloracion'] = lfvaloracion;

    this.jasper.parametros['@i_instrumento'] = linstrumentocdetalle;
    
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvRendimientoMaduracionRentaFija';
    this.jasper.generaReporteCore();

  }

}
