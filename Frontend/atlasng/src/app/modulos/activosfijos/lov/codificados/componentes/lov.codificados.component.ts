import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { BaseLovComponent } from '../../../../../util/shared/componentes/baseLov.component';
import {LovProductosComponent} from '../../productos/componentes/lov.productos.component'


@Component({
  selector: 'app-lov-codificados',
  templateUrl: 'lov.codificados.html'
})
export class LovCodificadosComponent extends BaseLovComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoCliente = new EventEmitter();
  displayLov = false;

  tipoplancdetalle = '';
  cnivel = '';

  @ViewChild(LovProductosComponent)
  private lovProductos: LovProductosComponent;
  public lmodulo: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tacfproductocodificado', 'LOVCODIFICADOS', false, true);
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.cbarras', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tacfproducto', 'codigo', 'codigo', 'i.cproducto = t.cproducto');
    consulta.addSubquery('tacfproducto', 'vunitario', 'vunitario1', 'i.cproducto = t.cproducto');
    consulta.addSubquery('tacfproducto', 'stock', 'stock', 'i.cproducto = t.cproducto');
    consulta.addSubquery('tacfproducto', 'nombre', 'nombre', 'i.cproducto = t.cproducto');
    consulta.addSubqueryPorSentencia(`isnull((select primernombre + ' ' + primerapellido from tthfuncionariodetalle d 
    where CAST(d.cpersona AS VARCHAR(20)) = t.cusuarioasignado and d.verreg = 0 and activo = 1),
    CASE WHEN t.cusuarioasignado = 'BODEGA' THEN 'BODEGA' ELSE 'ACTIVOS FIJOS' END)`, 'Responsable' ); 
    consulta.setCantidad(100); //NCH 20230322
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

  /**Muestra lov de productos */
  mostrarlovproductos(): void {
    this.lovProductos.mfiltros.movimiento=true;
    this.lovProductos.showDialog();

  }


  /**Retorno de lov de productos. */
  fijarLovProductosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.nproducto = reg.registro.nombre;
      this.mcampos.codigo=reg.registro.codigo;
      this.mfiltros.cproducto = reg.registro.cproducto;
      this.consultar();
    }
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
