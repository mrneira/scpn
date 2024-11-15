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
  selector: 'app-comp-negocio',
  templateUrl: 'componentesNegocio.html'
})
export class ComponentesNegocioComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  private catalogoDetalle: CatalogoDetalleComponent;

  public lcatalogos: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TgenComponente', 'COMPONENTE', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);

    this.mfiltros.ccatalogo = 2;

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.consultarCatalogoDetalle(this.lcatalogos, this.mfiltros.ccatalogo, true);
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if(!this.validaFiltrosConsulta()) {
      return;
    }
    super.crearNuevo();
    this.registro.ccatalogo = this.mfiltros.ccatalogo;
    this.registro.cdetalle = this.mfiltros.cdetalle;
    this.registro.optlock = 0;
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
    consulta.cantidad = 50;
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'ndetalle', 'i.ccatalogo=t.ccatalogo and i.cdetalle = t.cdetalle');
    
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    if(this.estaVacio(this.mfiltros.cdetalle)){
      this.mostrarMensajeError('TIPO DE COMPONENTE REQUERIDO');
      return false;
    }
    return super.validaFiltrosConsulta();
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
