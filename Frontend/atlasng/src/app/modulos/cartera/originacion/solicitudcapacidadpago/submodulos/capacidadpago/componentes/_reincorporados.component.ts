import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';

@Component({
  selector: 'app-reincorporados',
  template: ''
})
export class ReincorporadosComponent extends BaseComponent implements OnInit, AfterViewInit {

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarSolicitudReincorporado', 'SOLICITUDREINCORPORADO', true, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
  }

  actualizar() {
    super.actualizar();
  }

  // Inicia CONSULTA *********************
  consultar() {
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'N', 't.csolicitud', this.mfiltros, this.mfiltrosesp);
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any, dtoext = null) {
    super.postCommitEntityBean(resp, dtoext);
  }

}
