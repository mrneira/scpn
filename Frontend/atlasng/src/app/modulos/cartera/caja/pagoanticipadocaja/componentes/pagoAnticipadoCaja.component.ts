import { Component, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-pagoAnticipadoCaja',
  templateUrl: 'pagoAnticipadoCaja.html'
})
export class PagoAnticipadoCajaComponent extends BaseComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  @ViewChild(LovOperacionCarteraComponent)
  private lovOperacion: LovOperacionCarteraComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'DtoRubro', '_RUBROS', false, true);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
  }



  // Inicia CONSULTA *********************
  consultar() {
    if (!this.validaOperacion()) {
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.rqConsulta.CODIGOCONSULTA = 'DATOSDESEMBOLSO';
    this.rqConsulta.coperacion = this.mcampos.coperacion;

  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {

    this.manejaRespuestaDatosOperacion(resp);
  }

  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    if (!this.validaOperacion()) {
      return;
    }
    this.rqMantenimiento.coperacion = this.mcampos.coperacion;
    this.crearDtoMantenimiento();
    super.grabar();
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  public postCommit(resp: any) {
    this.mcampos.csolicitud = resp.csolicitud;
  }

  /**Muestra lov de personas */
  mostrarLovPersona(): void {
    this.lovPersonas.showDialog();
  }

  /**Muestra lov de operaciones de cartera. */
  mostrarLovOperacion(): void {
    if (this.mcampos.cpersona === undefined) {
      this.mostrarMensajeInfo('SELECCIONE CLIENTE');
      return;
    }
    this.lovOperacion.rqConsulta.mdatos.cestatussolicitud = 'APR';
    this.lovOperacion.rqConsulta.mdatos.cpersona = this.mcampos.cpersona;
    this.lovOperacion.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.mcampos.nombre = reg.registro.nombre;
    }
  }

  /**Retorno de lov de operacion de cartera. */
  fijarLovOperacionSelec(reg: any): void {
    this.msgs = [];
    this.mcampos.coperacion = reg.registro.coperacion;
    this.consultar();
  }

  private validaOperacion(): boolean {
    if (this.mcampos.coperacion === undefined || this.mcampos.coperacion === null) {
      super.mostrarMensajeError('NÚMERO DE OPERACIÓN A DESEMBOLSAR REQUERIDA');
      return false;
    }
    return true;
  }

  manejaRespuestaDatosOperacion(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      const msaldo = resp.SALDODESEMBOLSO[0];
      this.mcampos.montodesembolsar = msaldo.montodesembolsar;
      this.mcampos.descuento = msaldo.descuento;
      this.mcampos.gastosFinanciados = msaldo.gastosFinanciados;
      this.mcampos.monto = msaldo.monto;

      const moperacion = resp.OPERACION[0];
      this.mcampos.cpersona = moperacion.cpersona;
      this.mcampos.npersona = moperacion.n_persona;
      this.mcampos.cmoneda = moperacion.cmoneda;
      this.mcampos.cmoneda = moperacion.n_moneda;
      this.mcampos.cpersona = moperacion.cpersona;
    }
    this.lconsulta = [];
  }


}
