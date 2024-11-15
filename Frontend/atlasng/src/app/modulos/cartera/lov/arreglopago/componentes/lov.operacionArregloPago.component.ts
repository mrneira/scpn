import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { BaseLovComponent } from '../../../../../util/shared/componentes/baseLov.component';


@Component({
  selector: 'app-lov-operacion-arreglo',
  templateUrl: 'lov.operacionArregloPago.html'
})
export class LovOperacionArregloPagoComponent extends BaseLovComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoOperCartera = new EventEmitter();
  displayLov = false;

  public lmodulo: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarOperacionArregloPago', 'LOVOPERACIONARREGLO', false, true);
  }

  ngOnInit() {
    this.formFiltrosBase = this.formFiltros;
    this.componentehijo = this;
    // En los lov va 0 para no grabar log de transaccion.
    this.rqConsulta.grabarlog = '0';
    this.mcampos.camposfecha.fingreso = null;
  }

  consultar() {
    this.crearDtoConsulta();
    const consulta: Consulta = this.getConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    const consulta = new Consulta(this.entityBean, 'Y', 't.coperacion', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TcarTipoArregloPago', 'nombre', 'ntipoarreglopago', 'i.ctipoarreglopago = t.ctipoarreglopago');
    consulta.setCantidad(15);
    this.addConsulta(consulta);
    return consulta;
  }

  public getConsulta(): Consulta {
    const consulta = super.getConsulta(this.alias);
    consulta.addFiltroCondicion('operacion', this.mfiltros.coperacion, '=');
    return consulta;
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  private fijarFiltrosConsulta() {
  }

  seleccionaRegistro(evento: any) {
    this.eventoOperCartera.emit({ registro: evento.data });
    // para ocultar el dialogo.
    this.displayLov = false;
  }

  showDialog() {
    this.displayLov = true;
  }
}
