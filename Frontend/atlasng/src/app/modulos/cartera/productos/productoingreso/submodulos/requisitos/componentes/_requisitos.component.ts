import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta, Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovRequisitosComponent } from '../../../../../lov/requisitos/componentes/lov.requisitos.component';


@Component({
  selector: 'app-requisitos',
  templateUrl: '_requisitos.html'
})
export class RequisitosComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovRequisitosComponent)
  private lovrequisitos: LovRequisitosComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarProductoRequisitos', 'PRODUCTOREQUISITO', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();

  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (!this.validaFiltrosRequeridos()) {
      return;
    }
    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.verreg = 0;
    this.registro.activo = false;
    this.registro.opcional = false;
    this.registro.cmodulo = 7;
    this.registro.cproducto = this.mfiltros.cproducto;
    this.registro.ctipoproducto = this.mfiltros.ctipoproducto;
  }

  actualizar() {
    if (!this.validaDatosRegistro(this.registro)) {
      this.mostrarMensajeWarn("EXISTEN DATOS DUPLICADOS");
      return;
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
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (!this.validaFiltrosRequeridos()) {
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public consultarAnterior() {
    if (!this.validaFiltrosRequeridos()) {
      return;
    }
    super.consultarAnterior();
  }

  public consultarSiguiente() {
    if (!this.validaFiltrosRequeridos()) {
      return;
    }
    super.consultarSiguiente();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.orden', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TcarRequisitos', 'nombre', 'nombre', 'i.crequisito = t.crequisito');
    consulta.cantidad = 100;
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
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

  /**Muestra lov de requisitos */
  mostrarlovrequisitos(): void {
    this.lovrequisitos.showDialog();
  }


  /**Retorno de lov de requisitos. */
  fijarLovRequisitosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.nombre = reg.registro.nombre;
      this.registro.crequisito = reg.registro.crequisito;

    }
  }

  validaDatosRegistro(reg: any): boolean {
    super.encerarMensajes();
    const existeOrden = this.lregistros.find(x => Number(x.orden) === Number(reg.orden) && Number(x.idreg) !== Number(reg.idreg));

    if (!this.estaVacio(existeOrden)) {
      return false;
    }
    return true;
  }

}
