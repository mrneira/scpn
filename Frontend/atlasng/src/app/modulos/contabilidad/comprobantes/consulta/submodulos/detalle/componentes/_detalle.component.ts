import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';
import { LovConceptoContablesComponent } from '../../../../../lov/conceptocontables/componentes/lov.conceptoContables.component';
import { LovPlantillasComprobanteComponent } from '../../../../../lov/plantillascomprobante/componentes/lov.plantillasComprobante.component';
import { LovCuentasContablesComponent } from '../../../../../lov/cuentascontables/componentes/lov.cuentasContables.component';
import { DetallePlantillasComprobanteComponent } from '../../../../../parametros/detalleplantillascomprobante/componentes/detallePlantillasComprobante.component';
import {CatalogoDetalleComponent} from '../../../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import {AccordionModule} from 'primeng/primeng';

@Component({
  selector: 'app-detalle',
  templateUrl: '_detalle.html'
})
export class DetalleComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPlantillasComprobanteComponent)
  private lovplantillasComprobante: LovPlantillasComprobanteComponent;

  @ViewChild(LovConceptoContablesComponent)
  private lovconceptoContables: LovConceptoContablesComponent;

  @ViewChild(LovCuentasContablesComponent)
  private lovcuentasContables: LovCuentasContablesComponent;

  @Output() calcularTotalesDebitoCreditoEvent = new EventEmitter();

  public lregplantilla: any = [];
  public totalDebitoFA = 0;
  public totalCreditoFA = 0;

  public lcentrocostoscdetalle: SelectItem[] = [{label: '...', value: null}];

  private catalogoDetalle: CatalogoDetalleComponent

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TconComprobanteDetalle', 'DETALLE', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.mcampos.nsucursal = this.dtoServicios.mradicacion.nsucursal;
    this.mcampos.nagencia = this.dtoServicios.mradicacion.nagencia;
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }



  crearNuevo() {
    super.crearNuevo();
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.registro.centrocostosccatalogo = 1002;
  }

  actualizar() {
    if (this.registro.padre === undefined) {
      this.registro.padre = this.mfiltros.padre;
    }
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
    this.calcularTotalesDebitoCreditoEvent.emit();
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

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.ccomprobante', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tconcatalogo', 'tipoplancdetalle', 'tipoplancdetalle', 'i.ccuenta = t.ccuenta');
    consulta.addSubquery('tconcatalogo', 'nombre', 'ncuenta', 'i.ccuenta = t.ccuenta');
    consulta.cantidad = 100;
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
   return true;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
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

  crearNuevoRegistro() {
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    super.crearnuevoRegistro();

  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1002;
    const conCentroCostos = this.catalogoDetalle.crearDtoConsulta();
    this.addConsultaCatalogos('CENTROCOSTOS', conCentroCostos, this.lcentrocostoscdetalle , super.llenaListaCatalogo, 'cdetalle');
    this.ejecutarConsultaCatalogos();
  }

}
