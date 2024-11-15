import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../../util/shared/componentes/base.component';
import { AccionesReporteComponent } from '../../../../../../../../util/shared/componentes/accionesReporte.component';
import { SelectItem } from 'primeng/primeng';

import { LovFuncionariosComponent } from '../../../../../../lov/funcionarios/componentes/lov.funcionarios.component';

@Component({
  selector: 'app-quejasciudadano',
  templateUrl: 'quejasciudadano.html'
})
export class QuejasciudadanoComponent extends BaseComponent implements OnInit, AfterViewInit {


  @ViewChild(LovFuncionariosComponent)
  private lovFuncionarios: LovFuncionariosComponent;

  public ldetreza: SelectItem[] = [{ label: '...', value: null }];

  @Output() calcularTotalesQuejas = new EventEmitter();

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthevaluacionquejasciudadano', 'QUEJASCI', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    
    if(this.estaVacio(this.mcampos.cevaluacion)){
      super.mostrarMensajeError("NO SE HA DEFINIDO UNA EVALUACIÓN");
      return;
    }
    super.crearNuevo();
    this.registro.cevaluacion = this.mcampos.cevaluacion;

  }
  agregarlinea() {
    
    if(this.estaVacio(this.mcampos.cevaluacion)){
      super.mostrarMensajeError("NO SE HA DEFINIDO UNA EVALUACIÓN");
      return;
    }
    super.crearnuevoRegistro();
    this.registro.cevaluacion = this.mcampos.cevaluacion;

    this.actualizar();
  }
  actualizar() {
    super.actualizar();
this.actualizarQuejas();
  }

  eliminar() {
    super.eliminar();
    this.actualizarQuejas();
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
  }klm

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.secuencia', this.mfiltros, this.mfiltrosesp);
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
     return super.validaFiltrosRequeridos();
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

  mostrarLovFuncionario(): void {
    this.lovFuncionarios.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovFuncionarioSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.sancionadocfuncionario = reg.registro.cfuncionario;
      this.mcampos.cfuncionario = reg.registro.cfuncionario;
      this.mcampos.nombre = reg.registro.primernombre + " " + reg.registro.primerapellido;
      this.registro.nombre = this.mcampos.nombre;
    }
  }

  actualizarQuejas() {
    let totalquejas = 0;
    let valor = -4;
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        if (reg.aplicadescuento !== undefined && reg.aplicadescuento !== null) {
          if (reg.aplicadescuento == true) {
            totalquejas += valor;
          this.lregistros[Number(i)].porcentaje=-4;
          }else{
            this.lregistros[Number(i)].porcentaje=0;
          }
        }
      }
    }
    
    this.mcampos.total = totalquejas;
    this.calcularTotalesQuejas.emit();
  }
}
