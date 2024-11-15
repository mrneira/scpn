import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-lov-seguros',
  templateUrl: 'lov.seguros.html'
})

export class LovSegurosComponent extends BaseComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoOperCartera = new EventEmitter();
  displayLov = false;

  public lmodulo: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TsgsSeguro', 'LOVSEGUROS', false, true);
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
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.coperacioncartera', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TsgsTipoSeguroDetalle', 'nombre', 'ntiposeguro', 'i.ctiposeguro = t.ctiposeguro and i.verreg = 0');
    consulta.addSubquery('TsgsTipoSeguroDetalle', 'csaldo', 'csaldo', 'i.ctiposeguro = t.ctiposeguro and i.verreg = 0');
    consulta.addSubquery('TsgsTipoSeguroDetalle', 'csaldocxc', 'csaldocxc', 'i.ctiposeguro = t.ctiposeguro and i.verreg = 0');
    consulta.addSubqueryPorSentencia("select p.nombre from " + this.obtenerBean("tgenproducto") + " p, " + this.obtenerBean("tcaroperacion") + " o where " + "p.cmodulo = o.cmodulo and t.coperacioncartera = o.coperacion and p.cproducto = o.cproducto and o.cmodulo = 7", "nproducto");
    consulta.addSubqueryPorSentencia("select tp.nombre from " + this.obtenerBean("tgentipoproducto") + " tp, " + this.obtenerBean("tcaroperacion") + " o where " + "tp.cmodulo = o.cmodulo and t.coperacioncartera = o.coperacion and tp.cproducto = o.cproducto and tp.ctipoproducto = o.ctipoproducto and o.cmodulo = 7", "ntipoproducto");
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
    if (this.estaVacio(this.mcampos.consulta)) {
      this.mfiltrosesp.coperacioncartera = 'in (select coperacion from tcaroperacion where cestatus != \'CAN\')';
    }
  }

  seleccionaRegistro(evento: any) {
    this.eventoOperCartera.emit({ registro: evento.data });
    // para oculatar el dialogo.
    this.displayLov = false;
  }

  showDialog() {
    this.displayLov = true;
  }
}
