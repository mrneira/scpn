import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { LovCodigosConsultaComponent } from '../../lov/codigosconsulta/componentes/lov.codigosConsulta.component';
import { LovComponentesNegocioComponent } from '../../lov/componentesnegocio/componentes/lov.componentesNegocio.component';

@Component({
  selector: 'app-cod-consulta',
  templateUrl: '_codigosConsulta.html'
})
export class CodigosConsultaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild('lovcodconsultacodigos')
  private lovCodConsulta: LovCodigosConsultaComponent;

  @ViewChild(LovComponentesNegocioComponent)
  private lovCompNegocio: LovComponentesNegocioComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TgenCompCodigoConsulta', 'COMPCONSULTA', false);
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
    this.registro.ccanal = this.mfiltros.ccanal;
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.orden', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenCompCodigo', 'nombre', 'ncodigoconsulta', 'i.cconsulta = t.cconsulta and i.ccanal = t.ccanal');
    consulta.addSubquery('TgenComponente', 'nombre', 'ncomponente', 'i.ccomponente = t.ccomponente');
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
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

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  /**Muestra lov de codigos consulta */
  mostrarLovCodigosConsulta(): void {
    this.lovCodConsulta.mfiltros.ccanal = this.mfiltros.ccanal;
    this.lovCodConsulta.mdesabilitaFiltros['ccanal'] = true;

    this.lovCodConsulta.consultar();
    this.lovCodConsulta.showDialog();
  }

  /**Retorno de lov de codigos consulta */
  fijarLovCodigosConsultaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cconsulta = reg.registro.cconsulta;
      this.registro.mdatos.ncodigoconsulta = reg.registro.nombre;
    }
  }

  /**Muestra lov de componentes de negocio */
  mostrarLovCompNegocio(): void {
    this.lovCompNegocio.showDialog();
  }

  /**Retorno de lov de componentes de negocio */
  fijarLovCompNegocioSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.ccomponente = reg.registro.ccomponente;
      this.registro.mdatos.ncomponente = reg.registro.nombre;
    }
  }

}
