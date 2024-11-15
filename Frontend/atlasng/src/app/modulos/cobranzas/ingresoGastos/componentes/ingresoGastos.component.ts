import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { LovSaldoComponent } from '../../../monetario/lov/saldo/componentes/lov.saldo.component';
import { LovPersonasComponent } from '../../../personas/lov/personas/componentes/lov.personas.component';
import { LovOperacionCobranzaComponent } from '../../lov/operacion/componentes/lov.operacionCobranza.component';
import { TablaAmortizacionComponent } from './_tablaAmortizacion.component';

@Component({
  selector: 'app-ingreso-gastos',
  templateUrl: 'ingresoGastos.html'
})
export class IngresoGastosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  @ViewChild(LovOperacionCobranzaComponent)
  private lovOperacion: LovOperacionCobranzaComponent;

  @ViewChild(LovSaldoComponent)
  private lovsaldo: LovSaldoComponent;

  @ViewChild(TablaAmortizacionComponent)
  tablaAmortizacionComponent: TablaAmortizacionComponent;

  public ltipoarreglo: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'INGRESOARREGLOPAGO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  eliminar() {
    super.eliminar();
  }


  // Inicia CONSULTA *********************
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

    this.rqMantenimiento.coperacion = this.registro.coperacion;
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
      this.mcampos.nombre = reg.registro.nombre;

      this.mostrarLovOperacion();
    }
  }

  /**Muestra lov de operaciones */
  mostrarLovOperacion(): void {
    if (this.estaVacio(this.mcampos.cpersona)) {
      this.mostrarMensajeInfo('SELECCIONE UN CLIENTE');
      return;
    }
    this.lovOperacion.mfiltros.cpersona = this.mcampos.cpersona;
    this.lovOperacion.mfiltrosesp.cestatus = 'in (\'ASI\',\'JUD\')';
    this.lovOperacion.showDialog();
    this.lovOperacion.consultar();
  }

  /**Retorno de lov de operacion. */
  fijarLovOperacionSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.ccobranza = reg.registro.ccobranza;
      this.registro.coperacion = reg.registro.coperacion;
      this.mcampos.ntipoprod = reg.registro.coperacion + ' - ' + reg.registro.mdatos.nproducto + ' - ' + reg.registro.mdatos.ntipoproducto;
      this.mostrarlovsaldo();

      this.tablaAmortizacionComponent.mfiltros.coperacion = reg.registro.coperacion;
      this.tablaAmortizacionComponent.consultar();
    }
  }

  /**Muestra lov de saldo */
  mostrarlovsaldo(): void {
    this.lovsaldo.mfiltros.cmodulo = sessionStorage.getItem('m');
    this.lovsaldo.mfiltros.ctiposaldo = 'CXC';
    this.lovsaldo.mfiltrosesp.csaldo = 'in (select c.csaldo from TcarCuentaPorCobrar c where c.cmodulo = ' + sessionStorage.getItem('m') + ')';
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
