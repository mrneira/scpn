import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../generales/catalogos/componentes/_catalogoDetalle.component';

@Component({
  selector: 'app-activ-economicas',
  templateUrl: 'actividadesEconomicas.html'
})
export class ActividadesEconomicasComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  private catalogoDetalle: CatalogoDetalleComponent;

  public ltipoactividad: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TperActividadEconomica', 'ACTECONOM', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (!this.validaFiltrosConsulta()) {
      return;
    }
    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.tipoactividad = this.mfiltros.tipoactividad;
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.nombre', this.mfiltros, this.mfiltrosesp);
    consulta.cantidad = 25;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  
  cambiarTipoActividad(event: any): any {
    if (this.mfiltros.tipoactividad === undefined || this.mfiltros.tipoactividad === null) {
      return;
    };
    this.consultar();
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

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);

    this.catalogoDetalle.mfiltros.ccatalogo = 15;
    const conTipActividad = this.catalogoDetalle.crearDtoConsulta();
    this.addConsultaCatalogos('TIPACTIV', conTipActividad, this.ltipoactividad, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }

}
