import { Component, OnInit, AfterViewInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-lov-tablaamortizacion',
  templateUrl: 'lov.tablaamortizacion.html'
})
export class LovTablaamortizacionComponent extends BaseComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoCliente = new EventEmitter();
  displayLov = false;

  pfvencimientoInicial: Date;
  pfvencimientoFinal: Date;

  constructor(router: Router, dtoServicios: DtoServicios) {

    super(router, dtoServicios, 'TinvTablaamortizacion', 'LOVINVTABLAAMORTIZA', false, true);

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

    let lfechaInicial: number;
    if (!this.estaVacio(this.pfvencimientoInicial)) {
      try {
        lfechaInicial = (this.pfvencimientoInicial.getFullYear() * 10000) + ((this.pfvencimientoInicial.getMonth() + 1) * 100) + this.pfvencimientoInicial.getDate();
      }
      catch (ex) {
        lfechaInicial = 0;
      }
    }
    else {
      lfechaInicial = 0;
    }

    let lfechaFinal: number;
    if (!this.estaVacio(this.pfvencimientoFinal)) {
      try {
        lfechaFinal = (this.pfvencimientoFinal.getFullYear() * 10000) + ((this.pfvencimientoFinal.getMonth() + 1) * 100) + this.pfvencimientoFinal.getDate();
      }
      catch (ex) {
        lfechaFinal = 99999999;
      }
    }
    else {
      lfechaFinal = 99999999;
    }

    this.mfiltrosesp.fvencimiento = 'between ' + lfechaInicial + ' and ' + lfechaFinal + ' ';

    const consulta = new Consulta(this.entityBean, 'Y', 't.fvencimiento DESC', this.mfiltros, this.mfiltrosesp);
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

  private fijarFiltrosConsulta() {
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
