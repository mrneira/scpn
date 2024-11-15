
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { LovInversionesrvComponent } from '../../../../inversiones/lov/inversionesrv/componentes/lov.inversionesrv.component';

@Component({
  selector: 'app-ventaaccion',
  templateUrl: 'ventaaccion.html'
})
export class VentaaccionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovInversionesrvComponent)
  lovInversiones: LovInversionesrvComponent;

  public lbancos: SelectItem[] = [{ label: '...', value: null }];

  fecha = new Date();

  public edited = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tinvventaacciones', 'RENTAVARIABLE', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultar();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {

    super.crearNuevo();
    this.mcampos.ncodigotitulo = null;
    this.registro.estadoccatalogo = 1218;
    this.registro.estadocdetalle = 'PEN';
    this.registro.fingreso = this.fecha;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;

  }

  actualizar() {

    let lventaAcciones: number = 0;

    if (!this.estaVacio(this.registro.numeroacciones) && Number(this.registro.numeroacciones) != 0 &&
      !this.estaVacio(this.registro.preciounitarioaccion) && Number(this.registro.preciounitarioaccion) != 0) {
      lventaAcciones = Number(this.registro.numeroacciones) * Number(this.registro.preciounitarioaccion);
    }

    if (lventaAcciones <= 0) {
      this.mostrarMensajeError("EL VALOR A REGISTRAR DEBE SER POSITIVO");
      return;
    }

    this.encerarMensajes();

    super.actualizar();
    this.registro.mdatos.ncodigotitulo = this.mcampos.ncodigotitulo;

    if (!this.estaVacio(this.registro.numeroacciones) &&
      this.registro.numeroacciones != 0 &&
      !this.estaVacio(this.registro.preciounitarioaccion) &&
      this.registro.preciounitarioaccion != 0) {
      this.registro.montototal = this.registro.numeroacciones * this.registro.preciounitarioaccion;
      this.registro.montototal = Math.round(this.registro.montototal *100)/100; //CCA cambio venta acciones
    }
    else {
      this.registro.montototal = null;
    }

  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
    this.mcampos.ncodigotitulo = this.registro.mdatos.ncodigotitulo;


  }

  // Inicia CONSULTA *********************
  consultar() {
    if (!this.validaFiltrosConsulta()) {
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cinversion', {}, this.mfiltrosesp);
    consulta.addSubquery('tinvinversion', 'codigotitulo', 'ncodigotitulo', 'i.cinversion = t.cinversion');
   
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {

    this.mfiltrosesp.estadocdetalle = ' in (\'PEN\',\'DEV\')';
  }

  validaFiltrosConsulta(): boolean {
    return true;
   
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

  mostrarLovInversiones(): void {
   
    this.lovInversiones.mfiltros.estadocdetalle = 'APR';
    this.lovInversiones.showDialog();
  }

  fijarLovInversionesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cinversion = reg.registro.cinversion;

      this.mcampos.ncodigotitulo = reg.registro.codigotitulo;

    }
  }

}
