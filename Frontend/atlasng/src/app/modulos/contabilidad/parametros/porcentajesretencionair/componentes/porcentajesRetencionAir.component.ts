import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovCuentasContablesComponent } from '../../../lov/cuentascontables/componentes/lov.cuentasContables.component';

@Component({
  selector: 'app-porcentajes-retencion-air',
  templateUrl: 'porcentajesRetencionAir.html'
})
export class PorcentajesRetencionAirComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(LovCuentasContablesComponent)
  lovCuentasContables: LovCuentasContablesComponent;

  @ViewChild('formFiltros') formFiltros: NgForm;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TconRetencionAir', 'PORCRETEN', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.estado = true;
    this.registro.porcentajemin = 0;
    this.registro.porcentajemax = 0;
  }

  actualizar() {
    if (this.registro.padre === undefined) {
      this.registro.padre = this.mfiltros.padre;
    }
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
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
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.codigosri', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('"tconcatalogo"', 'nombre', 'ccuentaContable', 'i.ccuenta = t.ccuenta');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
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
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
    this.ejecutarConsultaCatalogos();

  }

  /**Muestra lov de cuentas contables */
  mostrarlovcuentasContables(): void {
    this.lovCuentasContables.showDialog(true);
  }

  /**Retorno de lov de cuentas contables. */
  fijarLovCuentasContablesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.ccuenta = reg.registro.ccuenta;
      this.registro.mdatos.ccuentaContable = reg.registro.nombre;             
    }
  } 
}
