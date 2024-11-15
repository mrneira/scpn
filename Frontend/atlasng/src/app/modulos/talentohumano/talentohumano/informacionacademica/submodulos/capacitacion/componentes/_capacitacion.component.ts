import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta, Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovPaisesComponent } from '../../../../../../generales/lov/paises/componentes/lov.paises.component';
@Component({
  selector: 'app-capacitacion',
  templateUrl: '_capacitacion.html'
})
export class CapacitacionComponent extends BaseComponent implements OnInit, AfterViewInit {



  @ViewChild(LovPaisesComponent)
  private lovPaises: LovPaisesComponent;
  public lmodalidad: SelectItem[] = [{ label: '...', value: null }];
  public ltipo: SelectItem[] = [{ label: '...', value: null }];


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthfuncionariocapacitacion', 'CAPACITACION', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.fechaactual = new Date();
    this.mcampos.fmin= new Date();
    this.mcampos.factiva= false;
  }
  validarFecha() {
    if (!this.estaVacio(this.registro.finicio)) {
      this.mcampos.fmin = new Date(this.registro.finicio);
      this.mcampos.fmin.setDate(this.mcampos.fmin.getDate()+1);
      this.mcampos.factiva= true;
    }
    this.registro.ffin=null;
  }

  ngAfterViewInit() {
  }
  mostrarLovPaises(): void {
    this.lovPaises.showDialog();
  }

  /**Retorno de lov de paises. */
  fijarLovPaisesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cpais = reg.registro.cpais;
      this.registro.mdatos.npais = reg.registro.nombre;
    }
  }
  crearNuevo() {
    if (this.estaVacio(this.mcampos.cfuncionario)){
      this.mostrarMensajeError("SELECCIONE UN FUNCIONARIO PARA INGRESAR DATOS");    
      return;
    }
    super.crearNuevo();
    this.registro.cfuncionario= this.mcampos.cfuncionario;
    this.registro.tipoccatalogo = 1103;
    this.registro.modalidadccatalogo = 1118;
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
       var fecha = new Date(this.registro.finicio);
    this.registro.finicio=new Date(fecha.getFullYear(),fecha.getMonth(),fecha.getDay());
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

  public crearDtoConsulta(): Consulta {

    const consulta = new Consulta(this.entityBean, 'Y', 't.cfcapacitacion', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'ntipo', 'i.ccatalogo = t.tipoccatalogo and i.cdetalle = t.tipocdetalle');
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'nmodalidad', 'i.ccatalogo = t.modalidadccatalogo and i.cdetalle = t.modalidadcdetalle');
    consulta.addSubquery('TgenPais', 'nombre', 'npais', 'i.cpais = t.cpais');
 
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

}
