import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { AccionesReporteComponent } from '../../../../../../../util/shared/componentes/accionesReporte.component';
import { SelectItem } from 'primeng/primeng';


import { LovPeriodoComponent } from '../../../../../lov/periodo/componentes/lov.periodo.component';
import { LovFuncionariosEvaluadosComponent } from '../../../../../lov/evaluados/componentes/lov.funcionarios.component';

@Component({
  selector: 'app-cabecera',
  templateUrl: 'cabecera.html'
})
export class CabeceraComponent extends BaseComponent implements OnInit, AfterViewInit {


  @ViewChild(LovPeriodoComponent)
  private lovPeriodo: LovPeriodoComponent;

  @ViewChild(LovFuncionariosEvaluadosComponent)
  private lovFuncionariosEval: LovFuncionariosEvaluadosComponent;
  public lparametro: any = [];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthasignacionresp', 'EVALUACION', true, true);
    this.componentehijo = this;
  }
  public cinfoempresa :any = [];
  public cversion :any = [];
  public nuevo = true;
  public periodoprueba = true;
  ngOnInit() {
    super.init();
  }

  ngAfterViewInit() {
  }
  
  crearNuevo() {
    super.crearNuevo();

    this.registro.optlock = 0;

    this.registro.calificacion = 0;
    this.registro.fingreso = this.fechaactual;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    this.registro.finalizada = false;
    this.registro.calidadoportunidad = 0;
    this.registro.conocimientoespecifico = 0;
    this.registro.competenciatecnica=0;
    this.registro.competenciaconductual=0;
    this.registro.sancionesadministrativas=0;
    this.registro.calificacion=0;
   
    this.registro.periodoprueba=this.mcampos.periodoprueba;

  }
  crearNuevoRegistro() {
    

    this.registro.optlock = 0;

    this.registro.calificacion = 0;
    this.registro.fingreso = this.fechaactual;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    this.registro.finalizada = false;
    this.registro.calidadoportunidad = 0;
    this.registro.conocimientoespecifico = 0;
    this.registro.competenciatecnica=0;
    this.registro.competenciaconductual=0;
    this.registro.sancionesadministrativas=0;
    this.registro.calificacion=0;
    this.registro.calidadoportunidad=0;
    this.registro.pcalidadoportunidad=0;
    this.registro.conocimientoespecifico=0;
    
    this.registro.pconocimientoespecifico=0;
    this.registro.competenciatecnica=0;
    this.registro.pcompetenciatecnica=0;
    this.registro.pcompetenciaconductual=0;
    this.registro.competenciaconductual=0;
    this.registro.psancionesadministrativas=0;
    this.registro.sancionesadministrativas=0;
    this.registro.promedio=0;
    this.registro.direstado=false;
    this.registro.diraprobado=false;
    let param =this.cinfoempresa[0].value;
    if(this.estaVacio(param)){
      super.mostrarMensajeError("NO SE HA DEFINIDO UNA EMPRESA");
    return;
    }
    let param2 =this.cversion[0].value;
    if(this.estaVacio(param2)){
      super.mostrarMensajeError("NO SE HA DEFINIDO UNA VERSIÓN PARA LA EVALUACIÓN");
      return;
    }
    this.registro.cinfoempresa= param;
    this.registro.cversion= param2;

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
    const consulta = new Consulta(this.entityBean, 'Y', 't.cevaluacion', this.mfiltros, this.mfiltrosesp);
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
    this.actualizar();
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
  /**Muestra lov de periodos */
  mostrarLovPeriodo(): void {
    this.lovPeriodo.showDialog();
  }
  /**Retorno de lov de Periodo. */
  fijarLovPeriodoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cperiodo = reg.registro.cperiodo;
      this.registro.cperiodo = reg.registro.cperiodo;
      this.mcampos.nperiodo = reg.registro.nombre;
      this.mcampos.fdesde = reg.registro.fdesde;
      this.mcampos.fhasta = reg.registro.fhasta;
    }
  }
  validaGrabar() {
    return super.validaGrabar('NO HA REALIZADADO LA VALIDACIÓN DEL FORMULARIO[DATOS EVALUACIÓN]');
  }
  /**Muestra lov de funcionarios evaluados */

  /**Retorno de lov de funcionarios. */



}
