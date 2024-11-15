import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { LovPaisesComponent } from '../../../generales/lov/paises/componentes/lov.paises.component';


@Component({
  selector: 'app-provincias',
  templateUrl: 'provincias.html'
})
export class ProvinciasComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

   @ViewChild(LovPaisesComponent)
  private lovPaises: LovPaisesComponent;


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TgenProvincia', 'PROVINCIA', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.estaVacio(this.mfiltros.cpais)) {
      this.mostrarMensajeError('PAÍS REQUERIDO');
      return;
    }
    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.cpais = this.mfiltros.cpais;
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.nombre', this.mfiltros, this.mfiltrosesp);
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
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

  /**Muestra lov de paises */
  mostrarLovPaises(): void {
    this.lovPaises.mfiltros.cpais = 'EC';
    this.lovPaises.consultar();
    this.lovPaises.showDialog();
  }

  /**Retorno de lov de paises. */
  fijarLovPaisesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.cpais = reg.registro.cpais;
      this.mcampos.npais = reg.registro.nombre;

      this.consultar();
    }
  }

}
