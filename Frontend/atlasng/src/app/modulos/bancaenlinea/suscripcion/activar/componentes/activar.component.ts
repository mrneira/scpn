import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovUsuariosComponent } from '../../../lov/usuarios/componentes/lov.usuarios.component';

@Component({
  selector: 'app-activar',
  templateUrl: 'activar.html'
})
export class ActivarComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovUsuariosComponent)
  private lovUsuarios: LovUsuariosComponent;

  private estatuscusuariocdetalleanterior;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TbanSuscripcion', 'TBANSUSCRIPCION', true);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
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

  habilitarEdicion() {
    if (this.estaVacio(this.mcampos.cpersona)) {
      this.mostrarMensajeError('USUARIO REQUERIDO');
      return;
    }
    super.habilitarEdicion();
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'N', 't.cusuario', this.mfiltros, this.mfiltrosesp);
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    this.validaUsuarioRequerido();
    this.registro.observacion = '';
    this.estatuscusuariocdetalleanterior = this.registro.estatuscusuariocdetalle;
    this.mcampos.fingreso = new Date(this.registro.fingreso);
  }

  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    if (!this.validaUsuarioRequerido()) {
      return;
    }
    if (this.registro.estatuscusuariocdetalle === 'ACT') {
      this.mostrarMensajeError('LA SUSCRIPCIÓN YA SE ENCUENTRA ACTIVA');
      return;
    }
    if (this.registro.estatuscusuariocdetalle !== 'INA') {
      this.mostrarMensajeError('LA SUSCRIPCIÓN DEBE ESTAR INACTIVA');
      return;
    }
    if (this.estaVacio(this.registro.observacion)) {
      this.mostrarMensajeError('OBSERVACION REQUERIDA');
      return;
    }
    this.registro.estatuscusuariocdetalle = 'ACT';
    this.actualizar();

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
    if (resp.cod !== 'OK') {
      this.registro.estatuscusuariocdetalle = this.estatuscusuariocdetalleanterior;
    }
  }

  validaGrabar() {
    if (!super.validaGrabar()) {
      this.registro.estatuscusuariocdetalle = this.estatuscusuariocdetalleanterior;
    }
    return super.validaGrabar();
  }

  validaUsuarioRequerido(): boolean {
    if (this.registro.cusuario === undefined) {
      this.mostrarMensajeError('USUARIO NO ASIGNADO');
      return false;
    }
    return true;
  }

  /**Muestra lov de personas */
  mostrarLovUsuarios(): void {
    this.lovUsuarios.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovUsuariosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cpersona = reg.registro.mdatos.cpersona;
      this.mcampos.npersona = reg.registro.mdatos.npersona;
      this.mfiltros.identificacion = reg.registro.mdatos.identificacion;
      this.consultar();
    }
  }
}
