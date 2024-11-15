import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-persona-inf-adicional',
  templateUrl: '_personaInfAdicional.html'
})
export class PersonaInfAdicionalComponent extends BaseComponent implements OnInit, AfterViewInit {

  public ltipovivienda: SelectItem[] = [{label: '...', value: null}];

  public lrelaciondependencia: SelectItem[] = [{label: '...', value: null}];

  public lorgingresos: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TperInformacionAdicional', 'ADICIONAL', true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.llenarTipoVivienda();
    this.llenarRelacionDependencia();
    this.mcampos.camposfecha.factualizacionpatrimonio = null;
    this.formvalidado = true;
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.verreg = 0;
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.registro.tipoviviendaccatalogo = 213;
    this.registro.relaciondependenciaccatalogo = 215;
    this.registro.origeningresosccatalogo = 217;
  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
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
    const consulta = new Consulta(this.entityBean, 'N', 't.cpersona', this.mfiltros, this.mfiltrosesp);
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.mfiltros.verreg = 0;
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

  validaGrabar() {
    return true;
    //return super.validaGrabar('NO HA REALIZADADO LA VALIDACIÓN DEL FORMULARIO [INFORMACION ADICIONAL]');
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  llenarTipoVivienda() {
    this.ltipovivienda = [];
    this.ltipovivienda.push({ label: 'PROPIA HIPOTECADA', value: 'P' });
    this.ltipovivienda.push({ label: 'PROPIA NO HIPOTECADA', value: 'N' });
    this.ltipovivienda.push({ label: 'ARRENDADA', value: 'A' });
    this.ltipovivienda.push({ label: 'PRESTADA', value: 'S' });
    this.ltipovivienda.push({ label: 'VIVE CON FAMILIARES', value: 'F' });
  }

  llenarRelacionDependencia() {
    this.lrelaciondependencia = [];
    this.lrelaciondependencia.push({ label: 'DEPENDIENTE', value: 'D' });
    this.lrelaciondependencia.push({ label: 'INDEPENDIENTE', value: 'I' });
  }
}
