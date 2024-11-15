import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { LovCuentasContablesComponent } from '../../../lov/cuentascontables/componentes/lov.cuentasContables.component';

@Component({
  selector: 'app-usuario-reporte',
  templateUrl: 'saldosContablesFechaReporte.html'
})
export class SaldosContablesFechaReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovCuentasContablesComponent)
  lovCuentasContables: LovCuentasContablesComponent;

  public lniveles: SelectItem[] = [{ label: '...', value: null }];
  public lsucursales: SelectItem[] = [{ label: '...', value: null }];
  public lagenciastotal: any = [];
  public lagencias: SelectItem[] = [{ label: '...', value: null }];


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TconSaldos', 'TCONSALDOS', false);
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
    this.fijarListaAgencias();
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  // Inicia CONSULTA *********************
  consultar() {
    super.encerarMensajes();
    if (this.mfiltros.nivel == null) {
      super.mostrarMensajeError('NIVEL REQUERIDO');
      return;
    }
    this.consultarSaldos();
  }

  // consultarSaldos() {
  //   this.rqConsulta.mdatos.nivel = this.mfiltros.nivel === undefined ? "" : this.mfiltros.nivel;
  //   this.rqConsulta.mdatos.ccuenta = this.mfiltros.ccuenta === undefined ? "" : this.mfiltros.ccuenta;
  //   this.rqConsulta.mdatos.ccompania = this.mfiltros.ccompania === undefined ? "" : this.mfiltros.ccompania;
  //   this.rqConsulta.mdatos.csucursal = this.mfiltros.csucursal === undefined ? "" : this.mfiltros.csucursal;
  //   this.rqConsulta.mdatos.cagencia = this.mfiltros.cagencia === undefined ? "" : this.mfiltros.cagencia;
  //   this.msgs = [];
  //   this.rqConsulta.CODIGOCONSULTA = 'SALDOSCONTABLESFECHAREPORTE';
  //   this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
  //     .subscribe(
  //       resp => {
  //         this.manejaRespuestaSaldos(resp);
  //       },
  //       error => {
  //         this.dtoServicios.manejoError(error);
  //       });
  // }
  // private manejaRespuestaSaldos(resp: any) {
  //   this.lregistros = [];
  //   if (resp.cod === 'OK') {
  //     this.lregistros = resp.SALDOSCONTABLESFECHAREPORTE;
  //   }
  // }

  consultarSaldos() {
    this.rqConsulta.CODIGOCONSULTA = 'CON_SALDOFECHA';
    this.rqConsulta.storeprocedure = "sp_ConRptSaldosContablesFecha";
    this.rqConsulta.parametro_ccuenta = this.mfiltros.ccuenta === undefined ? "" : this.mfiltros.ccuenta;
    this.rqConsulta.parametro_fecha = this.mfiltros.ffin === undefined ? "" : this.mfiltros.ffin;
    //this.rqConsulta.parametro_saldo = this.saldo;
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuestaSaldos(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }
    private manejaRespuestaSaldos(resp: any) {
      this.lregistros = [];
      if (resp.cod === 'OK') {
        this.lregistros = resp.CON_SALDOFECHA;
      }
    }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.ccuenta', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TconCatalogo', 'nombre', 'nombreCuenta', 'i.ccuenta = t.ccuenta');
    consulta.addSubquery('TgenAgencia', 'nombre', 'nombreAgencia', 'i.cagencia = t.cagencia');
    consulta.addSubquery('TgenSucursal', 'nombre', 'nombreSucursal', 'i.csucursal = t.csucursal');

    this.addConsulta(consulta);
    return consulta;
  }
  private fijarFiltrosConsulta() {
  }
  descargarReporte(): void {

    this.jasper.nombreArchivo = 'reporteSaldosContables';

    // Agregar parametros
    this.jasper.parametros['@i_cnivel'] = this.mfiltros.nivel;
    this.jasper.parametros['@i_ccuenta'] = this.mfiltros.ccuenta == undefined ? " " : this.mfiltros.ccuenta;
    this.jasper.parametros['@i_ccompania'] = this.mfiltros.ccompania == undefined ? 1 : this.mfiltros.ccompania;
    this.jasper.parametros['@i_csucursal'] = this.mfiltros.csucursal == undefined ? 1 : this.mfiltros.csucursal;
    this.jasper.parametros['@i_cagencia'] = this.mfiltros.cagencia == undefined ? 1 : this.mfiltros.cagencia;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/ReporteSaldosContablesFecha';
    this.jasper.generaReporteCore();
  }

  /**Muestra lov de cuentas contables */
  mostrarlovcuentasContables(): void {

    if (this.mfiltros.nivel == null) {
      super.mostrarMensajeError('NIVEL REQUERIDO');
      return;
    }
    this.lovCuentasContables.cnivel = this.mfiltros.nivel;
    this.lovCuentasContables.showDialog(null);
  }

  /**Retorno de lov de cuentas contables. */
  fijarLovCuentasContablesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.ccuenta = reg.registro.ccuenta;
      this.mfiltros.ccompania = reg.registro.ccompania;
      this.mcampos.ccuentaContable = reg.registro.nombre;
    }
  }

  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.encerarMensajes();
          this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
          this.manejaRespuestaCatalogos(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  llenarConsultaCatalogos(): void {
    const consultaNivel = new Consulta('tconnivel', 'Y', 't.nombre', {}, {});
    consultaNivel.cantidad = 100;
    this.addConsultaPorAlias('NIVEL', consultaNivel);
    const consultaSucursal = new Consulta('TgenSucursal', 'Y', 't.nombre', {}, {});
    consultaSucursal.cantidad = 500;
    this.addConsultaPorAlias('SUCURSAL', consultaSucursal);

    const consultaAgencia = new Consulta('TgenAgencia', 'Y', 't.nombre', {}, {});
    consultaAgencia.cantidad = 500;
    this.addConsultaPorAlias('AGENCIA', consultaAgencia);
  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.lniveles, resp.NIVEL, 'cnivel');
      this.llenaListaCatalogo(this.lsucursales, resp.SUCURSAL, 'csucursal');
      this.lagenciastotal = resp.AGENCIA;
    }
    this.lconsulta = [];
  }

  fijarListaAgencias() {
    this.lagencias = [];
    this.lagencias.push({ label: '...', value: null });
    for (const i in this.lagenciastotal) {
      if (this.lagenciastotal.hasOwnProperty(i)) {
        const reg: any = this.lagenciastotal[i];
        if (reg !== undefined && reg.value !== null && reg.csucursal === Number(this.mfiltros.csucursal)) {
          this.lagencias.push({ label: reg.nombre, value: reg.cagencia });
        }
      }
    }
  }
}
