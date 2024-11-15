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
  selector: 'app-calificacion-emisor',
  templateUrl: 'calificacionEmisor.html'
})
export class CalificacionEmisorComponent extends BaseComponent implements OnInit, AfterViewInit {

  public lemisor: SelectItem[] = [{ label: '...', value: null }];
  public lcalificacion: SelectItem[] = [{ label: '...', value: null }];

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'CALIFICACIONEMISOR', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  imprimir(resp: any): void {

    this.jasper.nombreArchivo = 'rptInvCalificacionEmisor';
    this.jasper.formatoexportar = resp;

    // Agregar parametros

    this.jasper.parametros['@i_emisor'] = this.mcampos.emisor;
    this.jasper.parametros['@i_calificacion'] = this.mcampos.calificacion;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvCalificacionEmisor';
    this.jasper.generaReporteCore();

  }

  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.manejaRespuestaCatalogos(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }
  llenarConsultaCatalogos(): void {
    const mfiltrosEmisor: any = { 'ccatalogo': 1213 };
    const consultaEmisor = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEmisor, {});
    consultaEmisor.cantidad = 200;
    this.addConsultaPorAlias('EMISOR', consultaEmisor);

    const mfiltrosCalificacion: any = { 'ccatalogo': 1207 };
    const consultaCalificacion = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosCalificacion, {});
    consultaCalificacion.cantidad = 200;
    this.addConsultaPorAlias('CALIFICACION', consultaCalificacion);

  }
  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.lemisor, resp.EMISOR, 'cdetalle');
      this.llenaListaCatalogo(this.lcalificacion, resp.CALIFICACION, 'cdetalle');
    }
    this.lconsulta = [];
  }


}
