import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { BaseLovComponent } from '../../../../../util/shared/componentes/baseLov.component';



@Component({
  selector: 'app-lov-productos',
  templateUrl: 'lov.productos.html'
})
export class LovProductosComponent extends BaseLovComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoCliente = new EventEmitter();
  displayLov = false;

  tipoplancdetalle = '';
  cnivel = '';

  public lmodulo: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tacfproducto', 'LOVPRODUCTO', false, true);
  }

  ngOnInit() {  
    this.componentehijo = this;
    // En los lov va 0 para no grabar log de transaccion.
    this.rqConsulta.grabarlog = '0';
  }

  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
  
    const consulta = new Consulta(this.entityBean, 'Y', 't.codigo', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tconcatalogo', 'nombre', 'ncuenta', 'i.ccuenta = t.ccuenta');
    consulta.addSubquery('tacfunidad', 'nombre', 'nunidad', 'i.cunidad = t.cunidad');
    consulta.cantidad=15
    this.addConsulta(consulta);
    return consulta;
  }

  public getConsulta(): Consulta {
    const consulta = super.getConsulta(this.alias);
    return consulta;
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  private fijarFiltrosConsulta() {
  }

  seleccionaRegistro(evento: any) {
    this.eventoCliente.emit({ registro: evento.data });
    // para ocultar el dialogo.
    this.displayLov = false;
  }

  showDialog() {

    this.displayLov = true;
  }
}
