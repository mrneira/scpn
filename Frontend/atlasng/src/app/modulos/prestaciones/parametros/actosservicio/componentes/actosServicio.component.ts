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
  selector: 'app-actos-servicio',
  templateUrl: 'actosServicio.html'
})
export class ActosServicioComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  public lestado: SelectItem[] = [{ label: '...', value: null }];
  public ltipoliquidacion: SelectItem[] = [{ label: '...', value: null }];

  @ViewChild(LovTipoBajaComponent)
  private lovTipoBaja: LovTipoBajaComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tpreactosservicio', 'ACTOSSERVICIO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
    this.consultar();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    this.mcampos.ntipobaja = '';
    super.crearNuevo();

  }

  actualizar() {
    super.actualizar();
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
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.ctipobaja', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tsoctipobaja', 'nombre', 'ntipobaja', 't.ctipobaja = i.ctipobaja');
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {

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
    this.enproceso = false;
    this.consultar();
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
    this.lovTipoBaja.consultar();
  }

  /**Retorno de lov de tipo baja. */
  fijarLovTipoBajaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.ctipobaja = reg.registro.ctipobaja;
      this.mcampos.ntipobaja = reg.registro.nombre;
    }
  }
}
