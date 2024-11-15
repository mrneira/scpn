import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { BaseLovComponent } from '../../../../../util/shared/componentes/baseLov.component';


@Component({
  selector: 'app-lov-titulo',
  templateUrl: 'lov.titulo.html'
})
export class LovTituloComponent extends BaseLovComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  
  private catalogoDetalle: CatalogoDetalleComponent;
  @Output() eventoCliente = new EventEmitter();
  displayLov = false;
  public larea: SelectItem[] = [{ label: '...', value: null }];
  public lespecifico: SelectItem[] = [{ label: '...', value: null }];
  public ldetallado: SelectItem[] = [{ label: '...', value: null }];
  public lcarrera: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthtitulo', 'LOVTITULO', false, false);
  }
  consultarCatalogos(): void {


    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1132;
    const consArea = this.catalogoDetalle.crearDtoConsulta();
    consArea.cantidad = 100;
    this.addConsultaCatalogos('AREA', consArea, this.larea, super.llenaListaCatalogo, 'cdetalle');

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1133;
    const consEspecifico = this.catalogoDetalle.crearDtoConsulta();
    consEspecifico.cantidad = 100;
    this.addConsultaCatalogos('CESPECIFICO', consEspecifico, this.lespecifico, super.llenaListaCatalogo, 'cdetalle');

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1134;
    const consDetallado = this.catalogoDetalle.crearDtoConsulta();
    consDetallado.cantidad = 100;
    this.addConsultaCatalogos('CDETALLADO', consDetallado, this.ldetallado, super.llenaListaCatalogo, 'cdetalle');

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1135;
    const consCarrera = this.catalogoDetalle.crearDtoConsulta();
    consCarrera.cantidad = 100;
    this.addConsultaCatalogos('CCARRERA', consCarrera, this.lcarrera, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos()
  }
  ngOnInit() {
    this.formFiltrosBase = this.formFiltros;
    this.componentehijo = this;
    this.consultarCatalogos();
    // En los lov va 0 para no grabar log de transaccion.
    this.rqConsulta.grabarlog = '0';
  }
  consultar() {

    this.crearDtoConsulta();
    const consulta: Consulta = this.getConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    const consulta = new Consulta(this.entityBean, 'Y', 't.areacdetalle', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'narea', ' t.areaccatalogo=i.ccatalogo and t.areacdetalle=i.cdetalle');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nespecifico', ' t.especificoccatalogo=i.ccatalogo and t.especificocdetalle=i.cdetalle');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'ndetallado', ' t.detalladoccatalogo=i.ccatalogo and t.detalladocdetalle=i.cdetalle');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'ncarrera', ' t.carreraccatalogo=i.ccatalogo and t.carreracdetalle=i.cdetalle');

    consulta.setCantidad(15);
    this.addConsulta(consulta);
    return consulta;
  }

  public getConsulta(): Consulta {
    const consulta = super.getConsulta(this.alias);
    return consulta;
  }

  private fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  seleccionaRegistro(evento: any) {
    // para oculatar el dialogo.
    this.eventoCliente.emit({ registro: evento.data });
    
    this.displayLov = false;

  }

 showDialog() {
    this.displayLov = true;
  }
}
