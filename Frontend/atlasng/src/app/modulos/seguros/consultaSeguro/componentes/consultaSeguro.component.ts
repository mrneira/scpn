import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta, Subquery } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { LovPersonasComponent } from '../../../personas/lov/personas/componentes/lov.personas.component';
import { LovSegurosComponent } from '../../lov/seguros/componentes/lov.seguros.component';
import { DatosOperacionComponent } from '../submodulos/datosOperacion/componentes/_datosOperacion.component';
import { DatosGarantiaComponent } from '../submodulos/datosGarantia/componentes/_datosGarantia.component';
import { TablaPolizaComponent } from '../submodulos/tablaPoliza/componentes/_tablaPoliza.component';
import { TablaPolizaIncrementoComponent } from '../submodulos/tablaPolizaIncremento/componentes/_tablaPolizaIncremento.component';

@Component({
  selector: 'app-consulta-seguro',
  templateUrl: 'consultaSeguro.html'
})

export class ConsultaSeguroComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  lovPersonas: LovPersonasComponent;

  @ViewChild(LovSegurosComponent)
  lovSeguros: LovSegurosComponent;

  @ViewChild(DatosOperacionComponent)
  operacionComponent: DatosOperacionComponent;

  @ViewChild(DatosGarantiaComponent)
  garantiaComponent: DatosGarantiaComponent;

  @ViewChild(TablaPolizaComponent)
  PolizaComponent: TablaPolizaComponent;

  @ViewChild(TablaPolizaIncrementoComponent)
  PolizaIncrementoComponent: TablaPolizaIncrementoComponent;

  public habilitagrabar = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TsgsSeguro', 'SEGURO', true, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
  }

  ngAfterViewInit() {
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
    if (this.estaVacio(this.mfiltros.coperacioncartera)) {
      super.mostrarMensajeInfo('NÚMERO DE OPERACIÓN REQUERIDA');
      return;
    }
    this.fijarFiltrosConsulta();

    // Consulta datos.
    const conOperacion = this.operacionComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.operacionComponent.alias, conOperacion);

    const conGarantia = this.garantiaComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.garantiaComponent.alias, conGarantia);

    const conAvaluo = this.garantiaComponent.avaluoComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.garantiaComponent.avaluoComponent.alias, conAvaluo);

    this.crearDtoConsulta();
    super.consultar();

  }

  public crearDtoConsulta(): Consulta {
    const consulta = new Consulta(this.entityBean, 'Y', 't.coperacioncartera', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TsgsTipoSeguroDetalle', 'nombre', 'ntiposeguro', 'i.ctiposeguro = t.ctiposeguro and i.verreg = 0');
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {

    this.operacionComponent.mfiltros.coperacion = this.mfiltros.coperacioncartera;
    this.garantiaComponent.mfiltros.coperacion = this.mfiltros.coperaciongarantia;
    this.garantiaComponent.avaluoComponent.mfiltros.coperacion = this.mfiltros.coperaciongarantia;
    this.PolizaComponent.mfiltros.coperacioncartera = this.mfiltros.coperacioncartera;
    this.PolizaComponent.mfiltros.coperaciongarantia = this.mfiltros.coperaciongarantia;
    this.PolizaComponent.mcampos.cpersona = this.mcampos.cpersona;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.operacionComponent.postQuery(resp);
    this.garantiaComponent.postQuery(resp);
    this.garantiaComponent.avaluoComponent.postQuery(resp);
    this.PolizaComponent.consultar();
    //this.PolizaIncrementoComponent.consultar();
    super.postQueryEntityBean(resp);
    this.registro.frecepcion = this.integerToDate(this.registro.frecepcion);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  // grabar(): void {
  //   this.lmantenimiento = []; // Encerar Mantenimiento
  //   this.registro.coperacioncartera = this.mfiltros.coperacioncartera;
  //   this.registro.cusuariorec = this.dtoServicios.mradicacion.cusuario;
  //   this.registro.frecepcion = this.dtoServicios.mradicacion.fcontable;

  //   this.crearDtoMantenimiento();
  //   // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
  //   super.grabar();
  // }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod === "OK") {
      this.habilitagrabar = false;
    }
  }

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
    this.lovSeguros.mcampos.consulta = true;
    this.lovSeguros.mfiltros.cpersona = this.mcampos.cpersona;
    // this.lovSeguros.mfiltrosesp.frecepcion = 'is null';
    this.lovSeguros.consultar();
    this.lovSeguros.showDialog();
  }


  /**Retorno de lov de operaciones. */
  fijarLovSegurosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.coperacioncartera = reg.registro.coperacioncartera;
      this.mfiltros.coperaciongarantia = reg.registro.coperaciongarantia;
      this.mcampos.ntipoprod = reg.registro.mdatos.nproducto + ' - ' + reg.registro.mdatos.ntipoproducto;
      this.habilitagrabar = true;
      this.consultar();
    }
  }

}
