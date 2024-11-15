
import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovAgentesbolsaComponent } from '../../../../../../inversiones/lov/agentesbolsa/componentes/lov.agentesbolsa.component';
import { LovCuentasContablesComponent } from '../../../../../../contabilidad/lov/cuentascontables/componentes/lov.cuentasContables.component';

@Component({
  selector: 'app-instrumento',
  templateUrl: 'instrumento.html'
})
export class InstrumentoComponent extends BaseComponent implements OnInit, AfterViewInit {

  public pEditable: number = 0;

  public lPortafolio: SelectItem[] = [{ label: '...', value: null }];
  public lMercado: SelectItem[] = [{ label: '...', value: null }];
  public lSistemaColocacion: SelectItem[] = [{ label: '...', value: null }];
  public lEmisor: SelectItem[] = [{ label: '...', value: null }];
  public lInstrumento: SelectItem[] = [{ label: '...', value: null }];
  public lMoneda: SelectItem[] = [{ label: '...', value: null }];
  public lBolsaValores: SelectItem[] = [{ label: '...', value: null }];
  public lClasificacion: SelectItem[] = [{ label: '...', value: null }];
  public lCalendarizacion: SelectItem[] = [{ label: '...', value: null }];
  public lPeriodos: SelectItem[] = [{ label: '...', value: null }];
  public lCupon: SelectItem[] = [{ label: '...', value: null }];
  public lEstado: SelectItem[] = [{ label: '...', value: null }];
  public lCasaValores: SelectItem[] = [{ label: '...', value: null }];
  public lRiesgo: SelectItem[] = [{ label: '...', value: null }];
  public lSector: SelectItem[] = [{ label: '...', value: null }];
  public lAjusteInteres: SelectItem[] = [{ label: '...', value: null }];

  lCuentaContable: number = 0;

  @ViewChild(LovCuentasContablesComponent)
  lovCuentasContables: LovCuentasContablesComponent;

  @ViewChild(LovCuentasContablesComponent)
  lovCuentasContablesBanco: LovCuentasContablesComponent;

  @ViewChild(LovAgentesbolsaComponent)
  lovAgentesBolsa: LovAgentesbolsaComponent;

  @Input()
  natural: BaseComponent;

  @Input()
  detalle: BaseComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tinvinversion', 'INSTRUMENTO', false, false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init();
    this.asignarCatalogoInicial();
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    //super.crearNuevo();
    this.registro = [];
    this.asignarCatalogoInicial();
    this.registro.cinversion = 0;
  }

  actualizar() {
    // No existe para el padre
  }

  eliminar() {
    // No existe para el padre
  }

  cancelar() {
    // No existe para el padre
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
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

  private manejaRespuestaCatalogos(resp: any) {
    if (resp.cod === 'OK') {

      this.llenaListaCatalogo(this.lPortafolio, resp.PORTAFOLIO, 'cdetalle');
      this.llenaListaCatalogo(this.lMercado, resp.MERCADO, 'cdetalle');
      this.llenaListaCatalogo(this.lSistemaColocacion, resp.COLOCACION, 'cdetalle');
      this.llenaListaCatalogo(this.lEmisor, resp.EMISOR, 'cdetalle');
      this.llenaListaCatalogo(this.lInstrumento, resp.INSTRUMENTO, 'cdetalle');
      this.llenaListaCatalogo(this.lMoneda, resp.MONEDA, 'cdetalle');
      this.llenaListaCatalogo(this.lBolsaValores, resp.BOLSAVALORES, 'cdetalle');
      this.llenaListaCatalogo(this.lClasificacion, resp.CLASIFICACION, 'cdetalle');
      this.llenaListaCatalogo(this.lCalendarizacion, resp.CALENDARIZACION, 'cdetalle');
      this.llenaListaCatalogo(this.lPeriodos, resp.PERIODOS, 'cdetalle');
      this.llenaListaCatalogo(this.lCupon, resp.CUPON, 'cdetalle');
      this.llenaListaCatalogo(this.lEstado, resp.ESTADO, 'cdetalle');
      this.llenaListaCatalogo(this.lCasaValores, resp.CASAVALORES, 'cdetalle');
      this.llenaListaCatalogo(this.lRiesgo, resp.RIESGO, 'cdetalle');
      this.llenaListaCatalogo(this.lSector, resp.SECTOR, 'cdetalle');
      this.llenaListaCatalogo(this.lAjusteInteres, resp.AJUSTEINTERES, 'cdetalle');

    }
    this.lconsulta = [];
  }


  llenarConsultaCatalogos(): void {

    const mfiltrosProf: any = { 'ccatalogo': this.registro.portafolioccatalogo };
    const consultaProf = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosProf, {});
    consultaProf.cantidad = 50;
    this.addConsultaPorAlias('PORTAFOLIO', consultaProf);

    const mfiltrosMercado: any = { 'ccatalogo': this.registro.mercadotipoccatalogo };
    const consultaMercado = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosMercado, {});
    consultaProf.cantidad = 50;
    this.addConsultaPorAlias('MERCADO', consultaMercado);

    const mfiltrosBanco: any = { 'ccatalogo': this.registro.bancoccatalogo };
    const consultaBanco = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosBanco, {});
    consultaBanco.cantidad = 50;
    this.addConsultaPorAlias('BANCO', consultaBanco);

    const mfiltrosSistemaColocacion: any = { 'ccatalogo': this.registro.sistemacolocacionccatalogo };
    const consultaSistemaColocacion = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosSistemaColocacion, {});
    consultaProf.cantidad = 50;
    this.addConsultaPorAlias('COLOCACION', consultaSistemaColocacion);


    const mfiltrosEmisor: any = { 'ccatalogo': this.registro.emisorccatalogo };
    const consultaEmisor = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEmisor, {});
    consultaEmisor.cantidad = 50;
    this.addConsultaPorAlias('EMISOR', consultaEmisor);

    const mfiltrosInstrumento: any = { 'ccatalogo': this.registro.instrumentoccatalogo };
    const consultaInstrumento = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosInstrumento, {});
    consultaInstrumento.cantidad = 50;
    this.addConsultaPorAlias('INSTRUMENTO', consultaInstrumento);

    const mfiltrosMoneda: any = { 'ccatalogo': this.registro.monedaccatalogo };
    const consultaMoneda = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosMoneda, {});
    consultaMoneda.cantidad = 50;
    this.addConsultaPorAlias('MONEDA', consultaMoneda);

    const mfiltrosCasaValores: any = { 'ccatalogo': this.registro.bolsavaloresccatalogo };
    const consultaCasaValores = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosCasaValores, {});
    consultaCasaValores.cantidad = 50;
    this.addConsultaPorAlias('BOLSAVALORES', consultaCasaValores);

    const mfiltrosClasificacion: any = { 'ccatalogo': this.registro.clasificacioninversionccatalogo };
    const consultaClasificacion = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosClasificacion, {});
    consultaClasificacion.cantidad = 50;
    this.addConsultaPorAlias('CLASIFICACION', consultaClasificacion);

    const mfiltrosCalendarizacion: any = { 'ccatalogo': this.registro.calendarizacionccatalogo };
    const consultaCalendarizacion = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosCalendarizacion, {});
    consultaCalendarizacion.cantidad = 50;
    this.addConsultaPorAlias('CALENDARIZACION', consultaCalendarizacion);

    const mfiltrosPeriodos: any = { 'ccatalogo': this.registro.periodicidadpagoscapitalccatalogo };
    const consultaPeriodos = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosPeriodos, {});
    consultaPeriodos.cantidad = 50;
    this.addConsultaPorAlias('PERIODOS', consultaPeriodos);

    const mfiltrosCupon: any = { 'ccatalogo': this.registro.compracuponccatalogo };
    const consultaCupon = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosCupon, {});
    consultaCupon.cantidad = 50;
    this.addConsultaPorAlias('CUPON', consultaCupon);

    const mfiltrosEstado: any = { 'ccatalogo': this.registro.estadoccatalogo };
    const consultaEstado = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstado, {});
    consultaEstado.cantidad = 50;
    this.addConsultaPorAlias('ESTADO', consultaEstado);

    const mfiltrosDesicion: any = { 'ccatalogo': this.registro.casavaloresccatalogo };
    const consultaDesicion = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosDesicion, {});
    consultaDesicion.cantidad = 50;
    this.addConsultaPorAlias('CASAVALORES', consultaDesicion);

    const mfiltrosRiesgo: any = { 'ccatalogo': this.registro.calificacionriesgoinicialccatalogo };
    const consultaRiesgo = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosRiesgo, {});
    consultaRiesgo.cantidad = 50;
    this.addConsultaPorAlias('RIESGO', consultaRiesgo);

    const mfiltrosSector: any = { 'ccatalogo': this.registro.sectorccatalogo };
    const consultaSector = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosSector, {});
    consultaSector.cantidad = 50;
    this.addConsultaPorAlias('SECTOR', consultaSector);

    const mfiltrosAjusteInteres: any = { 'ccatalogo': this.registro.formaajusteinteresccatalogo };
    const consultaAjusteInteres = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosAjusteInteres, {});
    consultaAjusteInteres.cantidad = 50;
    this.addConsultaPorAlias('AJUSTEINTERES', consultaAjusteInteres);

  }

  mostrarLovAgentesBolsa(): void {
    this.lovAgentesBolsa.showDialog(); // con true solo muestra cuentas de movimiento.
  }


  fijarLovAgentesBolsaSelect(reg: any): void {

    if (reg.registro !== undefined) {

      this.msgs = [];
      this.mcampos.cinvagentebolsa = reg.registro.cinvagentebolsa;
      this.mcampos.nombres = reg.registro.nombres;
      this.registro.cinvagentebolsa = reg.registro.cinvagentebolsa;

    }
  }

  asignarCatalogoInicial() {

    this.registro.tasaclasificacionccatalogo = 1210;
    this.registro.bolsavaloresccatalogo = 1215;
    this.registro.calendarizacionccatalogo = 1209;
    this.registro.calificacionriesgoinicialccatalogo = 1207;
    this.registro.casavaloresccatalogo = 1217;
    this.registro.clasificacioninversionccatalogo = 1203;
    this.registro.compracuponccatalogo = 1216;
    this.registro.emisorccatalogo = 1213;
    this.registro.formaajusteinteresccatalogo = 1208;
    this.registro.instrumentoccatalogo = 1202;
    this.registro.mercadotipoccatalogo = 1211;
    this.registro.monedaccatalogo = 1214;
    this.registro.periodicidadpagoscapitalccatalogo = 1206;
    this.registro.periodicidadpagosinteresccatalogo = 1206;
    this.registro.portafolioccatalogo = 1201;
    this.registro.sectorccatalogo = 1205;
    this.registro.sistemacolocacionccatalogo = 1212;
    this.registro.bancoccatalogo = 1224;
    this.registro.estadoccatalogo = 1204;
    this.registro.tasaclasificacioncdetalle = "FIJA";

  }

  calcularFechaVencimiento() {

    this.calcularProyeccion();
    this.calcularInteres();
    if (!this.estaVacio(this.registro.fcolocacion) &&
      !this.estaVacio(this.registro.plazo) &&
      this.registro.plazo > 0) {

      const rqConsulta: any = new Object();
      rqConsulta.CODIGOCONSULTA = 'INVERSION';
      rqConsulta.inversion = 3;

      rqConsulta.divisor = this.obtenerCalendarizacion();
      rqConsulta.fcolocacion = this.registro.fcolocacion;
      rqConsulta.plazo = this.registro.plazo;

      this.dtoServicios.ejecutarConsultaRest(rqConsulta)
        .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false);
          if (resp.cod !== 'OK') {
            return;
          }
          this.registro.fvencimiento = resp.FECHAVENCIMIENTO;
        },
        error => {
          this.dtoServicios.manejoError(error);
        });


    }
    else {
      this.registro.fvencimiento = null;
    }
    this.calcularNumeroPagosCapitalInteres();
  }

  calcularNumeroPagosCapitalInteres() {
    this.obtenerLeySb();
    this.calcularNumeroPagosCapital();
    this.calcularNumeroPagosInteres();
  }

  calcularNumeroPagosCapital() {

    this.registro.numeropagoscapital = this.calcularNumeroPagos(this.registro.periodicidadpagoscapitalcdetalle);

  }

  calcularNumeroPagosInteres() {

    this.registro.numeropagosinteres = this.calcularNumeroPagos(this.registro.periodicidadpagosinterescdetalle);

  }

  calcularNumeroPagos(iperiodicidadpagoscdetalle: String): Number {

    let lnumeropagos: Number = null;

    if (!this.estaVacio(iperiodicidadpagoscdetalle) &&
      !this.estaVacio(this.registro.plazo) && this.registro.plazo > 0) {

      let ldivisor: Number = null;

      if (!this.estaVacio(this.registro.calendarizacioncdetalle)) {
        switch (this.registro.calendarizacioncdetalle) {
          case "360":
            ldivisor = 360;
            break;
          case "365":
            ldivisor = 365;
            break;
          default:
            ldivisor = 365;
            break;
        }
      }

      switch (iperiodicidadpagoscdetalle) {
        case "ANUAL":
          if (ldivisor > 0) {
            lnumeropagos = Number(this.registro.plazo) / Number(ldivisor);
          }
          break;
        case "SEM":
          lnumeropagos = Number(this.registro.plazo) / Number(Number(ldivisor) / 2);
          break;
        case "TRIM":
          lnumeropagos = Number(this.registro.plazo) / Number(Number(ldivisor) / 4);
          break;
        case "VENC":
          lnumeropagos = 1;
          break;
      }
    }
    this.calcularInteres();
    return lnumeropagos;
  }

  totalizaComisiones() {
    let ltotal: number = 0;
    if (!this.estaVacio(this.registro.comisionbolsavalores)) {
      ltotal = Number(this.registro.comisionbolsavalores);
    }

    if (!this.estaVacio(this.registro.comisionoperador)) {
      ltotal = ltotal + Number(this.registro.comisionoperador);
    }

    if (!this.estaVacio(this.registro.comisionretencion)) {
      ltotal = ltotal - Number(this.registro.comisionretencion);
    }
    this.registro.comisiontotal = ltotal;

    this.registro.comisionesnegociacion = ltotal;

    this.calcularTotalAPagar();

  }

  calcularEnBase() {
    let lvalornominal: number = 0;
    if (!this.estaVacio(this.registro.valornominal)) {
      lvalornominal = this.registro.valornominal;
    }
    let lporcentajecalculoprecio: number = 0;
    if (!this.estaVacio(this.registro.porcentajecalculoprecio)) {
      lporcentajecalculoprecio = this.registro.porcentajecalculoprecio;
    }
    this.registro.efectivonegociado = lvalornominal * lporcentajecalculoprecio * 0.01;
    this.registro.valordescuento = lvalornominal - Number(this.registro.efectivonegociado);

  }

  calcularInteres() {

    this.calcularEnBase();

    if (!this.estaVacio(this.registro.calendarizacioncdetalle) &&
      this.registro.plazo > 0 &&
      this.registro.tasa > 0 &&
      this.registro.valornominal > 0) {

      this.registro.interesnominalvalor = this.registro.valornominal *
        ((Math.pow(1 + (this.registro.tasa / 100), this.registro.plazo / Number(this.obtenerCalendarizacion()))) - 1)

    }
    else {
      this.registro.interesnominalvalor = null;
    }
    this.registro.utilidad = this.registro.interesnominalvalor;

    this.registro.valornegociacion = this.registro.valornominal;
    this.registro.valornegociado = this.registro.valornominal;

    this.calcularTotalAPagar();

  }

  obtenerCalendarizacion(): Number {
    let ldivisor: Number = null;
    if (!this.estaVacio(this.registro.calendarizacioncdetalle)) {
      switch (this.registro.calendarizacioncdetalle) {
        case "360":
          ldivisor = 360;
          break;
        case "365":
          ldivisor = 365;
          break;
        default:
          ldivisor = 365;
          break;
      }
    }
    return ldivisor;

  }

  obtenerLeySb() {
    let lstrLey: string = "";
    let lstrSb: string = "";
    if (!this.estaVacio(this.registro.plazo)) {
      let lDivisor: Number = 365;
      if (!this.estaVacio(this.registro.calendarizacioncdetalle)) {
        lDivisor = this.obtenerCalendarizacion();
      }
      let lnumLey: Number = Number(this.registro.plazo) / Number(lDivisor);
      if (lnumLey <= 3) {
        lstrLey = "CORTO";
        lstrSb = "0-3";
      }
      else {

        if (lnumLey <= 5) {
          lstrLey = "MEDIANO";
          lstrSb = "3-5";
        }
        else {
          lstrLey = "LARGO";
          lstrSb = "5+";
        }
      }

      lstrLey = lstrLey + " PLAZO";

    }
    this.registro.ley = lstrLey;
    this.registro.sb = lstrSb;

  }

  calcularTotalAPagar() {

    let ltotal: number = 0;
    if (!this.estaVacio(this.registro.efectivonegociado)) {
      ltotal = Number(this.registro.efectivonegociado);
    }

    if (!this.estaVacio(this.registro.interesesnegociacion)) {
      ltotal = ltotal + Number(this.registro.interesesnegociacion);
    }

    if (!this.estaVacio(this.registro.comisionesnegociacion)) {
      ltotal = ltotal + Number(this.registro.comisionesnegociacion);
    }
    this.registro.totalapagar = ltotal;

  }

  calcularProyeccion() {
    let linteresnominaldias: number = 0;
    if (!this.estaVacio(this.registro.femision) && !this.estaVacio(this.registro.fultimopago)) {
      linteresnominaldias = this.dateDiff(this.registro.fultimopago, this.registro.femision);
    }
    let lPlazo: number = 0;
    if (!this.estaVacio(this.registro.plazo) && Number(this.registro.plazo) != 0) {
      lPlazo = Number(this.registro.plazo);
    }
    linteresnominaldias = linteresnominaldias + lPlazo;

    let linterestranscurridodias: number = 0;

    linterestranscurridodias = linteresnominaldias - lPlazo;

    this.registro.interesnominaldias = linteresnominaldias;
    this.registro.interestranscurridodias = linterestranscurridodias;

    this.registro.diasporvencer = linteresnominaldias - linterestranscurridodias;

  }

  dateDiff(ifinicio: Date, iffin: Date): number {

    var MILISENGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;

    var utc1 = Date.UTC(ifinicio.getFullYear(), ifinicio.getMonth(), ifinicio.getDate());
    var utc2 = Date.UTC(iffin.getFullYear(), iffin.getMonth(), iffin.getDate());

    return Math.floor((utc2 - utc1) / MILISENGUNDOS_POR_DIA);

  }

  completaIntereses(iPlazo: number) {

    let lInteresTranscurrido: number = 0;

    if (!this.estaVacio(this.registro.calendarizacioncdetalle) &&

      iPlazo > 0 &&

      this.registro.tasa > 0 &&
      this.registro.valornominal > 0) {

      lInteresTranscurrido = this.registro.valornominal *
        ((Math.pow(1 + (this.registro.tasa / 100), iPlazo / Number(this.obtenerCalendarizacion()))) - 1)

    }

    this.registro.interestranscurrido = lInteresTranscurrido;

    this.registro.interesesnegociacion = lInteresTranscurrido;

    this.registro.interesporvencer = this.registro.interesnominalvalor - lInteresTranscurrido;

    this.calcularTotalAPagar();

  }


}

