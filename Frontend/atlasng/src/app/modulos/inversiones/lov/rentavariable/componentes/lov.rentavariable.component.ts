import { Component, OnInit, AfterViewInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-lov-rentavariable',
  templateUrl: 'lov.rentavariable.html'
})
export class LovRentavariableComponent extends BaseComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoCliente = new EventEmitter();
  displayLov = false;

 

  pfColocacionInicial: Date;
  pfColocacionFinal: Date;

  constructor(router: Router, dtoServicios: DtoServicios) {

    super(router, dtoServicios, 'TinvInversionrentavariable', 'LOVINVRENTAVARIABLE', false, true);

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
    if (!this.estaVacio(this.pfColocacionInicial)) {
      try {
        lfechaInicial = (this.pfColocacionInicial.getFullYear() * 10000) + ((this.pfColocacionInicial.getMonth() + 1) * 100) + this.pfColocacionInicial.getDate();
      }
      catch (ex) {
        lfechaInicial = 0;
      }
    }
    else {
      lfechaInicial = 0;
    }

    let lfechaFinal: number;
    if (!this.estaVacio(this.pfColocacionFinal)) {
      try {
        lfechaFinal = (this.pfColocacionFinal.getFullYear() * 10000) + ((this.pfColocacionFinal.getMonth() + 1) * 100) + this.pfColocacionFinal.getDate();
      }
      catch (ex) {
        lfechaFinal = 99999999;
      }
    }
    else {
      lfechaFinal = 99999999;
    }

    this.mfiltrosesp.fcolocacion = 'between ' + lfechaInicial + ' and ' + lfechaFinal + ' ';

    const consulta = new Consulta(this.entityBean, 'Y', 't.fcolocacion DESC', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'ncompracupon', 'i.ccatalogo = t.compracuponccatalogo and i.cdetalle = t.compracuponcdetalle');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'ntipodividendo', 'i.ccatalogo = t.tipodividendoccatalogo and i.cdetalle = t.tipodividendocdetalle');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nestado', 'i.ccatalogo = t.estadoccatalogo and i.cdetalle = t.estadocdetalle');
    
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
