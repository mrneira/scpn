import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-reporte-consolidado-seguros',
  templateUrl: 'consolidadoSeguros.html'
})
export class ConsolidadoSegurosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public ltiposeguro: SelectItem[] = [{ label: '...', value: null }];
  public lestados: SelectItem[] = [{ label: 'NUEVO', value: 'NUEVO' },{label: 'RENOVACIÓN', value: 'RENOVACIÓN'},{ label: 'INCREMENTO', value: 'INCREMENTO' },{label: 'PAGO DIRECTO', value: 'PAGO DIRECTO'}];

  public estadoincremento: string;
  public estadorenovacion: string;
  public estadopago: string;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CONSOLIDADOSEGUROS', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  imprimir(): void {

    if(this.estaVacio(this.mcampos.estado) || this.mcampos.estado === 'NUEVO' )
    {
      this.estadorenovacion='NUEVO'
      this.estadoincremento=null
        this.estadopago=null
    }
    if(this.mcampos.estado === 'INCREMENTO'){    
      this.estadoincremento='INCREMENTO'
      this.estadorenovacion=null
        this.estadopago=null
    }
    if(this.mcampos.estado === "RENOVACIÓN")
      {
        this.estadoincremento = null
        this.estadorenovacion='RENOVACIÓN'
        this.estadopago=null
      }
    if(this.mcampos.estado === "PAGO DIRECTO")
      {
        this.estadoincremento = null
        this.estadorenovacion= null
        this.estadopago='SI'
      }
    
      if (this.estaVacio(this.mcampos.fpolinicio)) {
        this.mcampos.fpolinicio = null
      }
      if (this.estaVacio(this.mcampos.fpolfin)) {
        this.mcampos.fpolfin = null
      }
      if (this.estaVacio(this.mcampos.fveninicio)) {
        this.mcampos.fveninicio = null
      }
      if (this.estaVacio(this.mcampos.fvenfin)){
        this.mcampos.fvenfin = null
      }
      if (this.estaVacio(this.mcampos.frecepcioninicio)){
        this.mcampos.frecepcioninicio = null
      }
      if (this.estaVacio(this.mcampos.frecepcionfin)){
        this.mcampos.frecepcionfin = null
      }
      if (this.estaVacio(this.mcampos.ctiposeguro)){
        this.mcampos.ctiposeguro = null
      }

    this.jasper.nombreArchivo = 'ReporteConsolidadoSeguros-' + this.dtoServicios.mradicacion.fcontable;
    this.jasper.parametros['@i_ctiposeguro'] = this.mcampos.ctiposeguro;
    this.jasper.parametros['@i_fechainiciopoliza']	= this.mcampos.fpolinicio;
    this.jasper.parametros['@i_fechafinpoliza']	= this.mcampos.fpolfin;
    this.jasper.parametros['@i_fechainiciovencimiento']	= this.mcampos.fveninicio;
    this.jasper.parametros['@i_fechafinvencimiento']	= this.mcampos.fvenfin;
    this.jasper.parametros['@i_fechainiciorecepcion']	= this.mcampos.frecepcioninicio;
    this.jasper.parametros['@i_fechafinrecepcion']	= this.mcampos.frecepcionfin;
    this.jasper.parametros['@i_renovacion']	= this.estadorenovacion;
    this.jasper.parametros['@i_pagodirecto']	= this.estadopago;
    this.jasper.parametros['@i_incremento']	= this.estadoincremento;
    this.jasper.formatoexportar = 'xls';
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Seguros/rptSgsConsolidado';

    this.jasper.generaReporteCore();
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    const mfiltrosTipoSeguro: any = { verreg: 0 };
    const conTipoSeguro = new Consulta('TsgsTipoSeguroDetalle', 'Y', 't.nombre', mfiltrosTipoSeguro, {});
    conTipoSeguro.cantidad = 100;
    this.addConsultaCatalogos('TIPOSEGURO', conTipoSeguro, this.ltiposeguro, super.llenaListaCatalogo, 'ctiposeguro');

    this.ejecutarConsultaCatalogos();
  }

}

