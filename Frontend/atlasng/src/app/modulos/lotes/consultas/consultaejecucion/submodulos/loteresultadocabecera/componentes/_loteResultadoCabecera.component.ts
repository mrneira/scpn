import {Component, OnInit, AfterViewInit, ViewChild, EventEmitter, Output, Input} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../../../util/shared/componentes/base.component';

import {SelectItem} from 'primeng/primeng';

@Component({
  selector: 'app-lote-resultado-cabecera',
  templateUrl: '_loteResultadoCabecera.html'
})
export class LoteResultadoCabeceraComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  comboSelect: any;
  //  @Input() loteForModulo: any;
  //  @Input() fproceso: any;
  @Output() numeroejecucion = new EventEmitter();

  selected: any;

  constructor(router: Router, dtoServicios: DtoServicios) {// ya estan definidos los alias
    super(router, dtoServicios, 'TloteResultado', 'LOTECABECERA', false, true); // true cuendo es pk compuesto
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  crearNuevo() {// primero crea un registro
  }

  actualizar() { // Cuando doy confirmar se ejecuta
  }

  eliminar() {
  }

  cancelar() {
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.numeroejecucion desc', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TloteControlEjecucion', 'estatus', 'estatus', 'i.fproceso=t.fproceso and i.clote=t.clote and i.numeroejecucion=t.numeroejecucion');
    consulta.addSubquery('TgenModulo', 'nombre', 'nmodulo', 'i.cmodulo = t.cmodulo');
    
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
  seleccionaRegistro(evento: any) {
    this.numeroejecucion.emit({numeroejecucion: evento.data.numeroejecucion});
  }
}

