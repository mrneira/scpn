import { Component, OnInit, Output, Input, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { BaseLovComponent } from '../../../../../util/shared/componentes/baseLov.component';

@Component({
  selector: 'app-lov-clientes',
  templateUrl: 'lov.clientes.html'
})
export class LovClientesComponent extends BaseLovComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoCliente = new EventEmitter();

  public res;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tperproveedor', 'LOVCLIENTE', false);    
  }

  ngOnInit() {
    this.formFiltrosBase = this.formFiltros;
    this.componentehijo = this;
    this.rqConsulta.grabarlog = '0';
  }

  consultar() {
    if(this.mcampos.nombre === undefined || this.mcampos.nombre === ''){
      this.mfiltros.nombre = '';
    }
    else{
      this.mfiltros.nombre = this.mcampos.nombre.replace(/ /g,"%");
    }
           
    if(this.mcampos.cpersona === undefined || this.mcampos.cpersona === ''){
      this.mfiltros.cpersona = '';
    }
    else{
      this.mfiltros.cpersona = this.mcampos.cpersona;
    }
    
    if(this.mcampos.identificacion === undefined || this.mcampos.identificacion === ''){
      this.mfiltros.identificacion = '';
    }
    else{
      this.mfiltros.identificacion = this.mcampos.identificacion;
    }
    if (this.estaVacio(this.mcampos.todos)){
      this.mfiltros.cliente = true;
    }
    
    this.mfiltros.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.crearDtoConsulta();
    const consulta: Consulta = this.getConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    const consulta = new Consulta(this.entityBean, 'Y', 't.cpersona', this.mfiltros, this.mfiltrosesp);
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
