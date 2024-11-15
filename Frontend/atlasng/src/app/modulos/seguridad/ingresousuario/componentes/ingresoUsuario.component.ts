import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';

import { UsuarioDetalleComponent } from './_usuarioDetalle.component';
import { UsuarioRolComponent } from './_usuarioRol.component';
import { LovFuncionariosComponent } from '../../../talentohumano/lov/funcionarios/componentes/lov.funcionarios.component';

@Component({
  selector: 'app-ingreso-usuario',
  templateUrl: 'ingresoUsuario.html'
})
export class IngresoUsuarioComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(UsuarioDetalleComponent)
  usuarioDetalleComponent: UsuarioDetalleComponent;

  @ViewChild(UsuarioRolComponent)
  usuarioRolComponent: UsuarioRolComponent;

  @ViewChild(LovFuncionariosComponent)
  private lovFuncionarios: LovFuncionariosComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'INGRESOUSUARIO', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
    this.formvalidado = false;
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
    const consultaUsuarioDetalle = this.usuarioDetalleComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.usuarioDetalleComponent.alias, consultaUsuarioDetalle);
  }

  private fijarFiltrosConsulta() {
    this.usuarioDetalleComponent.fijarFiltrosConsulta();
    this.usuarioRolComponent.fijarFiltrosConsulta();
  }

  validaFiltrosConsulta(): boolean {
    return this.usuarioDetalleComponent.validaFiltrosRequeridos() && this.usuarioRolComponent.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.usuarioDetalleComponent.postQuery(resp);
    this.usuarioDetalleComponent.registro.cpersona = this.usuarioDetalleComponent.mfiltros.cpersona;

    if (!this.estaVacio(this.usuarioDetalleComponent.registro.cusuario)) {
      this.usuarioDetalleComponent.desabilita = true;
      this.usuarioRolComponent.desabilita = true;
    } else {
      this.usuarioDetalleComponent.desabilita = false;
      this.usuarioRolComponent.desabilita = false;
    }

    if (this.usuarioDetalleComponent.registro !== undefined && this.usuarioDetalleComponent.registro.cusuario !== undefined
      && this.usuarioDetalleComponent.registro.cusuario !== '') {
      // Solo consultar el rol cuando tiene CUSUARIO
      this.usuarioRolComponent.mfiltros.cusuario = this.usuarioDetalleComponent.registro.cusuario;
      this.usuarioRolComponent.consultar(this.usuarioDetalleComponent.registro.cusuario);
    } else {
      this.usuarioRolComponent.lregistros = [];
    }
  }

  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento

    super.addMantenimientoPorAlias(this.usuarioDetalleComponent.alias, this.usuarioDetalleComponent.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.usuarioRolComponent.alias, this.usuarioRolComponent.getMantenimiento(2));

    // para adicionar otros entity bean super.addMantenimientoPorAlias('alias',mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  validaGrabar() {
    if (this.estaVacio(this.usuarioDetalleComponent.registro.cpersona)) {
      this.mostrarMensajeError('PERSONA REQUERIDA');
      return false;
    }
    return this.usuarioDetalleComponent.validaGrabar() && this.usuarioRolComponent.validaGrabar();
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  public postCommit(resp: any) {
    this.usuarioDetalleComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.usuarioDetalleComponent.alias));
    this.usuarioRolComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.usuarioDetalleComponent.alias));
    if (this.grabo) {
      this.usuarioDetalleComponent.desabilita = true;
      this.usuarioRolComponent.desabilita = true;
    }
  }


  /**Muestra lov de funcionarios */
  mostrarLovFuncionario(): void {
    this.lovFuncionarios.showDialog();
  }

  /**Retorno de lov de funcionarios. */
  fijarLovFuncionario(reg: any): void {
    if (!this.estaVacio(reg.registro)) {
      this.mcampos.cfuncionario = reg.registro.cfuncionario;
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.npersona = reg.registro.mdatos.nombre;
      this.usuarioDetalleComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.usuarioRolComponent.mfiltros.cusuario = reg.registro.cusuariomod;

      this.consultar();
    }
  }

}
