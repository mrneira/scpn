import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovPeriodoComponent } from '../../../lov/periodo/componentes/lov.periodo.component';
import { LovDepartamentosComponent } from '../../../lov/departamentos/componentes/lov.departamentos.component';

@Component({
  selector: 'app-EvaluacionExterna',
  templateUrl: 'EvaluacionExterna.html'
})
export class EvaluacionExternaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;


  @ViewChild(LovPeriodoComponent)
  private lovPeriodo: LovPeriodoComponent;

  @ViewChild(LovDepartamentosComponent) 
  private lovDepartamentos: LovDepartamentosComponent;
  

  public ltipo: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthevaluacionexterna', 'EVALUACIONEXTERNA', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.mcampos.fechaactual = new Date();
    this.mcampos.fmin= new Date();
    this.mcampos.factiva= false;
  
}
validarFecha() {
  if (!this.estaVacio(this.registro.fdesde)) {
    this.mcampos.fmin = new Date(this.registro.fdesde);
    this.mcampos.fmin.setDate(this.mcampos.fmin.getDate()+1);
    this.mcampos.factiva= true;
  }
  this.registro.fhasta=null;
}

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.estaVacio(this.mcampos.cperiodo)) {
      this.mostrarMensajeError("ELIJA PRIMERO UN PERÍODO PARA REALIZAR LA ASIGNACIÓN");
      return;
    }
    super.crearNuevo();
    //this.registro.optlock = 0;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    this.registro.fingreso = this.fechaactual;
    this.registro.cperiodo = this.mcampos.cperiodo;
    this.registro.mdatos.nperiodo = this.mcampos.nperiodo;
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
    if (this.estaVacio(this.mcampos.cperiodo)) {
      this.mostrarMensajeError("ELIJA PRIMERO UN PERÍODO PARA REALIZAR LA ASIGNACIÓN");
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cexterna', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tthevaluacionperiodo','nombre','nperiodo','i.cperiodo = t.cperiodo');
   // consulta.addSubquery('tthdepartamento','nombre','ndepartamento','i.cdepartamento = t.cdepartamento');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
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
        this.mfiltros.cperiodo = reg.registro.cperiodo;
        this.registro.cperiodo = reg.registro.cperiodo;
        this.mcampos.nperiodo = reg.registro.nombre;
        this.mcampos.fdesde = reg.registro.fdesde;
        this.mcampos.fhasta = reg.registro.fhasta;
        this.registro.mdatos.nperiodo = reg.registro.nombre;
        this.consultar();
      }
    }
  
}
