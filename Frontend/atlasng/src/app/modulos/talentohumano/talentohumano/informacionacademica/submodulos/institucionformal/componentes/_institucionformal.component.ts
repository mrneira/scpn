import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta, Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { LovPaisesComponent } from '../../../../../../generales/lov/paises/componentes/lov.paises.component';
import { LovEstablecimientoComponent } from              '../../../../../lov/establecimiento/componentes/lov.establecimiento.component';
import { LovTituloComponent } from              '../../../../../lov/titulo/componentes/lov.titulo.component';

@Component({
  selector: 'app-institucionformal',
  templateUrl: '_institucionFormal.html'
})
export class InstitucionFormalComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(LovPaisesComponent)
  private lovPaises: LovPaisesComponent;
  
  @ViewChild(LovTituloComponent)
  private lovTitulo: LovTituloComponent;
  
  @ViewChild(LovEstablecimientoComponent)
  private lovEstablecimiento: LovEstablecimientoComponent;
  

  public ltipoEstablecimiento: SelectItem[] = [{label: '...', value: null}];
  public ltipoNivelAcademico: SelectItem[] = [{label: '...', value: null}];
  public lespecialidad: SelectItem[] = [{label: '...', value: null}];


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthestudioformal', 'ESTUDIOFORMAL', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.estaVacio(this.mcampos.cfuncionario)){
      this.mostrarMensajeError("SELECCIONE UN FUNCIONARIO PARA INGRESAR DATOS");    
      return;
    }
    super.crearNuevo();
    this.registro.cfuncionario= this.mcampos.cfuncionario;
   
    this.registro.nivelacademicoccatalogo=1106;
    this.registro.establecimientoccatalogo=1101;
  }

  mostrarLovTitulo(){
    this.lovTitulo.showDialog();
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

  public crearDtoConsulta(): Consulta {

    const consulta = new Consulta(this.entityBean, 'Y', 't.secuencia', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'nnivelacademico', 'i.ccatalogo = t.nivelacademicoccatalogo and i.cdetalle = t.nivelacademicocdetalle');
    consulta.addSubquery('tthinstitucioneducativa', 'nombre', 'ninstitucion', 'i.cinstitucion = t.cinstitucion');
    
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


  /**Muestra lov de paises */
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

  
  /**Muestra lov de paises */
  mostrarLovEstablecimiento(): void {
    if(this.estaVacio(this.registro.nivelacademicocdetalle)){
      this.mostrarMensajeInfo("SELECCIONE UN NIVEL ACADEMICO");
      return;
    }
    this.lovEstablecimiento.mfiltros.estudioformal= true;
    this.lovEstablecimiento.mfiltros.nivelcdetalle=this.registro.nivelacademicocdetalle;
    this.lovEstablecimiento.showDialog();
  }

  validarAnio(reg:any):void{
    var fechaNow = new Date(Date.now());
    let year =fechaNow.getFullYear();
    if(Number(reg.anio)>year || Number(reg.anio)<1900){
      reg.anio=""
    }
  }
  /**Retorno de lov de paises. */
  fijarLovEstablecimientoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cinstitucion = reg.registro.cinstitucion;
      this.registro.mdatos.ninstitucion = reg.registro.nombre;
   }
  }
  fijarLovTitulo(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.titulo = reg.registro.nombre;
      
   }
  }


  }
