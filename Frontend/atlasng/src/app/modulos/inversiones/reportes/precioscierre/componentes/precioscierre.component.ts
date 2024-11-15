import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-reporte-rendimientorentafija',
  templateUrl: 'precioscierre.html'
})
export class PrecioscierreComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public lestadocdetalle: SelectItem[] = [{ label: '...', value: null }];
  public lemisor: SelectItem[] = [{ label: '...', value: null }];


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'RENTAFIJA', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  imprimir(reg: any): void {

    if ((this.mcampos.finicio != null && this.mcampos.ffin == null) || (this.mcampos.finicio == undefined && this.mcampos.ffin == undefined) || (this.mcampos.finicio == null && this.mcampos.ffin != null) || (this.mcampos.finicio > this.mcampos.ffin)) {
      this.mostrarMensajeError("EL CAMPO DE FECHAS SON INCORRECTAS.");
      return;
    }
   

    






    this.jasper.nombreArchivo = 'PreciosCierre';
    this.jasper.parametros['@i_emisor'] = this.mcampos.emisorcdetalle;
   
    this.jasper.parametros['@i_finicio'] = this.fechaToInteger(this.mcampos.finicio);
    this.jasper.parametros['@i_ffin'] = this.fechaToInteger(this.mcampos.ffin);
    this.jasper.formatoexportar = reg;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvPreciosCierreGrafico';

    this.jasper.generaReporteCore();
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    const mfiltrosEstado: any = { 'ccatalogo': 1205 };
    const consultaEstado = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstado, {});
    consultaEstado.cantidad = 100;
    this.addConsultaCatalogos('ESTADO', consultaEstado, this.lestadocdetalle, super.llenaListaCatalogo, 'cdetalle', null, false);

    const mfiltrosEmisor: any = { 'ccatalogo': 1213 };
    const consultaEmisor = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEmisor, {});
    consultaEmisor.cantidad = 100;
    this.addConsultaCatalogos('EMISOR', consultaEmisor, this.lemisor, super.llenaListaCatalogo, 'cdetalle', null, false);

    this.ejecutarConsultaCatalogos();
  }


}

