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
  selector: 'app-periodo',
  templateUrl: 'periodo.html'
})
export class PeriodoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;


  public ltipo: SelectItem[] = [{ label: '...', value: null }];
  private catalogoDetalle: CatalogoDetalleComponent;


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthevaluacionperiodo', 'PERIODO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultar();  // para ejecutar consultas automaticas.
    this.mcampos.fechaactual = new Date();
    this.mcampos.fmin = new Date();
    this.mcampos.factiva = false;
    this.consultarCatalogos();
  }
  validarFecha() {
    if (!this.estaVacio(this.registro.fdesde)) {
      this.mcampos.fmin = new Date(this.registro.fdesde);
      this.mcampos.fmin.setDate(this.mcampos.fmin.getDate() + 1);
      this.mcampos.factiva = true;
    }
    this.registro.fhasta = null;
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    //this.registro.optlock = 0;
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

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cperiodo', this.mfiltros, this.mfiltrosesp);
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }
  consultarCatalogos(): void {
    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1136;
    const consArea = this.catalogoDetalle.crearDtoConsulta();
    consArea.cantidad = 100;
    this.addConsultaCatalogos('TIPO', consArea, this.ltipo, super.llenaListaCatalogo, 'cdetalle');
    this.ejecutarConsultaCatalogos()
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
