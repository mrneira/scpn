import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';

import { LovSolicitudesComponent } from './../../../lov/solicitudes/componentes/lov.solicitudes.component';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';
import { LovRequisitosComponent } from './../../../lov/requisitos/componentes/lov.requisitos.component';

@Component({
  selector: 'app-solicitud-requisitos',
  templateUrl: 'solicitudrequisitos.html'
})
export class SolicitudRequisitosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  @ViewChild(LovSolicitudesComponent)
  private lovSolicitudes: LovSolicitudesComponent;

  @ViewChild(LovRequisitosComponent)
  private lovRequisitos: LovRequisitosComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarSolicitudRequisitos', 'SOLICITUDREQUISITOS', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.csolicitud = this.mcampos.csolicitud;
    this.registro.opcional = false;
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
    this.mfiltros.csolicitud = this.mcampos.csolicitud;
    const consulta = new Consulta(this.entityBean, 'Y', 't.crequisito', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TcarRequisitos', 'nombre', 'nnombre', 'i.crequisito = t.crequisito');
    consulta.cantidad = 50;
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

  /**Muestra lov de personas */
  mostrarLovPersona(): void {
    this.lovPersonas.showDialog();
    this.lovPersonas.mfiltros.csocio = 1;
  }

  /**Muestra lov de Solicitudes */
  mostrarLovSolicitud(): void {
    if (this.mcampos.cpersona === undefined) {
      this.mostrarMensajeInfo('SELECCIONE CLIENTE');
      return;
    }
    this.lovSolicitudes.rqConsulta.mdatos.cestatussolicitud = 'ING';
    this.lovSolicitudes.rqConsulta.mdatos.cpersona = this.registro.cpersona;
    this.lovSolicitudes.showDialog();
    this.lovSolicitudes.consultar();
  }

  /**Muestra lov de requisitos */
  mostrarlovrequisitos(): void {
    this.lovRequisitos.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cpersona = reg.registro.cpersona;
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.nombre = reg.registro.nombre;
      this.mcampos.csolicitud = null;
      this.mostrarLovSolicitud()
    }
  }

  /**Retorno de lov de solicitudes. */
  fijarLovSolicitudSelec(reg: any): void {
    this.msgs = [];
    this.mcampos.csolicitud = reg.registro.mdatos.csolicitud;
    // this.csolicitud = reg.registro.mdatos.csolicitud;
    //this.consultar();
  }

  /**Retorno de lov de requisitos. */
  fijarLovRequisitosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.nnombre = reg.registro.nombre;
      this.registro.crequisito = reg.registro.crequisito;
    }
  }

}
