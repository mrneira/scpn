import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { LovCodigosConsultaComponent } from '../../lov/codigosconsulta/componentes/lov.codigosConsulta.component';
import { LovTransaccionesComponent } from '../../lov/transacciones/componentes/lov.transacciones.component';

@Component({
  selector: 'app-tran-consulta',
  templateUrl: '_transaccionesConsulta.html'
})
export class TransaccionesConsultaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild('lovcodconsultatransacciones')
  private lovCodConsulta: LovCodigosConsultaComponent;

  @ViewChild(LovTransaccionesComponent)
  private lovtransacciones: LovTransaccionesComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TgenCompConsulta', 'TRANSXCOMP', false);
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.cmodulo, t.ctransaccion', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenCompCodigo', 'nombre', 'ncodigoconsulta', 'i.cconsulta = t.cconsulta and i.ccanal = t.ccanal');
    consulta.addSubquery('TgenTransaccion', 'nombre', 'ntransaccion', 'i.cmodulo = t.cmodulo and i.ctransaccion = t.ctransaccion');
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

  /**Muestra lov de transacciones */
  mostrarLovTransacciones(): void {
    this.lovtransacciones.showDialog();
  }

  /**Retorno de lov de transacciones. */
  fijarLovTransaccionesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.nmodulo = reg.registro.mdatos.nmodulo;
      this.registro.mdatos.ntransaccion = reg.registro.nombre;
      this.registro.cmodulo = reg.registro.cmodulo;
      this.registro.ctransaccion = reg.registro.ctransaccion;
    }
  }

}
