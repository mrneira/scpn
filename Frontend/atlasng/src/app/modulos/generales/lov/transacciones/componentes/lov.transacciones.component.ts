import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-lov-transacciones',
  templateUrl: 'lov.transacciones.html'
})
export class LovTransaccionesComponent extends BaseComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoTransaccion = new EventEmitter();
  displayLov = false;

  public mostrarModulo = true;
  public lmodulo: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TgenTransaccion', 'LOVTRANSACCION', false, false);
  }

  ngOnInit() {
    this.formFiltrosBase = this.formFiltros;
    this.componentehijo = this;
    // En los lov va 0 para no grabar log de transaccion.
    this.rqConsulta.grabarlog = '0';
    this.consultarCatalogos();
  }

  consultar() {
    this.crearDtoConsulta();
    const consulta: Consulta = this.getConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    const consulta = new Consulta(this.entityBean, 'Y', 'ctransaccion', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenModulo', 'nombre', 'nmodulo', 'i.cmodulo = t.cmodulo');
    consulta.setCantidad(15);
    this.addConsulta(consulta);
    return consulta;
  }

  public getConsulta(): Consulta {
    const consulta = super.getConsulta(this.alias);
    return consulta;
  }

  validaFiltrosConsulta(): boolean {
    if(this.estaVacio(this.mfiltros.cmodulo)){
      super.mostrarMensajeWarn("MÓDULO REQUERIDO");
      return;
    }
    return super.validaFiltrosRequeridos();
  }
    
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  seleccionaRegistro(evento: any) {
    this.eventoTransaccion.emit({ registro: evento.data });
    // para oculatar el dialogo.
    this.displayLov = false;
  }

  showDialog(cmodulo: any = null) {
    if (cmodulo !== undefined && cmodulo !== null) {
      this.mfiltros.cmodulo = cmodulo;
      this.mostrarModulo = false;
    }
    this.displayLov = true;
  }


  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuestaCatalogos(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  llenarConsultaCatalogos(): void {
    const mfiltrosMod: any = { 'activo': true };
    const consultaIdioma = new Consulta('TgenModulo', 'Y', 't.nombre', mfiltrosMod, {});
    consultaIdioma.cantidad = 50;
    this.addConsultaPorAlias('MODULOS', consultaIdioma);

  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.lmodulo, resp.MODULOS, 'cmodulo');
    }
    this.lconsulta = [];
  }

}
