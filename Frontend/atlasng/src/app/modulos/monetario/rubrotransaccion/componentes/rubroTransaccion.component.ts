import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';

import { LovTransaccionesComponent } from '../../../generales/lov/transacciones/componentes/lov.transacciones.component';
import { LovSaldoComponent } from '../../lov/saldo/componentes/lov.saldo.component';

@Component({
  selector: 'app-saldo-transaccion',
  templateUrl: 'rubroTransaccion.html'
})
export class RubroTransaccionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovTransaccionesComponent)
  private lovtransacciones: LovTransaccionesComponent;

  @ViewChild(LovSaldoComponent)
  private lovsaldo: LovSaldoComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TmonRubro', 'SALDOTRANSACCION', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);

  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (!super.validaFiltrosRequeridos('FILTROS REQUERIDOS')) {
      return;
    }
    super.crearNuevo();
    this.registro.debito = false;
    this.registro.ingreso = false;
    this.registro.desabilitarpagina = false;
    this.registro.grabar = false;
    this.registro.controllavado = false;
    this.registro.generacxxcheques = false;
    this.registro.cmodulo = this.mfiltros.cmodulo;
    this.registro.ctransaccion = this.mfiltros.ctransaccion;
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.crubro', this.mfiltros, this.mfiltrosesp);
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************
  
  validaGrabar() {
    if (!super.validaFiltrosRequeridos('FILTROS REQUERIDOS')) {
      return false;
    }
    else {
      if (this.lregistros.length > 0) {
        return true;
      }
      else {
        this.mostrarMensajeError('DEBE INGRESAR AL MENOS UN REGISTRO');
      }
    }
  }

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

  /**Muestra lov de transacciones */
  mostrarLovTransacciones(): void {
    this.lovtransacciones.showDialog();
  }

  /**Retorno de lov de transacciones. */
  fijarLovTransaccionesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.nmodulo = reg.registro.mdatos.nmodulo;
      this.mcampos.ntransaccion = reg.registro.nombre;
      this.mfiltros.cmodulo = reg.registro.cmodulo;
      this.mfiltros.ctransaccion = reg.registro.ctransaccion;

      this.consultar();
    }
  }

  /**Muestra lov de saldo */
  mostrarLovSaldo(): void {
    this.lovsaldo.showDialog();
  }

  /**Retorno de lov de saldo. */
  fijarLovSaldoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.nombre = reg.registro.nombre;
      this.registro.csaldo = reg.registro.csaldo;
    }
  }

}
