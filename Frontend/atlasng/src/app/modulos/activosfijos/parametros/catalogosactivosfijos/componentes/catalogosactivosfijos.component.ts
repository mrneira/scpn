import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';

import { CatalogoPadreComponent } from './../submodulos/_catalogoPadre.component';
import { CatalogoDetalleComponent } from './../submodulos/_catalogoDetalle.component';
import { LovCatalogosComponent } from '../../../../generales/lov/catalogos/componentes/lov.catalogos.component';

@Component({
  selector: 'app-catalogos',
  templateUrl: 'catalogosactivosfijos.html'
})
export class CatalogosActivosfijosComponent extends BaseComponent implements OnInit, AfterViewInit {

  public rangomenor: any = 1300;
  public rangomayor: any = 1399;

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(CatalogoPadreComponent)
  catalogoPadreComponent: CatalogoPadreComponent;

  @ViewChild(CatalogoDetalleComponent)
  catalogoDetalleComponent: CatalogoDetalleComponent;

  @ViewChild(LovCatalogosComponent)
  private lovCatalogos: LovCatalogosComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'MANTUSUARIO', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  selectRegistro(registro: any) {
    // No existe para el padre
  }

  crearNuevo() {
    // No existe para el padre
  }

  actualizar() {
    // No existe para el padre
  }

  eliminar() {
    // No existe para el padre
  }

  cancelar() {
   // No existe para el padre
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    // Consulta datos.
    const conCatalogoPadre = this.catalogoPadreComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.catalogoPadreComponent.alias, conCatalogoPadre);

    const conCatalogoDetalle = this.catalogoDetalleComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.catalogoDetalleComponent.alias, conCatalogoDetalle);
  }

  private fijarFiltrosConsulta() {
    this.catalogoPadreComponent.fijarFiltrosConsulta();
    this.catalogoDetalleComponent.fijarFiltrosConsulta();
  }

  validaFiltrosConsulta(): boolean {
    return this.catalogoPadreComponent.validaFiltrosRequeridos() && this.catalogoDetalleComponent.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.catalogoPadreComponent.postQueryEntityBean(resp);
    this.catalogoDetalleComponent.postQueryEntityBean(resp);
  }

  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    if(this.catalogoPadreComponent.validarCatalogoPadre()){

      this.lmantenimiento = []; // Encerar Mantenimiento
      super.addMantenimientoPorAlias(this.catalogoPadreComponent.alias, this.catalogoPadreComponent.getMantenimiento(1));
      super.addMantenimientoPorAlias(this.catalogoDetalleComponent.alias, this.catalogoDetalleComponent.getMantenimiento(2));
      // para adicionar otros entity bean super.addMantenimientoPorAlias('alias',mantenimiento);  pude ser de otros componentes
      super.grabar();

    }
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  public postCommit(resp: any) {
    this.catalogoPadreComponent.postCommitEntityBean(resp);
    this.catalogoDetalleComponent.postCommitEntityBean(resp);
  }

  /**Muestra lov de catalogos */
  mostrarLovCatalogos(): void {
    this.lovCatalogos.showDialog();
  }

  /**Retorno de lov de catalogos. */
  fijarLovCatalogosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.ccatalogo = reg.registro.ccatalogo;
      this.mcampos.ncatalogo = reg.registro.nombre;
      this.catalogoPadreComponent.mfiltros.ccatalogo = reg.registro.ccatalogo;
      this.catalogoDetalleComponent.mfiltros.ccatalogo = reg.registro.ccatalogo;

      this.consultar();
    }
  }

  validaGrabar(){
   return this.catalogoPadreComponent.validaGrabar();
  }

}
