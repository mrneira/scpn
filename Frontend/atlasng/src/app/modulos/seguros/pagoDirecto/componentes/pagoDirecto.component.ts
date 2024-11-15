import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { LovPersonasComponent } from '../../../personas/lov/personas/componentes/lov.personas.component';
import { LovPersonaVistaComponent } from '../../../personas/lov/personavista/componentes/lov.personaVista.component';
import { LovSegurosComponent } from '../../lov/seguros/componentes/lov.seguros.component';
import { DatosPolizaComponent } from '../submodulos/datosPoliza/componentes/_datosPoliza.component'

@Component({
  selector: 'app-pago-directo',
  templateUrl: 'pagoDirecto.html'
})
export class PagoDirectoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  @ViewChild(LovPersonaVistaComponent)
  private lovPersonaVista: LovPersonaVistaComponent;

  @ViewChild(LovSegurosComponent)
  lovSeguros: LovSegurosComponent;

  @ViewChild(DatosPolizaComponent)
  polizaComponent: DatosPolizaComponent;

  consultaRubros = true;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TsgsSeguro', 'SEGURO', true, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
  }

  habilitarEdicion() {
    if (this.estaVacio(this.mfiltros.coperacioncartera)) {
      super.mostrarMensajeInfo('NÚMERO DE OPERACIÓN REQUERIDA');
      return;
    }

    return super.habilitarEdicion();
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.nombre', this.mfiltros, this.mfiltrosesp);
    // consulta.addSubquery('TgarTipoGarantia', 'nombre', 'ntipogar', 'i.ctipogarantia = t.ctipogarantia');
    consulta.addSubquery('TsgsTipoSeguroDetalle', 'nombre', 'ntiposeguro', 'i.ctiposeguro = t.ctiposeguro and i.verreg = 0');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.coperacion = this.mfiltros.coperacioncartera;
    this.rqMantenimiento.monto = this.polizaComponent.registro.valorprima;
    this.rqMantenimiento.cuotainicio = this.polizaComponent.registro.mdatos.cuotainicio;
    this.rqMantenimiento.numerocuotas = this.polizaComponent.registro.mdatos.numerocuotas;
    this.rqMantenimiento.csaldo = this.polizaComponent.registro.mdatos.csaldo;
    this.rqMantenimiento.documento = this.polizaComponent.registro.numerofactura;

    this.polizaComponent.registro.finicio = this.fechaToInteger(this.polizaComponent.mcampos.finicio);
    this.polizaComponent.registro.fvencimiento = this.fechaToInteger(this.polizaComponent.mcampos.fvencimiento);
    this.polizaComponent.registro.femision = this.fechaToInteger(this.polizaComponent.mcampos.femision);
    this.polizaComponent.selectRegistro(this.polizaComponent.registro);
    this.polizaComponent.actualizar();

    super.addMantenimientoPorAlias(this.polizaComponent.alias, this.polizaComponent.getMantenimiento(1));
    super.grabar();
  }

  public postCommit(resp: any) {
    if (resp.cod === "OK") {
      this.polizaComponent.habilitagrabar = false;
    }
    super.postCommitEntityBean(resp);
  }

  validaGrabar() {
    return this.polizaComponent.validaGrabar();
  }
  // Fin MANTENIMIENTO *********************

  /**Muestra lov de personas */
  mostrarlovpersona(): void {
    this.lovPersonas.mfiltros.csocio = 1;
    this.lovPersonas.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.nombre = reg.registro.nombre;
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.identificacion = reg.registro.identificacion;

      this.mostrarLovSeguros();
    }
  }

  /**Muestra lov de persona vista */
  mostrarLovPersonaVista(): void {
    this.lovPersonaVista.showDialog();
    this.lovPersonaVista.mcampos.cpersona = this.mcampos.cpersona;
    this.lovPersonaVista.mcampos.identificacion = this.mcampos.identificacion;
    this.lovPersonaVista.mcampos.nombre = this.mcampos.nombre;
    this.lovPersonaVista.consultar();
  }

  /**Muestra lov de seguros */
  mostrarLovSeguros(): void {
    if (this.estaVacio(this.mcampos.cpersona)) {
      super.mostrarMensajeInfo('PERSONA REQUERIDA');
      return;
    }
    this.lovSeguros.mfiltros.cpersona = this.mcampos.cpersona;
    this.lovSeguros.mfiltrosesp.secuenciapoliza = 'is not null';
    this.lovSeguros.consultar();
    this.lovSeguros.showDialog();
  }

  /**Retorno de lov de operaciones. */
  fijarLovSegurosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.coperacioncartera = reg.registro.coperacioncartera;
      this.mfiltros.coperaciongarantia = reg.registro.coperaciongarantia;
      this.polizaComponent.registro.coperacioncartera = reg.registro.coperacioncartera;
      this.polizaComponent.registro.coperaciongarantia = reg.registro.coperaciongarantia;
      this.polizaComponent.registro.ctiposeguro = reg.registro.ctiposeguro;
      this.polizaComponent.registro.mdatos.ntiposeguro = reg.registro.mdatos.ntiposeguro;
      this.polizaComponent.registro.mdatos.csaldo = reg.registro.mdatos.csaldo;
      this.mcampos.ntipoprod = reg.registro.mdatos.nproducto + ' - ' + reg.registro.mdatos.ntipoproducto;
    }
  }

}
