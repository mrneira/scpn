import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-reporte-rendimientorentavariable',
  templateUrl: 'rendimientorentavariable.html'
})
export class RendimientorentavariableComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public lestadocdetalle: SelectItem[] = [{ label: '...', value: null }];
  public lemisor: SelectItem[] = [{ label: '...', value: null }];


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'INVERSIONESXESTADO', false);
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
    if (this.mcampos.estadocdetalle === null || this.mcampos.estadocdetalle === undefined) {
      this.mostrarMensajeError("SELECCIONE EL SECTOR O VARIOS SECTORES.");
      return;
    }

    if (this.estaVacio(this.mcampos.emisorcdetalle)) {
      this.mcampos.emisorcdetalle = "V";
    }
    let listaEstados: any = [];
    for (const i in this.mcampos.estadocdetalle) {
      //if (lista.hasOwnProperty(i)) {
      const reg = this.mcampos.estadocdetalle[i];
      //if (reg.mdatos.tipoplancdetalle === 'PC-FA'){
      listaEstados.push({ "estadocdetalle": reg });
      //}
    }






    this.jasper.nombreArchivo = 'RendimientoRentaVariable';
    this.jasper.parametros['@i_emisor'] = this.mcampos.emisorcdetalle;
    this.jasper.parametros['@i_sector'] = listaEstados;
    this.jasper.parametros['@i_finicio'] = this.fechaToInteger(this.mcampos.finicio);
    this.jasper.parametros['@i_fcierre'] = this.fechaToInteger(this.mcampos.ffin);
    this.jasper.formatoexportar = 'xls';
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvRendimientoRentaVariable';

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

