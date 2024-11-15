import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { BaseLovComponent } from '../../../../../util/shared/componentes/baseLov.component';

@Component({
  selector: 'app-lov-funcionarioseval',
  templateUrl: 'lov.funcionarios.html'
})
export class LovFuncionariosEvaluadosComponent extends BaseLovComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoCliente = new EventEmitter();
  displayLov = false;
  
  consultado = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthasignacion', 'LOVFUNCIONARIO', false, false);
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.cevaluacion', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tthfuncionariodetalle', 'primernombre + \' \' + primerapellido', 'nfuncionario', 'i.cfuncionario= t.cfuncionario and i.verreg = 0');
    consulta.addSubquery('tthfuncionariodetalle', 'primernombre + \' \' + primerapellido', 'njefefuncionario', 'i.cfuncionario= t.jefecfuncionario and i.verreg = 0');
    consulta.addSubquery('tthevaluacionperiodo', 'nombre', 'nperiodo', 'i.cperiodo = t.cperiodo');
    consulta.addSubquery('tthevaluacionperiodo', 'finicio', 'fdesde', 'i.cperiodo = t.cperiodo');
    consulta.addSubquery('tthevaluacionperiodo', 'ffin', 'fhasta', 'i.cperiodo = t.cperiodo');
    consulta.addSubquery('tthasignacionresp', 'cevaluacion', 'cevaluacions', 'i.cevaluacion = t.cevaluacion');
   // consulta.addSubquery('tthasignacionresp', 'periodoprueba', 'periodoprueba', 'i.cevaluacion = t.cevaluacion');
    consulta.addSubquery('tthfuncionariodetalle', 'documento', 'documento', 'i.cfuncionario= t.cfuncionario and i.verreg = 0');
    consulta.addSubquery('tthcontratodetalle', 'ccargo', 'ccargo', 'i.cfuncionario = t.cfuncionario AND i.verreg = 0');
    consulta.addSubquery('tthcontratodetalle', 'cgrupo', 'cgrupo', 'i.cfuncionario = t.cfuncionario AND i.verreg = 0');
    consulta.addSubqueryPorSentencia("SELECT d.cdepartamento FROM " + this.obtenerBean("tthdepartamento") + " d JOIN " + this.obtenerBean("tthcargo") + " c ON d.cdepartamento = c.cdepartamento  JOIN " + this.obtenerBean("tthcontratodetalle") + " cd ON c.ccargo = cd.ccargo WHERE cd.cfuncionario =  t.cfuncionario AND cd.verreg = 0", "cdepartamento");
    
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
