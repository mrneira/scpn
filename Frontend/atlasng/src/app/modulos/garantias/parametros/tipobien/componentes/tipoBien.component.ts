import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-tipo-gar',
  templateUrl: 'tipoBien.html'
})
export class TipoBienComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public ltipogarantia: SelectItem[] = [{ label: '...', value: null }];
  public ltiposeguro: SelectItem[] = [{ label: '...', value: null }];
  public checkableSeguro = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TgarTipoBien', 'TIPOBIEN', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.estaVacio(this.mfiltros.ctipogarantia)) {
      this.mostrarMensajeError('TIPO DE GARANTÍA REQUERIDA');
      return;
    }
    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.ctipogarantia = this.mfiltros.ctipogarantia;
    this.registrarEtiqueta(this.registro, this.ltipogarantia, 'ctipogarantia', 'ntipogar');
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.nombre', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgarTipoGarantia', 'nombre', 'ntipogar', 'i.ctipogarantia = t.ctipogarantia');
    consulta.addSubquery('TsgsTipoSeguroDetalle', 'nombre', 'ntiposeguro', 'i.ctiposeguro = t.ctiposeguro and i.verreg = 0');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    if (this.estaVacio(this.mfiltros.ctipogarantia)) {
      this.mostrarMensajeError("TIPO DE GARANTÍA REQUERIDO");
      return;
    }
    return super.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
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

    const consultaEstadoope = new Consulta('TgarTipoGarantia', 'Y', 't.nombre', null, null);
    consultaEstadoope.cantidad = 50;
    this.addConsultaCatalogos('TIPOGAR', consultaEstadoope, this.ltipogarantia, this.llenaListaGar, 'ctipogarantia', this.componentehijo);

    const mfiltrosTipoSeguro: any = { verreg: 0 };
    const conTipoSeguro = new Consulta('TsgsTipoSeguroDetalle', 'Y', 't.nombre', mfiltrosTipoSeguro, {});
    conTipoSeguro.cantidad = 100;
    this.addConsultaCatalogos('TIPOSEGURO', conTipoSeguro, this.ltiposeguro, super.llenaListaCatalogo, 'ctiposeguro');

    this.ejecutarConsultaCatalogos();
  }

  public llenaListaGar(pLista: any, pListaResp, campopk = 'pk', agregaRegistroVacio = true, componentehijo = null): any {
    super.llenaListaCatalogo(pLista, pListaResp, campopk, agregaRegistroVacio, componentehijo);
    componentehijo.mfiltros.ctipogarantia = pListaResp[0].pk;
  }

  marcarSeguro(value: boolean): void {
    this.checkableSeguro = value;
    this.registro.ctiposeguro = null;
  }

}
