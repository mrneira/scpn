import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-calif-rangos',
  templateUrl: 'calificacionRangos.html'
})
export class CalificacionRangosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public lsegmentos: SelectItem[] = [{ label: '...', value: null }];

  public lcalificacion: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarCalificacionRangos', 'CALIFRANGOS', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.estaVacio(this.mfiltrosigual.csegmento)) {
      this.mostrarMensajeError('SEGMENTO REQUERIDO');
      return;
    }
    super.crearNuevo();
    this.registro.csegmento = this.mfiltrosigual.csegmento;
    this.registrarEtiqueta(this.registro, this.lsegmentos, 'csegmento', 'nsegmento');
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.ccalificacion', this.mfiltros, this.mfiltrosesp, this.mfiltrosigual);

    consulta.addSubquery('TcarSegmento', 'nombre', 'nsegmento', 'i.csegmento = t.csegmento');
    consulta.addSubquery('TgenCalificacion', 'nombre', 'ncalificacion', 'i.ccalificacion = t.ccalificacion');

    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
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

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    const conBaseConComp = new Consulta('TcarSegmento', 'Y', 't.nombre', this.mfiltros, this.mfiltrosesp);
    conBaseConComp.cantidad = 50;
    this.addConsultaCatalogos('SEGMENTO', conBaseConComp, this.lsegmentos, this.llenaListaSegmentos, 'csegmento', this.componentehijo);

    const conCalif = new Consulta('TgenCalificacion', 'Y', 't.nombre', this.mfiltros, this.mfiltrosesp);
    conCalif.cantidad = 50;
    this.addConsultaCatalogos('CALIF', conCalif, this.lcalificacion, super.llenaListaCatalogo, 'ccalificacion');

    this.ejecutarConsultaCatalogos();
  }

  public llenaListaSegmentos(pLista: any, pListaResp, campopk = 'csegmento', agregaRegistroVacio = true, componentehijo = null): any {
    super.llenaListaCatalogo(pLista, pListaResp, campopk, agregaRegistroVacio, componentehijo);

    componentehijo.mfiltrosigual.csegmento = pLista[1].value;
  }

  cambiarSegmento(event: any): any {
    if (this.mfiltrosigual.csegmento === undefined || this.mfiltrosigual.csegmento === null) {
      return;
    };
    this.consultar();
  }

}
