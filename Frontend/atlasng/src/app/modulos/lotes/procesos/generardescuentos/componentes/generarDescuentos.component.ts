import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-generar-descuentos',
  templateUrl: 'generarDescuentos.html'
})
export class GenerarDescuentosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public lotefinalizado = true;
  public numejecucion = null;
  public lprogreso = null;
  private interval = null;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TloteModuloTareas', 'LOTEMODTAREAS', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.mcampos.nmodulo = 'CARTERA';
    this.mcampos.ntransaccion = 'DESCUENTOS DE CARTERA';
    this.consultar();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
  }

  actualizar() {
  }

  eliminar() {
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 'ordenmod, t.orden', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TloteModulo', 'orden', 'ordenmod', 'i.cmodulo = t.cmodulo and i.clote = t.clote');
    consulta.addSubquery('TgenModulo', 'nombre', 'nmodulo', 'i.cmodulo = t.cmodulo');
    consulta.addSubquery('TloteTareas', 'nombre', 'ntarea', 'i.cmodulo = t.cmodulo and i.ctarea = t.ctarea');
    consulta.cantidad = 200;

    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.clote = 'DESCUENTOS';
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.CLOTE = this.mfiltros.clote;
    this.rqMantenimiento.fejecucion = this.fechaToInteger(new Date());
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod === 'OK') {
      this.numejecucion = resp.numejecucion;
    }
  }

}
