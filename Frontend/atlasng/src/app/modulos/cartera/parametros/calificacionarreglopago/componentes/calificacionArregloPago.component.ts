import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-calf-arreglo',
  templateUrl: 'calificacionArregloPago.html'
})
export class CalificacionArregloPagoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public ltipoarreglopago: SelectItem[] = [{ label: '...', value: null }];
  public lcalificacion: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarCalificacionArregloPago', 'CALIFARREGLOPAGO', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.estaVacio(this.mfiltros.ctipoarreglopago)) {
      this.mostrarMensajeError('TIPO DE NEGOCIACIÓN DE PAGO REQUERIDO');
      return;
    }
    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.ctipoarreglopago = this.mfiltros.ctipoarreglopago;
  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.ctipoarreglopago', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenCalificacion', 'nombre', 'ncalificacion', 'i.ccalificacion = t.ccalificacion');
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();

    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const consultaTipArreglo = new Consulta('TcarTipoArregloPago', 'Y', 't.nombre', {}, {});
    consultaTipArreglo.cantidad = 30;
    this.addConsultaCatalogos('TIPOARREGLO', consultaTipArreglo, this.ltipoarreglopago, this.llenaTipoArreglo, 'ctipoarreglopago', this.componentehijo, false);

    const consultaCalif = new Consulta('TgenCalificacion', 'Y', 't.ccalificacion', {}, {});
    consultaCalif.cantidad = 30;
    this.addConsultaCatalogos('CALIFICACION', consultaCalif, this.lcalificacion, super.llenaListaCatalogo, 'ccalificacion', null, true);

    this.ejecutarConsultaCatalogos();
  }

  public llenaTipoArreglo(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    super.llenaListaCatalogo(pLista, pListaResp, campopk, agregaRegistroVacio, componentehijo);
    componentehijo.mfiltros.ctipoarreglopago = pLista[0].value;
  }

}
