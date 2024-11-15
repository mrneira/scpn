import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';
import { LovOperacionCarteraComponent } from '../../../lov/operacion/componentes/lov.operacionCartera.component';

@Component({
  selector: 'app-anular',
  templateUrl: 'anularAprobados.html'
})
export class AnularAprobadosComponent extends BaseComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  @ViewChild(LovOperacionCarteraComponent)
  private lovOperacion: LovOperacionCarteraComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'SALDODESEMBOLSO', false, true);
  }

  ngOnInit() {
    this.componentehijo = this;
	super.init(this.formFiltros);	
  }

  // Inicia CONSULTA *********************
  consultar() {
  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.validaFiltrosConsulta();
    this.lmantenimiento = []; // Encerar Mantenimiento
    if (!this.validaOperacion()) {
      return;
    }
    this.rqMantenimiento.cpersona = this.mcampos.cpersona;
    this.rqMantenimiento.coperacion = this.mfiltros.coperacion;
    super.grabar();
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  /**Muestra lov de personas */
  mostrarLovPersona(): void {
    this.lovPersonas.mfiltros.csocio = 1;
    this.lovPersonas.showDialog();
  }

  /**Muestra lov de operaciones de cartera. */
  mostrarLovOperacion(): void {
    if (this.mcampos.cpersona === undefined) {
      this.mostrarMensajeInfo('SELECCIONE CLIENTE');
      return;
    }
    this.lovOperacion.mfiltros.cestatus = 'APR';
    this.lovOperacion.mfiltros.cpersona = this.mcampos.cpersona;
    this.lovOperacion.showDialog();
    this.lovOperacion.consultar();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.mcampos.nombre = reg.registro.nombre;
      this.mostrarLovOperacion();
    }
  }

  /**Retorno de lov de operacion de cartera. */
  fijarLovOperacionSelec(reg: any): void {
    this.msgs = [];
    this.mfiltros.coperacion = reg.registro.coperacion;
    this.mcampos.ntipoprod = reg.registro.mdatos.nproducto + ' - ' + reg.registro.mdatos.ntipoproducto;
  }

  private validaOperacion(): boolean {
    if (this.estaVacio(this.mfiltros.coperacion)) {
      super.mostrarMensajeError('NÚMERO DE OPERACIÓN A ANULAR REQUERIDA');
      return false;
    }
    return true;
  }





}
