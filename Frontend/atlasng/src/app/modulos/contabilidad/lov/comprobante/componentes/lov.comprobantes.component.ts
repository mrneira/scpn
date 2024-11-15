import { Component, OnInit, Output, Input, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { BaseLovComponent } from '../../../../../util/shared/componentes/baseLov.component';


@Component({
  selector: 'app-lov-comprobantes',
  templateUrl: 'lov.comprobantes.html'
})
export class LovComprobantesComponent extends BaseLovComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoCliente = new EventEmitter();
  public lmodulo: SelectItem[] = [{label: '...', value: null}];
  // mayorizadoSi: string;
  // mayorizadoNo: string;
  // mayorizadoTodos : string;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TconComprobante', 'LOVCOMPROBANTE', false, true);
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

    if (this.mcampos.frealdesde !== undefined && this.mcampos.frealhasta !== undefined){
      this.mfiltrosesp.freal = 'between \'' + super.calendarToFechaString(this.mcampos.frealdesde) + '\' and \'' + super.calendarToFechaString(this.mcampos.frealhasta) + '\'';
    }

    if (this.mcampos.valordesde !== undefined && this.mcampos.valordesde !== 0 
        && this.mcampos.valorhasta !== undefined && this.mcampos.valorhasta !== 0){
      this.mfiltrosesp.montocomprobante = ' >= ' + this.mcampos.valordesde;
      this.mfiltrosesp.montocomprobante = ' <= ' + this.mcampos.valorhasta;
    }

    if (this.mcampos.comentario !== undefined){
      this.mfiltrosesp.comentario = 'like \'%' + this.mcampos.comentario + '%\''; 
    }

    // if (this.mayorizadoSi) this.mfiltros.mayorizado = true;
    // if (this.mayorizadoNo) this.mfiltros.mayorizado = false;
    
    // delete this.mfiltros.mayorizadoSi ;
    // delete this.mfiltros.mayorizadoNo ;
    // delete this.mfiltros.mayorizadoTodos ;


    const consulta =  new Consulta(this.entityBean, 'Y', ' cast(ccomprobante AS BIGINT) DESC', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tconconcepto','nombre','nconcepto','t.cconcepto = i.cconcepto');
    consulta.addSubquery('tgenmodulo','nombre','nmodulo','t.cmodulo = i.cmodulo');
    consulta.addSubquery('tgentransaccion','nombre','ntransaccion','t.ctransaccion = i.ctransaccion and t.cmodulo = i.cmodulo');
    consulta.setCantidad(500);
    this.addConsulta(consulta);
    return consulta;
  }

  public getConsulta(): Consulta {
    const consulta = super.getConsulta(this.alias);
    return consulta;
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    for(const i in resp.LOVCOMPROBANTE){
      this.lregistros[i].fcontable = super.integerToFormatoFecha(this.lregistros[i].fcontable);
    }
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.movimiento = 0;
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
