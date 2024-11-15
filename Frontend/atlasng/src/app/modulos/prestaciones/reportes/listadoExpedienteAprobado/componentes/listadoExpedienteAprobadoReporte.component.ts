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
  templateUrl: 'listadoExpedienteAprobadoReporte.html'
})
export class ListadoExpedienteAprobadoReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovPersonasComponent)
  public lovPersonas: LovPersonasComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'REPORTELISTADOEXPEDIENTEAPROBADODEPAGO', false);
    this.componentehijo = this;
  }

  public ltbaja: SelectItem[] = [{label: '...', value: null}];
  ngOnInit() {
    super.init();
    this.mcampos.camposfecha.fIniLiquidacion = new Date();
    this.mcampos.camposfecha.fFinLiquidacion = new Date();
  }

  ngAfterViewInit() {
  }
  llenarConsultaCatalogos(): void {
          const consultaBaja = new Consulta('tsoctipobaja','Y','t.nombre',{},{});
          consultaBaja.cantidad = 100;
          this.addConsultaPorAlias ('BAJA', consultaBaja);

        }
   validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }
  private manejaRespuestaCatalogos(resp: any) {
          const msgs = [];
          if (resp.cod === 'OK') {
            this.llenaListaCatalogo(this.ltbaja,resp.BAJA, 'ctipobaja');
          }
          this.lconsulta = [];
        }
  imprimir(resp:any): void {
    //this.jasper.nombreReporteJasper = 'lazos/facturacion/ventas.jasper';
    this.jasper.nombreArchivo = 'ReporteListadoExpedienteAprobadoDePago';
    if((this.mcampos.fIniLiquidacion != null && this.mcampos.fFinLiquidacion == null) || (this.mcampos.fIniLiquidacion == null && this.mcampos.fFinLiquidacion != null) || (this.mcampos.fIniLiquidacion > this.mcampos.fFinLiquidacion)){
      this.mostrarMensajeError("EL CAMPO DE FECHAS SON INCORRECTAS.");

  }else{
    if (this.mcampos.fIniLiquidacion === undefined || this.mcampos.fIniLiquidacion === null) {
      this.mcampos.fIniLiquidacion = null
    }
    if (this.mcampos.fFinLiquidacion === undefined || this.mcampos.fFinLiquidacion === null) {
      this.mcampos.fFinLiquidacion = null
    }

    // Agregar parametros

    this.jasper.parametros['@i_fIniLiquidacion'] = this.mcampos.fIniLiquidacion;
    this.jasper.parametros['@i_fFinLiquidacion'] = this.mcampos.fFinLiquidacion;
    this.jasper.parametros['@w_usuario'] = this.dtoServicios.mradicacion.np;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestaciones/ListadoExpedienteActivo';
this.jasper.formatoexportar=resp;
    this.jasper.generaReporteCore();
  }
  }

  /**Manejo respuesta de consulta de catalogos.*/
}
