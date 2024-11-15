import { Component, OnInit, AfterViewInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';

import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-definicion-tareas',
  templateUrl: 'definicionTareas.html'
})
export class DefinicionTareasComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  
  public lmodulo: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {// ya estan definidos los alias
    super(router, dtoServicios, 'TloteTareas', 'LOTETAREAS', false, true); // true cuendo es pk compuesto
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {// primero crea un registro
    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.cmodulo = this.mfiltros.cmodulo;
  }

  actualizar() { // Cuando doy confirmar se ejecuta
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.cmodulo', this.mfiltros, this.mfiltrosesp);
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
    super.grabar(false);
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }
  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
    const consultaModulo = new Consulta('TgenModulo', 'Y', 't.nombre', {}, {});
    consultaModulo.cantidad = 100;
    this.addConsultaCatalogos('MODULO', consultaModulo, this.lmodulo, this.llenarModulo, 'cmodulo', this.componentehijo);
    this.ejecutarConsultaCatalogos();
  }
 public llenarModulo(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
   super.llenaListaCatalogo(pLista, pListaResp, campopk, false, componentehijo);
   componentehijo.mfiltros.cmodulo = pLista[0].value;
   componentehijo.consultar();
 }  
}
