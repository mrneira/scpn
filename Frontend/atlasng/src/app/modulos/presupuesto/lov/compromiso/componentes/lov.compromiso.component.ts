import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { BaseLovComponent } from '../../../../../util/shared/componentes/baseLov.component';



@Component({
  selector: 'app-lov-compromiso',
  templateUrl: 'lov.compromiso.html'
})
export class LovCompromisoComponent extends BaseLovComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoCliente = new EventEmitter();

  public lmodulo: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tpptcompromiso', 'LOVCOMPROMISO', false, true);
  }

  ngOnInit() {
    this.formFiltrosBase = this.formFiltros;
    this.componentehijo = this;
    this.rqConsulta.grabarlog = '0';
    let finicio = new Date(this.anioactual, this.fechaactual.getMonth(), 1 );
    this.mcampos.finicio =  finicio;
    this.mcampos.ffin = this.fechaactual;
  }

  consultar() {
    this.crearDtoConsulta();
    const consulta: Consulta = this.getConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
     let lfechainicial : string = super.calendarToFechaString(this.mcampos.finicio);
   
    var fecha  = new Date();
    fecha.setDate(fecha.getDate()+1);
    let lfechafinal : string =  super.calendarToFechaString(fecha);
    
    this.mfiltrosesp.fingreso = 'between \'' + lfechainicial + '\' and \'' + lfechafinal + '\'';
    const consulta = new Consulta(this.entityBean, 'Y', ' cast(ccompromiso AS BIGINT) DESC ', this.mfiltros, this.mfiltrosesp);
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

  showDialog(movimiento: any) {
    this.displayLov = true;
  }
}
