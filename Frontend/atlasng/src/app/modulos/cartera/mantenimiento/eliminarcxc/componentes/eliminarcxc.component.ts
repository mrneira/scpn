import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';
import { LovOperacionCarteraComponent } from '../../../lov/operacion/componentes/lov.operacionCartera.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-eliminar-cxc',
  templateUrl: 'eliminarcxc.html'
})
export class EliminarcxcComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  @ViewChild(LovOperacionCarteraComponent)
  private lovOperacion: LovOperacionCarteraComponent;

  public selectedRegistros: any;
  private lcxc: any;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tcaroperaciontransaccion', 'CONSULTATRANSACCIONCXC', false, false);
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
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.fijarFiltrosConsulta();
    this.rqConsulta.CODIGOCONSULTA = 'CONSULTATRANSACCIONCXC';
    this.rqConsulta.storeprocedure = "sp_CarConCuentasPorCobrar";
    super.consultar();
  }

  private fijarFiltrosConsulta() {
    this.rqConsulta.parametro_coperacion = this.mfiltros.coperacion;
  }

  validaFiltrosConsulta(): boolean {
    if (this.estaVacio(this.mfiltros.coperacion)) {
      super.mostrarMensajeError("OPERACIÓN ES REQUERIDA");
      return false;
    }
    return this.validaFiltrosRequeridos();
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    this.selectedRegistros = [];
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    if (!this.validaRegistros()) {
      this.mostrarMensajeError("NO HA SELECCIONADO REGISTROS");
      return;
    }

    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.coperacion = this.mfiltros.coperacion;
    this.rqMantenimiento.mdatos.ELIMINARCXC = this.selectedRegistros;
    super.grabar(false);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod === "OK") {
      this.enproceso = false;
      this.consultar();
    }
  }

  validaRegistros(): boolean {
    if (!this.estaVacio(this.selectedRegistros)) {
      return true;
    }
    return false;
  }
  // Fin MANTENIMIENTO *********************

  /**Muestra lov de personas */
  mostrarLovPersona(): void {
    this.lovPersonas.mfiltros.csocio = 1;
    this.lovPersonas.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.cpersona = reg.registro.cpersona;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.mcampos.nombre = reg.registro.nombre;
      this.mostrarLovOperacion();
    }
  }

  /**Muestra lov de operaciones de cartera. */
  mostrarLovOperacion(): void {
    if (this.estaVacio(this.mfiltros.cpersona)) {
      this.mostrarMensajeInfo('SELECCIONE UN CLIENTE');
      return;
    }
    this.lovOperacion.mfiltrosesp.cestatus = 'not in (\'APR\',\'CAN\')';
    this.lovOperacion.mfiltros.cpersona = this.mfiltros.cpersona;
    this.lovOperacion.consultar();
    this.lovOperacion.showDialog();
  }

  /**Retorno de lov de operacion de cartera. */
  fijarLovOperacionSelec(reg: any): void {
    this.mfiltros.coperacion = reg.registro.coperacion;
    this.mcampos.ntipoprod = reg.registro.mdatos.nproducto + ' - ' + reg.registro.mdatos.ntipoproducto;
    this.consultar();
  }
}
