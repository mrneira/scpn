import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { MenuItem } from 'primeng/components/common/menuitem';
@Component({
  selector: 'app-datosgenerales',
  templateUrl: 'datosgenerales.html'
})
export class DatosgeneralesComponent extends BaseComponent implements OnInit, AfterViewInit {




  @Output() eventoProyectado = new EventEmitter();

  public itemsReporte: MenuItem[] = [{ label: 'PRIVATIVAS', icon: 'ui-icon-circle-arrow-e', command: () => { this.ROLPAGOS(); } },
  { label: 'RENTA FIJA', icon: 'ui-icon-circle-arrow-w', command: () => { this.PROVISIONES(); } }];

  public lmodulos: SelectItem[] = [{ label: '...', value: null }];

  public lestado: SelectItem[] = [{ label: '...', value: null }];
  public ltipo: SelectItem[] = [{ label: '...', value: null }];
  public ltipodetalle: any[];

  public nuevo: boolean = true;
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tinvplananual', 'PLANANUAL', true);
    this.componentehijo = this;
  }
  fechaactual = new Date();
  fmin = new Date();
  fmini = new Date();
  factiva = false;

  ngOnInit() {
    super.init();
  }

  ngAfterViewInit() {
  }

  ROLPAGOS() {
    this.mcampos.tipo = "EXCEL";
    this.mcampos.tiporeporte = "ROLP";

  }

  PROVISIONES() {

    this.mcampos.tipo = "EXCEL";
    this.mcampos.tiporeporte = "ROLPR";

  }
  crearNuevo() {
    this.fmin = new Date(this.fechaactual);

    super.crearNuevo();
    this.registro.anio = this.fmin.getFullYear();
    this.registro.cplan = 0;
    this.registro.estado = true;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    this.registro.fingreso = this.fechaactual;
    this.registro.pparticipaciontotal = 0;
  }

  actualizar() {
    super.actualizar();
    this.cambiarAsignado();
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    super.cancelar();
    this.cambiarAsignado();
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.anio', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'ntipo', 't.tipoccatalogo = i.ccatalogo and i.cdetalle = t.tipocdetalle');
    consulta.addSubquery('tgenmodulo', 'nombre', 'nmodulo', 'i.cmodulo = t.cmodulo');

    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.tipocdetalle = this.mcampos.tipocdetalle;
    this.mfiltros.anio = this.mcampos.anio;
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
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();

  }
  cambiarAsignado() {
    this.eventoProyectado.emit();
  }
  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);

  }



  validaGrabar() {
    return super.validaGrabar('NO HA REALIZADADO LA VALIDACIÓN DEL FORMULARIO [DATOS PLAN ANUAL]');
  }
  validarDatos(): boolean {
    let mensaje = '';
    if (this.registro.anio) {

    }
    return true;
  }
}
