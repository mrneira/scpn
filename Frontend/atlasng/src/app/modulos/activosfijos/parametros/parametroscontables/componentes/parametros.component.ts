import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovCuentasContablesComponent } from '../../../../contabilidad/lov/cuentascontables/componentes/lov.cuentasContables.component';

@Component({
  selector: 'app-parametros',
  templateUrl: 'parametros.html'
})
export class ParametrosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  @ViewChild('lov1')
  lovCuentas: LovCuentasContablesComponent;
  @ViewChild('lov2')
  lovCuentasDepreciacion: LovCuentasContablesComponent;
  @ViewChild('lov3')
  lovCuentasGasto: LovCuentasContablesComponent;
  @ViewChild('lov4')
  lovCuentasDepreciacionAcum: LovCuentasContablesComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tacfproducto', 'PRODUCTO', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.optlock = 0;
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.nombre', this.mfiltros, this.mfiltrosesp);
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
      this.mfiltros.movimiento = true;
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
  

  /**Muestra lov de cuentas contables */
  mostrarLovCuentas(): void {
    this.lovCuentas.mfiltros.movimiento = true;
    this.lovCuentas.showDialog(true);
  }

  /**Retorno de lov de Cuentas Contables. */
  fijarLovCuentasSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.ccuenta = reg.registro.ccuenta;
    }
  }

  /**Muestra lov de cuentas contables */
  mostrarLovCuentasDepreciacion(): void {
    this.lovCuentas.mfiltros.movimiento = true;
    this.lovCuentasDepreciacion.showDialog(true);
  }

  /**Retorno de lov de Cuentas Contables. */
  fijarLovCuentasDepreciacionSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.ccuentadepreciacion = reg.registro.ccuenta;
    }
  }

  mostrarLovCuentasDepreciacionAcum(): void {
    this.lovCuentas.mfiltros.movimiento = true;
    this.lovCuentasDepreciacionAcum.showDialog(true);
  }

  /**Retorno de lov de Cuentas Contables. */
  fijarLovCuentasDepreciacionAcumSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.ccuentadepreciacionacum = reg.registro.ccuenta;
    }
  }
  /**Muestra lov de cuentas contables */
  mostrarLovCuentasGasto(): void {
    this.lovCuentas.mfiltros.movimiento = true;
    this.lovCuentasGasto.showDialog(true);
  }

  /**Retorno de lov de Cuentas Contables. */
  fijarLovCuentasGastoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.ccuentagasto = reg.registro.ccuenta;
    }
  }

  limpiarlovcuentacontable(): void {
    this.registro.ccuenta = null;
  }

  limpiarlovcuentacontabledepreciacion(): void {
    this.registro.ccuentadepreciacion = null;
  }

  limpiarlovcuentacontabledepreciacionacum(): void {
    this.registro.ccuentadepreciacionacum = null;
  }

  limpiarlovcuentacontablegasto(): void {
    this.registro.ccuentagasto = null;
  }

}
