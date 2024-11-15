
import { Component, OnInit, AfterViewInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-lov-default',
  templateUrl: 'lov.default.html'
})
export class LovDefaultComponent extends BaseComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoCliente = new EventEmitter();
  displayLov = false;

  public pEliminarContabilidadAnulada: boolean = false;
  public pEsPrecancelacion: boolean = false;

  pfEmisionInicial: Date;
  pfEmisionFinal: Date;

  public lEstado: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {

    super(router, dtoServicios, 'tinvdefault', 'LOVDEFAUL', false, true);

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

    const consulta = new Consulta(this.entityBean, 'Y', 't.cdefault asc', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nestado', 'i.ccatalogo = t.estadoccatalogo AND i.cdetalle = t.estadocdetalle ');
    
    consulta.addSubqueryPorSentencia("select ISNULL(SUM(det.valor),0)  from tinvdefaultdetalle det where det.cdefault = t.cdefault and det.estadocdetalle='PAG'","nrecuperado");
    consulta.addSubqueryPorSentencia('SELECT c.nombre FROM tgencatalogodetalle c, tinvinversion inv WHERE inv.cinversion = t.cinversion AND inv.emisorccatalogo = c.ccatalogo AND inv.emisorcdetalle =c.cdetalle', 'nemisor');
    consulta.addSubqueryPorSentencia('SELECT ci.nombre FROM tgencatalogodetalle ci, tinvinversion inv WHERE inv.cinversion = t.cinversion AND inv.instrumentoccatalogo = ci.ccatalogo AND inv.instrumentocdetalle =ci.cdetalle', 'ninstrumento');
    consulta.addSubqueryPorSentencia('SELECT sec.nombre FROM tgencatalogodetalle sec, tinvinversion inv WHERE inv.cinversion = t.cinversion AND inv.sectorccatalogo = sec.ccatalogo AND inv.sectorcdetalle =sec.cdetalle', 'nsector');
    

    consulta.cantidad = 100;
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

    this.consultarCatalogos();
    this.displayLov = true;
  }

  private manejaRespuestaCatalogos(resp: any) {
    if (resp.cod === 'OK') {

      this.llenaListaCatalogo(this.lEstado, resp.ESTADO, 'cdetalle');

    }
  }

  llenarConsultaCatalogos(): void {

    const mfiltrosCatalogo: any = { 'ccatalogo': 1204 };

    let mfiltrosEstado: any = {};
    if (!this.estaVacio(this.mfiltrosesp.estadocdetalle))
    {
      mfiltrosEstado = { 'cdetalle': this.mfiltrosesp.estadocdetalle };
    }

    const consultaEstado = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosCatalogo, mfiltrosEstado);
    consultaEstado.cantidad = 50;
    this.addConsultaPorAlias('ESTADO', consultaEstado);
  }

  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.encerarMensajes();
          this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
          this.manejaRespuestaCatalogos(resp);

        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }
  

}
