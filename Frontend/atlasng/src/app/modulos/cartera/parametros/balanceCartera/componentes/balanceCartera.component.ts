import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { SelectItem } from 'primeng/components/common/selectitem';

@Component({
  selector: 'app-balance-cartera',
  templateUrl: 'balanceCartera.html'
})
export class BalanceCarteraComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  private catalogoDetalle: CatalogoDetalleComponent;
  public ltipo: SelectItem[] = [{ label: '...', value: null }];
  private ccatalogotipo = 705;
  habilitaDefault = false;
  habilitaIncremento = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarBalance', 'BALANCE', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
    this.consultarCatalogos();
  }

  crearNuevo() {
    if (this.mfiltros.cdetalletipo === undefined || this.mfiltros.cdetalletipo === null) {
      super.mostrarMensajeWarn("TIPO DE BALANCE ES REQUERIDO");
      return;
    }

    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.ccatalogotipo = this.ccatalogotipo;
    this.registro.cdetalletipo = this.mfiltros.cdetalletipo;
    this.habilitaDefault = false;
    this.habilitaIncremento = false;
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.orden', this.mfiltros, this.mfiltrosesp);
    consulta.cantidad = 50;
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
    if (resp.cod === "OK") {
      this.enproceso = false;
      this.consultar();
    }
  }
  // Fin MANTENIMIENTO *********************

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = this.ccatalogotipo;
    const conTipoIngreso = this.catalogoDetalle.crearDtoConsulta();
    conTipoIngreso.cantidad = 20;
    this.addConsultaCatalogos('TIPOBALANCE', conTipoIngreso, this.ltipo, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }

  cambiarTipo(event: any): any {
    if (this.mfiltros.cdetalletipo === undefined || this.mfiltros.cdetalletipo === null) {
      return;
    }
    this.mcampos.ntipobalance = this.ltipo.find(x => x.value === event.value).label;
    this.consultar();
  }

  marcarDefault(value: boolean): void {
    this.habilitaDefault = value;
    if (value) {
      this.habilitaIncremento = false;
      this.registro.incremento = this.habilitaIncremento;
      this.marcarIncremento(this.habilitaIncremento);
    } else {
      this.registro.valordefault = null;
    }
  }

  marcarIncremento(value: boolean): void {
    this.habilitaIncremento = value;
    if (value) {
      this.habilitaDefault = false;
      this.registro.default = this.habilitaDefault;
      this.marcarDefault(this.habilitaDefault);
    } else {
      this.registro.porcentajeincremento = null;
    }
  }
}
