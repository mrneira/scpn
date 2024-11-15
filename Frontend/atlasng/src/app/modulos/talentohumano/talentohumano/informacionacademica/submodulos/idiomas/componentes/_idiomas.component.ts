import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { AccionesReporteComponent } from '../../../../../../../util/shared/componentes/accionesReporte.component';
import { LovPaisesComponent } from '../../../../../../generales/lov/paises/componentes/lov.paises.component';
import { LovIdiomasComponent } from '../../../../../../generales/lov/idiomas/componentes/lov.idiomas.component';
import { LovEstablecimientoComponent } from '../../../../../lov/establecimiento/componentes/lov.establecimiento.component';

import { SelectItem } from 'primeng/primeng';


@Component({
  selector: 'app-idiomas',
  templateUrl: '_idiomas.html'
})
export class IdiomasComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(LovPaisesComponent)
  private lovPaises: LovPaisesComponent;

  public ltipoEstablecimiento: SelectItem[] = [{ label: '...', value: null }];

  @ViewChild(LovIdiomasComponent)
  private lovIdiomas: LovIdiomasComponent;
  @ViewChild(LovEstablecimientoComponent)
  private lovEstablecimiento: LovEstablecimientoComponent;


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthidioma', 'IDIOMAS', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.estaVacio(this.mcampos.cfuncionario)) {
      this.mostrarMensajeError("SELECCIONE UN FUNCIONARIO PARA INGRESAR DATOS");
      return;
    }
    super.crearNuevo();
    this.registro.cfuncionario = this.mcampos.cfuncionario;
    this.registro.habla = 50;
    this.registro.lee = 50;
    this.registro.escribe = 50;
    this.registro.cpais = 'EC';
    this.registro.mdatos.npais = 'ECUADOR';
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
    if (this.estaVacio(this.mcampos.cfuncionario)){
      this.mostrarMensajeError("SELECCIONE UN FUNCIONARIO PARA MANTENIMIENTO");    
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cfuncionario', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenPais', 'nombre', 'npais', 'i.cpais = t.cpais');
    consulta.addSubquery('tgenidioma', 'nombre', 'nidioma', 'i.cidioma = t.cidioma');
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
  mostrarLovIdiomas(): void {
    this.lovIdiomas.showDialog();
  }

  /**Retorno de lov de paises. */
  fijarLovIdiomasSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cidioma = reg.registro.cidioma;
      this.registro.mdatos.nidioma = reg.registro.nombre;
    }
  }
  /**Muestra lov de paises */
  mostrarLovEstablecimiento(): void {
    this.lovEstablecimiento.mfiltros.idiomas = true;
    this.lovEstablecimiento.showDialog();
  }

  /**Retorno de lov de paises. */
  fijarLovEstablecimientoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cinstitucion = reg.registro.cinstitucion;
      this.registro.mdatos.ninstitucion = reg.registro.nombre;
    }
  }

}
