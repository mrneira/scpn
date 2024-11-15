import { Component, OnInit, AfterViewInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';

import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-definicion-predecesoras',
  templateUrl: 'definicionPredecesoras.html'
})
export class DefinicionPredeComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  
  public llote: SelectItem[] = [{label: '...', value: null}];
  
  public lpredecesora: SelectItem[] = [{label: '...', value: null}];
  
  

  constructor(router: Router, dtoServicios: DtoServicios) {// ya estan definidos los alias
    super(router, dtoServicios, 'tlotepredecesora', 'LOTEPRECECESORA', false, true); // true cuendo es pk compuesto
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {// primero crea un registro
    if(this.estaVacio(this.mfiltros.clote)){
      super.mostrarMensajeError("SELECCIONE UN LOTE PARA DEFINIR SUS PREDECESORAS");
      return;
    }
    super.crearNuevo();
    this.registro.activa = true;
    this.registro.clote=this.mfiltros.clote;
    
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.orden', this.mfiltros, this.mfiltrosesp);
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

  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }
  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

   
    const consultaLote = new Consulta('tlotecodigo', 'Y', 't.clote', {}, {});
    consultaLote.cantidad = 100;
    this.addConsultaCatalogos('LOTE', consultaLote, this.llote, super.llenaListaCatalogo, 'clote');

   
    const consultaPredecesora = new Consulta('tlotecodigo', 'Y', 't.clote', {}, {});
    consultaPredecesora.cantidad = 100;
    this.addConsultaCatalogos('PREDECESORA', consultaPredecesora, this.lpredecesora, super.llenaListaCatalogo, 'clote');

    this.ejecutarConsultaCatalogos();
  }
 
}
