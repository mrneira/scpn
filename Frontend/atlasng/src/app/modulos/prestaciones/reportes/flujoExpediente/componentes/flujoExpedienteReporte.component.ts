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
  templateUrl: 'flujoExpedienteReporte.html'
})
export class FlujoExpedienteReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovPersonasComponent)
  public lovPersonas: LovPersonasComponent;

  public ltbaja: SelectItem[] = [{ label: '...', value: null }];
  public letapa: SelectItem[] = [{ label: '...', value: null }];
  public ltexpediente: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'REPORTEFLUJOEXPEDIENTE', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.camposfecha.fIniEntrada = new Date();
    this.mcampos.camposfecha.fFinEntrada = new Date();
    this.mcampos.camposfecha.fIniSalida = new Date();
    this.mcampos.camposfecha.fFinSalida = new Date();
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
    this.jasper.nombreArchivo = 'ReporteFlujoExpediente';
    if ((this.mcampos.fIniEntrada != null && this.mcampos.fFinEntrada == null) || (this.mcampos.fIniEntrada == null && this.mcampos.fFinEntrada != null) || (this.mcampos.fIniEntrada > this.mcampos.fFinEntrada) ||
      (this.mcampos.fIniSalida != null && this.mcampos.fFinSalida == null) || (this.mcampos.fIniSalida == null && this.mcampos.fFinSalida != null) || (this.mcampos.fIniSalida > this.mcampos.fFinSalida)) {
      this.mostrarMensajeError("EL CAMPO DE FECHAS SON INCORRECTAS.");

    }
    if (this.mcampos.etapa === undefined || this.mcampos.etapa === null) {
      this.mostrarMensajeError("SELECCIONAR UN DEPARTAMENTO.");
      return;
    }
    else {
      if (this.mcampos.fIniEntrada === undefined || this.mcampos.fIniEntrada === null) {
        this.mcampos.fIniEntrada = null
      }
      if (this.mcampos.fFinEntrada === undefined || this.mcampos.fFinEntrada === null) {
        this.mcampos.fFinEntrada = null
      }
      if (this.mcampos.fIniSalida === undefined || this.mcampos.fIniSalida === null) {
        this.mcampos.fIniSalida = null
      }
      if (this.mcampos.fFinSalida === undefined || this.mcampos.fFinSalida === null) {
        this.mcampos.fFinSalida = null
      }
      if (this.mcampos.tbaja === undefined || this.mcampos.tbaja === null) {
        this.mcampos.tbaja = -1
      }
      if (this.mcampos.texpediente === undefined || this.mcampos.texpediente === null) {
        this.mcampos.texpediente = ''
      }



      // Agregar parametros

      this.jasper.parametros['@i_fIniEntrada'] = this.mcampos.fIniEntrada;
      this.jasper.parametros['@i_fFinEntrada'] = this.mcampos.fFinEntrada;
      this.jasper.parametros['@i_fIniSalida'] = this.mcampos.fIniSalida;
      this.jasper.parametros['@i_fFinSalida'] = this.mcampos.fFinSalida;
      this.jasper.parametros['@i_Departamento'] = listaEstados;
      this.jasper.parametros['@i_tipoBaja'] = this.mcampos.tbaja;
      this.jasper.parametros['@i_tipoExpediente'] = this.mcampos.texpediente;
      this.jasper.parametros['@w_usuario'] = this.dtoServicios.mradicacion.np;
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestaciones/FlujoExpediente';
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
    const consultaExpediente = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstUsr, {});
    consultaExpediente.cantidad = 100;
    this.addConsultaCatalogos('EXPEDIENTE', consultaExpediente, this.ltexpediente, super.llenaListaCatalogo, 'cdetalle');

    const consultaBaja = new Consulta('tsoctipobaja', 'Y', 't.nombre', {}, {});
    consultaBaja.cantidad = 100;
    this.addConsultaCatalogos('BAJA', consultaBaja, this.ltbaja, super.llenaListaCatalogo, 'ctipobaja');

    this.ejecutarConsultaCatalogos();
  }
}
