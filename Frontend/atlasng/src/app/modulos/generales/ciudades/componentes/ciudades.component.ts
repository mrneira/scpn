import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { LovPaisesComponent } from '../../../generales/lov/paises/componentes/lov.paises.component';
import { LovProvinciasComponent } from '../../../generales/lov/provincias/componentes/lov.provincias.component';
import { LovCantonesComponent } from '../../../generales/lov/cantones/componentes/lov.cantones.component';


@Component({
  selector: 'app-ciudades',
  templateUrl: 'ciudades.html'
})
export class CiudadesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPaisesComponent)
  private lovPaises: LovPaisesComponent;

  @ViewChild(LovProvinciasComponent)
  private lovProvincias: LovProvinciasComponent;

  @ViewChild(LovCantonesComponent)
  private lovCantones: LovCantonesComponent;


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TgenCiudad', 'CIUDAD', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (!this.validaFiltrosConsulta()) {
      return;
    }
    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.cpais = this.mfiltros.cpais;
    this.registro.cpprovincia = this.mfiltros.cpprovincia;
    this.registro.ccanton = this.mfiltros.ccanton;
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
    if (this.estaVacio(this.mfiltros.cpais)) {
      this.mostrarMensajeError('PAÍS REQUERIDO');
      return;
    }
    if (this.estaVacio(this.mfiltros.cpprovincia)) {
      this.mostrarMensajeError('PROVINCIA REQUERIDA');
      return;
    }
    if (this.estaVacio(this.mfiltros.ccanton)) {
      this.mostrarMensajeError('CANTÓN REQUERIDO');
      return;
    }
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
    this.lovPaises.mfiltros.cpais='EC';
    this.lovPaises.consultar();
    this.lovPaises.showDialog();

  }

  /**Retorno de lov de paises. */
  fijarLovPaisesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.cpais = reg.registro.cpais;
      this.mcampos.npais = reg.registro.nombre;

      this.mfiltros.cpprovincia = null;
      this.mcampos.nprovincia = null;
      this.mfiltros.ccanton = null;
       this.mcampos.ncanton = null;
    }
      this.mostrarLovProvincias();
  }

  /**Muestra lov de provincias */
  mostrarLovProvincias(): void {
    if (this.estaVacio(this.mfiltros.cpais)) {
      this.mostrarMensajeError('PAÍS REQUERIDO');
      return;
    }
    this.lovProvincias.mfiltros.cpais = this.mfiltros.cpais;
    this.lovProvincias.consultar();
    this.lovProvincias.showDialog();
  }

  /**Retorno de lov de provincias. */
  fijarLovProvinciasSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.cpprovincia = reg.registro.cpprovincia;
      this.mcampos.nprovincia = reg.registro.nombre;

      this.mfiltros.ccanton = null;
       this.mcampos.ncanton = null;
    }
      this.mostrarLovCantones();
  }

  /**Muestra lov de cantones */
  mostrarLovCantones(): void {
    if (this.estaVacio(this.mfiltros.cpais)) {
      this.mostrarMensajeError('PAÍS REQUERIDO');
      return;
    }
    if (this.estaVacio(this.mfiltros.cpprovincia)) {
      this.mostrarMensajeError('PROVINCIA REQUERIDO');
      return;
    }
    this.lovCantones.mfiltros.cpais = this.mfiltros.cpais;
    this.lovCantones.mfiltros.cpprovincia = this.mfiltros.cpprovincia;
    this.lovCantones.consultar();
    this.lovCantones.showDialog();
  }

  /**Retorno de lov de cantones. */
  fijarLovCantonesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.ccanton = reg.registro.ccanton;
      this.mcampos.ncanton = reg.registro.nombre;

      this.consultar();
    }

  }

}
