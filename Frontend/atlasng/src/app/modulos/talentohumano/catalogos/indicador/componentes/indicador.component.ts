import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { LovActividadComponent } from '../../../lov/actividad/componentes/lov.actividad.component';
import { retry } from 'rxjs/operator/retry';

@Component({
  selector: 'app-indicador',
  templateUrl: 'indicador.html'
})
export class IndicadorComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovActividadComponent)
  private lovActividad: LovActividadComponent;

  public ltipo: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthactividaindicador', 'ACTIVIDAD', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
     if (!this.validarActividad()){
    this.mostrarMensajeError("NO SE HA DEFINIDO UNA ACTIVIDAD");
      return;
    }
     super.crearNuevo();
    this.registro.cactividad = this.mcampos.cactividad;
     //this.registro.optlock = 0;
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
    if (this.registro.cactividad === null || this.registro.cactividad === undefined) {
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }
  validarActividad(): boolean {
    if (this.registro.cactividad === null || this.registro.cactividad === undefined) {
      return false;
    }
    return true;
  }
  public crearDtoConsulta(): Consulta {
   
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cacindicador', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tthactividad', 'nombre', 'anombre', ' t.cactividad=i.cactividad');

    
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return this.validarActividad();
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
  /**Muestra lov de personas */
  mostrarLovActividad(): void {
    this.lovActividad.showDialog();
    //this.lovPersonas.mfiltros.csocio = 1;
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }
  fijarLovActividadSelec(reg: any): void {
    if (reg.registro !== undefined) {

      this.registro.cactividad = reg.registro.cactividad;
      this.mcampos.cactividad = reg.registro.cactividad;
      this.registro.mdatos.anombre=reg.registro.nombre;
      this.mfiltros.cactividad = reg.registro.cactividad;

      this.consultar();
    }
  }
}
