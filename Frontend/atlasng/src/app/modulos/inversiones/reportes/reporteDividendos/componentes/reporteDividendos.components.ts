
// Reporte de dividendos pagados y dividendos en acciones
// RRP: 20211028

import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { JasperComponent } from "app/util/componentes/jasper/componentes/jasper.component";
import { DtoServicios } from "app/util/servicios/dto.servicios";
import { BaseComponent } from "app/util/shared/componentes/base.component";
import { SelectItem } from "primeng/primeng";

@Component({
  selector: 'app-reporte-dividendos',
  templateUrl: 'reporteDividendos.html'
})
export class ReporteDividendosComponent extends BaseComponent implements OnInit, AfterViewInit {

  public lEmisor: SelectItem[] = [{ label: '...', value: null }];

  public lperfiles: SelectItem[] = [{label: '...', value: null}, {label: 'Nacional', value: 'NAC'}, {label: 'Internacional', value: 'EXT'}];


  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

//RRO 20220804
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'dividendos', false);
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

    this.jasper.nombreArchivo = 'rptInvDividendosPagadosAcciones';
    this.jasper.formatoexportar = resp;

    // Agregar parametros
    this.jasper.parametros['@sectorcdetalle'] = this.mfiltros.crol;
    this.jasper.parametros['@fechaInicio'] = this.mcampos.fdesde.getFullYear() + '-'  + (this.mcampos.fdesde.getMonth() + 1) + '-' + this.mcampos.fdesde.getDate(); // lfdesde;
    this.jasper.parametros['@fechaFin'] = this.mcampos.fhasta.getFullYear() + '-'  + (this.mcampos.fhasta.getMonth() + 1) + '-' + this.mcampos.fhasta.getDate();// lfhasta;
    this.jasper.parametros['@responsable'] = this.dtoServicios.mradicacion.np;

    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvDividendosPagadosAcciones';
    this.jasper.generaReporteCore(); 
  }

  validarCabecera(): string {
    let lmensaje: string = "";
      if (this.estaVacio(this.mcampos.fdesde) || this.estaVacio(this.mcampos.fhasta)) {
        lmensaje = "LAS FECHAS SON OBLIGATORIAS";
      }  
      return lmensaje;
  }

}
