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
  selector: 'app-reporte-correccionocp',
  templateUrl: 'correccionocp.html'
})
export class CorreccionOcpComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public lmodulos: SelectItem[] = [{ label: '...', value: null }];
  public ltipocuenta: SelectItem[] = [{ label: '...', value: null }];
  public linstitucion: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ttestransaccion', 'OCP_MANTENIMIENTOCOBROS', false);
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
    this.registro.cestado = '7';
    this.registro.codrespuestabce = null;
    this.registro.numeroreferencia = null;
    this.registro.numeroreferenciapago = null;
    this.registro.modificado = true;
    super.actualizar();
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.optlock = 0;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  //  // Inicia CONSULTA *********************
  //  consultar() {
  //   this.fijarFiltrosConsulta();
  //   this.rqConsulta.CODIGOCONSULTA = 'SPI_MANTENIMIENTOPAGOS';
  //   this.rqConsulta.storeprocedure = "sp_TesConObtenerPagosPorEstadoModificable";
  //   super.consultar();
  // }

  // private fijarFiltrosConsulta() {
  //   this.rqConsulta.parametro_modulo = this.mfiltros.cmodulo === undefined ? "" : this.mfiltros.cmodulo;
  //   this.rqConsulta.parametro_estado = '5';
  //   this.rqConsulta.parametro_fingreso = this.mfiltros.fingreso === undefined ? "" : this.mfiltros.fingreso;
  //   this.rqConsulta.parametro_tipotransaccion = 'P';
  // }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  // tomarRegistrosModificar(): boolean {
  //   for (const i in this.lregistros) {
  //     if (this.lregistros.hasOwnProperty(i)) {
  //       const reg: any = this.lregistros[i];
  //       for (const j in this.selectedRegistros) {
  //         if (this.selectedRegistros.hasOwnProperty(j)) {
  //           const mar: any = this.selectedRegistros[j];
  //           if (reg !== undefined && mar !== undefined && reg.ctestransaccion === mar.ctestransaccion) {
  //             reg.mdatos.pagar = true;
  //             this.graba = true;
  //           }
  //         }
  //       }
  //     }
  //   }
  //   if (this.selectedRegistros === undefined || this.selectedRegistros === null) {
  //     this.graba = false;
  //   }
  //   return this.graba;
  // }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    this.mfiltros.verreg = 0;
    this.mfiltros.tipotransaccion = 'C';
    this.mfiltros.cestado = 5;
    var fecha = new Date();
    fecha.setDate(fecha.getDate() + 1);
    let lfechainicial: string = super.calendarToFechaString(this.mfiltros.fingreso);
    let lfechafinal: string = super.calendarToFechaString(fecha);
    this.mfiltrosesp.fingreso = 'between \'' + lfechainicial + '\' and \'' + lfechafinal + '\'';
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
  }

  cerrarDialogo() {
  }

  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    //this.rqMantenimiento.mdatos.MODIFICARPAGOS = this.lregistros;
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
    coninstitucion.cantidad = 100;
    this.addConsultaCatalogos('INSTITUCION', coninstitucion, this.linstitucion, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }
}
