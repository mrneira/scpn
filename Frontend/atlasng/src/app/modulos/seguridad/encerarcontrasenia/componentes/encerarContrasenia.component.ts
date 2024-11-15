import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovUsuariosComponent } from '../../lov/usuarios/componentes/lov.usuarios.component';

@Component({
  selector: 'app-encerar-contrasenia',
  templateUrl: 'encerarContrasenia.html'
})
export class EncerarContraseniaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovUsuariosComponent)
  private lovUsuarios: LovUsuariosComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TsegUsuarioDetalle', 'USUARIODETALLE', true);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
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
    const consulta = new Consulta(this.entityBean, 'N', 't.cusuario', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenIdioma', 'nombre', 'nidioma', 'i.cidioma = t.cidioma');
    consulta.addSubquery('TgenCanales', 'nombre', 'ncanal', 'i.ccanal = t.ccanal');
    consulta.addSubquery('TgenArea', 'nombre', 'narea', 'i.carea = t.carea');
    consulta.addSubquery('TgenSucursal', 'nombre', 'nsucursal', 'i.csucursal = t.csucursal');
    consulta.addSubquery('TgenAgencia', 'nombre', 'nagencia', 'i.csucursal = t.csucursal and i.cagencia = t.cagencia');
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.mfiltros.verreg = 0;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    this.validaUsuarioRequerido();
  }
  // Fin CONSULTA *********************



  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    if (!this.validaUsuarioRequerido()) {
      return;
    }

    if (this.estaVacio(this.mcampos.nuevacon)) {
      this.mostrarMensajeError('PASSWORD TEMPORAL REQUERIDO');
      return;
    }

    if (this.estaVacio(this.mcampos.confirmarcon)) {
      this.mostrarMensajeError('CONFIRMAR PASSWORD TEMPORAL REQUERIDO');
      return;
    }

    if (this.mcampos.confirmarcon !== this.mcampos.nuevacon) {
      this.mostrarMensajeError('PASSWORD TEMPORAL NO SON IGUALES');
      return;
    }

    const newPass = this.mcampos.confirmarcon;
    this.rqMantenimiento.mdatos.bas64 = newPass;

    this.registro.password = newPass;
    this.registro.cambiopassword = '1';
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
  }

  validaUsuarioRequerido(): boolean {
    if (this.registro.cusuario === undefined) {
      this.mostrarMensajeError('USUARIO NO ASIGNADO');
      return false;
    }
    return true;
  }

  /**Muestra lov de usuarios */
  mostrarLovUsuarios(): void {
    this.lovUsuarios.mfiltros.estatuscusuariocdetalle = 'ACT';
    this.lovUsuarios.showDialog();
  }

  /**Retorno de lov de usuarios. */
  fijarLovUsuariosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cpersona = reg.registro.mdatos.cpersona;
      this.mcampos.npersona = reg.registro.mdatos.npersona;
      this.mfiltros.cpersona = reg.registro.mdatos.cpersona;
      this.registro.cusuario = reg.registro.mdatos.cpersona;
      this.mcampos.nuevacon = '';
      this.mcampos.confirmarcon = '';
      this.consultar();
    }
  }

}
