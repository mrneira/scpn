import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-lov-operadorinst',
  templateUrl: 'lov.operadorinst.html'
})
export class LovOperadorinstComponent extends BaseComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  
    @Output() eventoCliente = new EventEmitter();
    displayLov = false;
  
    
    tipoplancdetalle = '';
    cnivel = '';
    
    public lmodulo: SelectItem[] = [{label: '...', value: null}];
  
    constructor(router: Router, dtoServicios: DtoServicios) {

      
      super(router, dtoServicios, 'tinvoperadorinstitucional', 'LOVOPERADORINST', false, true);
      
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
      const consulta = new Consulta(this.entityBean, 'Y', 't.nombrescontacto', this.mfiltros, this.mfiltrosesp);
      consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nBanco', ' t.bancoscpnccatalogo = i.ccatalogo and t.bancoscpncdetalle = i.cdetalle');
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
  