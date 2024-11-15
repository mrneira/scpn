import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovCapacitacionComponent } from '../../../../../lov/capacitacion/componentes/lov.capacitacion.component';

import { LovFuncionariosComponent } from '../../../../../lov/funcionarios/componentes/lov.funcionarios.component';

@Component({
  selector: 'app-egreso',
  templateUrl: 'egreso.html'
})
export class EgresoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovCapacitacionComponent)
  private lovCapacitacion: LovCapacitacionComponent;

  @ViewChild(LovFuncionariosComponent)
  private lovFuncionarios: LovFuncionariosComponent;

  public ltipo: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tnomegreso', 'EGRESO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
   this.mcampos.total=0;
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.estaVacio(this.mcampos.crol)){
      this.mostrarMensajeError("ELIJA PRIMERO UNA ROL PARA MANTENIMIENTO");
      return;
    }
    super.crearNuevo();
    this.registro.crol= this.mcampos.crol;
    
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
    if (this.estaVacio(this.mcampos.crol)) {
      this.mostrarMensajeError('ELIJA UN ROL PARA REALIZAR EL MANTENIMIENTO');
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cegreso', this.mfiltros, this.mfiltrosesp);
   
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.crol = this.mcampos.crol;
      
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
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }
 
  
  mostrarLovFuncionario(): void {
    this.lovFuncionarios.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovFuncionarioSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cfuncionario = reg.registro.cfuncionario;
      this.registro.cfuncionario = reg.registro.cfuncionario;
      this.mcampos.nfuncionario = reg.registro.primernombre+ " "+ reg.registro.primerapellido;
      this.registro.mdatos.nnombre =  reg.registro.primernombre;
      this.registro.mdatos.napellido =reg.registro.primerapellido;
    }
  }



}
