import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { LovPersonasComponent } from '../../../personas/lov/personas/componentes/lov.personas.component';
import { LovPersonaVistaComponent } from '../../../personas/lov/personavista/componentes/lov.personaVista.component';
import { LovSegurosComponent } from '../../lov/seguros/componentes/lov.seguros.component';
import { DatosPolizaComponent } from '../submodulos/datosPoliza/componentes/_datosPoliza.component'

@Component({
  selector: 'app-renovacion-poliza-incremento',
  templateUrl: 'renovacionPolizaIncremento.html'
})
export class RenovacionPolizaIncrementoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  @ViewChild(LovPersonaVistaComponent)
  private lovPersonaVista: LovPersonaVistaComponent;


  @ViewChild(LovSegurosComponent)
  lovSeguros: LovSegurosComponent;

  @ViewChild(DatosPolizaComponent)
  polizaComponent: DatosPolizaComponent;

  public consultaRubros = true;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'DtoRubro', '_RUBROS', true, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
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
    this.rqConsulta.CODIGOCONSULTA = 'CONSULTAINCREMENTO';
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    this.rqConsulta.mdatos.coperacioncartera = this.mfiltros.coperacioncartera;
    this.rqConsulta.mdatos.coperaciongarantia = this.mfiltros.coperaciongarantia;
    const consultaPoliza = this.polizaComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.polizaComponent.alias, consultaPoliza);
  }

  private fijarFiltrosConsulta() {
    this.polizaComponent.mfiltros.coperacioncartera = this.mfiltros.coperacioncartera;
    this.polizaComponent.mfiltros.coperaciongarantia = this.mfiltros.coperaciongarantia;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.polizaComponent.postQuery(resp);
    if (this.consultaRubros) {
      this.lregistros = [];
      for (const i in resp._RUBROS) {
        if (resp._RUBROS.hasOwnProperty(i)) {
          const reg: any = resp._RUBROS[i];
          if (!this.estaVacio(reg) && reg.csaldo === this.mcampos.csaldo) {
            this.lregistros.push(reg);
          }
        }
      }
    }
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento

    this.polizaComponent.registro.valordevolucion = super.redondear(this.polizaComponent.mcampos.valordevolucion, 2);
    this.polizaComponent.registro.finicio = this.fechaToInteger(this.polizaComponent.mcampos.finicio);
    this.polizaComponent.registro.fvencimiento = this.fechaToInteger(this.polizaComponent.mcampos.fvencimiento);
    this.polizaComponent.registro.femision = this.fechaToInteger(this.polizaComponent.mcampos.femision);
    this.polizaComponent.selectRegistro(this.polizaComponent.registro);
    this.polizaComponent.actualizar();

    this.crearDtoMantenimiento();
    super.grabar(false);
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1, true);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);

    super.addMantenimientoPorAlias(this.polizaComponent.alias, this.polizaComponent.getMantenimiento(2));
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

  /**Muestra lov de seguros */
  mostrarLovSeguros(): void {
    if (this.estaVacio(this.mcampos.cpersona)) {
      super.mostrarMensajeInfo('PERSONA REQUERIDA');
      return;
    }
    this.lovSeguros.mfiltros.cpersona = this.mcampos.cpersona;
    this.lovSeguros.mfiltrosesp.frecepcion = 'is not null';
    this.lovSeguros.mfiltrosesp.secuenciapoliza = 'is null';
    this.lovSeguros.mfiltros.incremento = true;

    this.lovSeguros.consultar();
    this.lovSeguros.showDialog();
  }

  /**Retorno de lov de operaciones. */
  fijarLovSegurosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.coperacioncartera = reg.registro.coperacioncartera;
      this.mfiltros.coperaciongarantia = reg.registro.coperaciongarantia;
      this.polizaComponent.mcampos.valorprimaretenida = reg.registro.valorprimaretenida;
      this.polizaComponent.mcampos.ctiposeguro = reg.registro.ctiposeguro;
      this.mcampos.csaldo = reg.registro.mdatos.csaldo;
      this.mcampos.ntipoprod = reg.registro.mdatos.nproducto + ' - ' + reg.registro.mdatos.ntipoproducto;
      this.consultar();
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

}

