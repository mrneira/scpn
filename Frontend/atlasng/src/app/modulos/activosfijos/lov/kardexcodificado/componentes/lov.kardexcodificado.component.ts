import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { BaseLovComponent } from '../../../../../util/shared/componentes/baseLov.component';



@Component({
  selector: 'app-lov-kardexcodificado',
  templateUrl: 'lov.kardexcodificado.html'
})
export class LovKardexCodificadoComponent extends BaseLovComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoCliente = new EventEmitter();
  displayLov = false;

  tipoplancdetalle = '';
  cnivel = '';

  public lmodulo: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tacfproductocodificado', 'LOVKARDEXCODIFICADO', false, true);
  }

  ngOnInit() {
    this.componentehijo = this;
    // En los lov va 0 para no grabar log de transaccion.
    this.rqConsulta.grabarlog = '0';
  }

  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    if (!this.estaVacio(this.mcampos.nombre)) {
      this.mfiltrosesp.cproducto = " in (SELECT cproducto FROM tacfproducto WHERE nombre LIKE '%" + this.mcampos.nombre + "%')"
    }else{
      this.mfiltrosesp= {};
    }
    const consulta = new Consulta(this.entityBean, 'Y', 't.cbarras', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tacfproducto', 'codigo', 'codigo', 'i.cproducto = t.cproducto');
    consulta.addSubquery('tacfproducto', 'vunitario', 'vunitario1', 'i.cproducto = t.cproducto');
    consulta.addSubquery('tacfproducto', 'stock', 'stock', 'i.cproducto = t.cproducto');
    consulta.addSubquery('tacfproducto', 'nombre', 'nombre', 'i.cproducto = t.cproducto');

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
    this.mfiltros.cusuarioasignado = 'CUSTODIOAF';
    


  }

  seleccionaRegistro(evento: any) {
    this.eventoCliente.emit({ registro: evento.data });
    // para ocultar el dialogo.
    this.displayLov = false;
  }

  showDialog() {
    this.displayLov = true;
  }
}