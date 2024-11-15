
import { Component, OnInit, AfterViewInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-lov-contabilizacion',
  templateUrl: 'lov.contabilizacion.html'
})
export class LovContabilizacionComponent extends BaseComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoCliente = new EventEmitter();
  displayLov = false;

  tipoplancdetalle = '';
  cnivel = '';

  pfcolocacionInicial: Date;
  pfcolocacionFinal: Date;

  public lmodulo: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {

    super(router, dtoServicios, 'TinvContabilizacion', 'LOVCONTABILIZA', false, true);

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

    let lfechaInicial: number;
    if (!this.estaVacio(this.pfcolocacionInicial)) {
      try {
        lfechaInicial = (this.pfcolocacionInicial.getFullYear() * 10000) + ((this.pfcolocacionInicial.getMonth() + 1) * 100) + this.pfcolocacionInicial.getDate();
      }
      catch (ex) {
        lfechaInicial = 0;
      }
    }
    else {
      lfechaInicial = 0;
    }

    let lfechaFinal: number;
    if (!this.estaVacio(this.pfcolocacionFinal)) {
      try {
        lfechaFinal = (this.pfcolocacionFinal.getFullYear() * 10000) + ((this.pfcolocacionFinal.getMonth() + 1) * 100) + this.pfcolocacionFinal.getDate();
      }
      catch (ex) {
        lfechaFinal = 99999999;
      }
    }
    else {
      lfechaFinal = 99999999;
    }

    this.mfiltrosesp.fcontable = ' between ' + lfechaInicial + ' and ' + lfechaFinal + ' ';

    this.mfiltrosesp.cinvcontabilizacion = " IN (select max(a.cinvcontabilizacion) from tinvcontabilizacion a inner join tconcomprobante b on a.ccomprobante = b.ccomprobante where a.ccomprobante is not null and b.anulado = 0 and b.eliminado = 0 group by a.ccomprobante) ";

    const consulta = new Consulta(this.entityBean, 'Y', 't.fcontable DESC, t.ccomprobante', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'noperacion', 'i.ccatalogo = t.procesoccatalogo and i.cdetalle = t.procesocdetalle');
    consulta.addSubqueryPorSentencia('select j.nombre from tinvinversion i inner join tgencatalogodetalle j on i.tasaclasificacionccatalogo = j.ccatalogo and i.tasaclasificacioncdetalle = j.cdetalle where i.cinversion = t.cinversion', 'ntasaclasificacion');
    consulta.addSubqueryPorSentencia('select j.nombre from tinvinversion i inner join tgencatalogodetalle j on i.emisorccatalogo = j.ccatalogo and i.emisorcdetalle = j.cdetalle where i.cinversion = t.cinversion', 'nemisor');
    consulta.addSubquery('tinvinversion', 'instrumentocdetalle', 'ninstrumentocdetalle', 'i.cinversion = t.cinversion');
    consulta.addSubquery('tinvinversion', 'valornominal', 'nvalornominal', 'i.cinversion = t.cinversion');
    
    consulta.cantidad = 15;
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
   
    this.displayLov = false;
  }

  showDialog() {
    this.displayLov = true;
  }
}
