import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovTipoBajaComponent } from '../../../../socios/lov/tipobaja/componentes/lov.tipoBaja.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-liquidacion-baja',
  templateUrl: 'liquidacionBaja.html'
})
export class LiquidacionBajaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  public lestado: SelectItem[] = [{ label: '...', value: null }];
  public ltipoliquidacion: SelectItem[] = [{ label: '...', value: null }];

  @ViewChild(LovTipoBajaComponent)
  private lovTipoBaja: LovTipoBajaComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tpreliquidacionbaja', 'LIQBAJA', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (!this.validaFiltrosConsulta()) {
      return;
    }

    super.crearNuevo();
    this.registro.cdetalletipoexp = this.mfiltros.cdetalletipoexp;
    this.registro.beneficiariosocio = false;
    this.registro.ccatalogotipoexp = 2802;
  }

  actualizar() {
    super.actualizar();
    // this.registrarEtiqueta(this.registro,this.ltipoliquidacion,'cdetalletipoexp','nliquidacion');
    this.grabar();
  }

  eliminar() {
    super.eliminar();
    this.grabar();
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (!this.validaFiltrosConsulta()) {
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.ctipobaja', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nliquidacion', 't.ccatalogotipoexp = i.ccatalogo and t.cdetalletipoexp = i.cdetalle');
    consulta.addSubquery('tsoctipobaja', 'nombre', 'ntipobaja', 't.ctipobaja = i.ctipobaja');
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.ccatalogotipoexp = 2802;
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

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltroTipoLiquidacion: any = { 'ccatalogo': 2802 };
    const conTipLiquidacion = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroTipoLiquidacion, {});
    this.addConsultaCatalogos('TIPLIQUID', conTipLiquidacion, this.ltipoliquidacion, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();

  }

  /**Muestra lov de tipo baja */
  mostrarLovTipoBaja(): void {
    this.lovTipoBaja.showDialog();
  }

  /**Retorno de lov de tipo baja. */
  fijarLovTipoBajaSelec(reg: any): void {

    if (reg.registro !== undefined) {
      this.registro.ctipobaja = reg.registro.ctipobaja;
      this.registro.mdatos.ntipobaja = reg.registro.nombre;

      //  this.consultar();
    }
  }

}
