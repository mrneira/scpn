import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { JasperComponent } from '../../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-operaciones',
  templateUrl: 'operaciones.html'
})
export class OperacionesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public lmesesini: SelectItem[] = [{label: '...', value: null}];
  public lregistrosdatos:any;
  public lparametro:any=[];
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'OPERACIONES', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.fijarListaMeses();
    this.consularCatalogos();
    this.mfiltros.fperiodo = this.anioactual;
    
  }

  fijarListaMeses() {
    this.lmesesini.push({ label: "ENERO", value: 1 });
    this.lmesesini.push({ label: "FEBRERO", value: 2 });
    this.lmesesini.push({ label: "MARZO", value: 3 });
    this.lmesesini.push({ label: "ABRIL", value: 4 });
    this.lmesesini.push({ label: "MAYO", value: 5 });
    this.lmesesini.push({ label: "JUNIO", value: 6 });
    this.lmesesini.push({ label: "JULIO", value: 7 });
    this.lmesesini.push({ label: "AGOSTO", value: 8 });
    this.lmesesini.push({ label: "SEPTIEMBRE", value: 9 });
    this.lmesesini.push({ label: "OCTUBRE", value: 10 });
    this.lmesesini.push({ label: "NOVIEMBRE", value: 11 });
    this.lmesesini.push({ label: "DICIEMBRE", value: 12 });
  }
  ngAfterViewInit() {
  }

  consultar() {
    if (this.mfiltros.fperiodo === undefined || this.mfiltros.fperiodo === null) {
      this.mostrarMensajeError("INGRESE PERIODO");
      return;
    }
    if (this.mfiltros.finicio === undefined || this.mfiltros.finicio === null) {
      this.mostrarMensajeError("INGRESE MES");
      return;
    }

  }
  public crearDtoConsulta() {
    const consulta = new Consulta(this.entityBean, 'Y', 't.codigo', {codigo:'REP.PROV'},{});    
    this.addConsulta(consulta);
    return consulta;
  } 
  
consularCatalogos(){
  this.encerarConsultaCatalogos();
  const mfiltrosparam = { 'codigo': 'REP.PROV' };
    const consultarParametro = new Consulta('todcparametros', 'Y', 't.codigo', mfiltrosparam, null);
    consultarParametro.cantidad = 100;
    this.addConsultaCatalogos('TABL', consultarParametro, this.lparametro, super.llenaListaCatalogo, 'texto');
this.ejecutarConsultaCatalogos();
}
public postQuery(resp: any) {
  super.postQueryEntityBean(resp);   
 
}
  public generarReporte() {
    this.rqConsulta.CODIGOCONSULTA = 'OC_OPERACIONESCARTERA';
    this.rqConsulta.storeprocedure = "sp_OdcRptOperacionesCartera";
    this.rqConsulta.parametro_fperiodo= this.mfiltros.fperiodo
    this.rqConsulta.parametro_finicio= this.mfiltros.finicio 
    this.dtoServicios.ejecutarConsultaRest(this.rqConsulta)
      .subscribe(
      resp => {
        this.dtoServicios.llenarMensaje(resp, false);
        if (resp.cod !== 'OK') {
          return;
        }
        this.lregistrosdatos = resp.OC_OPERACIONESCARTERA;
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  imprimir(resp: any): void {     
    if (this.mfiltros.fperiodo === undefined || this.mfiltros.fperiodo === null) {
      this.mostrarMensajeError("INGRESE PERIODO");
      return;
    }
    if (this.mfiltros.finicio === undefined || this.mfiltros.finicio === null) {
      this.mostrarMensajeError("INGRESE MES");
      return;
    }
    var Fecha = new Date();
    var mes = Fecha.getMonth() + 1;
    var dia = Fecha.getDate();
    var respmes = '';
    var respdia = '';
    if (mes < 10) {
      respmes = '0'
    }
    if (dia < 10) {
      respdia = '0'
    }
      var codigo =this.lparametro[1].value;
      var nombre = codigo + dia + respdia + respmes + mes + Fecha.getFullYear().toString();
      this.jasper.nombreArchivo = nombre;
      this.jasper.formatoexportar = ('xls');
      this.jasper.parametros['@i_periodo'] = this.mfiltros.fperiodo;
      this.jasper.parametros['@i_mes'] = this.mfiltros.finicio;
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/OrganismosdeControl/rptOdcReporteProvisional';
      this.jasper.generaReporteCore();
    } 

}