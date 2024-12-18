import { Component, OnInit, Output, Input, EventEmitter, ViewChild,HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { BaseLovComponent } from '../../../../../util/shared/componentes/baseLov.component';


@Component({
  selector: 'app-lov-evaluacion',
  templateUrl: 'lov.evaluacion.html'
})
export class LovEvaluacionComponent extends BaseLovComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  
  @Output() eventoCliente = new EventEmitter();
  displayLov = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthevaluacion', 'LOVEVALUACION', false, false);
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.cevaluacion', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tthfuncionariodetalle','primernombre + \' \' + primerapellido','nombre','i.cfuncionario= t.cfuncionario and i.verreg = 0' );
    consulta.addSubquery('tthevaluacionperiodo','nombre' , 'nperiodo', 'i.cperiodo = t.cperiodo');
    consulta.addSubquery('tthevaluacionperiodo','fdesde' , 'fdesde', 'i.cperiodo = t.cperiodo');
    consulta.addSubquery('tthevaluacionperiodo','fhasta' , 'fhasta', 'i.cperiodo = t.cperiodo');
    consulta.addSubquery('tthevaluacionasignacion','jefecfuncionario' , 'jefecfuncionario', 'i.casignacion = t.casignacion');
    
    consulta.setCantidad(15);
    this.addConsulta(consulta);
    return consulta;
  }

  public getConsulta(): Consulta {
    const consulta = super.getConsulta(this.alias);
    return consulta;
  }

  private fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  seleccionaRegistro(evento: any) {
    // para oculatar el dialogo.
    this.eventoCliente.emit({ registro: evento.data });
    
    this.displayLov = false;

  }

 showDialog() {
    this.displayLov = true;
  }
}
