import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovCuentasContablesComponent } from '../../../../contabilidad/lov/cuentascontables/componentes/lov.cuentasContables.component';

import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { GestorDocumentalComponent } from '../../../../gestordocumental/componentes/gestordocumental.component';

import { SelectItem } from 'primeng/primeng';
@Component({
  selector: 'app-mantenimientovehiculos',
  templateUrl: 'mantenimientovehiculos.html'
})
export class MantenimientoVehiculosComponent extends BaseComponent implements OnInit, AfterViewInit {

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
  public lmarcacdetalle: SelectItem[] = [{ label: '...', value: null }];
  private catalogoMarcaDetalle: CatalogoDetalleComponent;
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tacfproductocodificado', 'PRODUCTOCODIFICADO', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultar();
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
  }

  actualizar() {
    super.actualizar();
  }
  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();


  

    this.catalogoMarcaDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoMarcaDetalle.mfiltros.ccatalogo = 1302;
    const conMarca = this.catalogoMarcaDetalle.crearDtoConsulta();
    conMarca.cantidad = 200;
    this.addConsultaCatalogos('MARCAPRODUCTO', conMarca, this.lmarcacdetalle, super.llenaListaCatalogo, 'cdetalle');

   

    this.ejecutarConsultaCatalogos();

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
    consulta.addSubquery('tacfproducto', 'codigo', 'codigo', 'i.cproducto = t.cproducto');   
    consulta.addSubquery('tacfproducto', 'nombre', 'nombre', 'i.cproducto = t.cproducto');

    consulta.cantidad = 100;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltrosesp.cproducto = "in (SELECT cproducto FROM tacfproducto WHERE codigo LIKE 'veh%')"
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


}
