import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { JasperComponent } from '../../../../../../../util/componentes/jasper/componentes/jasper.component';
import { last } from 'rxjs/operator/last';

@Component({
  selector: 'app-reporte-correccionpagospi',
  templateUrl: 'correccionpagospi.html'
})
export class CorreccionPagoSpiComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public lmodulos: SelectItem[] = [{ label: '...', value: null }];
  public ltipocuenta: SelectItem[] = [{ label: '...', value: null }];
  public linstitucion: SelectItem[] = [{ label: '...', value: null }];
  public ldestino: any[];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ttestransaccion', 'MODIFICARPAGOS', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  actualizar() {
    super.actualizar();
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.optlock = 0;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    this.mfiltros.verreg = 0;
    this.mfiltros.tipotransaccion = 'P';
    this.mfiltros.cestado = 5;
    var fecha = new Date();
    fecha.setDate(fecha.getDate() + 1);
    let lfechainicial=this.fechaToInteger(this.mcampos.fingreso);
    let lfechafinal= this.fechaToInteger(fecha);
    this.mfiltrosesp.fcontable = 'between \'' + lfechainicial + '\' and \'' + lfechafinal + '\'';
    const consulta = new Consulta(this.entityBean, 'Y', 't.ctestransaccion', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'tipocuenta', 'i.ccatalogo = t.tipocuentaccatalogo and i.cdetalle = t.tipocuentacdetalle');
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'institucion', 'i.ccatalogo = t.institucionccatalogo and i.cdetalle = t.institucioncdetalle');
    consulta.addSubquery('TgenModulo', 'nombre', 'modulo', 't.cmodulo = i.cmodulo');
    consulta.addSubquery('ttesestadorespuesta', 'nombre', 'nombre', 't.cestado = i.cestado and i.tipotransaccion=t.tipotransaccion and i.codigorespuesta=t.codrespuestabce and i.modificable=1');
    consulta.addSubquery('ttesestadorespuesta', 'nombre', 'modificable', 't.cestado = i.cestado and i.tipotransaccion=t.tipotransaccion and i.codigorespuesta=t.codrespuestabce and i.modificable=1');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
   // this.mfiltros.ctransaccion = this.ldestino[0].ctransaccionoriginal;
    this.mfiltros.cmodulo = this.ldestino[0].cmoduloriginal;
  }

  cerrarDialogo() {
  }

  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    this.rqMantenimiento.mdatos.MODIFICARPAGOS = this.lregistros;
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
      this.consultar();
    }
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
    const mfiltrosMod: any = { activo: true, negocio: true };
    const conModulo = new Consulta('tgenmodulo', 'Y', 't.nombre', mfiltrosMod, {});
    conModulo.cantidad = 100;
    this.addConsultaCatalogos('MODULOS', conModulo, this.lmodulos, super.llenaListaCatalogo, 'cmodulo');

    const mfiltroscuenta: any = { 'ccatalogo': 306 };
    const concuenta = new Consulta('TgenCatalogoDetalle', 'Y', 't.nombre', mfiltroscuenta, {});
    concuenta.cantidad = 100;
    this.addConsultaCatalogos('TIPOCUENTA', concuenta, this.ltipocuenta, super.llenaListaCatalogo, 'cdetalle');

    const mfiltrosIns: any = { 'ccatalogo': 305,'activo': true };
    const coninstitucion = new Consulta('TgenCatalogoDetalle', 'Y', 't.nombre', mfiltrosIns, {});
    coninstitucion.cantidad = 200;
    this.addConsultaCatalogos('INSTITUCION', coninstitucion, this.linstitucion, super.llenaListaCatalogo, 'cdetalle');

    const mfiltrosDes: any = { cmodulodestino: sessionStorage.getItem('m'), ctransacciondestino: sessionStorage.getItem('t'), tipomapeo: 'MOD' };
    const conDestino = new Consulta('TtesRetroalimentacion', 'Y', 't.cretroalimentacion', mfiltrosDes, {});
    conDestino.cantidad = 50;
    this.addConsultaCatalogos('RETROALIMENTACION', conDestino, this.ldestino, this.llenarRetroalimentacion, '', this.componentehijo);

    this.ejecutarConsultaCatalogos();
  }

  public llenarRetroalimentacion(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    this.componentehijo.ldestino = pListaResp;
  }
}
