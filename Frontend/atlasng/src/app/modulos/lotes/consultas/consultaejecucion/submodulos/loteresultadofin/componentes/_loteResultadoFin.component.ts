import {Component, OnInit, AfterViewInit, ViewChild, EventEmitter, Output, Input} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../../../util/shared/componentes/base.component';

import {SelectItem} from 'primeng/primeng';

@Component({
  selector: 'app-lote-resultado-fin',
  templateUrl: '_loteResultadoFin.html'
})
export class LoteResultadoFinComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  //  @Input() lote: any;


  constructor(router: Router, dtoServicios: DtoServicios) {// ya estan definidos los alias
    super(router, dtoServicios, 'TloteResultadoFin', 'LOTEFIN', false, true); // true cuendo es pk compuesto
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  crearNuevo() {// primero crea un registro
    //    super.crearNuevo();
  }

  actualizar() { // Cuando doy confirmar se ejecuta
    //    super.actualizar();
  }

  eliminar() {
    //    super.eliminar();
  }

  cancelar() {
    //    super.cancelar();
  }

  public selectRegistro(registro: any) {
    //    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', '', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenModulo', 'nombre', 'nmodulo', 'i.cmodulo = t.cmodulo');
    consulta.addSubquery('TloteTareas', 'nombre', 'ntarea', 'i.cmodulo = t.cmodulo and i.ctarea = t.ctarea');
    
    consulta.cantidad = 50;
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
  }

  public crearDtoMantenimiento() {
  }

  public postCommit(resp: any, dtoext = null) {
    super.postCommitEntityBean(resp, dtoext);
  }

  consultarCatalogos(): any {
  }

}

