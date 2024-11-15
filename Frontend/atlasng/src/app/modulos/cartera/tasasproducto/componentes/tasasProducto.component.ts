import { LovSaldoComponent } from './../../../monetario/lov/saldo/componentes/lov.saldo.component';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovProductoComponent } from '../../../generales/lov/producto/componentes/lov.producto.component';
import { LovTipoProductoComponent } from '../../../generales/lov/tipoproducto/componentes/lov.tipoProducto.component';

@Component({
  selector: 'app-tasas-producto',
  templateUrl: 'tasasProducto.html'
})
export class TasasProductoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovProductoComponent)
  private lovproducto: LovProductoComponent;

  @ViewChild(LovTipoProductoComponent)
  private lovtipoProducto: LovTipoProductoComponent;

  @ViewChild(LovSaldoComponent)
  private lovsaldo: LovSaldoComponent;

  public lregplantilla: any = [];

  public lmoneda: SelectItem[] = [{ label: '...', value: null }];
  public lsaldo: SelectItem[] = [{ label: '...', value: null }];
  public ltasareferencial: SelectItem[] = [{ label: '...', value: null }];
  public loperador: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarProductoTasas', 'PRODUCTOTASAS', false, true);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  crearNuevo() {
    if (!this.validaFiltrosRequeridos()) {
      return;
    }

    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.cmodulo = 7;
    this.registro.cmoneda = 'USD';
    this.registro.cproducto = this.mfiltros.cproducto;
    this.registro.ctipoproducto = this.mfiltros.ctipoproducto;
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

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cproducto', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenTipoProducto', 'nombre', 'nnombre', 'i.cmodulo = 7 and i.cproducto = t.cproducto and i.ctipoproducto = t.ctipoproducto');
    consulta.addSubquery('TgenMoneda', 'nombre', 'nmoneda', 'i.cmoneda = t.cmoneda');
    consulta.addSubquery('TmonSaldo', 'nombre', 'nsaldo', 'i.cmodulo = 7 and i.csaldo = t.csaldo');
    consulta.addSubquery('TgenTasareferencial', 'nombre', 'ntasa', 'i.cmoneda = t.cmoneda and i.ctasareferencial = t.ctasareferencial');
    consulta.addSubquery('TgenTasareferencial', 'tasa', 'ntasabase', 'i.cmoneda = t.cmoneda and i.ctasareferencial = t.ctasareferencial');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.verreg = 0;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
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
  }

  /**Muestra lov de producto */
  mostrarlovproducto(): void {
    this.lovproducto.cmodulo = 7;
    this.lovproducto.consultar();
    this.lovproducto.showDialog(7);
  }

  /**Retorno de lov de producto. */
  fijarLovProductoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.nombre = reg.registro.nombre;
      this.mfiltros.cproducto = reg.registro.cproducto;
    }
    this.mcampos.tnombre = null;
    this.mfiltros.ctipoproducto = null;

    this.mostrarlovtipoProducto();
  }

  /**Muestra lov de tipo producto */
  mostrarlovtipoProducto(): void {
    this.lovtipoProducto.cmodulo = 7;
    this.lovtipoProducto.cproducto = this.mfiltros.cproducto;
    this.lovtipoProducto.consultar();
    this.lovtipoProducto.showDialog(7, this.mfiltros.cproducto);
  }

  /**Retorno de lov de tipo de producto. */
  fijarLovTipoProductoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.tnombre = reg.registro.nombre;
      this.mfiltros.ctipoproducto = reg.registro.ctipoproducto;
      this.consultar();
    }
  }

  /**Muestra lov de saldo */
  mostrarlovsaldo(): void {
    this.lovsaldo.showDialog();
  }

  /**Retorno de lov de saldo. */
  fijarLovSaldoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.nombre = reg.registro.nombre;
      this.registro.csaldo = reg.registro.csaldo;
      this.registro.mdatos.nsaldo = reg.registro.nombre;

    }
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    const conModMoneda = new Consulta('TgenMoneda', 'Y', 't.nombre', null, null);
    this.addConsultaCatalogos('MONEDA', conModMoneda, this.lmoneda, super.llenaListaCatalogo, 'cmoneda');

    const mfiltrosTasa = { cmodulo: 7 };
    const conModSaldo = new Consulta('TmonSaldo', 'Y', 't.nombre', mfiltrosTasa, null);
    this.addConsultaCatalogos('SALDO', conModSaldo, this.lsaldo, super.llenaListaCatalogo);

    const consultaTasaRef = new Consulta('TgenTasareferencial', 'Y', 't.nombre', null, null);
    consultaTasaRef.cantidad = 50;
    this.addConsultaCatalogos('TASAREFERENCIAL', consultaTasaRef, this.ltasareferencial, super.llenaListaCatalogo, 'ctasareferencial');

    this.ejecutarConsultaCatalogos();
    this.llenarOperador();
  }

  llenarOperador() {
    this.loperador = [];
    this.loperador.push({ label: '...', value: null });
    this.loperador.push({ label: 'SUMAR', value: '+' });
    this.loperador.push({ label: 'RESTAR', value: '-' });
    this.loperador.push({ label: 'PORCENTAJE', value: '%' });
  }
}
