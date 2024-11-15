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
    super(router, dtoServicios, 'tnomliquidaciondetalle', 'EGRESO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
  this.mfiltros.ingreso= false;
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.estaVacio(this.mcampos.cliquidacion)){
      this.mostrarMensajeError("ELIJA PRIMERO UNA LIQUIDACIÓN PARA MANTENIMIENTO");
      return;
    }
    super.crearNuevo();
    this.registro.crol= this.mcampos.crol;
    
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
    if (this.estaVacio(this.mcampos.cliquidacion)) {
      this.mostrarMensajeError('CREE UNA NUEVA LIQUIDACIÓN PARA REALIZAR EL MANTENIMIENTO');
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cliquidaciondetalle', this.mfiltros, this.mfiltrosesp);
    consulta.cantidad = 100;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.cliquidacion = this.mcampos.cliquidacion;
      
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    let totale=0;
    if (!this.estaVacio(resp.EGRESO) && resp.INGRESO.length>0) {
      for (const i in resp.EGRESO) {
       
          const reg = resp.EGRESO[i];
          totale = totale + reg.valor;
        
      }
      
    }
    this.mcampos.total = totale;
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
