import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { BaseLovComponent } from '../../../../../util/shared/componentes/baseLov.component';

@Component({
  selector: 'app-lov-proveedores',
  templateUrl: 'lov.proveedores.html'
})
export class LovProveedoresComponent extends BaseLovComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoCliente = new EventEmitter();

  public res;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tperproveedor', 'LOVPROVEEDOR', false);    
  }

  ngOnInit() {
    this.formFiltrosBase = this.formFiltros;
    this.componentehijo = this;
    // En los lov va 0 para no grabar log de transaccion.
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
    this.mfiltros.cliente = false;
    this.mfiltrosesp.cusuarioing = " <> 'migra'";
    this.mfiltros.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.crearDtoConsulta();
    const consulta: Consulta = this.getConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    const consulta = new Consulta(this.entityBean, 'Y', 't.nombre', this.mfiltros, this.mfiltrosesp);
   consulta.setCantidad(100);
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
