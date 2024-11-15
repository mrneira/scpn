import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { BaseLovComponent } from '../../../../../util/shared/componentes/baseLov.component';

@Component({
  selector: 'app-lov-matrizcorrelaciondetalle',
  templateUrl: 'lov.matrizcorrelaciondetalle.html'
})
export class LovMatrizCorrelacionDComponent extends BaseLovComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoCliente = new EventEmitter();
  displayLov = false;
  
  consultado = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthmatrizcorrelaciondetalle', 'LOVMATRIZ', false, false);
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
    this.consultado = true;
    super.consultar();
  }
  
  public crearDtoConsulta(): Consulta {
    const consulta = new Consulta(this.entityBean, 'Y', 't.cmatrizdetalle', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tthfuncionariodetalle', 'primernombre + \' \' + primerapellido', 'nfuncionario', 'i.cfuncionario= t.cfuncionario and i.verreg = 0');
    consulta.addSubquery('tthdepartamento', 'nombre', 'ndepartamento', 'i.cdepartamento = t.cdepartamento');
    consulta.addSubquery('tthfuncionariodetalle', 'documento', 'documento', 'i.cfuncionario= t.cfuncionario and i.verreg = 0');
    consulta.addSubquery('tthmetadetalle', 'producto', 'nproducto', 'i.cmetadetalle= t.cmetadetalle and i.cmeta=t.cmeta');
    consulta.addSubqueryPorSentencia('select i.nombrecomercial from tcelinfoempresa i where i.cinfoempresa=(select go.cinfoempresa from tthmatrizcorrelacion go where go.cmatriz=t.cmatriz)', 'nempresa');
    consulta.addSubqueryPorSentencia('select i.nombre from tthdepartamento i where i.cdepartamento=(select S.cdepartamento from tthmatrizcorrelacion S where S.cmatriz=t.cmatriz)', 'ndepartamentoevaluado');
    consulta.addSubqueryPorSentencia('select i.nombre from tthevaluacionperiodo i where i.cperiodo=(select go.cperiodo from tthmatrizcorrelacion go where go.cmatriz=t.cmatriz)', 'nperiodo');
   
    //valida que exista una evaluación interna con una cmatrizdetalle
    consulta.addSubquery('tthinterna', 'cinterna', 'cinterna', 'i.cmatrizdetalle = t.cmatrizdetalle');
    consulta.setCantidad(50);
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
    evento.data.mdatos.nombre = 
    this.eventoCliente.emit({ registro: evento.data });
    // para oculatar el dialogo.
    this.displayLov = false;
  }
  
  showDialog() {
    this.displayLov = true;
  }
  
  closeLov() {
    if(this.consultado && this.lregistros.length == 0){
      this.eventoCliente.emit({ registro: undefined });
      // para oculatar el dialogo.
      this.displayLov = false;
    }  
  }
  
}
