import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { BaseLovComponent } from '../../../../../util/shared/componentes/baseLov.component';


@Component({
  selector: 'app-lov-operacion-cobranza',
  templateUrl: 'lov.operacionCobranza.html'
})
export class LovOperacionCobranzaComponent extends BaseLovComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoOperCobranza = new EventEmitter();
  displayLov = false;

  public lmodulo: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcobCobranza', 'LOVOPERACION', false, true);
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.ccobranza', this.mfiltros, this.mfiltrosesp);
    consulta.addSubqueryPorSentencia("select p.nombre from " + this.obtenerBean("tgenproducto") + " p, " + this.obtenerBean("tcaroperacion") + " o where " + "p.cmodulo = o.cmodulo and t.coperacion = o.coperacion and p.cproducto = o.cproducto and o.cmodulo = 7", "nproducto");
    consulta.addSubqueryPorSentencia("select tp.nombre from " + this.obtenerBean("tgentipoproducto") + " tp, " + this.obtenerBean("tcaroperacion") + " o where " + "tp.cmodulo = o.cmodulo and t.coperacion = o.coperacion and tp.cproducto = o.cproducto and tp.ctipoproducto = o.ctipoproducto and o.cmodulo = 7", "ntipoproducto");
    consulta.addSubquery('TcobEstatus', 'nombre', 'nestatus', 'i.cestatus = t.cestatus');

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
    this.eventoOperCobranza.emit({ registro: evento.data });
    // para oculatar el dialogo.
    this.displayLov = false;
  }

  showDialog() {
    this.displayLov = true;
  }
}
