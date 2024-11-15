import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { LovPersonasComponent } from '../../../../../../personas/lov/personas/componentes/lov.personas.component';

@Component({
  selector: 'app-avaluo-gar',
  templateUrl: '_avaluo.html'
})
export class AvaluoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;
  public habilitarGrabar = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TgarOperacionAvaluo', 'AVALUOGAR', true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.mcampos.camposfecha.finspeccion = null;
    this.mcampos.camposfecha.fvencimientoavaluo = null;
    this.habilitarGrabar = false;
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.verreg = 0;
    this.registro.optlock = 0;
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.registro.fentregaavaluo = this.dtoServicios.mradicacion.fcontable;
  }

  actualizar() {
    super.actualizar();
    this.habilitarGrabar = true;
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
    this.registro.coperacion = this.mcampos.coperacion;
  }

  // Inicia CONSULTA *********************
  consultar() {

  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', '', this.mfiltros, this.mfiltrosesp);

    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.verreg = 0;
  }

  validaGrabar(coperacion: string = null) {
    if (this.estaVacio(coperacion)) {
      return true;
    } else {
      return super.validaGrabar('NO HA REALIZADADO LA VALIDACIÓN DEL FORMULARIO[DATOS GENERAL]');
    }

  }

  habilitarEdicion() {
    this.habilitarGrabar = false;
    if (this.estaVacio(this.mcampos.cpersona)) {

      this.mostrarMensajeError('PERSONA REQUERIDA');
      return false;
    }
    return super.habilitarEdicion();
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();

    super.grabar();
  }


  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any, dtoext = null) {
    super.postCommitEntityBean(resp, dtoext);
  }


}
