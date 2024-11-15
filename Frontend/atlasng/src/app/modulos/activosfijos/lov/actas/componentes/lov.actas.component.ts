import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { BaseLovComponent } from '../../../../../util/shared/componentes/baseLov.component';



@Component({
  selector: 'app-lov-actas',
  templateUrl: 'lov.actas.html'
})
export class LovActasComponent extends BaseLovComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoCliente = new EventEmitter();
  displayLov = false;

  public lmodulo: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'AF_LOVFUNCACTAS', false, true);
  }

  ngOnInit() {
    this.formFiltrosBase = this.formFiltros;
    this.componentehijo = this;
    // En los lov va 0 para no grabar log de transaccion.
    this.rqConsulta.grabarlog = '0';
    let finicio = new Date(this.anioactual, this.fechaactual.getMonth(), 1 );
    this.mcampos.finicio =  finicio;
    this.mcampos.ffin = this.fechaactual;
  }

    consultar() {
      this.rqConsulta.mdatos.CODIGOCONSULTA = 'AF_LOVFUNCACTAS';
      this.rqConsulta.storeprocedure = "sp_AcfConLovFuncionariosActa";
      const consulta = new Consulta(this.entityBean, 'Y', '', this.mfiltros, this.mfiltrosesp);
      this.addConsulta(consulta);
      super.consultar();
    
    
  }

  public crearDtoConsulta(): Consulta {

    var fecha  = new Date();
    fecha.setDate(fecha.getDate()+1);
    let lfechainicial : string = super.calendarToFechaString(this.mcampos.finicio);
    let lfechafinal : string =  super.calendarToFechaString(fecha);
    this.mfiltrosesp.fingreso = 'between \'' + lfechainicial + '\' and \'' + lfechafinal + '\'';
    
    this.mfiltrosesp.cusuarioasignado = 'not in (\'CUSTODIOAF\')';
    const consulta = new Consulta(this.entityBean, 'Y', 't.fingreso',this.mfiltros, this.mfiltrosesp);

    consulta.addSubquery('tthfuncionariodetalle','primernombre + \' \' + primerapellido','nfuncionario','i.cpersona= t.cusuarioasignado and i.verreg = 0' );
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
    // para ocultar el dialogo.
    this.displayLov = false;
  }

  showDialog(movimiento: any) {
    this.displayLov = true;
  }
}
