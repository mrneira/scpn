import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';


@Component({
  selector: 'app-titulo',
  templateUrl: 'titulo.html'
})
export class TituloComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public larea: SelectItem[] = [{ label: '...', value: null }];
  public lespecifico: SelectItem[] = [{ label: '...', value: null }];
  public ldetallado: SelectItem[] = [{ label: '...', value: null }];
  public lcarrera: SelectItem[] = [{ label: '...', value: null }];

  private catalogoDetalle: CatalogoDetalleComponent;
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthtitulo', 'TITULO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    
    this.consultarCatalogos();
    this.consultar();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.areaccatalogo=1132;
    this.registro.especificoccatalogo=1133;
    this.registro.detalladoccatalogo=1134;
    this.registro.carreraccatalogo=1135;
  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
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
  public crearDtoConsulta(): Consulta {

    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.ctitulo', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'narea', ' t.areaccatalogo=i.ccatalogo and t.areacdetalle=i.cdetalle');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nespecifico', ' t.especificoccatalogo=i.ccatalogo and t.especificocdetalle=i.cdetalle');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'ndetallado', ' t.detalladoccatalogo=i.ccatalogo and t.detalladocdetalle=i.cdetalle');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'ncarrera', ' t.carreraccatalogo=i.ccatalogo and t.carreracdetalle=i.cdetalle');


    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }
}
