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
  templateUrl: 'anticiposCesantiaReporte.html'
})
export class AnticiposCesantiaReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovPersonasComponent)
  public lovPersonas: LovPersonasComponent;

  public lestadopolicias: SelectItem[] = [{ label: '...', value: null }];


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'ANTICIPOSCESANTIAREPORTE', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.camposfecha.FechaInicio = new Date();
    this.mcampos.camposfecha.FechaFin = new Date();

    this.consultarCatalogos();

  }

  ngAfterViewInit() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  imprimir(resp: any): void {

    let listaEstados: any = [];
    for (const i in this.mcampos.estadopolicia) {
      //if (lista.hasOwnProperty(i)) {
      const reg = this.mcampos.estadopolicia[i];
      //if (reg.mdatos.tipoplancdetalle === 'PC-FA'){
      listaEstados.push({ "estado": reg });
      //}
    }

    //this.jasper.nombreReporteJasper = 'lazos/facturacion/ventas.jasper';
    this.jasper.nombreArchivo = 'ReporteAnticiposCesantia';
    if ((this.mcampos.FechaInicio != null && this.mcampos.FechaFin == null) || (this.mcampos.FechaInicio == null && this.mcampos.FechaFin != null) || (this.mcampos.FechaInicio > this.mcampos.FechaFin)) {
      this.mostrarMensajeError("EL CAMPO DE FECHAS SON INCORRECTAS.");
      return;
    } else {


      if (this.mcampos.FechaInicio === undefined || this.mcampos.FechaInicio === null) {
        this.mcampos.FechaInicio = null
      }

      if (this.mcampos.FechaFin === undefined || this.mcampos.FechaFin === null) {
        this.mcampos.FechaFin = null
      }
      if (this.mcampos.estadopolicia === undefined || this.mcampos.estadopolicia === null) {
        this.mostrarMensajeError("SELECCIONAR UN ESTADO.");
        return;
      }

      // Agregar parametros
      this.jasper.parametros['@i_fIniExp'] = this.mcampos.FechaInicio;
      this.jasper.parametros['@i_fFinExp'] = this.mcampos.FechaFin;
      this.jasper.parametros['@i_estadoPolicia'] = listaEstados;
      this.jasper.parametros['@w_usuario'] = this.dtoServicios.mradicacion.np;
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestaciones/Pre_AnticiposCesantia';
      this.jasper.formatoexportar = resp;
      this.jasper.generaReporteCore();
    }
  }

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();
    const mfiltrosEstUsr1: any = { 'ccatalogo': 2703 };
    const consultaEstadoPolicia = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstUsr1, {});
    consultaEstadoPolicia.cantidad = 50;
    this.addConsultaCatalogos('ESTADOPOLICIA', consultaEstadoPolicia, this.lestadopolicias, super.llenaListaCatalogo, 'cdetalle', null, false);
    this.ejecutarConsultaCatalogos();
  }

}
