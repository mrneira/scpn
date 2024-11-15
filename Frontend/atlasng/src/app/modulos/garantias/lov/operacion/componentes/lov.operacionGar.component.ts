import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { NgForm } from '@angular/forms';
import { BaseLovComponent } from '../../../../../util/shared/componentes/baseLov.component';

@Component({
  selector: 'app-lov-operacion-gar',
  templateUrl: 'lov.operacionGar.html'
})
export class LovOperacionGarComponent extends BaseLovComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoOperGar = new EventEmitter();
  displayLov = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TgarOperacion', 'LOVOPERACIONGAR', false, true);
  }

  ngOnInit() {
    this.formFiltrosBase = this.formFiltros;
    this.componentehijo = this;
    // En los lov va 0 para no grabar log de transaccion.
    this.rqConsulta.grabarlog = '0';
  }

  consultar() {
    this.crearDtoConsulta();
    const consulta: Consulta = this.getConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    const consulta = new Consulta(this.entityBean, 'Y', '', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenMoneda', 'nombre', 'nmoneda', 'i.cmoneda = t.cmoneda');
    consulta.addSubquery('TgarEstatus', 'nombre', 'nestatus', 'i.cestatus = t.cestatus');
    consulta.addSubquery('TgenProducto', 'nombre', 'nproducto', 'i.cmodulo = t.cmodulo and i.cproducto = t.cproducto');
    consulta.addSubquery('TgenTipoProducto', 'nombre', 'ntipoproducto', 'i.cmodulo = t.cmodulo and i.cproducto = t.cproducto and i.ctipoproducto = t.ctipoproducto');
    consulta.addSubquery('TgarClasificacion', 'nombre', 'nclasificacion', 'i.cclasificacion = t.cclasificacion');
    consulta.addSubquery('TgarTipoGarantia', 'nombre', 'ntipogar', 'i.ctipogarantia = t.ctipogarantia');
    consulta.addSubquery('TgarTipoBien', 'nombre', 'ntipobien', 'i.ctipogarantia = t.ctipogarantia and i.ctipobien = t.ctipobien');
    consulta.addSubquery('TgarTipoBien', 'aplicaseguro', 'aplicaseguro', 'i.ctipogarantia = t.ctipogarantia and i.ctipobien = t.ctipobien');
    consulta.addSubquery('TgarTipoBien', 'ctiposeguro', 'ctiposeguro', 'i.ctipogarantia = t.ctipogarantia and i.ctipobien = t.ctipobien');
    consulta.addSubquery('TgarOperacionAvaluo', 'valoravaluo', 'montoavaluo', 'i.coperacion = t.coperacion and i.verreg = 0');
    consulta.addSubquery('TgarOperacionAvaluo', 'valorcomercial', 'monto', 'i.coperacion = t.coperacion and i.verreg = 0');
    consulta.addSubquery('TgenPais', 'nombre', 'npais', 'i.cpais = t.cpais');
    consulta.addSubquery('TgenProvincia', 'nombre', 'nprovincia', 'i.cpais = t.cpais and i.cpprovincia=t.cpprovincia');
    consulta.addSubquery('TgenCanton', 'nombre', 'ncanton', 'i.cpais = t.cpais and i.cpprovincia=t.cpprovincia and i.ccanton=t.ccanton');

    consulta.setCantidad(15);
    this.addConsulta(consulta);
    return consulta;
  }

  public getConsulta(): Consulta {
    const consulta = super.getConsulta(this.alias);
    consulta.addFiltroCondicion('coperacion', this.mfiltros.coperacion, '=');
    return consulta;
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  private fijarFiltrosConsulta() {
  }

  seleccionaRegistro(evento: any) {
    this.eventoOperGar.emit({ registro: evento.data });
    // para oculatar el dialogo.
    this.displayLov = false;
  }

  showDialog() {
    this.displayLov = true;
  }
}
