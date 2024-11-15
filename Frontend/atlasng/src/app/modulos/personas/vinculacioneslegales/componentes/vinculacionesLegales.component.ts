import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { LovPersonasComponent } from '../../../personas/lov/personas/componentes/lov.personas.component';
import { LovCausalesVinculacionComponent } from '../../../personas/lov/causalesvinculacion/componentes/lov.causalesVinculacion.component';

@Component({
  selector: 'app-vin-legales',
  templateUrl: 'vinculacionesLegales.html'
})
export class VinculacionesLegalesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  @ViewChild(LovCausalesVinculacionComponent)
  private lovCausalesVinculacion: LovCausalesVinculacionComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TperVinculacionesLegales', 'VINLEGALES', true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.verreg = 0;
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    if (this.mfiltros.cpersona !== undefined) {
      this.registro.cpersona = this.mfiltros.cpersona;
    }
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
    const consulta = new Consulta(this.entityBean, 'N', '', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TperTipoCausalVinculacion', 'nombre', 'ntipocausal', 'i.ctipocausal = t.ctipocausal');
    consulta.addSubquery('TperCausalVinculacion', 'nombre', 'ncausal', 'i.ctipocausal = t.ctipocausal and i.ccausalvinculacion = t.ccausalvinculacion');
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.verreg = 0;
    this.mfiltros.ccompania = this.dtoServicios.mradicacion.ccompania;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
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

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  /**Muestra lov de personas */
  mostrarLovPersona(): void {
    this.lovPersonas.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cpersona = reg.registro.cpersona;
      this.mfiltros.cpersona = reg.registro.cpersona;
      this.mcampos.npersona = reg.registro.nombre;

      this.consultar();
    }
  }

  /**Muestra lov de causales de vinculacion */
  mostrarLovCausalVinculacion(): void {
    this.lovCausalesVinculacion.showDialog();
  }

  /**Retorno de lov de causales de vinculacion. */
  fijarLovCausalVinculacionSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.ctipocausal = reg.registro.ctipocausal;
      this.registro.ccausalvinculacion = reg.registro.ccausalvinculacion;
      this.registro.mdatos.ntipocausal = reg.registro.mdatos.ntipocausal;
      this.registro.mdatos.ncausal = reg.registro.nombre;
    }
  }

}
