import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovPlantillasComprobanteComponent } from '../../../lov/plantillascomprobante/componentes/lov.plantillasComprobante.component';
import { LovCuentasContablesComponent } from '../../../lov/cuentascontables/componentes/lov.cuentasContables.component';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { LovClasificadorComponent } from '../../../../presupuesto/lov/clasificador/componentes/lov.clasificador.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-detalle-plantillas-comprobante',
  templateUrl: 'detallePlantillasComprobante.html'
})
export class DetallePlantillasComprobanteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  @ViewChild(LovPlantillasComprobanteComponent)
  private lovplantillasComprobante: LovPlantillasComprobanteComponent;
  private catalogoDetalle: CatalogoDetalleComponent

  @ViewChild(LovCuentasContablesComponent)
  private lovcuentasContables: LovCuentasContablesComponent;
  @ViewChild(LovClasificadorComponent)
  private lovclasificador: LovClasificadorComponent;
  public lcentrocostoscdetalle: SelectItem[] = [{ label: '...', value: null }];
  public lcampotablaccatalogo: SelectItem[] = [{ label: '...', value: null }];
  public lcampotablacdetalle: SelectItem[] = [{ label: '...', value: null }];
  tipomovimiento = "";
  campotablaccatalogo = 0;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TconPlantillaDetalle', 'DETALLEPLANTILLA', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);

    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (!this.validaFiltrosRequeridos()) {
      return;
    }

    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.registro.cplantilla = this.mfiltros.cplantilla;
    this.registro.centrocostosccatalogo = 1002;
    this.registro.debito = false;
    this.registro.campotablaccatalogo = this.mcampos.tipomovimientocdetalle;
    //this.registro.tipomovimientocdetalle = this.mcampos.tipomovimientocdetalle;
    this.registro.mdatos.ntipo = this.mcampos.ntipo;
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.cplantilla', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TconCatalogo', 'nombre', 'ncuenta', 'i.ccuenta = t.ccuenta and i.ccompania = t.ccompania');
    consulta.addSubquery('TconCatalogo', 'tipoplancdetalle', 'tipoplancdetalle', 'i.ccuenta = t.ccuenta and i.ccompania = t.ccompania');
    consulta.addSubquery('TgenCatalogo', 'nombre', 'ntipo', 't.campotablaccatalogo = i.ccatalogo');
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'ncampotablacdetalle', 't.campotablacdetalle = i.cdetalle and t.campotablaccatalogo = i.ccatalogo');
    consulta.addSubquery('tpptclasificador', 'nombre', 'npartida', 't.cpartida = i.cclasificador');

    consulta.orderby = 'orden';
    consulta.cantidad = 100;
    this.addConsulta(consulta);
    return consulta;
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
    const conCentroCostosmfiltros: any = { 'ccatalogo': 1002 };
    const conCentroCostos = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', conCentroCostosmfiltros, {});
    conCentroCostos.cantidad = 100;
    this.addConsultaCatalogos('CENTROCOSTOS', conCentroCostos, this.lcentrocostoscdetalle, super.llenaListaCatalogo, 'cdetalle');

    const mfiltrosTipo: any = { 'ccatalogo': 1031 };
    const consultaTipo = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosTipo, {});
    consultaTipo.cantidad = 100;
    this.addConsultaCatalogos('SALDOS', consultaTipo, this.lcampotablaccatalogo, super.llenaListaCatalogo, 'cdetalle');
    this.ejecutarConsultaCatalogos();
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

  /**Muestra lov de plantillas contables */
  mostrarlovplantillasComprobante(): void {
    this.lovplantillasComprobante.consultar();
    this.lovplantillasComprobante.showDialog();
  }


  /**Retorno de lov de plantillas contables. */
  fijarLovPlantillasComprobanteSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.pnombre = reg.registro.nombre;
      this.mfiltros.cplantilla = reg.registro.cplantilla;
      this.mcampos.tipomovimientocdetalle = Number(reg.registro.tipomovimientocdetalle);
      this.mcampos.ntipo = reg.registro.mdatos.ntipo;

      this.CargarListaCampoTablaCdetalle(reg.registro);
      this.consultar();
    }
  }

  /**Muestra lov de cuentas contables */
  mostrarlovcuentasContables(): void {
    this.lovcuentasContables.mfiltros.ccuenta = undefined;
    this.lovcuentasContables.mfiltros.nombre = undefined;
    this.lovcuentasContables.showDialog(true);
    this.lovcuentasContables.consultar();
  }


  /**Retorno de lov de cuentas contables. */
  fijarLovCuentasContablesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.ncuenta = reg.registro.nombre;
      this.registro.ccuenta = reg.registro.ccuenta;
    }
  }

  /**Muestra lov de cuentas contables */
  mostrarlovclasificador(): void {
    this.lovclasificador.mfiltros.movimiento = true;
    this.lovclasificador.showDialog();
    this.lovclasificador.consultar();
  }


  /**Retorno de lov de cuentas contables. */
  fijarLovClasificadorSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.npartida = reg.registro.nombre;
      this.registro.cpartida = reg.registro.cclasificador;
    }
  }




  CargarListaCampoTablaCdetalle(reg: any) {
    this.encerarConsultaCatalogos();
    if (this.estaVacio(reg.tipomovimientocdetalle)) {
      return;
    }
  //  this.mcampos.campotablaccatalogo = reg.tipomovimientoccatalogo;
  //  this.mcampos.campotablacdetalle =Number(reg.tipomovimientocdetalle);
    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = Number(this.mcampos.tipomovimientocdetalle);
    this.catalogoDetalle.mod = this.mod;
    const conDetalleCampoTabla = this.catalogoDetalle.crearDtoConsulta();
    conDetalleCampoTabla.cantidad = 100;
    conDetalleCampoTabla.orderby = 'nombre';
    this.addConsultaCatalogos('CampoTabla', conDetalleCampoTabla, this.lcampotablacdetalle, this.llenaListaCatalogo, 'cdetalle');
    if (!this.estaVacio(this.mcampos.tipomovimientocdetalle)) {
      this.ejecutarConsultaCatalogos();
    }
  }

  cerrarDialogo() {
    this.registro.mdatos.ncampotablaccatalogo = this.lcampotablaccatalogo.find(x => x.value === this.registro.campotablaccatalogo).label;
    this.registro.mdatos.ncampotablacdetalle = this.lcampotablacdetalle.find(x => x.value === this.registro.campotablacdetalle).label;
  }

}
