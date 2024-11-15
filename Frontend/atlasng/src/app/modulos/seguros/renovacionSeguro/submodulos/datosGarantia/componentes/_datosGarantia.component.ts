import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { DatosGarantiaAvaluoComponent } from './_datosGarantiaAvaluo.component'

@Component({
  selector: 'app-datos-garantia',
  templateUrl: '_datosGarantia.html'
})
export class DatosGarantiaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(DatosGarantiaAvaluoComponent)
  public avaluoComponent: DatosGarantiaAvaluoComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TgarOperacion', 'OPERACIONGARANTIA', true);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init();
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
    consulta.addSubquery('TgarTipoGarantia', 'nombre', 'ntipogarantia', 'i.ctipogarantia = t.ctipogarantia');
    consulta.addSubquery('TgarTipoBien', 'nombre', 'ntipobien', 'i.ctipogarantia = t.ctipogarantia and i.ctipobien = t.ctipobien');
    consulta.addSubquery('TgarEstatus', 'nombre', 'nestatus', 'i.cestatus = t.cestatus');
    consulta.addSubquery('TgenPais', 'nombre', 'npais', 'i.cpais = t.cpais');
    consulta.addSubquery('TgenProvincia', 'nombre', 'nprovincia', 'i.cpais = t.cpais and i.cpprovincia = t.cpprovincia');
    consulta.addSubquery('TgenCanton', 'nombre', 'ncanton', 'i.cpais = t.cpais and i.cpprovincia = t.cpprovincia and i.ccanton = t.ccanton');

    this.addConsulta(consulta);
    return consulta;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    if (resp.cod === "OK") {
      const datos = resp.OPERACIONGARANTIA[0].mdatos;
      this.mcampos.nubicacion = 'PAÍS: ' + datos.npais + ' / PROVINCIA: ' + datos.nprovincia + ' / CANTON: ' + datos.ncanton;
      

    }
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    // No existe para el padre
  }
  // Fin MANTENIMIENTO *********************

}
