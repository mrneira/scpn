import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovSaldoComponent } from '../../../../monetario/lov/saldo/componentes/lov.saldo.component';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';
import { LovOperacionCarteraComponent } from '../../../lov/operacion/componentes/lov.operacionCartera.component';
import { TablaAmortizacionComponent } from '../../../consultas/consultaoperacion/submodulos/tablaamortizacion/componentes/_tablaAmortizacion.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-ingresocxc',
  templateUrl: 'ingresocxc.html'
})
export class IngresocxcComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  @ViewChild(LovOperacionCarteraComponent)
  private lovOperacion: LovOperacionCarteraComponent;

  @ViewChild(LovSaldoComponent)
  private lovsaldo: LovSaldoComponent;

  @ViewChild(TablaAmortizacionComponent)
  tablaAmortizacionComponent: TablaAmortizacionComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'INGRESOCXC', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
  }

  actualizar() {
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
  }

  public selectRegistro(registro: any) {
  }

  // Inicia CONSULTA *********************
  consultar() {
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
  }

  private fijarFiltrosConsulta() {

  }

  validaFiltrosConsulta(): boolean {
    return this.validaFiltrosRequeridos();
  }

  public postQuery(resp: any) {
    this.postQuery(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {

    this.rqMantenimiento.coperacion = this.mcampos.coperacion;
    this.rqMantenimiento.monto = this.mcampos.monto;
    this.rqMantenimiento.numerocuotas = this.mcampos.numcuotas;
    this.rqMantenimiento.csaldo = this.mcampos.csaldo;
    this.rqMantenimiento.cuotainicio = this.mcampos.cuotainicio;
    super.grabar(false);
  }

  validaGrabar() {
    if (!super.validaFiltrosConsulta('LLENAR LOS CAMPOS REQUERIDOS')) {
      return;
    }
    return super.validaGrabar();
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod === 'OK') {
      this.tablaAmortizacionComponent.consultar();
    }
  }

  /**Muestra lov de personas */
  mostrarLovPersona(): void {
    this.lovPersonas.mfiltros.csocio = 1;
    this.lovPersonas.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.mcampos.nombre = reg.registro.nombre;

      this.lovOperacion.mfiltrosesp.cestatus = 'not in (\'APR\',\'CAN\')';
      this.lovOperacion.mfiltrosesp.coperacion = 'not in (select coperacion from tcaroperacionarreglopago)';
      this.lovOperacion.mfiltros.cpersona = this.mcampos.cpersona;
      this.lovOperacion.consultar();
      this.lovOperacion.showDialog();
    }
  }

  /**Muestra lov de operaciones de cartera. */
  mostrarLovOperacion(): void {
    if (this.mcampos.cpersona === undefined) {
      this.mostrarMensajeInfo('SELECCIONE UN CLIENTE');
      return;
    }

    this.lovOperacion.showDialog();
  }

  /**Retorno de lov de operacion de cartera. */
  fijarLovOperacionSelec(reg: any): void {
    this.mcampos.coperacion = reg.registro.coperacion;
    this.mcampos.ntipoprod = reg.registro.mdatos.nproducto + ' - ' + reg.registro.mdatos.ntipoproducto;
    this.mostrarlovsaldo();

    this.tablaAmortizacionComponent.mfiltros.coperacion = reg.registro.coperacion;
    this.tablaAmortizacionComponent.consultar();
  }

  /**Muestra lov de saldo */
  mostrarlovsaldo(): void {
    this.lovsaldo.mfiltros.ctiposaldo = 'CXC';
    this.lovsaldo.consultar();
    this.lovsaldo.showDialog();
  }


  /**Retorno de lov de saldo. */
  fijarLovSaldoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.nsaldo = reg.registro.nombre;
      this.mcampos.csaldo = reg.registro.csaldo;
    }
  }

}
