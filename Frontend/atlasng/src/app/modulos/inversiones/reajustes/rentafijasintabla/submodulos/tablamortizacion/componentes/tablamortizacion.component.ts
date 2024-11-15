
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { InversionesServicios } from './../../../../../servicios/_invservicios.service';

@Component({
  selector: 'app-tablamortizacion',
  templateUrl: 'tablamortizacion.html'
})
export class TablamortizacionComponent extends BaseComponent implements OnInit, AfterViewInit {

  public pTransaccion: number = 0;

  public pCinversion: number = null;

  public lEstado: SelectItem[] = [{ label: '...', value: null }];
  public pEditable: number = 0;

  public pEliminar: boolean = false;

  constructor(router: Router, dtoServicios: DtoServicios,
    private inversionesServicios: InversionesServicios) {

    super(router, dtoServicios, 'ABSTRACT', 'TABLAAMORTIZA', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {

    super.init();
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {

    if (!this.construirTablaValidar()) {
      return;
    }

    super.crearNuevo();

    this.registro.estadocdetalle = "PEN";
    this.registro.mdatos.nestado = 'PENDIENTE';

    this.totalizar();

  }

  actualizar() {
    if (!this.validarRegistro()) {
      return;
    }
    if (this.registro.plazo <= 0) {
      this.mostrarMensajeError(this.obtenerErrorPlazo());
      return;
    }

    super.actualizar();

    this.construirTabla();

    this.totalizar(true, true);
    this.encerarMensajes();

  }

  construirTabla(): string {

    let lMensaje: string = "";

    lMensaje = this.validaConstruirTabla();

    if (this.estaVacio(lMensaje) && this.pTransaccion < 3000)
    {
      return lMensaje;
    }

    this.inversionesServicios.ptablaamortizaregistro = this.lregistros;

    if (this.inversionesServicios.ptablaamortizaregistro != undefined && this.inversionesServicios.ptablaamortizaregistro.length > 0) {

      const rqConsulta: any = new Object();
      rqConsulta.CODIGOCONSULTA = 'INVERSION';
      rqConsulta.inversion = 9;

      rqConsulta.cinversion = this.pCinversion;

      rqConsulta.tablaamortiza = this.lregistros;
      rqConsulta.fcompra = this.inversionesServicios.pFcompra;
      rqConsulta.calendarizacioncdetalle = this.inversionesServicios.pCalendarizacioncdetalle;
      rqConsulta.yield = this.inversionesServicios.pYield;
      rqConsulta.femision = this.inversionesServicios.pFemision;
      rqConsulta.tasa = this.inversionesServicios.pTasa;
      rqConsulta.fultimopago = this.inversionesServicios.pFultimopago;
      rqConsulta.pTransaccion =  this.pTransaccion;

      this.dtoServicios.ejecutarConsultaRest(rqConsulta)
        .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false);
          if (resp.cod !== 'OK') {
            return "";
          }

          this.inversionesServicios.construyePago(resp, this.inversionesServicios.pMercadotipocdetalle);
          this.lregistros = resp.lregistros;
          this.inversionesServicios.ptablaamortizaregistro = resp.lregistros;
        },
        error => {
          this.dtoServicios.manejoError(error);
        });

      this.obtenerTIR();

      return "";

    }

  }



  eliminar() {

    if (this.pEliminar) {
      super.eliminar();
      this.totalizar(true, true);
    }

  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {

    this.pEliminar = true;
    if (registro.estadocdetalle == "PAG") {
      this.mostrarMensajeError("NO PUEDE MODIFICAR LAS CUOTAS PAGADAS");
      this.pEliminar = false;
      return;
    }

    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar(): string {

    let lMensaje: string = this.validaConstruirTabla();

    if (!this.estaVacio(lMensaje)) {
      return lMensaje;
    }

    this.lregistros = [];
    this.totalizar(false);

    let lreturn: boolean = true;

    const rqConsulta: any = new Object();
    rqConsulta.CODIGOCONSULTA = 'INVERSION';
    rqConsulta.inversion = 2;
    rqConsulta.cinversion = this.mfiltros.cinversion;

    this.dtoServicios.ejecutarConsultaRest(rqConsulta)
      .subscribe(
      resp => {
        this.dtoServicios.llenarMensaje(resp, false);
        if (resp.cod !== 'OK') {
          return "";
        }

        for (const i in resp.TABAMO) {
          if (resp.TABAMO.hasOwnProperty(i)) {
     
            resp.TABAMO[i].mdatos.nestado = resp.TABAMO[i].nestado;
          }
        }

        this.lregistros = resp.TABAMO;
        this.inversionesServicios.ptablaamortizaregistro = resp.TABAMO;

        let lreturn  = this.construirTabla();

        if (!lreturn) {
          this.totalizar(false);
        }
      },
      error => {
        this.dtoServicios.manejoError(error);
      });

    return "";
  }

  public fijarFiltrosConsulta() {
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  totalizarLinea() {

    let lproyeccioncapital: number = 0;
    let lproyeccioninteres: number = 0;
    let lvalormora: number = 0;

    if (!this.estaVacio(this.registro.proyeccioncapital)) {
      lproyeccioncapital = Number(this.registro.proyeccioncapital);
    }

    if (!this.estaVacio(this.registro.proyeccioninteres)) {
      lproyeccioninteres = Number(this.registro.proyeccioninteres);
    }

    if (!this.estaVacio(this.registro.valormora)) {
      lvalormora = Number(this.registro.valormora);
    }

    this.registro.total = lproyeccioncapital +
      lproyeccioninteres +
      lvalormora;

  }

  calcularPlazo() {

    if (!this.validarRegistro()) {
      return;
    }

    var MILISENGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;

    var utc1 = Date.UTC(this.registro.nfinicio.getFullYear(), this.registro.nfinicio.getMonth(), this.registro.nfinicio.getDate());
    var utc2 = Date.UTC(this.registro.nfvencimiento.getFullYear(), this.registro.nfvencimiento.getMonth(), this.registro.nfvencimiento.getDate());

    this.registro.plazo = Math.floor((utc2 - utc1) / MILISENGUNDOS_POR_DIA);

    if (this.registro.plazo <= 0) {
      this.mostrarMensajeError(this.obtenerErrorPlazo());
    }
  }

  validarRegistro(): boolean {
    let lRetorno: boolean = true;
    if (this.estaVacio(this.registro.nfinicio)) {
      this.mostrarMensajeError("FECHA DE INICIO REQUERIDA");
      lRetorno = false;
    }
    if (this.estaVacio(this.registro.nfvencimiento)) {
      this.mostrarMensajeError("FECHA DE VENCIMIENTO REQUERIDA");
      lRetorno = false;
    }
    if (this.registro.proyecciontasa < 0) {
      this.mostrarMensajeError("VALOR DE LA TASA DEBE SER UN NÚMERO ENTERO POSITIVO");
      lRetorno = false;
    }
    if (this.registro.proyeccioncapital < 0) {
      this.mostrarMensajeError("VALOR DEL CAPITAL SER UN NÚMERO ENTERO POSITIVO");
      lRetorno = false;
    }
    if (this.registro.proyeccioninteres < 0) {
      this.mostrarMensajeError("VALOR DEL INTERÉS SER UN NÚMERO ENTERO POSITIVO");
      lRetorno = false;
    }
    return lRetorno;
  }

  obtenerErrorPlazo(): string {
    return "FECHA DE INICIO DEBE SER MENOR QUE LA FECHA DE VENCIMIENTO";
  }

  public totalizar(
    iblncontabillizar: boolean = true,
    iblngeneraComisiones: boolean = false): number {

    this.inversionesServicios.pUtilidad = 0;


    this.inversionesServicios.ptablaamortizaregistro = this.lregistros;


    this.rqMantenimiento.lregistrosTotales[0].capital = this.inversionesServicios.pCapital;

    this.rqMantenimiento.lregistrosTotales[0].interes = this.inversionesServicios.pInteres;
    this.rqMantenimiento.lregistrosTotales[0].total = this.inversionesServicios.pCapital + this.inversionesServicios.pInteres;

    this.inversionesServicios.pUtilidad = this.inversionesServicios.pInteres;

    if (this.pEditable != 0 && iblngeneraComisiones == true) {
      this.inversionesServicios.generarComisiones();
      this.inversionesServicios.sumaComisiones();
    }

    if (iblncontabillizar && this.pEditable != 0) {
      this.inversionesServicios.Contabilizar(this.inversionesServicios.pcCOMPRA);
    }

    

    this.obtenerTIR();


    return this.rqMantenimiento.lregistrosTotales[0].total;
  }

  private manejaRespuestaCatalogos(resp: any) {
    if (resp.cod === 'OK') {

      this.llenaListaCatalogo(this.lEstado, resp.ESTADO, 'cdetalle');

    }
  }

  llenarConsultaCatalogos(): void {

    const mfiltrosEstado: any = { 'ccatalogo': 1218 };
    const consultaEstado = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstado, {});
    consultaEstado.cantidad = 50;
    this.addConsultaPorAlias('ESTADO', consultaEstado);
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

  obtenerTIR() {

    let lPorcentajecalculoprecio: number = 0;

    let lValorCompra: number = null;

    if (!this.estaVacio(this.inversionesServicios.pPorcentajecalculoprecio) && Number(this.inversionesServicios.pPorcentajecalculoprecio) != 0) {
      lPorcentajecalculoprecio = this.inversionesServicios.pPorcentajecalculoprecio * 0.01;
    }

    if (!this.estaVacio(this.inversionesServicios.pEfectivonegociado) && Number(this.inversionesServicios.pEfectivonegociado) != 0)
    {
      lValorCompra = this.inversionesServicios.pEfectivonegociado;
    }
    else
    {
      lValorCompra = this.inversionesServicios.pCapital * lPorcentajecalculoprecio;
    }

    this.inversionesServicios.generaTIR(
      lValorCompra
      , this.inversionesServicios.pinterestranscurrido
      , this.inversionesServicios.pComisionBolsa
      , this.inversionesServicios.pComisionOperador);

    let lTIR: number = 0;

    const rqConsulta: any = new Object();
    rqConsulta.CODIGOCONSULTA = 'INVERSION';
    rqConsulta.inversion = 6;
    rqConsulta.pTIR = this.inversionesServicios.pTIR;

    this.dtoServicios.ejecutarConsultaRest(rqConsulta)
      .subscribe(
      resp => {
        this.dtoServicios.llenarMensaje(resp, false);
        if (resp.cod !== 'OK') {
          return;
        }

        lTIR = resp.TIR;

        this.inversionesServicios.pTirAdd(
          this.inversionesServicios.pTirTitulo
          , null
          , null
          , null
          , null
          , null
          , null
          , lTIR);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  construirTablaValidar(): boolean {

    let lvalida: boolean = true;

    if (this.estaVacio(this.inversionesServicios.pFcompra) ||
      this.estaVacio(this.inversionesServicios.pCalendarizacioncdetalle) ||
      this.estaVacio(this.inversionesServicios.pYield) ||
      this.estaVacio(this.inversionesServicios.pFemision)) {
      this.mostrarMensajeError("DEBE SUBIR LA TABLA DE PAGOS EN EXCEL");

      lvalida = false;
    }
    return lvalida;
  }

  validaConstruirTabla(): string {

    let lMensaje: string = "";

    if (this.estaVacio(this.inversionesServicios.pFcompra)) {
      lMensaje = "FECHA DE COMPRA";
    }

    if (this.estaVacio(lMensaje) && this.estaVacio(this.inversionesServicios.pCalendarizacioncdetalle)) {
      lMensaje = "BASE DE CÁLCULO PARA EL INTERÉS";
    }

    if (this.estaVacio(lMensaje) && this.estaVacio(this.inversionesServicios.pYield)) {
      lMensaje = "BASE DE CÁLCULO PARA EL INTERÉS";
    }

    if (this.estaVacio(lMensaje) && this.estaVacio(this.inversionesServicios.pFemision)) {
      lMensaje = "FECHA DE EMISIÓN";
    }

    if (!this.estaVacio(lMensaje)) {
      lMensaje = "FALTA [" + lMensaje + "].  SUBA LA INFORMACIÓN DE EXCEL";
    }

    return lMensaje;
  }


}
