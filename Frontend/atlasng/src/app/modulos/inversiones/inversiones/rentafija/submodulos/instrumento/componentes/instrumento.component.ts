
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
import { InversionesServicios } from './../../../../../servicios/_invservicios.service';
import { LovOperadorinstComponent } from '../../../../../../inversiones/lov/operadorinst/componentes/lov.operadorinst.component';

@Component({
  selector: 'app-instrumento',
  templateUrl: 'instrumento.html'
})

export class InstrumentoComponent extends BaseComponent implements OnInit, AfterViewInit {

  public pActualizarNumeroInstrumento: number = 0;

  public pActualizaTituloContrato: number = 0;

  public pCodigoTitulo: string = null;

  public pTransaccion: number = null;

  public pEsReajuste: boolean = false;

  public pEditable: number = 0;

  public pTasaclasificacioncdetalle: string = "";

  public pAlerta: string = null;
  public ret1 = true;
  public ret2 = true;

  public pCinversion: number = 0;

  public valorSector = ''; //CCA 20240318

  @ViewChild(LovCuentasContablesComponent)
  lovCuentasContables: LovCuentasContablesComponent;

  @ViewChild(LovAgentesbolsaComponent)
  lovAgentesBolsa: LovAgentesbolsaComponent;

  @ViewChild(LovOperadorinstComponent)
  lovOperadorInst: LovOperadorinstComponent;

  @Input()
  natural: BaseComponent;

  @Input()
  detalle: BaseComponent;

  constructor(router: Router, dtoServicios: DtoServicios, private inversionesServicios: InversionesServicios) {
    super(router, dtoServicios, 'tinvinversion', 'INSTRUMENTO', false, false);
  }

  ngOnInit() {

    this.componentehijo = this;
    super.init();
    this.asignarCatalogoInicial();
    if(this.inversionesServicios.pInstrumentocdetalle==="FACCO")
      {
        this.mcampos.nemisor="Aceptante";
      }else{
        this.mcampos.nemisor="Emisor";
      }

  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    this.registro = [];

    this.registro.cinversion = 0;
    this.registro.periodicidadpagoscapitalccatalogo=1206;
    this.registro.periodicidadpagosinteresccatalogo=1206;
    this.inversionesServicios.pCusuarioing = this.dtoServicios.mradicacion.cusuario;
    this.inversionesServicios.valoresPorDefault();

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

  mostrarLovAgentesBolsa(): void {

    this.lovAgentesBolsa.mfiltrosesp.casavalorescdetalle = " in (\'" + this.registro.casavalorescdetalle + "\')";
    this.lovAgentesBolsa.showDialog();
  }

  mostrarLovOperadorInst(): void {

    this.lovOperadorInst.showDialog();
  }


  fijarLovAgentesBolsaSelect(reg: any): void {

    if (reg.registro !== undefined) {

      this.msgs = [];

      this.inversionesServicios.pRazonSocialAgente = reg.registro.nombrescontacto;

      this.inversionesServicios.pCinvagentebolsa = reg.registro.cinvagentebolsa;
      this.inversionesServicios.asignarCuentaContableAgente(this.inversionesServicios.pcCOMISIONOPERADOR, this.inversionesServicios.pcCOMPRA);

    }
  }

  fijarLovOperadorInst(reg: any): void {

    if (reg.registro !== undefined) {

      this.msgs = [];

      this.inversionesServicios.pOperadorInstNombre = reg.registro.mdatos.nBanco;
      this.inversionesServicios.pCinvoperadorinstitucional = reg.registro.cinvoperadorinstitucional;

    }
  }

  asignarCatalogoInicial() {

    this.registro.tasaclasificacionccatalogo = 1210;
    this.registro.bolsavaloresccatalogo = 1215;
    this.registro.calendarizacionccatalogo = 1209;
    this.registro.basediasinteresccatalogo = 1222;
    this.registro.calificacionriesgoinicialccatalogo = 1207;
    this.registro.calificacionriesgoactualccatalogo = 1207;
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
    this.registro.bancopagoccatalogo = 305;
    this.registro.aceptanteccatalogo = 1213;
    this.registro.estadoccatalogo = 1204;
    this.registro.tasaclasificacioncdetalle = this.pTasaclasificacioncdetalle;

  }

  construirTabla() {

    if (this.inversionesServicios.ptablaamortizaregistro != undefined && this.inversionesServicios.ptablaamortizaregistro.length > 0) {

      const rqConsulta: any = new Object();
      rqConsulta.CODIGOCONSULTA = 'INVERSION';
      rqConsulta.inversion = 9;

      rqConsulta.cinversion = this.pCinversion;

      rqConsulta.tablaamortiza = this.inversionesServicios.ptablaamortizaregistro;
      rqConsulta.fcompra = this.inversionesServicios.pFcompra;
      rqConsulta.calendarizacioncdetalle = this.inversionesServicios.pCalendarizacioncdetalle;
      rqConsulta.yield = this.inversionesServicios.pYield;
      rqConsulta.femision = this.inversionesServicios.pFemision;
      rqConsulta.tasa = this.inversionesServicios.pTasa;
      rqConsulta.fultimopago = this.inversionesServicios.pFultimopago;

      this.dtoServicios.ejecutarConsultaRest(rqConsulta)
        .subscribe(
          resp => {
            this.dtoServicios.llenarMensaje(resp, false);
            if (resp.cod !== 'OK') {
              return;
            }

            this.inversionesServicios.construyePago(resp, this.inversionesServicios.pMercadotipocdetalle);

          },
          error => {
            this.dtoServicios.manejoError(error);
          });

      this.calcularNumeroPagosCapitalInteres();

      this.obtenerTIR();


    }

  }

  calcularDias(
    ifinicio: Date
    , iffin: Date
    , iRubro: number
    , icalendarizacioncdetalle: string) {

    if (!this.estaVacio(ifinicio) &&
      !this.estaVacio(iffin)) {

      const rqConsulta: any = new Object();
      rqConsulta.CODIGOCONSULTA = 'INVERSION';
      rqConsulta.inversion = 8;

      rqConsulta.calendarizacioncdetalle = icalendarizacioncdetalle;
      rqConsulta.finicio = this.fechaToInteger(ifinicio);
      rqConsulta.ffinal = this.fechaToInteger(iffin);

      this.dtoServicios.ejecutarConsultaRest(rqConsulta)
        .subscribe(
          resp => {
            this.dtoServicios.llenarMensaje(resp, false);
            if (resp.cod !== 'OK') {
              return;
            }

            this.inversionesServicios.pInteresnominaldias = this.inversionesServicios.pInteresnominaldias + resp.DIAS;

            switch (iRubro) {
              case 0:
                break
              case 1:
                this.inversionesServicios.pDiasporvencer = resp.DIAS;

                this.calculoIntereses();

                break;
            }




          },
          error => {
            this.dtoServicios.manejoError(error);
          });
    }


  }




  calcularNumeroPagosCapitalInteres() {
    this.obtenerLeySb();
    this.calcularNumeroPagosCapital();
    this.calcularNumeroPagosInteres();
  }

  calcularNumeroPagosCapital() {

    this.inversionesServicios.pNumeropagoscapital = this.calcularNumeroPagos(this.registro.periodicidadpagoscapitalcdetalle);

  }

  calcularNumeroPagosInteres() {

    this.inversionesServicios.pNumeropagosinteres = this.calcularNumeroPagos(this.registro.periodicidadpagosinterescdetalle);

  }

  calcularNumeroPagos(iperiodicidadpagoscdetalle: String): Number {

    let lnumeropagos: Number = null;

    if (!this.estaVacio(iperiodicidadpagoscdetalle) &&
      !this.estaVacio(this.registro.plazo) && this.registro.plazo > 0) {

      let ldivisor: Number = null;

      if (!this.estaVacio(this.inversionesServicios.pCalendarizacioncdetalle)) {
        switch (this.inversionesServicios.pCalendarizacioncdetalle) {
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

  comisionBolsaContabiliza() {
    this.totalizaComisiones();
  }

  comisionOperadorContabiliza() {
    this.totalizaComisiones();
  }

  comisionRetencionContabiliza() {
    this.totalizaComisiones();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  totalizaComisiones() {

    if (this.pEditable != 0) {

      this.obtenerTIR();

    }

    this.inversionesServicios.sumaComisiones(this.pEditable);
  }

  calcularEnBase() {

    this.inversionesServicios.generarComisiones()
    this.comisionBolsaContabiliza();
    this.comisionOperadorContabiliza();
    this.comisionRetencionContabiliza();

    if (this.pEditable == 2) {
      this.obtenerTIR();
    }

  }

  limpiarTotales() {
    this.inversionesServicios.pEfectivonegociado = 0;
    this.inversionesServicios.pInteresesnegociacion = 0;
    this.inversionesServicios.pComisionBolsa = 0;
    this.inversionesServicios.pComisionOperador = 0;
    this.inversionesServicios.pComisiontotal = 0;
    this.inversionesServicios.pRetencion = 0;
    this.inversionesServicios.pSubtotal = 0;
    this.inversionesServicios.pPrecioNeto = 0;
    this.inversionesServicios.pValorACompensar = 0;

  }

  calcularInteresFijo(iblnContabilizar: boolean = true) {

    let lblnControl: boolean = false;

    if (this.inversionesServicios.instrumentosPC()) {
      if (this.registro.plazo > 366) {
        this.limpiarTotales();
        this.mostrarMensajeError("PLAZO DEBE SER IGUAL O MENOR A UN AÑO");
        return;
      }
      lblnControl = true;
    }
    else if (this.pTasaclasificacioncdetalle == "VAR") {
      this.inversionesServicios.pCapital = this.registro.preciocompra;
    }

    this.fechaVencimiento();
    this.limpiarTotales();

    if (lblnControl) this.inversionesServicios.pEfectivonegociado = this.inversionesServicios.pValornegociacion;

    if (!lblnControl &&
      !this.inversionesServicios.instrumentosPC() &&
      !this.estaVacio(this.inversionesServicios.pCapital) && this.inversionesServicios.pCapital != 0 &&
      ((!this.estaVacio(this.inversionesServicios.pTasa) && this.inversionesServicios.pTasa != 0 &&
        !this.estaVacio(this.registro.plazo) && this.registro.plazo != 0) || this.pTasaclasificacioncdetalle == "VAR")) {

      if (this.pTasaclasificacioncdetalle == "FIJA") {
        this.inversionesServicios.pEfectivonegociado = this.inversionesServicios.pCapital * (1 - (this.inversionesServicios.pTasa * (this.registro.plazo / 360) * 0.01));
        this.inversionesServicios.pInteresesnegociacion = this.inversionesServicios.pCapital - this.inversionesServicios.pEfectivonegociado;
      }
      else {
        this.inversionesServicios.pCapital = this.registro.preciocompra;
        this.inversionesServicios.pEfectivonegociado = this.inversionesServicios.pCapital;
      }

      lblnControl = true;

    }

    if (lblnControl) {
      this.generaComisionBolsa();
      this.generaComisionOperador();
      this.generaRetencion();
      this.suma();
    }

    if (iblnContabilizar) this.inversionesServicios.Contabilizar();

  }

  suma() {
    this.inversionesServicios.pComisiontotal = this.redondear(this.inversionesServicios.pComisionBolsa, 2) + this.redondear(this.inversionesServicios.pComisionOperador, 2);

    this.inversionesServicios.pSubtotal = this.redondear(this.inversionesServicios.pEfectivonegociado, 2) +
      this.redondear(this.inversionesServicios.pInteresesnegociacion, 2) +
      this.redondear(this.inversionesServicios.pComisionBolsa, 2) +
      this.redondear(this.inversionesServicios.pComisionOperador, 2) -
      this.redondear(this.inversionesServicios.pRetencion, 2);

    this.inversionesServicios.pPrecioNeto = this.inversionesServicios.pSubtotal / this.inversionesServicios.pCapital * 100;

    this.inversionesServicios.pPrecioNeto = this.redondear(this.inversionesServicios.pPrecioNeto, 4);

    this.inversionesServicios.pValorACompensar = this.redondear(this.inversionesServicios.pEfectivonegociado, 2) +
      this.redondear(this.inversionesServicios.pInteresesnegociacion, 2) +
      this.redondear(this.inversionesServicios.pComisionBolsa, 2) -
      this.redondear(this.inversionesServicios.pRetencion, 2);

  }

  generaComisionBolsa() {
    let ldivisor: number = null;
    this.inversionesServicios.pComisionBolsa = this.inversionesServicios.pEfectivonegociado * this.inversionesServicios.pTASA_BOLSA_VALORES * 0.0001;
    if(this.estaVacio(this.registro.plazo)){
      this.registro.plazo=0;
    }
  if(this.estaVacio(this.inversionesServicios.pPlazo) || this.inversionesServicios.pPlazo==0){
    
    this.inversionesServicios.pPlazo=Number(this.registro.plazo);
  }
    if((this.inversionesServicios.pInstrumentocdetalle==="PCCERO" || this.inversionesServicios.pInstrumentocdetalle==="FACCO") && this.inversionesServicios.pPlazo<360){ 
 

    if (!this.estaVacio(this.inversionesServicios.pCalendarizacioncdetalle)) {
      switch (this.inversionesServicios.pCalendarizacioncdetalle) {
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
    
    this.inversionesServicios.pComisionBolsa = this.inversionesServicios.pComisionBolsa*(this.inversionesServicios.pPlazo/ldivisor);
  
   }
   
  }

  generaComisionOperador() {
    this.inversionesServicios.pComisionOperador = this.inversionesServicios.pEfectivonegociado * this.inversionesServicios.pTASA_OPERADOR_BOLSA * 0.0001;
    let ldivisor: number = null;
    if(this.estaVacio(this.registro.plazo)){
      this.registro.plazo=0;
    }
    if(this.estaVacio(this.inversionesServicios.pPlazo) || this.inversionesServicios.pPlazo==0){
      this.inversionesServicios.pPlazo=Number(this.registro.plazo);
    }
    if((this.inversionesServicios.pInstrumentocdetalle==="PCCERO" || this.inversionesServicios.pInstrumentocdetalle==="FACCO") && this.inversionesServicios.pPlazo<360){
 

      if (!this.estaVacio(this.inversionesServicios.pCalendarizacioncdetalle)) {
        switch (this.inversionesServicios.pCalendarizacioncdetalle) {
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
      this.inversionesServicios.pComisionOperador = this.inversionesServicios.pComisionOperador*(this.inversionesServicios.pPlazo/ldivisor);
    
     }
   
  }

  generaRetencion() {
    /*if (this.ret1) {
      this.inversionesServicios.pRetencion1 = this.inversionesServicios.pComisionBolsa * this.inversionesServicios.pTASA_RETENCION * 0.01;
      this.inversionesServicios.pRetencion1 = this.redondear(this.inversionesServicios.pRetencion1, 2);
    }else{
      this.inversionesServicios.pRetencion1=0;
    }
    if (this.ret2) {
      this.inversionesServicios.pRetencion2 = this.inversionesServicios.pComisionOperador * this.inversionesServicios.pTASA_RETENCION * 0.01;
      this.inversionesServicios.pRetencion2 = this.redondear(this.inversionesServicios.pRetencion2, 2);
    }else{
      this.inversionesServicios.pRetencion2=0;
    }
    this.inversionesServicios.pRetencion = this.inversionesServicios.pRetencion1 + this.inversionesServicios.pRetencion2;
    */
    this.inversionesServicios.pRetencion = this.inversionesServicios.pComisionBolsa * this.inversionesServicios.pTASA_RETENCION * 0.01;

  }
  

  calcularInteres() {

    this.calcularEnBase();
    this.inversionesServicios.pValornegociado = this.inversionesServicios.pCapital;
    this.inversionesServicios.calcularTotalAPagar();

  }

  calcularvalorNegociacion() {

    // this.calcularEnBase();
    this.inversionesServicios.pValornegociacion = (this.inversionesServicios.pCapital * this.inversionesServicios.pPorcentajecalculoprecio) / 100;
    this.calcularInteresFijo();

  }

  obtenerCalendarizacion(): Number {
    let ldivisor: Number = null;
    if (!this.estaVacio(this.inversionesServicios.pCalendarizacioncdetalle)) {
      switch (this.inversionesServicios.pCalendarizacioncdetalle) {
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
      if (!this.estaVacio(this.inversionesServicios.pCalendarizacioncdetalle)) {
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

  calcularProyeccion() {

    if (this.pTasaclasificacioncdetalle == "FIJA") {


      let lPlazo: number = 0;
      if (!this.estaVacio(this.registro.plazo) && Number(this.registro.plazo) != 0) {
        lPlazo = Number(this.registro.plazo);
      }
      this.inversionesServicios.pPlazo = lPlazo;

      this.inversionesServicios.pInteresnominaldias = 0;

      this.calcularDias(this.inversionesServicios.pFemision, this.inversionesServicios.pFultimopago, 0, this.inversionesServicios.pCalendarizacioncdetalle);

      this.calcularDias(this.inversionesServicios.pFultimopago, this.inversionesServicios.pFvencimiento, 1, this.inversionesServicios.pCalendarizacioncdetalle);


    }
  }

  dateDiff(ifinicio: Date, iffin: Date): number {

    var MILISENGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;

    var utc1 = Date.UTC(ifinicio.getFullYear(), ifinicio.getMonth(), ifinicio.getDate());
    var utc2 = Date.UTC(iffin.getFullYear(), iffin.getMonth(), iffin.getDate());

    return Math.floor((utc2 - utc1) / MILISENGUNDOS_POR_DIA);

  }

  calculoIntereses() {

    //this.inversionesServicios.completaIntereses();
    this.inversionesServicios.calcularTotalAPagar();

  }

  obtenerTIR() {

    this.inversionesServicios.generaTIR(
      this.inversionesServicios.pEfectivonegociado
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

  contabilizaEmisor() {
    this.inversionesServicios.asignarCuentaContable(this.inversionesServicios.pcCAPITAL, this.inversionesServicios.pcCOMPRA, 1213, this.inversionesServicios.pEmisorcdetalle);
    this.inversionesServicios.asignarCuentaContable(this.inversionesServicios.pcINTERES, this.inversionesServicios.pcCOMPRA, 1213, this.inversionesServicios.pEmisorcdetalle);
    this.maximoPorcentaje();
  }

  contabilizaBanco() {
    this.inversionesServicios.asignarCuentaContable(this.inversionesServicios.pcBANCOS, this.inversionesServicios.pcCOMPRA, 1224, this.inversionesServicios.pBancocdetalle);
  }

  contabilizaBolsaValores() {
    this.inversionesServicios.asignarCuentaContable(this.inversionesServicios.pcCOMISIONBOLSA, this.inversionesServicios.pcCOMPRA, 1215, this.inversionesServicios.pBolsavalorescdetalle);
  
  }


  contabilizaValorNegociado() {
    if (this.pTasaclasificacioncdetalle != "FIJA") {

      if (this.pEditable != 0) {
        this.inversionesServicios.Contabilizar();
      }

    }
  }

  fechaVencimiento() {


    if (this.inversionesServicios.instrumentosPC()) {

      var fechaven = new Date();

      if (this.estaVacio(this.inversionesServicios.pFemision) || this.estaVacio(this.registro.plazo) || Number(this.registro.plazo) == 0) {
        fechaven = null;
      }
      else {
        fechaven.setDate(this.inversionesServicios.pFemision.getDate() + Number(this.registro.plazo));
      }

      this.inversionesServicios.pFvencimiento = fechaven;
      let dia = fechaven.getDay();
      if (dia === 0 || dia === 6) {
        this.mostrarMensajeError("LA FECHA DE VENCIMIENTO ES DE DÍA NO LABORABLE");
      } else {
        this.mostrarMensajeSuccess("LA FECHA DE VENCIMIENTO ES CORRECTA");
      }

    }
    else if (this.inversionesServicios.instrumentosSinTablaSinPC()) {
      this.calcularSinTabla();
    }

  }


  construirSinTabla(
    itasaBolsa: number = null
    , itasaOperador: number = null
    , itasaRetencion: number = null
    , icinversion: number = null) {

    const rqConsulta: any = new Object();
    rqConsulta.CODIGOCONSULTA = 'INVERSION';
    rqConsulta.inversion = 10;

    if (!this.estaVacio(icinversion) && icinversion != 0) {
      rqConsulta.tasaBolsa = itasaBolsa;
      rqConsulta.tasaOperador = itasaOperador;
      rqConsulta.tasaRetencion = itasaRetencion;

    }
    else {

      if (!this.estaVacio(itasaBolsa) && itasaBolsa != 0) {
        rqConsulta.tasaBolsa = itasaBolsa;
      }
      if (!this.estaVacio(itasaOperador) && itasaOperador != 0) {
        rqConsulta.tasaOperador = itasaOperador;
      }
      if (!this.estaVacio(itasaRetencion) && itasaRetencion != 0) {
        rqConsulta.tasaRetencion = itasaRetencion;
      }
    }

    rqConsulta.cinversion = icinversion;
    rqConsulta.pFemision = this.inversionesServicios.pFemision;
    rqConsulta.pCapital = this.inversionesServicios.pCapital;
    rqConsulta.pFultimopago = this.inversionesServicios.pFultimopago;
    rqConsulta.pPlazoxvencer = this.inversionesServicios.pPlazoxvencer;
    rqConsulta.pTasa = this.inversionesServicios.pTasa;
    rqConsulta.ptCalendarizacion = this.inversionesServicios.pCalendarizacioncdetalle;
    rqConsulta.pPorcentajecalculoprecio = this.inversionesServicios.pPorcentajecalculoprecio;
    rqConsulta.pBolsavalorescdetalle= this.inversionesServicios.pBolsavalorescdetalle;

    this.dtoServicios.ejecutarConsultaRest(rqConsulta)
      .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false);
          if (resp.cod !== 'OK') {
            return;
          }

          let lblnBolsa: boolean = null;
          let lblnOperador: boolean = null;
          if (this.pEditable != 0) {
            lblnBolsa = this.inversionesServicios.pblnComisionBolsa;
            lblnOperador = this.inversionesServicios.pblnComisionOperador;
          }
            if(resp.tasaComision){
              this.inversionesServicios.pTASA_BOLSA_VALORES_DEF=resp.tasaComision;
              this.asignarBolsaRespuesta();
              this.inversionesServicios.generaPorcentajeString();
            }
          this.inversionesServicios.construyePago(resp, this.inversionesServicios.pMercadotipocdetalle, lblnOperador, lblnBolsa);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }
asignarBolsaRespuesta(){

  this.inversionesServicios.pTASA_BOLSA_VALORES = this.inversionesServicios.pTASA_BOLSA_VALORES_DEF;
}
  asignarBolsaValores() {
    if (this.inversionesServicios.pblnComisionBolsa) {
      this.inversionesServicios.pTASA_BOLSA_VALORES = this.inversionesServicios.pTASA_BOLSA_VALORES_DEF;
      this.inversionesServicios.pTASA_RETENCION = this.inversionesServicios.pTASA_RETENCION_DEF;
    }
    else {
      this.inversionesServicios.pTASA_BOLSA_VALORES = 0;
      this.inversionesServicios.pTASA_RETENCION = 0;
    }



    this.generaComisionBolsa()

    this.generaRetencion();

    this.suma();

    this.inversionesServicios.generaPorcentajeString();

  }

  asignarOperador() {
    if (this.inversionesServicios.pblnComisionOperador) {
      this.inversionesServicios.pTASA_OPERADOR_BOLSA = this.inversionesServicios.pTASA_OPERADOR_BOLSA_DEF;
    }
    else {
      this.inversionesServicios.pTASA_OPERADOR_BOLSA = 0;
    }

    this.generaComisionOperador();

    this.suma();

    this.inversionesServicios.generaPorcentajeString();

  }

  asignarRetencion() {
    if (this.inversionesServicios.pblnRetencionFuente) {
      this.inversionesServicios.pTASA_RETENCION = this.inversionesServicios.pTASA_RETENCION_DEF;
    }
    else {
      this.inversionesServicios.pTASA_RETENCION = 0;
    }

    this.generaRetencion();

    this.suma();

  }


  valorAcciones() {
    this.registro.valoracciones = this.registro.preciounitarioaccion * this.registro.numeroacciones;
    this.registro.preciocompra = this.registro.valoracciones;

    this.calcularInteresFijo();

  }

  calcularSinTabla() {

    if (this.inversionesServicios.pMercadotipocdetalle == 'EXTBUR') this.inversionesServicios.pFultimopago = this.inversionesServicios.pFemision;

    if (!this.estaVacio(this.inversionesServicios.pFemision) &&
      !this.estaVacio(this.inversionesServicios.pCapital) &&
      Number(this.inversionesServicios.pCapital) > 0 &&
      !this.estaVacio(this.inversionesServicios.pFultimopago) &&
      !this.estaVacio(this.inversionesServicios.pPlazoxvencer) &&
      Number(this.inversionesServicios.pPlazoxvencer) > 0 &&
      !this.estaVacio(this.inversionesServicios.pTasa) &&
      !this.estaVacio(this.inversionesServicios.pCalendarizacioncdetalle) &&
      !this.estaVacio(this.inversionesServicios.pPorcentajecalculoprecio) &&
      Number(this.inversionesServicios.pPorcentajecalculoprecio) > 0) {

      this.maximoPorcentaje();

      this.construirSinTabla();


    }
    else {
      this.inversionesServicios.pInterestranscurridodias = null;
      this.inversionesServicios.pFvencimiento = null;
      this.inversionesServicios.pEfectivonegociado = null;
      this.inversionesServicios.pValornegociacion = null;
      this.inversionesServicios.pDiasporvencer = null;
      this.inversionesServicios.pInteresnominaldias = null;
      this.inversionesServicios.pValordescuento = null;
      this.inversionesServicios.pComisionBolsa = null;
      this.inversionesServicios.pComisionOperador = null;
      this.inversionesServicios.pRetencion = null;
      this.inversionesServicios.pComisiontotal = null;
      this.inversionesServicios.pinterestranscurrido = null;
      this.inversionesServicios.pInteresesnegociacion = null;
      this.inversionesServicios.pSubtotal = null;
      this.inversionesServicios.pInteres = null;
      this.inversionesServicios.pInteresporvencer = null;
      this.inversionesServicios.pPrecioNeto = null;
      this.inversionesServicios.pValorACompensar = null;
    }

    this.inversionesServicios.Contabilizar();

  }

  maximoPorcentaje() {

    if (!this.estaVacio(this.inversionesServicios.pEmisorcdetalle)) {

      const rqConsulta: any = new Object();
      rqConsulta.CODIGOCONSULTA = 'INVERSION';
      rqConsulta.inversion = 13;
      rqConsulta.cinversion = this.pCinversion;
      rqConsulta.emisorcdetalle = this.inversionesServicios.pEmisorcdetalle;
      rqConsulta.pBolsavalorescdetalle = this.inversionesServicios.pBolsavalorescdetalle;

      if (this.pTransaccion == 19) {
        rqConsulta.instrumentocdetalle = 'ACCION';
      }
      else {
        rqConsulta.instrumentocdetalle = this.inversionesServicios.pInstrumentocdetalle;
      }

      rqConsulta.valor = this.inversionesServicios.pCapital;

      this.dtoServicios.ejecutarConsultaRest(rqConsulta)
        .subscribe(
          resp => {
            this.dtoServicios.llenarMensaje(resp, false);
            if (resp.cod !== 'OK') {
              return;
            }

            if (resp.NUMEROERROR == '1') {
              this.mostrarMensajeError(resp.ALERTA);
              this.inversionesServicios.pEmisorcdetalle = null;
            }
            else {
              this.pAlerta = resp.ALERTA;
            }
            if(resp.tasaComision>0){
              this.inversionesServicios.pTASA_BOLSA_VALORES_DEF=resp.tasaComision;
              this.asignarBolsaRespuesta();
              this.inversionesServicios.generaPorcentajeString();
              this.asignarBolsaValores();
            }
            this.valorSector = resp.idSector;

          },
          error => {
            this.dtoServicios.manejoError(error);
          });

    }





  }
}
