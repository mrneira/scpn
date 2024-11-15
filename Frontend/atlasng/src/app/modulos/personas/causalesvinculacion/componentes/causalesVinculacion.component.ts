import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { TiposCausalesVinculacionComponent } from '../../tiposcausalesvinculacion/componentes/tiposCausalesVinculacion.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-causales-vinculacion',
  templateUrl: 'causalesVinculacion.html'
})
export class CausalesVinculacionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public ltiposcausales: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TperCausalVinculacion', 'CAUSAL', false, false);
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
    this.registro.ctipocausal = this.mfiltros.ctipocausal;
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
  
  cambiarTipoCausal(event: any): any {
    if (this.mfiltros.ctipocausal === undefined || this.mfiltros.ctipocausal === null) {
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

    const tipoCausales = new TiposCausalesVinculacionComponent(this.router, this.dtoServicios);
    const conSucursales = tipoCausales.crearDtoConsulta();
    this.addConsultaCatalogos(tipoCausales.alias, conSucursales, this.ltiposcausales, super.llenaListaCatalogo, 'ctipocausal');

    this.ejecutarConsultaCatalogos();
  }
  
}
