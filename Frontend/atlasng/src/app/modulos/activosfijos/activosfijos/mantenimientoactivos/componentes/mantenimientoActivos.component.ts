import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovCuentasContablesComponent } from '../../../../contabilidad/lov/cuentascontables/componentes/lov.cuentasContables.component';
import { SelectItem } from 'primeng/primeng';
import {CatalogoDetalleComponent} from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';

import { GestorDocumentalComponent } from '../../../../gestordocumental/componentes/gestordocumental.component';
@Component({
  selector: 'app-mantenimientoActivos',
  templateUrl: 'mantenimientoActivos.html'
})
export class MantenimientoActivosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild('lov1')
  lovCuentas: LovCuentasContablesComponent;
  @ViewChild('lov2')
  lovCuentasDepreciacion: LovCuentasContablesComponent;
  @ViewChild('lov3')
  lovCuentasGasto: LovCuentasContablesComponent;
  @ViewChild('lov4')
  lovCuentasDepreciacionAcum: LovCuentasContablesComponent;
  @ViewChild(GestorDocumentalComponent)
  private lovGestor: GestorDocumentalComponent;
  public visible = true;

  private catalogoDetalle: CatalogoDetalleComponent;
  
  public lestructura: SelectItem[] = [{ label: '...', value: null }];
  public lestado    : SelectItem[] = [{ label: '...', value: null }];
  public lubicacion : SelectItem[] = [{ label: '...', value: null }];//RNI 20240802

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tacfproductocodificado', 'PRODUCTOCODIFICADO', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
  }

  actualizar() {
    super.actualizar();
    this.registro.estructuraccatalogo=1310;
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.cbarras', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tacfproducto', 'nombre', 'nproducto', 'i.cproducto = t.cproducto');
    consulta.cantidad = 100;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
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

  
  /**Muestra lov de cuentas contables */
  mostrarLovCuentas(): void {
    this.lovCuentas.showDialog(true);
  }

  /**Retorno de lov de Cuentas Contables. */
  fijarLovCuentasSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.ccuenta = reg.registro.ccuenta;
    }
  }

  /**Muestra lov de cuentas contables */
  mostrarLovCuentasDepreciacion(): void {
    this.lovCuentasDepreciacion.showDialog(true);
  }

  /**Retorno de lov de Cuentas Contables. */
  fijarLovCuentasDepreciacionSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.ccuentadepreciacion = reg.registro.ccuenta;
    }
  }

  mostrarLovCuentasDepreciacionAcum(): void {
    this.lovCuentasDepreciacionAcum.showDialog(true);
  }

  /**Retorno de lov de Cuentas Contables. */
  fijarLovCuentasDepreciacionAcumSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.ccuentadepreciacionacum = reg.registro.ccuenta;
    }
  }
  /**Muestra lov de cuentas contables */
  mostrarLovCuentasGasto(): void {
    this.lovCuentasGasto.showDialog(true);
  }
  mostrarLovGestorDocumental(reg: any): void {
    this.selectRegistro(reg);
    this.mostrarDialogoGenerico = false;
    this.lovGestor.showDialog(reg.cgesarchivo);
  }
  /**Retorno de lov de Gestión Documental. */
  fijarLovGestorDocumental(reg: any): void {
    if (reg !== undefined) {
      this.registro.cgesarchivo = reg.cgesarchivo;
      this.registro.mdatos.ndocumento = reg.ndocumento;
      this.actualizar();

      this.grabar();
      this.visible = true;

    }
  }
  descargarArchivo(cgesarchivo: any): void {
    this.lovGestor.consultarArchivo(cgesarchivo, true);
  }

  /**Retorno de lov de Cuentas Contables. */
  fijarLovCuentasGastoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.ccuentagasto = reg.registro.ccuenta;
    }
  }

  limpiarlovcuentacontable(): void {
    this.registro.ccuenta = null;
  }

  limpiarlovcuentacontabledepreciacion(): void {
    this.registro.ccuentadepreciacion = null;
  }

  limpiarlovcuentacontabledepreciacionacum(): void {
    this.registro.ccuentadepreciacionacum = null;
  }

  limpiarlovcuentacontablegasto(): void {
    this.registro.ccuentagasto = null;
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1310;
    const conPorcentajeIVA = this.catalogoDetalle.crearDtoConsulta();
    this.addConsultaCatalogos('ESTRUCTURA', conPorcentajeIVA, this.lestructura, super.llenaListaCatalogo, 'cdetalle');
    
    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1301;
    const conEstado = this.catalogoDetalle.crearDtoConsulta();
    conEstado.cantidad = 20;
    this.addConsultaCatalogos('ESTADOPRODUCTO', conEstado, this.lestado, super.llenaListaCatalogo, 'cdetalle');

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1309;
    const conUbicacion = this.catalogoDetalle.crearDtoConsulta();
    conUbicacion.cantidad = 20;
    this.addConsultaCatalogos('UBICACION', conUbicacion, this.lubicacion, super.llenaListaCatalogo, 'cdetalle');
    
    this.ejecutarConsultaCatalogos();
  }
}
