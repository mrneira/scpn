import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component'

@Component({
  selector: 'app-usuario-reporte',
  templateUrl: 'listadoExpedienteReporte.html'
})
export class ListadoExpedienteReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovPersonasComponent)
  public lovPersonas: LovPersonasComponent;

  public ltbaja: SelectItem[] = [{ label: '...', value: null }];
  public letapa: SelectItem[] = [{ label: '...', value: null }];
  public ltexpediente: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'REPORTELISTADOEXPEDIENTE', false);
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

    let listaEstados: any = [];
    for (const i in this.mcampos.etapa) {
      //if (lista.hasOwnProperty(i)) {
      const reg = this.mcampos.etapa[i];
      //if (reg.mdatos.tipoplancdetalle === 'PC-FA'){
      listaEstados.push({ "cetapaactual": reg });
      //}
    }

    //this.jasper.nombreReporteJasper = 'lazos/facturacion/ventas.jasper';
    this.jasper.nombreArchivo = 'ReporteListadoExpediente';
    if ((this.mcampos.fIniLiquidacion != null && this.mcampos.fFinLiquidacion == null) || (this.mcampos.fIniLiquidacion == null && this.mcampos.fFinLiquidacion != null) || (this.mcampos.fIniLiquidacion > this.mcampos.fFinLiquidacion) ||
      (this.mcampos.fIniBaja != null && this.mcampos.fFinBaja == null) || (this.mcampos.fIniBaja == null && this.mcampos.fFinBaja != null) || (this.mcampos.fIniBaja > this.mcampos.fFinBaja)) {
      this.mostrarMensajeError("EL CAMPO DE FECHAS SON INCORRECTAS.");

    }
    if (this.mcampos.etapa === undefined || this.mcampos.etapa === null) {
      this.mostrarMensajeError("SELECCIONAR UN DEPARTAMENTO.");
      return;
    }
    else {
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
      if (this.mcampos.texpediente === undefined || this.mcampos.texpediente === null) {
        this.mcampos.texpediente = ''
      }



      // Agregar parametros

      this.jasper.parametros['@i_fIniLiquidacion'] = this.mcampos.fIniLiquidacion;
      this.jasper.parametros['@i_fFinLiquidacion'] = this.mcampos.fFinLiquidacion;
      this.jasper.parametros['@i_fIniBaja'] = this.mcampos.fIniBaja;
      this.jasper.parametros['@i_fFinBaja'] = this.mcampos.fFinBaja;
      this.jasper.parametros['@i_Departamento'] = listaEstados;
      this.jasper.parametros['@i_tipoBaja'] = this.mcampos.tbaja;
      this.jasper.parametros['@i_tipoExpediente'] = this.mcampos.texpediente;
      this.jasper.parametros['@w_usuario'] = this.dtoServicios.mradicacion.np;
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestaciones/ListadoExpediente';
      this.jasper.formatoexportar = resp;
      this.jasper.generaReporteCore();
    }
  }


  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();
    const mfiltrosEtapa: any = { 'ccatalogo': 2806 };
    const consultaEtapa = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEtapa, {});
    consultaEtapa.cantidad = 100;
    this.addConsultaCatalogos('ETAPA', consultaEtapa, this.letapa, super.llenaListaCatalogo, 'cdetalle', null, false);

    const mfiltrosEstUsr: any = { 'ccatalogo': 2802 };
    //   const mfiltrosEspecial: any ={'cdetalle': `!= 'ANT' `}
    const mfiltrosEspecial: any = { }
    const consultaExpediente = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstUsr, mfiltrosEspecial);
    consultaExpediente.cantidad = 100;
    this.addConsultaCatalogos('EXPEDIENTE', consultaExpediente, this.ltexpediente, super.llenaListaCatalogo, 'cdetalle');

    const consultaBaja = new Consulta('tsoctipobaja', 'Y', 't.nombre', {}, {});
    consultaBaja.cantidad = 100;
    this.addConsultaCatalogos('BAJA', consultaBaja, this.ltbaja, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }
}
