import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from './../../../../util/servicios/dto.servicios';
import { Consulta } from './../../../../util/dto/dto.component';
import { BaseComponent } from './../../../../util/shared/componentes/base.component';
import { LovUsuariosCanalesComponent } from './../../../canalesdigitales/lov/usuarios/componentes/lov.usuarios.component';

@Component({
  selector: 'app-inactivacion-canal-digital',
  templateUrl: 'inactivacion.html'
})
export class InactivacionCanalDigitalComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovUsuariosCanalesComponent)
  private lovUsuarios: LovUsuariosCanalesComponent;

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
    // this.validaUsuarioRequerido();
    this.registro.observacion = '';
    this.estatuscusuariocdetalleanterior = this.registro.estatuscusuariocdetalle;
    this.mcampos.fingreso = new Date(this.registro.fingreso);
  }

  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {    
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
    return super.validaGrabar();
  }

  /**Muestra lov de personas */
  mostrarLovUsuarios(): void {
    this.lovUsuarios.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovUsuariosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos = reg.registro.mdatos;
    }
  }

  /**Retorno de lov de personas. */
  fijarLovSusMovilSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.secuencia = reg.registro.secuencia;
      this.consultar();
    }
  }

  bloquear(): void{
    this.rqMantenimiento.cpersona = this.mcampos.cpersona;
    this.rqMantenimiento.credencial = this.mcampos.credencial;
    this.rqMantenimiento.estado = 'BLO';
    const rqMan = this.getRequestMantenimiento();
    this.dtoServicios.ejecutarRestMantenimiento(rqMan).subscribe(
      resp => {
        if (resp.cod !== 'OK') {
          return;
        }
        
        this.mcampos = resp.mdatos;
        super.mostrarMensajeSuccess("USUARIO BLOQUEADO");
      },
      error => {
        this.dtoServicios.manejoError(error);
      }
    );
  }

  desbloquear(): void{
    this.rqMantenimiento.cpersona = this.mcampos.cpersona;
    this.rqMantenimiento.credencial = this.mcampos.credencial;
    this.rqMantenimiento.estado = 'ACT';
    const rqMan = this.getRequestMantenimiento();
    this.dtoServicios.ejecutarRestMantenimiento(rqMan).subscribe(
      resp => {
        if (resp.cod !== 'OK') {
          return;
        }
        
        this.mcampos = resp.mdatos;

        super.mostrarMensajeSuccess("USUARIO DESBLOQUEADO");
      },
      error => {
        this.dtoServicios.manejoError(error);
      }
    );
  }
}

