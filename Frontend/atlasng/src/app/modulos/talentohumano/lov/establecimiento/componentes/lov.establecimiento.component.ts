import { Component, OnInit, Output, Input, EventEmitter, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { BaseLovComponent } from '../../../../../util/shared/componentes/baseLov.component';


@Component({
  selector: 'app-lov-establecimiento',
  templateUrl: 'lov.establecimiento.html'
})
export class LovEstablecimientoComponent extends BaseLovComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoCliente = new EventEmitter();
  displayLov = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthinstitucioneducativa', 'LOVESTABLECIMIENTO', false, false);
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.cinstitucion', this.mfiltros, this.mfiltrosesp);
    consulta.setCantidad(15);
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

  seleccionaRegistro(evento: any) {
    this.eventoCliente.emit({ registro: evento.data });
    // para oculatar el dialogo.
    this.displayLov = false;
  }

  showDialog() {
    this.displayLov = true;
  }

}
