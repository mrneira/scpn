import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CodigosConsultaComponent } from './_codigosConsulta.component';
import { TransaccionesConsultaComponent } from './_transaccionesConsulta.component';
import { CanalesComponent } from '../../../generales/canales/componentes/canales.component';


@Component({
  selector: 'app-componentes-consulta',
  templateUrl: 'componentesConsulta.html'
})
export class ComponentesConsultaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(CodigosConsultaComponent)
  codConsultas: CodigosConsultaComponent;

  @ViewChild(TransaccionesConsultaComponent)
  tranConsultas: TransaccionesConsultaComponent;

  public lcanales: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'COMPCONSULTA', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
    this.mfiltros.ccanal = 'OFI';

    this.fijarFiltrosConsulta();
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

   selectRegistro(registro: any) {
    // No existe para el padre
  }

  crearNuevo() {
    // No existe para el padre
  }

  actualizar() {
    // No existe para el padre
  }

  eliminar() {
    // No existe para el padre
  }

  cancelar() {
   // No existe para el padre
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    // Consulta datos.
    const conCodConsultas = this.codConsultas.crearDtoConsulta();
    this.addConsultaPorAlias(this.codConsultas.alias, conCodConsultas);

    const conTranConsultas = this.tranConsultas.crearDtoConsulta();
    this.addConsultaPorAlias(this.tranConsultas.alias, conTranConsultas);
  }

  private fijarFiltrosConsulta() {
    this.codConsultas.mfiltros.ccanal = this.mfiltros.ccanal;
    this.codConsultas.mfiltros.cconsulta = this.mfiltros.cconsulta;

    this.tranConsultas.mfiltros.ccanal = this.mfiltros.ccanal;
    this.tranConsultas.mfiltros.cconsulta = this.mfiltros.cconsulta;

    this.codConsultas.fijarFiltrosConsulta();
    this.tranConsultas.fijarFiltrosConsulta();
  }

  validaFiltrosConsulta(): boolean {
    return this.codConsultas.validaFiltrosRequeridos() && this.tranConsultas.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.codConsultas.postQuery(resp);
    this.tranConsultas.postQuery(resp);
  }

  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    super.addMantenimientoPorAlias(this.codConsultas.alias, this.codConsultas.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.tranConsultas.alias, this.tranConsultas.getMantenimiento(2));

    // para adicionar otros entity bean super.addMantenimientoPorAlias('alias',mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  public postCommit(resp: any) {
    this.codConsultas.postCommitEntityBean(resp, this.getDtoMantenimiento(this.codConsultas.alias));
    this.tranConsultas.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tranConsultas.alias));
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    const canalComponent = new CanalesComponent(this.router, this.dtoServicios);
    const conCanales = canalComponent.crearDtoConsulta();
    this.addConsultaCatalogos('MODCATALOGO', conCanales, this.lcanales, super.llenaListaCatalogo, 'ccanal');

    this.ejecutarConsultaCatalogos();

  }

}
