import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovSaldoComponent } from '../../../../monetario/lov/saldo/componentes/lov.saldo.component';

@Component({
  selector: 'app-tipo-seguro',
  templateUrl: 'tipoSeguro.html'
})
export class TipoSeguroComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovSaldoComponent)
  private lovsaldo: LovSaldoComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TsgsTipoSeguroDetalle', 'TIPOSEGURODETALLE', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.verreg = 0;
    this.registro.optlock = 0;
  }

  actualizar() {
    if (this.mcampos.valorseguro === "true") {
      this.registro.seguroprendario = true;
      this.registro.segurohipotecario = false;
    } else {
      this.registro.seguroprendario = false;
      this.registro.segurohipotecario = true;
    }

    super.actualizar();
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    if (registro.seguroprendario) {
      this.mcampos.valorseguro = "true";
    } else {
      this.mcampos.valorseguro = "false";
    }
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.nombre', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TmonSaldo', 'nombre', 'nsaldo', 'i.csaldo = t.csaldo');
    consulta.addSubquery('TmonSaldo', 'nombre', 'nsaldocxc', 'i.csaldo = t.csaldocxc');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
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

    if (resp.cod === "OK") {
      this.enproceso = false;
      this.consultar();
    }
  }
  // Fin MANTENIMIENTO *********************

  /**Muestra lov de saldo */
  mostrarlovsaldo(): void {
    this.lovsaldo.mfiltros.cmodulo = sessionStorage.getItem('m');
    this.lovsaldo.mfiltros.ctiposaldo = 'SEG';
    this.lovsaldo.consultar();
    this.lovsaldo.showDialog();
  }

  /**Retorno de lov de saldo. */
  fijarLovSaldoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.nsaldo = reg.registro.nombre;
      this.registro.csaldo = reg.registro.csaldo;
    }
  }

  /**Muestra lov de saldo */
  mostrarlovsaldoCxC(): void {
    this.lovsaldo.mfiltros.cmodulo = sessionStorage.getItem('m');
    this.lovsaldo.mfiltros.ctiposaldo = 'CXC';
    this.lovsaldo.consultar();
    this.lovsaldo.showDialog();
  }

  /**Retorno de lov de saldo. */
  fijarLovSaldoSelecCxC(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.nsaldocxc = reg.registro.nombre;
      this.registro.csaldocxc = reg.registro.csaldo;
    }
  }

}
