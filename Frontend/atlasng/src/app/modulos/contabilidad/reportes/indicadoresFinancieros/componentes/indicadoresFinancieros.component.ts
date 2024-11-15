import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-indicadores-financieros',
  templateUrl: 'indicadoresFinancieros.html'
})
export class IndicadoresFinancierosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;
  public ltipoReporte: SelectItem[] = [
    { label: '...', value: null },
    { label: 'Covertura prestacional',    value:  'PRESTACIONAL'},
    { label: 'Retornos de la inversión',  value:  'ROI'},
    { label: 'Ind. Gestión',              value:  'GESTION'},
    { label: 'Ind. Calidad Activos  IP',  value:  'AIP'},
    { label: 'Ind. Calidad Activos  INP', value:  'AINP'},
    { label: 'Ind. Morosidad',            value:  'MOROSIDAD'}
  ];
  
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', '', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.anio = this.anioactual;
  }
  //RNI 20240910
  ngAfterViewInit() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }
  
  //ngAfterViewInit() {}
  
  imprimir(resp: any){

    if ((this.mcampos.ffin == null) || (this.mcampos.ffin == undefined)) {
      this.mostrarMensajeError("DEBE INGRESAR UNA FECHA HASTA DONDE DECEA GENERAR EL REPORTE.");
      return;
    }
    if (this.mcampos.tipoReporte === null || this.mcampos.tipoReporte === undefined) {
      this.mostrarMensajeError("SELECCIONE EL TIPO DE REPORTE.");
      return;
    }

    if(new Date(this.mcampos.ffin).getTime() <= new Date("2017-12-31").getTime()){
      this.mostrarMensajeError("LA FECHA HASTA DEBE INCIAR A PARTIR DE 2018-01-01.");
      return;
    }

    let fechaFinalInt   = this.fechaToInteger(this.mcampos.ffin);
    
    this.jasper.parametros = {};
    this.jasper.parametros['@i_cpersona'] = this.dtoServicios.mradicacion["cpersona"];
    switch(this.mcampos.tipoReporte) {
      case "PRESTACIONAL":
        this.jasper.nombreArchivo = 'rptIndicadoresFinancierosPrestacional';          
        this.jasper.parametros['@i_fechafinal']     = fechaFinalInt;
        this.jasper.parametros['@i_tiporeporte']    = this.mcampos.tipoReporte;        
        this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptIndicadoresFinancierosPrestacional';
        break;
      case "ROI":
        this.jasper.nombreArchivo = 'rptIndicadoresFinancierosRoi';
        this.jasper.parametros['@i_fechafinal']     = fechaFinalInt;
        this.jasper.parametros['@i_tiporeporte']    = this.mcampos.tipoReporte;        
        this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptIndicadoresFinancierosRoi';

        break;
      case "GESTION":
        this.jasper.nombreArchivo = 'rptConIndGestion';
        this.jasper.parametros['@i_fcorte']         = this.mcampos.ffin;
        this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptConIndGestion';
        break;
      case "AIP":
        this.jasper.nombreArchivo = 'rptConIndCalidadActivosIP';
        this.jasper.parametros['@i_fcorte']         = this.mcampos.ffin;
        this.jasper.parametros['@i_privativas']     = true;
        this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptConIndCalidadActivosIP-INP';
        break;
      case "AINP":
        this.jasper.nombreArchivo = 'rptConIndCalidadActivosINP';
        this.jasper.parametros['@i_fcorte']         = this.mcampos.ffin;
        this.jasper.parametros['@i_privativas']     = false;
        this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptConIndCalidadActivosIP-INP';
        break;
      case "MOROSIDAD":
        this.jasper.nombreArchivo = 'rptConIndMorosidad';
        this.jasper.parametros['@i_fcorte']         = this.mcampos.ffin;
        this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptConIndMorosidad';
        break;
      default:
        return;
    }

    this.jasper.formatoexportar = resp;
    this.jasper.generaReporteCore();

  }

}