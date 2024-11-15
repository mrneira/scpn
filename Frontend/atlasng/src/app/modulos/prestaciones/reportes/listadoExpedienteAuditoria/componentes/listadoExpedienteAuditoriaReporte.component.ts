import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import {JasperComponent} from '../../../../../util/componentes/jasper/componentes/jasper.component';
import {LovPersonasComponent} from '../../../../personas/lov/personas/componentes/lov.personas.component'

@Component({
  selector: 'app-usuario-reporte',
  templateUrl: 'listadoExpedienteAuditoriaReporte.html'
})
export class ListadoExpedienteAuditoriaReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovPersonasComponent)
  public lovPersonas: LovPersonasComponent;

  public ltbaja: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'REPORTELISTADOEXPEDIENTEAUDITORIA', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.camposfecha.fIniLiquidacion = new Date();
    this.mcampos.camposfecha.fFinLiquidacion = new Date();
    this.mcampos.camposfecha.fIniBaja = new Date();
    this.mcampos.camposfecha.fFinBaja = new Date();
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

   validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  imprimir(resp: any): void {
    //this.jasper.nombreReporteJasper = 'lazos/facturacion/ventas.jasper';
    this.jasper.nombreArchivo = 'ReporteListadoExpedienteAuditoria';
    if((this.mcampos.fIniLiquidacion != null && this.mcampos.fFinLiquidacion == null) || (this.mcampos.fIniLiquidacion == null && this.mcampos.fFinLiquidacion != null) || (this.mcampos.fIniLiquidacion > this.mcampos.fFinLiquidacion) ||
    (this.mcampos.fIniBaja != null && this.mcampos.fFinBaja == null) || (this.mcampos.fIniBaja == null && this.mcampos.fFinBaja != null) || (this.mcampos.fIniBaja > this.mcampos.fFinBaja)){
      this.mostrarMensajeError("EL CAMPO DE FECHAS SON INCORRECTAS.");

  }else{
    if (this.mcampos.fIniLiquidacion === undefined || this.mcampos.fIniLiquidacion === null) {
      this.mcampos.fIniLiquidacion = null
    }
    if (this.mcampos.fFinLiquidacion === undefined || this.mcampos.fFinLiquidacion === null) {
      this.mcampos.fFinLiquidacion = null
    }
    if (this.mcampos.fIniBaja === undefined || this.mcampos.fIniBaja === null) {
      this.mcampos.fIniBaja = null
    }
    if (this.mcampos.fFinBaja === undefined || this.mcampos.fFinBaja === null) {
      this.mcampos.fFinBaja = null
    }
        if (this.mcampos.tbaja === undefined || this.mcampos.tbaja === null) {
      this.mcampos.tbaja = -1
    }


    // Agregar parametros

    this.jasper.parametros['@i_fIniLiquidacion'] = this.mcampos.fIniLiquidacion;
    this.jasper.parametros['@i_fFinLiquidacion'] = this.mcampos.fFinLiquidacion;
    this.jasper.parametros['@i_fIniBaja'] = this.mcampos.fIniBaja;
    this.jasper.parametros['@i_fFinBaja'] = this.mcampos.fFinBaja;
    this.jasper.parametros['@i_tipoBaja'] = this.mcampos.tbaja;
    this.jasper.parametros['@w_usuario'] = this.dtoServicios.mradicacion.np;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestaciones/ListadoExpedienteAuditoria';
this.jasper.formatoexportar=resp;
    this.jasper.generaReporteCore();
  }
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

    const consultaBaja = new Consulta('tsoctipobaja','Y','t.nombre',{},{});
    consultaBaja.cantidad = 100;
    this.addConsultaPorAlias ('BAJA', consultaBaja);


  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.ltbaja,resp.BAJA, 'ctipobaja');
    }
    this.lconsulta = [];
  }
}
