import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';

@Component({
  selector: 'app-datos-operacion',
  templateUrl: '_datosOperacion.html'
})
export class DatosOperacionComponent extends BaseComponent implements OnInit, AfterViewInit {

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarOperacion', 'OPERACIONCARTERA', true);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init();
    this.mcampos.camposfecha.faprobacion = null;
    this.mcampos.camposfecha.fapertura = null;
    this.mcampos.camposfecha.fvencimiento = null;
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    // No existe para el padre
  }

  actualizar() {
    // No existe para el padre
  }

  eliminar() {
    // No existe para el padre
  }

  cancelar() {
    // No existe para el padre
  }

  public selectRegistro(registro: any) {
    // No existe para el padre
  }

  // Inicia CONSULTA *********************
  consultar() {
    // No existe para el padre
  }

  public crearDtoConsulta(): Consulta {
    const consulta = new Consulta(this.entityBean, 'Y', 't.coperacion', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TperPersonaDetalle', 'nombre', 'npersona', 't.cpersona = i.cpersona and i.verreg = 0');
    // consulta.addSubquery('tgenproducto', 'nombre', 'nproducto', 'i.cproducto = t.cproducto and i.cmodulo = t.cmodulo');
    // consulta.addSubquery('TgenTipoProducto', 'nombre', 'ntipoproducto', 'i.cproducto = t.cproducto and i.ctipoproducto = t.ctipoproducto and i.cmodulo = t.cmodulo');
    consulta.addSubquery('TcarEstatus', 'nombre', 'nestatus', 'i.cestatus = t.cestatus');
    consulta.addSubquery('TgenSucursal', 'nombre', 'nsucursal', 'i.csucursal = t.csucursal');
    consulta.addSubquery('TgenAgencia', 'nombre', 'nagencia', 'i.cagencia = t.cagencia and i.csucursal = t.csucursal');
    this.addConsulta(consulta);
    return consulta;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    // No existe para el padre
  }
  // Fin MANTENIMIENTO *********************

}
