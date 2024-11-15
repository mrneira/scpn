import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';
import { LovOperacionCarteraComponent } from '../../../lov/operacion/componentes/lov.operacionCartera.component';

@Component({
  selector: 'app-simulacion-descuentos',
  templateUrl: 'simulacionDescuentos.html'
})
export class SimulacionDescuentosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  @ViewChild(LovOperacionCarteraComponent)
  private lovOperacion: LovOperacionCarteraComponent;

  consultaRubros = true;
  private simulacion = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CONDICIONES', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    this.rqMantenimiento.monto = 0;
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  // Inicia CONSULTA *********************

  consultar() {
    this.rqConsulta.mdatos.CODIGOCONSULTA = 'RUBROSTRANSACCION';
    super.consultar();
  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    if (this.consultaRubros) {
      super.postQueryEntityBean(resp);
    }
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    if (this.estaVacio(this.mcampos.coperacion)) {
      this.mostrarMensajeError('NÚMERO DE OPERACIÓN REQUERIDA');
      return;
    }

    if (this.estaVacio(this.rqMantenimiento.monto) || this.rqMantenimiento.monto === 0) {
      this.mostrarMensajeError('MONTO NO PUEDE SER CERO');
      return;
    }

  }

  grabarSimulacion(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento

    if (this.estaVacio(this.mcampos.coperacion)) {
      this.mostrarMensajeError('NÚMERO DE OPERACIÓN REQUERIDA');
      return;
    }

    this.simulacion = true;
    this.rqMantenimiento.coperacion = this.mcampos.coperacion;
    this.rqMantenimiento['rollback'] = true;

    super.addMantenimientoPorAlias(this.alias, this.getMantenimiento(1));
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1, true);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    this.lregistros = [];
    if (resp.cod === "OK" && !this.estaVacio(resp.CONDICIONES)) {
      this.enproceso = false;
      this.lregistros = resp.CONDICIONES;
      this.mcampos.fcobro = resp.DESCUENTOS.fcobro;
      this.mcampos.monto = resp.DESCUENTOS.monto;
      this.mcampos.cuotasvencido = resp.DESCUENTOS.cuotasvencido;
      this.mcampos.diasvencido = resp.DESCUENTOS.diasvencido;
      this.mcampos.montoDescuentos = resp.DESCUENTOS.montoDescuento;
    }
  }

  /**Muestra lov de personas */
  mostrarLovPersona(): void {
    this.lovPersonas.mfiltros.csocio = 1;
    this.lovPersonas.showDialog();
  }

  /**Muestra lov de operaciones de cartera. */
  mostrarLovOperacion(): void {
    if (this.estaVacio(this.mcampos.cpersona)) {
      this.mostrarMensajeInfo('SELECCIONE CLIENTE');
      return;
    }
    this.lovOperacion.mfiltrosesp.cestatus = 'not in (\'APR\',\'CAN\')';
    this.lovOperacion.mfiltros.cpersona = this.mcampos.cpersona;
    this.lovOperacion.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    this.limpiar();
    if (reg.registro !== undefined) {
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.mcampos.nombre = reg.registro.nombre;
      this.mostrarLovOperacion();
      this.lovOperacion.consultar();
    }
  }

  /**Retorno de lov de operacion de cartera. */
  fijarLovOperacionSelec(reg: any): void {
    this.limpiar();
    this.mcampos.coperacion = reg.registro.coperacion;
    this.mcampos.nmoneda = reg.registro.mdatos.nmoneda;
    this.mcampos.ntipoprod = reg.registro.mdatos.nproducto + ' - ' + reg.registro.mdatos.ntipoproducto;
  }

  limpiar() {
    super.encerarMensajes();
    this.lregistros = [];
    this.mcampos.fcobro = null;
    this.mcampos.monto = null;
    this.mcampos.cuotasvencido = null;
    this.mcampos.diasvencido = null;
    this.mcampos.montoDescuentos = null;
  }
}
