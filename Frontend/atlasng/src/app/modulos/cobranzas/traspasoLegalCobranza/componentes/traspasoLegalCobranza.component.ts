import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { LovPersonasComponent } from '../../../personas/lov/personas/componentes/lov.personas.component';
import { LovOperacionCobranzaComponent } from '../../lov/operacion/componentes/lov.operacionCobranza.component';
import { CobranzaComponent } from '../submodulos/cobranza/componentes/_cobranza.component';

@Component({
  selector: 'app-traspaso-legal',
  templateUrl: 'traspasoLegalCobranza.html'
})
export class TraspasoLegalCobranzaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  @ViewChild(LovOperacionCobranzaComponent)
  private lovOperacion: LovOperacionCobranzaComponent;

  @ViewChild(CobranzaComponent)
  cobranzaComponent: CobranzaComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'TRASPASOLEGAL', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  selectRegistro(registro: any) {
    // No existe para el padre
  }

  crearNuevo() {
    // No existe para el padre
  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
    // No existe para el padre
  }

  cancelar() {
    // No existe para el padre
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
  }

  private fijarFiltrosConsulta() {
    this.cobranzaComponent.mfiltros.coperacion = this.mcampos.coperacion;
  }

  validaFiltrosConsulta(): boolean {
    return (this.cobranzaComponent.validaFiltrosConsulta());
  }

  public postQuery(resp: any) {
    this.cobranzaComponent.consultar();
  }

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    if (this.cobranzaComponent.mcampos.flegal === undefined || this.cobranzaComponent.mcampos.flegal === null || this.cobranzaComponent.registro.observacion === undefined || this.cobranzaComponent.registro.observacion === null) {
      this.mostrarMensajeError("INGRESE CAMPOS OBLIGATORIOS");
      return;
    }
    var fecha = this.fechaToInteger(this.cobranzaComponent.mcampos.flegal);
    if (fecha < this.dtoServicios.mradicacion.fcontable) {
      this.mostrarMensajeError("FECHA SELECCIONADA INVALIDA");
      return;
    }
    if (this.mcampos.ccobranza === undefined || this.mcampos.ccobranza === null) {
      this.mostrarMensajeError("SELECCIONA COBRANZA");
      return;
    }

    this.cobranzaComponent.registro.flegal = fecha;
    this.cobranzaComponent.registro.cestatus = 'JUD';
    this.rqMantenimiento.mdatos.coperacion = this.mcampos.coperacion;
    this.rqMantenimiento.mdatos.cestatus = 'JUD';
    this.cobranzaComponent.registro.cusuariotraspaso = this.dtoServicios.mradicacion.cusuario;

    this.crearDtoMantenimiento();
    super.grabar();

  }

  validaGrabar() {
    return this.cobranzaComponent.validaGrabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
    super.addMantenimientoPorAlias(this.cobranzaComponent.alias, this.cobranzaComponent.getMantenimiento(1));
  }
  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
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
      this.lovOperacion.mfiltros.cestatus = 'ASI';
      this.lovOperacion.mfiltros.cpersona = this.mcampos.cpersona;
      this.lovOperacion.consultar();
      this.lovOperacion.showDialog();
    }
  }

  /**Muestra lov de operaciones de cartera. */
  mostrarLovOperacion(): void {
    if (this.estaVacio(this.mcampos.cpersona)) {
      this.mostrarMensajeInfo('SELECCIONE UN CLIENTE');
      return;
    }
    this.lovOperacion.mfiltros.cpersona = this.mcampos.cpersona;
    this.lovOperacion.showDialog();
  }

  /**Retorno de lov de operacion. */
  fijarLovOperacionSelec(reg: any): void {
    this.mcampos.ccobranza = reg.registro.ccobranza;
    this.mcampos.coperacion = reg.registro.coperacion;
    this.mcampos.ntipoprod = reg.registro.coperacion + ' - ' + reg.registro.mdatos.nproducto + ' - ' + reg.registro.mdatos.ntipoproducto;
    this.consultar();
  }
}
