import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-catalogoestadocash',
  templateUrl: 'catalogoestadocash.html'
})
export class CatalogoEstadoCashComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  public ltipodocumentocdetalle: SelectItem[] = [{ label: '...', value: null }];
  private catalogoDetalle: CatalogoDetalleComponent;
  secuenciaactual: number;
  duplicado = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ttesestadocash', 'CatalogoEstadoCash', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    //this.consultar();  // para ejecutar consultas automaticas.
    //this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.mostrarDialogoGenerico = true;
  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    this.encerarMensajes();
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
    this.mostrarDialogoGenerico = true;
    this.secuenciaactual = this.registro.secuenciaactual;
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cestado', this.mfiltros, this.mfiltrosesp);
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
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

  cerrarDialogo() {
  }


}
