import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { BaseLovComponent } from '../../../../../util/shared/componentes/baseLov.component';

@Component({
  selector: 'app-lov-causales-vinculacion',
  templateUrl: 'lov.causalesVinculacion.html'
})
export class LovCausalesVinculacionComponent extends BaseLovComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoCliente = new EventEmitter();

  public ltiposcausales: SelectItem[] = [{ label: '...', value: null }];

  displayLov = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TperCausalVinculacion', 'LOVCAUSALVIN', false);
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.nombre', this.mfiltros, this.mfiltrosesp);
    consulta.setCantidad(15);
    consulta.addSubquery('TperTipoCausalVinculacion', 'nombre', 'ntipocausal', 'i.ctipocausal = t.ctipocausal');

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
    const consultaTipoIdent = new Consulta('TperTipoCausalVinculacion', 'Y', 't.nombre', {}, {});
    consultaTipoIdent.cantidad = 50;
    this.addConsultaPorAlias('TIPOSCAUSALES', consultaTipoIdent);
  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.ltiposcausales, resp.TIPOSCAUSALES, 'ctipocausal');

    }
    this.lconsulta = [];
  }

  cambiaTipoCausal(event: any): any {
    if (this.mfiltros.ctipocausal === undefined || this.mfiltros.ctipocausal === null) {
      return;
    };
    this.consultar();
  }
}
