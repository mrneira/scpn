import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';

@Component({
  selector: 'app-datos-garantia-avaluo',
  template: ''
})
export class DatosGarantiaAvaluoComponent extends BaseComponent implements OnInit, AfterViewInit {

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TgarOperacionAvaluo', 'GARANTIAAVALUO', true);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init();
    this.mcampos.camposfecha.fentregaavaluo = null;
    this.mcampos.camposfecha.fvencimientoavaluo = null;
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
    this.mfiltros.verreg = 0;
    const consulta = new Consulta(this.entityBean, 'Y', 't.coperacion', this.mfiltros, this.mfiltrosesp);
    // consulta.addSubquery('TgarTipoGarantia', 'nombre', 'ntipogarantia', 'i.ctipogarantia = t.ctipogarantia');
    // consulta.addSubquery('TgarTipoBien', 'nombre', 'ntipobien', 'i.ctipobien = t.ctipobien');
    // consulta.addSubquery('TgarEstatus', 'nombre', 'nestatus', 'i.cestatus = t.cestatus');
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
