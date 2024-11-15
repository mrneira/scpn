import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovUsuariosComponent } from "../../../../bancaenlinea/lov/usuarios/componentes/lov.usuarios.component";
import { LovSuscripcionMovilComponent } from "../../../lov/suscripcion/componentes/lov.suscripcionMovil.component";
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-inactivar',
  templateUrl: 'inactivar.html'
})
export class InactivarComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovUsuariosComponent)
  private lovUsuarios: LovUsuariosComponent;
  
  @ViewChild(LovSuscripcionMovilComponent)
  private lovSusMovil: LovSuscripcionMovilComponent;

  private estatuscusuariocdetalleanterior;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TbanSuscripcionMovil', 'TBANSUSCRIPCIONMOVIL', true);
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
    consulta.addSubquery('TgencatalogoDetalle', 'nombre', 'nestado', 'i.ccatalogo=estatuscusuarioccatalogo and i.cdetalle=estatuscusuariocdetalle');
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
    if (this.registro.estatuscusuariocdetalle === 'INA') {
      this.mostrarMensajeError('EL USUARIO YA SE ENCUENTRA INACTIVO');
      return;
    }
    if (this.estaVacio(this.registro.observacion)) {
      this.mostrarMensajeError('OBSERVACION REQUERIDA');
      return;
    }
    this.registro.estatuscusuariocdetalle = 'INA';
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
    if (this.estaVacio(this.registro.cusuario)) {
      this.mostrarMensajeError('USUARIO NO REGISTRADO EN BANCA MOVIL');
      this.editable = false;
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
      this.mfiltros.cusuario = reg.registro.mdatos.cusuario;
      this.mostrarLovSusMovil();
    }
  }
  
  /**Muestra lov de personas */
  mostrarLovSusMovil(): void {
    this.lovSusMovil.mfiltros.cusuario = this.mfiltros.cusuario;
    this.lovSusMovil.mfiltros.estatuscusuariocdetalle = 'ACT';
    this.lovSusMovil.consultar();
    this.lovSusMovil.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovSusMovilSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.secuencia = reg.registro.secuencia;
      this.consultar();
    }
  }
}
