import {Component, OnInit, AfterViewInit, ViewChild, EventEmitter, Output, Input} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../../../util/shared/componentes/base.component';

import {SelectItem} from 'primeng/primeng';
import {LovTransaccionesComponent} from '../../../../../../generales/lov/transacciones/componentes/lov.transacciones.component';

@Component({
  selector: 'app-transacciones-ejecucion',
  templateUrl: '_transaccionesEjecucion.html'
})
export class TransaccionesEjecucionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovTransaccionesComponent)
  lovTransaccionesComponent: LovTransaccionesComponent;

  cmodulo: string;
  ctransaccion: string;


  constructor(router: Router, dtoServicios: DtoServicios) {// ya estan definidos los alias
    super(router, dtoServicios, 'TloteTransaccion', 'LOTETRANSACCION', false, true); // true cuendo es pk compuesto
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  crearNuevo() {// primero crea un registro
    super.crearNuevo();
    this.registro.activo = 1;
    this.registro.clote = this.mfiltros.clote;
  }

  actualizar() { // Cuando doy confirmar se ejecuta
    this.registro.cmodulo = this.cmodulo;
    this.registro.ctransaccion = this.ctransaccion;
    this.actualizarActivo();
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    this.actualizarActivo();
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    this.setActivo(registro);
    this.cmodulo = registro.cmodulo;
    this.ctransaccion = registro.ctransaccion;
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.ctransaccion', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenTransaccion', 'nombre', 'ntransaccion', 'i.ctransaccion = t.ctransaccion and i.cmodulo = t.cmodulo');
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

  /**Muestra lov de transacciones */
  mostrarLovTransacciones(): void {
    this.lovTransaccionesComponent.showDialog();
  }
  /**Retorno de lov de transacciones. */
  fijarLovTransaccionesSelect(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.ntransaccion = reg.registro.nombre;
      this.cmodulo = reg.registro.cmodulo;
      this.ctransaccion = reg.registro.ctransaccion;
    }
  }
  actualizarActivo() {
    if (this.registro.activo) {
      this.registro.activo = '1';
    } else {
      this.registro.activo = '0';
    }
  }
  setActivo(registro: any) {
    if (registro.activo === true || registro.activo === false) {
      return;
    }

    if (registro.activo === undefined || registro.activo !== '1') {
      registro.activo = false;
    } else {
      registro.activo = true;
    }
  }
}

