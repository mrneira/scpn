import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovCapacitacionComponent } from '../../../lov/capacitacion/componentes/lov.capacitacion.component';

import { LovFuncionariosComponent } from '../../../lov/funcionarios/componentes/lov.funcionarios.component';

import { CapacitacionEventoComponent } from "../submodulos/cabecera/componentes/capacitacioncab.component";
import { CapacitacionDetalleComponent } from "../submodulos/detalle/componentes/capacitaciondet.component";

@Component({
  selector: 'app-capacitacion',
  templateUrl: 'capacitacion.html'
})
export class CapacitacionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovCapacitacionComponent)
  private lovCapacitacion: LovCapacitacionComponent;


  @ViewChild(CapacitacionEventoComponent)
  private tablaCabecera: CapacitacionEventoComponent;

  @ViewChild(CapacitacionDetalleComponent)
  private tablaDetalle: CapacitacionDetalleComponent;

  @ViewChild(LovFuncionariosComponent)
  private lovFuncionarios: LovFuncionariosComponent;

  public ltipo: SelectItem[] = [{ label: '...', value: null }];
  public nuevo = true;


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CAPACITACIONDATOS', false);
  }



  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
    this.tablaDetalle.ins=true;
    this.tablaDetalle.del=true;
    this.tablaDetalle.editable=true;
    
    
  }

  ngAfterViewInit() {
  }

  crearNuevo() {

  }

  actualizar() {
  }

  eliminar() {
  }

  cancelar() {
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (this.estaVacio(this.mcampos.cinstruccion)) {
      this.mostrarMensajeError('ELIJA UNA CAPACITACIÓN PARA REALIZAR EL MANTENIMIENTO');
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();

    const consCabecera = this.tablaCabecera.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaCabecera.alias, consCabecera);

    const consDetalle = this.tablaDetalle.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaDetalle.alias, consDetalle);
  }
  private fijarFiltrosConsulta() {
    this.tablaCabecera.mfiltros.cinstruccion = this.mcampos.cinstruccion;
    this.tablaDetalle.mfiltros.cinstruccion = this.mcampos.cinstruccion;
  }

  validaFiltrosConsulta(): boolean {
    return (
      this.tablaCabecera.validaFiltrosRequeridos() &&
      this.tablaDetalle.validaFiltrosRequeridos());
  }


  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.tablaCabecera.postQuery(resp);
    this.tablaDetalle.postQuery(resp);
    this.nuevo = false;
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    
      this.lmantenimiento = []; // Encerar Mantenimiento
      this.crearDtoMantenimiento();
      if (this.nuevo) {
        this.tablaCabecera.selectRegistro(this.tablaCabecera.registro);
        this.tablaCabecera.actualizar();
        this.tablaCabecera.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
        this.tablaCabecera.registro.fingreso = this.fechaactual;
      } else {
        this.tablaCabecera.registro.actualizar = true;
        this.tablaCabecera.registro.cusuariomod = this.dtoServicios.mradicacion.cusuario;
        this.tablaCabecera.registro.fmodificacion = this.fechaactual;
      }
      super.addMantenimientoPorAlias(this.tablaCabecera.alias, this.tablaCabecera.getMantenimiento(1));
      super.addMantenimientoPorAlias(this.tablaDetalle.alias, this.tablaDetalle.getMantenimiento(2));
      super.grabar();
    }
  

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {

    if (resp.cod === 'OK') {
      this.grabo = true;
       this.tablaCabecera.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaCabecera.alias));
      this.tablaDetalle.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaDetalle.alias));
    }
   
    if (!this.estaVacio(resp.CAPACITACIÓN)) {
      this.mcampos.cinstruccion = resp.EVALUACION[0].cinstruccion;
      this.mcampos.ncapacitacion = this.registro.nombre;
      this.nuevo = false;
      this.tablaCabecera.mcampos.cinstruccion = this.mcampos.cinstruccion;
      this.tablaDetalle.mcampos.cinstruccion = this.mcampos.cinstruccion;
     
    }
  }

  mostrarLovCapacitacion(): void {
    this.lovCapacitacion.showDialog();
  }

  /**Retorno de lov de paises. */
  fijarLovCapacitacionSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cinstruccion = reg.registro.cinstruccion;
      this.mcampos.ncapacitacion = reg.registro.nombre;
      this.registro.cinstruccion = reg.registro.cinstruccion;
      this.tablaCabecera.mcampos.cinstruccion = reg.registro.cinstruccion;
      this.tablaDetalle.mcampos.cinstruccion = reg.registro.cinstruccion;

      this.consultar();
    }
  }
  mostrarLovFuncionario(): void {
    this.lovFuncionarios.showDialog();
  }

  validaGrabar() {
    return this.tablaCabecera.validaGrabar()
  }
  /**Retorno de lov de personas. */
  fijarLovFuncionarioSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cfuncionario = reg.registro.cfuncionario;
      this.registro.cfuncionario = reg.registro.cfuncionario;
      this.mcampos.nfuncionario = reg.registro.primernombre + " " + reg.registro.primerapellido;
      this.registro.mdatos.nnombre = reg.registro.primernombre;
      this.registro.mdatos.napellido = reg.registro.primerapellido;
    }
  }



}
