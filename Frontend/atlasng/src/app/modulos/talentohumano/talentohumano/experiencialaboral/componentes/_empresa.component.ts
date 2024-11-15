import { Component, OnInit, AfterViewInit, ViewChild,Output,EventEmitter } from '@angular/core';

import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta, Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-empresa',
  templateUrl: '_empresa.html'
})
export class EmpresaComponent extends BaseComponent implements OnInit, AfterViewInit {


  @Output() eventoReferencia = new EventEmitter();

public mostrarExperiencia: boolean;
public codigoexperiencia=0;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthexperiencialaboral', 'EMPRESA', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.fechaactual = new Date();
    this.mcampos.fmin = new Date();
  
  }

  ngAfterViewInit() {
  }
  validarFecha() {
    if (!this.estaVacio(this.registro.fingreso)) {
      this.mcampos.fmin = new Date(this.registro.fingreso);
      this.mcampos.fmin.setDate(this.mcampos.fmin.getDate()+1);
      
    }
    this.registro.fechafin=null;
  }
  
 
  crearNuevo() {
    if (this.estaVacio(this.mcampos.cfuncionario)) {
      this.mostrarMensajeInfo("SELECCIONE UN FUNCIONARO PARA INGRESAR DATOS");
      return;
    }
    super.crearNuevo();

  }

  actualizar() {
    super.actualizar();
    this.encerarMensajes();

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
    if (this.estaVacio(this.mcampos.cfuncionario)){
      this.mostrarMensajeError("SELECCIONE UN FUNCIONARIO PARA MANTENIMIENTO");    
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }
  seleccionaRegistro(evento: any) {
    this.eventoReferencia.emit({ registro: evento.data });
  }
  public crearDtoConsulta(): Consulta {
    const consulta = new Consulta(this.entityBean, 'Y', 't.cexperiencia', this.mfiltros, this.mfiltrosesp);

    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {

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

  consultarReferencia(evento: any) {
   this.eventoReferencia.emit({ registro: evento.data });

  }
  validaFiltrosConsulta(): boolean {
    return true;
  }

}
