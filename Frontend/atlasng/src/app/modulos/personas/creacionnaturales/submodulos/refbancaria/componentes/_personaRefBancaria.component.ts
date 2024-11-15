import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-persona-ref-bancaria',
  templateUrl: '_personaRefBancaria.html'
})
export class PersonaRefBancariaComponent extends BaseComponent implements OnInit, AfterViewInit {

  public linstfinanciera: SelectItem[] = [{ label: '...', value: null }];
  public lestado: SelectItem[] = [{ label: '...', value: null }];
  public ltipocuenta: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TperReferenciaBancaria', 'REFERENCIABANCARIA', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.verreg = 0;
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.registro.tipoinstitucionccatalogo = 305;
    this.registro.tipocuentaccatalogo = 306;
    this.registro.estado = "ACT";
    this.registro.cuentaprincipal = true;
  }

  actualizar() {
    this.encerarMensajes();
    super.actualizar();
  }

  eliminar() {
    this.mostrarMensajeError('NO PUED>E >ELIMINAR EL REGISTRO');
    this.mostrarDialogoGenerico = true;

  }

  cancelar() {
    this.encerarMensajes();
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (this.estaVacio(this.mfiltros.cpersona)) {
      super.mostrarMensajeError("PERSONA REQUERIDA");
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.veractual desc', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery("tgencatalogodetalle", "nombre", "tipoinstitucioncdetalle1", "t.tipoinstitucioncdetalle= i.cdetalle and t.tipoinstitucionccatalogo=i.ccatalogo");
    consulta.addSubquery("tgencatalogodetalle", "nombre", "tipocuentacdetalle1", "t.tipocuentacdetalle= i.cdetalle and t.tipocuentaccatalogo=i.ccatalogo");
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

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

}
