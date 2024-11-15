import { Component, OnInit, Output, Input, EventEmitter, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { BaseLovComponent } from '../../../../../util/shared/componentes/baseLov.component';

@Component({
  selector: 'app-lov-tth-grupoocupacional',
  templateUrl: 'lov.grupoocupacional.html'
})
export class LovGrupoOcupacionalComponent extends BaseLovComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoCliente = new EventEmitter();
  displayLov = false;

  public lregimen: SelectItem[] = [{ label: '...', value: null }];
  public ltiporelacionlaboral: SelectItem[] = [{ label: '...', value: null }];
  
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthgrupoocupacional', 'LOVGRUPOOCUPACIONAL', false, false);
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.cgrupo', this.mfiltros, this.mfiltrosesp);
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

  llenarConsultaCatalogos(): void {
      const mfiltroREGIMEN: any = { 'ccatalogo': 1114 };
      const consultaREGIMEN = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroREGIMEN, {});
      consultaREGIMEN.cantidad = 500;
      this.addConsultaPorAlias('REGIMEN', consultaREGIMEN);

      const mfiltroTIPORELACIONLABORAL: any = { 'ccatalogo': 1110 };
      const consultaTIPORELACIONLABORAL = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroTIPORELACIONLABORAL, {});
      consultaTIPORELACIONLABORAL.cantidad = 500;
      this.addConsultaPorAlias('TIPORELACIONLABORAL', consultaTIPORELACIONLABORAL);
  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
      const msgs = [];
      if (resp.cod === 'OK') {
          this.llenaListaCatalogo(this.lregimen, resp.REGIMEN, 'cdetalle');
          this.llenaListaCatalogo(this.ltiporelacionlaboral, resp.TIPORELACIONLABORAL, 'cdetalle');
      }
      this.lconsulta = [];
  }
}
