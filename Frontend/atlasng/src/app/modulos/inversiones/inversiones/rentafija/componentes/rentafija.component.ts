
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovInversionesComponent } from '../../../../inversiones/lov/inversiones/componentes/lov.inversiones.component';
import { InstrumentoComponent } from '../submodulos/instrumento/componentes/instrumento.component';
import { SbsComponent } from '../submodulos/sbs/componentes/sbs.component';
import { TablamortizacionComponent } from '../submodulos/tablamortizacion/componentes/tablamortizacion.component';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { RubrosComponent } from '../submodulos/rubros/componentes/rubros.component';
import { InversionesServicios } from './../../../servicios/_invservicios.service';

import { ResultadoCargaComponent } from '../submodulos/resultadocarga/componentes/resultadocarga.component';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { TirComponent } from '../submodulos/tir/componentes/tir.component';

import { LovComentariosComponent } from '../../../../inversiones/lov/comentarios/componentes/lov.comentarios.component';
import { allSettled } from 'q';
import { EILSEQ } from 'constants';

@Component({
  selector: "app-rentafija",
  templateUrl: "rentafija.html",
  providers: [InversionesServicios]
})

export class RentafijaComponent extends BaseComponent
  implements OnInit, AfterViewInit {
  @ViewChild("formFiltros") formFiltros: NgForm;

  private mCinversionhisultimo: number = null;

  private mInteresdiferencia: number = null;
  private mCapitaldiferencia: number = null;

  private mPermiteAnular: number = null;

  private mLabelEnviar: string = null;

  private lInstrumento: any = [];

  private mMensajeCarga: string = "";

  private mAprobar: string = null;

  lOperacion: any = [];

  pTransaccion: number = null;

  pTasaclasificacioncdetalle: string = "";

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(RubrosComponent)
  rubrosComponent: RubrosComponent;

  @ViewChild(ResultadoCargaComponent)
  resultadoCargaComponente: ResultadoCargaComponent;

  @ViewChild(InstrumentoComponent)
  instrumentoComponent: InstrumentoComponent;

  @ViewChild(SbsComponent)
  sbsComponent: SbsComponent;

  @ViewChild(TablamortizacionComponent)
  tablamortizacionComponent: TablamortizacionComponent;

  @ViewChild(TirComponent)
  tirComponent: TirComponent;

  @ViewChild(LovInversionesComponent) private lovInversiones: LovInversionesComponent;

  @ViewChild(LovComentariosComponent) private lovComentarios: LovComentariosComponent;

  constructor(router: Router, dtoServicios: DtoServicios, private inversionesServicios: InversionesServicios, private confirmationService: ConfirmationService) {

    super(router, dtoServicios, "ABSTRACT", "RENTAFIJA", false);
  }

  ngOnInit() {

    this.pTransaccion = Number(sessionStorage.getItem('t'));

    this.inversionesServicios.pInversionExterior =
      (this.pTransaccion >= 100 && this.pTransaccion <= 112) ||
        (this.pTransaccion >= 1100 && this.pTransaccion <= 1112) ||
        (this.pTransaccion >= 3100 && this.pTransaccion <= 3112) ? true : false;

    let lTran: string = sessionStorage.getItem('t');

    if (this.inversionesServicios.pInversionExterior) {
      this.inversionesServicios.pSectorcdetalle = "EXT";
    }

    if (sessionStorage.getItem('t') == "10" ||    //'PCCERO'
      sessionStorage.getItem('t') == "11" ||    //'INVHIP'
      sessionStorage.getItem('t') == "12" ||    //'OBLIGA'
      sessionStorage.getItem('t') == "13" ||    //'TITULA'
      sessionStorage.getItem('t') == "14" ||    //'PA'
      sessionStorage.getItem('t') == "15" ||    //'CDP'
      sessionStorage.getItem('t') == "16" ||    //'BONO'
      sessionStorage.getItem('t') == "17" ||    //'BONEST'
      sessionStorage.getItem('t') == "18" ||    //'VALTIT'
      sessionStorage.getItem('t') == "20" ||    //'FACCO'
      sessionStorage.getItem('t') == "21" ||    //'OTROS'
      sessionStorage.getItem('t') == "101" ||    //'OTROS'
      sessionStorage.getItem('t') == "102" ||    //'OTROS'
      sessionStorage.getItem('t') == "103" ||
      sessionStorage.getItem('t') == "1010" ||    //'PCCERO'
      sessionStorage.getItem('t') == "1011" ||    //'INVHIP'
      sessionStorage.getItem('t') == "1012" ||    //'OBLIGA'
      sessionStorage.getItem('t') == "1013" ||    //'TITULA'
      sessionStorage.getItem('t') == "1014" ||    //'PA'
      sessionStorage.getItem('t') == "1015" ||    //'CDP'
      sessionStorage.getItem('t') == "1016" ||    //'BONO'
      sessionStorage.getItem('t') == "1017" ||    //'BONEST'
      sessionStorage.getItem('t') == "1018" ||    //'VALTIT'
      sessionStorage.getItem('t') == "1020" ||    //'FACCO'
      sessionStorage.getItem('t') == "1021" ||    //'OTROS'
      sessionStorage.getItem('t') == "1101" ||    //'OTROS'
      sessionStorage.getItem('t') == "1102" ||    //'OTROS'
      sessionStorage.getItem('t') == "1103" ||    //'OTROS'
      sessionStorage.getItem('t') == "2011" ||    //'INVHIP'
      sessionStorage.getItem('t') == "2012" ||    //'OTROS'
      sessionStorage.getItem('t') == "2013" ||    //'TITULA'
      sessionStorage.getItem('t') == "2018" ||    //'VALTIT'
      sessionStorage.getItem('t') == "3010" ||    //'PCCERO'
      sessionStorage.getItem('t') == "3011" ||    //'INVHIP'
      sessionStorage.getItem('t') == "3012" ||    //'OBLIGA'
      sessionStorage.getItem('t') == "3013" ||    //'TITULA'
      sessionStorage.getItem('t') == "3014" ||    //'PA'
      sessionStorage.getItem('t') == "3015" ||    //'CDP'
      sessionStorage.getItem('t') == "3016" ||    //'BONO'
      sessionStorage.getItem('t') == "3017" ||    //'BONEST'
      sessionStorage.getItem('t') == "3018" ||    //'VALTIT'
      sessionStorage.getItem('t') == "3020" ||    //'FACCO'
      sessionStorage.getItem('t') == "3021" ||    //'OTROS'
      sessionStorage.getItem('t') == "3101" ||    //'OTROS'
      sessionStorage.getItem('t') == "3102" ||    //'OTROS--'
      sessionStorage.getItem('t') == "3103" ||    //'VALTIT'
      sessionStorage.getItem('t') == "4010" ||    //'PCCERO'
      sessionStorage.getItem('t') == "4011" ||    //'INVHIP'
      sessionStorage.getItem('t') == "4012" ||    //'OBLIGA'
      sessionStorage.getItem('t') == "4013" ||    //'TITULA'
      sessionStorage.getItem('t') == "4014" ||    //'PA'
      sessionStorage.getItem('t') == "4015" ||    //'CDP'
      sessionStorage.getItem('t') == "4016" ||    //'BONO'
      sessionStorage.getItem('t') == "4017" ||    //'BONEST'
      sessionStorage.getItem('t') == "4018" ||    //'VALTIT'
      sessionStorage.getItem('t') == "4020" ||    //'FACCO'
      sessionStorage.getItem('t') == "4021" ||    //'OTROS'
      sessionStorage.getItem('t') == "4101" ||    //'OTROS'
      sessionStorage.getItem('t') == "4102" ||    //'OTROS'
      sessionStorage.getItem('t') == "4103") {    //'CDP'

      this.pTasaclasificacioncdetalle = "FIJA";

      if (lTran == "10" || lTran == "1010" || lTran == "3010" || lTran == "4010") {
        this.inversionesServicios.pInstrumentocdetalle = "PCCERO";
      }
      else if (lTran == "11" || lTran == "1011" || lTran == "2011" || lTran == "3011" || lTran == "4011") {
        this.inversionesServicios.pInstrumentocdetalle = "INVHIP";
      }
      else if (lTran == "12" || lTran == "1012" || lTran == "2012" || lTran == "3012" || lTran == "4012") {
        this.inversionesServicios.pInstrumentocdetalle = "OBLIGA";
      }
      else if (lTran == "13" || lTran == "1013" || lTran == "2013" || lTran == "3013" || lTran == "4013") {
        this.inversionesServicios.pInstrumentocdetalle = "TITULA";
      }
      else if (lTran == "14" || lTran == "1014" || lTran == "3014" || lTran == "4014") {
        this.inversionesServicios.pInstrumentocdetalle = "PA";
      }
      else if (lTran == "15" || lTran == "1015" || lTran == "3015" || lTran == "4015") {
        this.inversionesServicios.pInstrumentocdetalle = "CDP";
      }
      else if (lTran == "16" || lTran == "1016" || lTran == "3016" || lTran == "4016") {
        this.inversionesServicios.pInstrumentocdetalle = "BONO";
      }
      else if (lTran == "17" || lTran == "1017" || lTran == "3017" || lTran == "4017") {
        this.inversionesServicios.pInstrumentocdetalle = "BONEST";
      }
      else if (lTran == "18" || lTran == "1018" || lTran == "2018" || lTran == "3018" || lTran == "4018") {
        this.inversionesServicios.pInstrumentocdetalle = "VALTIT";
      }
      else if (lTran == "20" || lTran == "1020" || lTran == "2020" || lTran == "3020" || lTran == "4020") {
        this.inversionesServicios.pInstrumentocdetalle = "FACCO";
      }
      else if (lTran == "21" || lTran == "1021" || lTran == "3021" || lTran == "4021") {
        this.inversionesServicios.pInstrumentocdetalle = "CDP";
      }
      else if (lTran == "101" || lTran == "1101" || lTran == "3101" || lTran == "4101") {
        this.inversionesServicios.pInstrumentocdetalle = "BONO";
      }
      else if (lTran == "102" || lTran == "1102" || lTran == "3102" || lTran == "4102") {
        this.inversionesServicios.pInstrumentocdetalle = "CASHEQ";
      }
      else if (lTran == "103" || lTran == "1103" || lTran == "3103" || lTran == "4103") {
        this.inversionesServicios.pInstrumentocdetalle = "CASHFP";
      }

      if (this.inversionesServicios.instrumentosSinTabla() ||

        this.inversionesServicios.pSectorcdetalle == "EXT") {
        this.mcampos.TIR = "";
      }
      else if (this.pTransaccion >= 1000 && !(this.pTransaccion >= 2000 && this.pTransaccion <= 3000)) {
        this.mcampos.tablaAmortizaSubir = "";
      }

    }
    else {
      this.pTasaclasificacioncdetalle = "VAR";
    }

    if (this.inversionesServicios.pInstrumentocdetalle == "CDP" || this.inversionesServicios.pInstrumentocdetalle == "PA") {
      this.inversionesServicios.pMercadotipocdetalle = "EXTBUR";
      this.instrumentoComponent.pCodigoTitulo = "No. " + this.inversionesServicios.pInstrumentocdetalle;
    }
    else {
      this.inversionesServicios.pMercadotipocdetalle = "BURSAT";

      if (this.pTasaclasificacioncdetalle == "VAR") {
        this.instrumentoComponent.pCodigoTitulo = "Código Operación";
      }
      else {
        this.instrumentoComponent.pCodigoTitulo = "Código Título";
      }

    }

    this.limpiaTablaAmortiza();

    this.instrumentoComponent.pTasaclasificacioncdetalle = this.pTasaclasificacioncdetalle;
    this.instrumentoComponent.pTransaccion = this.pTransaccion;
    this.sbsComponent.pTasaclasificacioncdetalle = this.pTasaclasificacioncdetalle;

    this.tablamortizacionComponent.pTransaccion = this.pTransaccion;

    this.obtenerPlantillaContable();

    this.lInstrumento.push({
      cinversion: 0
    });
    this.componentehijo = this;
    super.init(this.formFiltros);

    this.tablamortizacionComponent.rqMantenimiento.lregistrosTotales = [];
    this.tablamortizacionComponent.rqMantenimiento.lregistrosTotales.push({
      capital: 0,
      interes: 0,
      total: 0
    });

  }

  limpiaTablaAmortiza() {
    this.mcampos.tablaAmortiza = "";
    this.mcampos.tablaAmortizaSubir = "";
    this.mcampos.TIR = "";

  }

  ngAfterViewInit() {

  }

  selectRegistro(registro: any) {
    // No existe para el padre
  }

  crearNuevo() {
    // No existe para el padre
  }

  actualizar() {

    if (this.actualizarNumeroCdpPa()) {
      this.instrumentoComponent.pActualizarNumeroInstrumento = 1;
    }
    else {
      this.asignarEditable(2);
      this.enceraCamposExcepciones();
    }
  }

  actualizarAcciones(): boolean {
    return (this.pTransaccion < 1000 && this.inversionesServicios.pEstadocdetalle == 'PAG' && (this.inversionesServicios.pInstrumentocdetalle == 'ACCION' || this.inversionesServicios.pInstrumentocdetalle == 'ACCOPP'));
  }


  actualizarNumeroCdpPa(): boolean {
    return (this.pTransaccion < 1000 && this.inversionesServicios.pEstadocdetalle == 'PAG' && (this.inversionesServicios.pstrInstrumentoCLegal == 'CDP'));
  }

  eliminar() {
    // No existe para el padre
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.enceraCamposExcepciones();
    this.limpiarReajuste();
    this.inversionesServicios.limpiarService();
    this.obtenerInversion();
  }

  obtenerInversion() {

    this.instrumentoComponent.pEsReajuste = false;

    const rqConsulta: any = new Object();
    rqConsulta.CODIGOCONSULTA = 'INVERSION';
    rqConsulta.inversion = 1;
    rqConsulta.cinversion = this.mcampos.cinversion;

    rqConsulta.transaccion = this.pTransaccion;

    this.dtoServicios.ejecutarConsultaRest(rqConsulta)
      .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false);
          if (resp.cod !== 'OK') {
            return;
          }

          let lregistro: any = [];

          lregistro = resp.INVERSION;

          if (lregistro[0].estadocdetalle == "ENVAPR") {
            this.mAprobar = this.inversionesServicios.pLabelEnvioparaPago;
          }
          else {
            this.mAprobar = this.inversionesServicios.pLabelAprobar;
          }

          this.mPermiteAnular = lregistro[0].PermiteAnular;

          if (this.pTransaccion < 1000) {
            this.mLabelEnviar = this.inversionesServicios.pLabelEnvioAprobar;
          }
          else if (this.pTransaccion < 2000) {
            this.mLabelEnviar = this.inversionesServicios.pLabelDevolver;
          }

          this.asignarPcInversion(lregistro[0].cinversion);

          this.instrumentoComponent.registro.comentariosingreso = lregistro[0].comentariosingreso;
          this.instrumentoComponent.registro.comentariosaprobacion = lregistro[0].comentariosaprobacion;
          this.instrumentoComponent.registro.comentariosanulacion = lregistro[0].comentariosanulacion;
          this.instrumentoComponent.registro.comentariosdevolucion = lregistro[0].comentariosdevolucion;

          this.inversionesServicios.pFcontable = lregistro[0].fcontable;
          this.inversionesServicios.pCcompania = lregistro[0].ccompania;
          this.inversionesServicios.pCcomprobanteanulacion = lregistro[0].ccomprobanteanulacion;

          this.inversionesServicios.pPorcentajecalculoprecio = lregistro[0].porcentajecalculoprecio;

          this.instrumentoComponent.registro.cinversion = lregistro[0].cinversion;
          this.instrumentoComponent.registro.codigotitulo = lregistro[0].codigotitulo;
          this.instrumentoComponent.registro.numerocontrato = lregistro[0].numerocontrato;
          this.instrumentoComponent.registro.tasaclasificacionccatalogo = lregistro[0].tasaclasificacionccatalogo;
          this.instrumentoComponent.registro.tasaclasificacioncdetalle = lregistro[0].tasaclasificacioncdetalle;
          this.inversionesServicios.pCcomprobante = lregistro[0].ccomprobante;
          this.instrumentoComponent.registro.optlock = lregistro[0].optlock;
          this.instrumentoComponent.registro.fcolocacion = lregistro[0].nfcolocacion;
          this.instrumentoComponent.registro.fregistro = lregistro[0].nfregistro;
          this.inversionesServicios.pFcompra = lregistro[0].nfcompra;
          this.inversionesServicios.pFpago = lregistro[0].nfpago;

          this.inversionesServicios.pFemision = lregistro[0].nfemision;

          this.inversionesServicios.pFvencimiento = lregistro[0].nfvencimiento;

          this.inversionesServicios.pFultimopago = lregistro[0].nfultimopago;
          this.inversionesServicios.pFpagoultimocupon = lregistro[0].nfpagoultimocupon;

          this.instrumentoComponent.registro.fultimacompra = lregistro[0].nfultimacompra;

          this.inversionesServicios.pCinvagentebolsa = lregistro[0].cinvagentebolsa;

          this.inversionesServicios.pCinvoperadorinstitucional = lregistro[0].cinvoperadorinstitucional;

          this.inversionesServicios.pRazonSocialAgente = lregistro[0].nombresagente;

          this.inversionesServicios.pOperadorInstNombre = lregistro[0].nombresoperadorinst;

          this.inversionesServicios.pCapital = lregistro[0].valornominal;

          if (this.pTasaclasificacioncdetalle != "FIJA") {
            this.inversionesServicios.pValornegociado = lregistro[0].valornominal;
          }

          this.inversionesServicios.pValornegociacion = lregistro[0].valornegociacion;

          this.instrumentoComponent.registro.valorefectivo = lregistro[0].valorefectivo;
          this.instrumentoComponent.registro.plazo = lregistro[0].plazo;

          this.inversionesServicios.pPlazo = lregistro[0].plazo;


          this.inversionesServicios.pTasa = lregistro[0].tasa;

          this.inversionesServicios.pDiasgraciacapital = lregistro[0].diasgraciacapital;
          this.inversionesServicios.pDiasgraciainteres = lregistro[0].diasgraciainteres;
          this.instrumentoComponent.registro.diasporvencerafechacompra = lregistro[0].diasporvencerafechacompra;
          this.instrumentoComponent.registro.boletin = lregistro[0].boletin;

          this.inversionesServicios.pCotizacion = lregistro[0].cotizacion;

          this.inversionesServicios.pYield = lregistro[0].yield;

          this.inversionesServicios.pRetencion = lregistro[0].comisionretencion;

          this.inversionesServicios.pblnRetencionFuente = (this.inversionesServicios.pRetencion != null && this.inversionesServicios.pRetencion != 0);

          this.inversionesServicios.pComisionBolsa = lregistro[0].comisionbolsavalores;

          this.inversionesServicios.pblnComisionBolsa = (this.inversionesServicios.pComisionBolsa != null && this.inversionesServicios.pComisionBolsa != 0);

          this.inversionesServicios.pComisionOperador = lregistro[0].comisionoperador;

          this.inversionesServicios.pblnComisionOperador = (this.inversionesServicios.pComisionOperador != null && this.inversionesServicios.pComisionOperador != 0);

          this.inversionesServicios.pPorcentajecalculodescuento = lregistro[0].porcentajecalculodescuento;
          this.inversionesServicios.pPorcentajecalculorendimiento = lregistro[0].porcentajecalculorendimiento;

          this.instrumentoComponent.registro.interestranscurrido = lregistro[0].interestranscurrido;

          this.instrumentoComponent.registro.porcentajepreciocompra = lregistro[0].porcentajepreciocompra;
          this.inversionesServicios.pPorcentajeprecioultimacompra = lregistro[0].porcentajeprecioultimacompra;
          this.instrumentoComponent.registro.preciounitarioaccion = lregistro[0].preciounitarioaccion;
          this.instrumentoComponent.registro.numeroacciones = lregistro[0].numeroacciones;
          this.instrumentoComponent.registro.valoracciones = lregistro[0].valoracciones;
          this.instrumentoComponent.registro.preciocompra = lregistro[0].preciocompra;
          this.instrumentoComponent.registro.valordividendospagados = lregistro[0].valordividendospagados;
          this.instrumentoComponent.registro.porcentajeparticipacioncupon = lregistro[0].porcentajeparticipacioncupon;
          this.instrumentoComponent.registro.tasainterescupon = lregistro[0].tasainterescupon;
          this.instrumentoComponent.registro.observaciones = lregistro[0].observaciones;
          this.instrumentoComponent.registro.observacionespagos = lregistro[0].observacionespagos;
          this.instrumentoComponent.registro.bolsavaloresccatalogo = lregistro[0].bolsavaloresccatalogo;

          this.inversionesServicios.pBolsavalorescdetalle = lregistro[0].bolsavalorescdetalle;

          this.instrumentoComponent.registro.calendarizacionccatalogo = lregistro[0].calendarizacionccatalogo;
          this.inversionesServicios.pCalendarizacioncdetalle = lregistro[0].calendarizacioncdetalle;

          this.instrumentoComponent.registro.basediasinteresccatalogo = lregistro[0].basediasinteresccatalogo;
          this.inversionesServicios.pBasediasinterescdetalle = lregistro[0].basediasinterescdetalle;

          this.instrumentoComponent.registro.calificacionriesgoinicialccatalogo = lregistro[0].calificacionriesgoinicialccatalogo;
          this.instrumentoComponent.registro.calificacionriesgoinicialcdetalle = lregistro[0].calificacionriesgoinicialcdetalle;

          this.instrumentoComponent.registro.calificacionriesgoactualccatalogo = lregistro[0].calificacionriesgoactualccatalogo;

          this.inversionesServicios.pCalificacionriesgoactualcdetalle = lregistro[0].calificacionriesgoactualcdetalle;

          this.instrumentoComponent.registro.casavaloresccatalogo = lregistro[0].casavaloresccatalogo;
          this.instrumentoComponent.registro.casavalorescdetalle = lregistro[0].casavalorescdetalle;
          this.instrumentoComponent.registro.clasificacioninversionccatalogo = lregistro[0].clasificacioninversionccatalogo;
          this.instrumentoComponent.registro.clasificacioninversioncdetalle = lregistro[0].clasificacioninversioncdetalle;
          this.instrumentoComponent.registro.compracuponccatalogo = lregistro[0].compracuponccatalogo;

          this.instrumentoComponent.registro.emisorccatalogo = lregistro[0].emisorccatalogo;

          this.inversionesServicios.pEmisorcdetalle = lregistro[0].emisorcdetalle;
         //ACECPTANTE FACTURA COMERCIAL
          this.inversionesServicios.pEmisorcdetalleNuevo = lregistro[0].aceptantecdetalle;

          this.instrumentoComponent.registro.formaajusteinteresccatalogo = lregistro[0].formaajusteinteresccatalogo;
          this.instrumentoComponent.registro.instrumentoccatalogo = lregistro[0].instrumentoccatalogo;
          this.instrumentoComponent.registro.mercadotipoccatalogo = lregistro[0].mercadotipoccatalogo;

          this.inversionesServicios.pMercadotipocdetalle = lregistro[0].mercadotipocdetalle;

          this.instrumentoComponent.registro.monedaccatalogo = lregistro[0].monedaccatalogo;


          this.inversionesServicios.pMonedacdetalle = lregistro[0].monedacdetalle;


          this.instrumentoComponent.registro.periodicidadpagoscapitalccatalogo = lregistro[0].periodicidadpagoscapitalccatalogo;
          this.instrumentoComponent.registro.periodicidadpagoscapitalcdetalle = lregistro[0].periodicidadpagoscapitalcdetalle;
          this.instrumentoComponent.registro.periodicidadpagosinteresccatalogo = lregistro[0].periodicidadpagosinteresccatalogo;
          this.instrumentoComponent.registro.periodicidadpagosinterescdetalle = lregistro[0].periodicidadpagosinterescdetalle;
          this.instrumentoComponent.registro.portafolioccatalogo = lregistro[0].portafolioccatalogo;
          this.instrumentoComponent.registro.portafoliocdetalle = lregistro[0].portafoliocdetalle;
          this.instrumentoComponent.registro.sectorccatalogo = lregistro[0].sectorccatalogo;

          this.inversionesServicios.pSectorcdetalle = lregistro[0].sectorcdetalle;

          this.instrumentoComponent.registro.sistemacolocacionccatalogo = lregistro[0].sistemacolocacionccatalogo;

          this.inversionesServicios.pSistemacolocacioncdetalle = lregistro[0].sistemacolocacioncdetalle;

          this.instrumentoComponent.registro.bancoccatalogo = lregistro[0].bancoccatalogo;

          this.instrumentoComponent.registro.bancopagoccatalogo = lregistro[0].bancopagoccatalogo;

          this.inversionesServicios.pBancocdetalle = lregistro[0].bancocdetalle;
          this.inversionesServicios.pBancopagocdetalle = lregistro[0].bancopagocdetalle;

          this.instrumentoComponent.registro.estadoccatalogo = lregistro[0].estadoccatalogo;

          this.inversionesServicios.pEstadocdetalle = lregistro[0].estadocdetalle;

          if (this.esReajuste(lregistro[0].cinversionhisultimo)) {
            this.mCinversionhisultimo = lregistro[0].cinversionhisultimo;
            this.mInteresdiferencia = lregistro[0].interesdiferencia;
            this.mCapitaldiferencia = lregistro[0].capitaldiferencia;
            this.inversionesServicios.pTasa = lregistro[0].tasanueva;
          }

          this.instrumentoComponent.registro.interesanterior = lregistro[0].interesanterior;
          this.instrumentoComponent.registro.capitalanterior = lregistro[0].capitalanterior;
          this.instrumentoComponent.registro.interesnuevo = lregistro[0].interesnuevo;
          this.instrumentoComponent.registro.capitalnuevo = lregistro[0].capitalnuevo;

          if (this.inversionesServicios.instrumentosSinTablaSinPC() ||
            (this.inversionesServicios.tieneTablaPagos() && this.esIngresadaOAnulada())) {
            this.inversionesServicios.pPlazoxvencer = lregistro[0].plazo;
          }

          this.inversionesServicios.pCusuarioing = lregistro[0].cusuarioing;
          this.inversionesServicios.pFingreso = lregistro[0].fingreso;
          this.inversionesServicios.pCusuariomod = lregistro[0].cusuariomod;
          this.inversionesServicios.pFmodificacion = lregistro[0].fmodificacion;

          this.inversionesServicios.pinterestranscurrido = lregistro[0].interestranscurrido;

          this.instrumentoComponent.registro.centrocostoccatalogo = lregistro[0].centrocostoccatalogo;

          this.inversionesServicios.pCentrocostocdetalle = lregistro[0].centrocostocdetalle;

          this.inversionesServicios.pInstrumentocdetalle = lregistro[0].instrumentocdetalle;

          this.inversionesServicios.pInteres = lregistro[0].interes;

          this.inversionesServicios.pTASA_BOLSA_VALORES = lregistro[0].porcentajebolsa;
          this.inversionesServicios.pTASA_OPERADOR_BOLSA = lregistro[0].porcentajeoperador;
          this.inversionesServicios.pTASA_RETENCION = lregistro[0].porcentajeretencion;

          this.inversionesServicios.generaPorcentajeString();

          if (this.inversionesServicios.tieneTablaPagos() && (
            this.inversionesServicios.pEstadocdetalle == 'APR' ||
            this.inversionesServicios.pEstadocdetalle == 'PAG' ||
            this.inversionesServicios.pEstadocdetalle == 'FINAPR' ||
            this.inversionesServicios.pEstadocdetalle == 'ANULA')) {

            this.mcampos.tablaAmortiza = "Tabla de Pagos";
            if (this.inversionesServicios.pEstadocdetalle == 'PAG' && this.pTransaccion < 1000) this.mcampos.tablaAmortizaSubir = "Subir Tabla de Pagos";
            this.mcampos.TIR = "TIR";

          }

          for (const i in resp.TABAMO) {
            if (resp.TABAMO.hasOwnProperty(i)) {
              resp.TABAMO[i].mdatos.nestado = resp.TABAMO[i].nestado;
            }
          }

          if (this.pTasaclasificacioncdetalle == "VAR" || this.inversionesServicios.instrumentosPC()) {
            this.instrumentoComponent.calcularInteresFijo(false);
          }
          else if (this.inversionesServicios.instrumentosSinTablaSinPC()
            || (this.inversionesServicios.tieneTablaPagos() && this.esIngresadaOAnulada())) {
            this.instrumentoComponent.construirSinTabla(
              lregistro[0].porcentajebolsa
              , lregistro[0].porcentajeoperador
              , lregistro[0].porcentajeretencion
              , Number(this.mcampos.cinversion));
          }
          else if (this.pTransaccion < 3000) {
            this.inversionesServicios.construyePago(
              resp, 
              this.inversionesServicios.pMercadotipocdetalle);
          }

          else if (this.pTransaccion > 3000 &&
            this.pTransaccion < 4000 &&
            this.inversionesServicios.tieneTablaPagos() &&
            (this.inversionesServicios.pEstadocdetalle == "ENVAPR" ||
              this.inversionesServicios.pEstadocdetalle == "ENVPAG" ||
              this.inversionesServicios.pEstadocdetalle == "PAG")) {
            this.inversionesServicios.construyePago(
              resp, this.inversionesServicios.pMercadotipocdetalle);
          }

          this.tablamortizacionComponent.lregistros = resp.TABAMO;
          this.inversionesServicios.ptablaamortizaregistro = resp.TABAMO;

          let lblnControl: boolean = true;

          if (this.pTransaccion < 1000
            && this.inversionesServicios.pEstadocdetalle == "PAG"
            && this.inversionesServicios.tieneTablaPagos()) {

            if (resp.TABAMO == null) {
              lblnControl = false;
            }
            else if (this.tablamortizacionComponent.lregistros.length == 0) {
              lblnControl = false;

            }

          }

          if (!lblnControl) {
            this.mLabelEnviar = "";
          }
          else if (this.estaVacio(this.instrumentoComponent.registro.codigotitulo)) {
            if (this.actualizarNumeroCdpPa()) {
              this.mLabelEnviar = "";
            }
            else if (this.actualizarAcciones() && (this.estaVacio(this.instrumentoComponent.registro.codigotitulo) || this.estaVacio(this.inversionesServicios.pFpago))) {
              this.mLabelEnviar = "";
            }
          }

          if (!this.inversionesServicios.instrumentosSinTabla() && !this.esIngresadaOAnulada()) {

            if (this.pTransaccion > 3000) {
              this.tablamortizacionComponent.construirTabla();
            }

            if (lblnControl) this.tablamortizacionComponent.obtenerTIR();
          }
          else if (this.inversionesServicios.tieneTablaPagos() && this.pTransaccion < 1000 && this.inversionesServicios.pEstadocdetalle == 'ANULA') {
            this.tablamortizacionComponent.obtenerTIR();
          }

          if (this.pTransaccion < 1000 && this.inversionesServicios.tieneTablaPagos() && this.inversionesServicios.pEstadocdetalle == 'PAG') {
            this.instrumentoComponent.pActualizaTituloContrato = 1;
          }




        },
        error => {
          this.dtoServicios.manejoError(error);
        });


  }



  private fijarFiltrosConsulta() {
    this.tablamortizacionComponent.fijarFiltrosConsulta();
  }

  validaFiltrosConsulta(): boolean {
    return (
      this.tablamortizacionComponent.validaFiltrosRequeridos()
    );
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.tablamortizacionComponent.postQuery(resp);
    this.resultadoCargaComponente.postQuery(resp);

  }

  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(iOmitirValidacionEdicion: boolean = false): void {

    if (this.instrumentoComponent.pActualizaTituloContrato == 0 && !iOmitirValidacionEdicion && this.instrumentoComponent.pEditable == 0 && this.estaVacio(this.mMensajeCarga) && this.instrumentoComponent.pActualizarNumeroInstrumento == 0) {
      this.mostrarMensajeError('LOS DATOS NO HAN SIDO EDITADOS');
      return;
    }

    if (this.estaVacio(this.instrumentoComponent.registro.codigotitulo)) {
      if (this.instrumentoComponent.pActualizarNumeroInstrumento == 1) {
        this.mostrarMensajeError('DEBE INGRESAR EL NÚMERO DE ' + this.inversionesServicios.pInstrumentocdetalle);
        return;
      }
      else if (this.actualizarAcciones()) {
        this.mostrarMensajeError('DEBE INGRESAR EL CÓDIGO DE OPERACIÓN');
        return;
      }
    }

    if (this.pTasaclasificacioncdetalle != "FIJA" && this.estaVacio(this.inversionesServicios.pInstrumentocdetalle)) {
      this.mostrarMensajeError('INSTRUMENTO REQUERIDO');
      return;
    }
    if (this.estaVacio(this.inversionesServicios.pEmisorcdetalleNuevo)  && this.inversionesServicios.pInstrumentocdetalle=='FACCO') {
      this.mostrarMensajeError('EMISOR REQUERIDO');
      return;
    }
    if (this.estaVacio(this.inversionesServicios.pMercadotipocdetalle)) {
      this.mostrarMensajeError('MERCADO REQUERIDO');
      return;
    }

    if (this.estaVacio(this.inversionesServicios.pSistemacolocacioncdetalle)) {
      this.mostrarMensajeError('SISTEMA DE COLOCACIÓN REQUERIDO');
      return;
    }

    if (this.estaVacio(this.inversionesServicios.pEmisorcdetalle)) {
      this.mostrarMensajeError('EMISOR REQUERIDO');
      return;
    }


    if (this.inversionesServicios.pInversionExterior) {
      this.inversionesServicios.pSectorcdetalle = "EXT";
    }
    else {
      if(this.estaVacio(this.instrumentoComponent.valorSector)){
        this.inversionesServicios.pSectorcdetalle;
      }else{
        this.inversionesServicios.pSectorcdetalle = this.instrumentoComponent.valorSector ; //CCA 20240318
      }
    }

    if (this.estaVacio(this.inversionesServicios.pMonedacdetalle)) {
      this.mostrarMensajeError('MONEDA REQUERIDA');
      return;
    }

    if (this.inversionesServicios.pMonedacdetalle != "USD" && (this.estaVacio(this.inversionesServicios.pCotizacion) || this.inversionesServicios.pCotizacion <= 0)) {
      this.mostrarMensajeError('LA COTIZACIÓN DEBE SER UN VALOR MAYOR A CERO');
      return;
    }

    if (this.estaVacio(this.instrumentoComponent.registro.clasificacioninversioncdetalle) && !this.inversionesServicios.escash()) {
      this.mostrarMensajeError('CLASIFICACIÓN DE LA INVERSIÓN REQUERIDA');
      return;
    }

    if (this.inversionesServicios.pMercadotipocdetalle == "BURSAT" && !this.estaVacio(this.inversionesServicios.pComisionBolsa) &&
      this.inversionesServicios.pComisionBolsa != 0 &&
      this.estaVacio(this.inversionesServicios.pBolsavalorescdetalle)) {
      this.mostrarMensajeError('BOLSA DE VALORES REQUERIDA');

      return;
    }

    if (this.inversionesServicios.pMercadotipocdetalle == "BURSAT" && this.estaVacio(this.instrumentoComponent.registro.casavalorescdetalle)) {
      this.mostrarMensajeError('CASA DE VALORES REQUERIDA');
      return;
    }

    if (this.inversionesServicios.pMercadotipocdetalle == "BURSAT" && this.estaVacio(this.inversionesServicios.pCinvagentebolsa)) {
      this.mostrarMensajeError('CONTACTO CASA DE VALORES REQUERIDO');
      return;
    }

    if (this.pTasaclasificacioncdetalle == "FIJA" && this.estaVacio(this.inversionesServicios.pFemision)) {
      this.mostrarMensajeError('FECHA DE EMISIÓN REQUERIDA');
      return;
    }

    if (this.inversionesServicios.pMercadotipocdetalle == "BURSAT" && !this.inversionesServicios.instrumentosPC() &&
      this.estaVacio(this.inversionesServicios.pFcompra)) {

      this.mostrarMensajeError('FECHA DE COMPRA REQUERIDA');

      return;
    }

    if (this.actualizarAcciones() &&
      this.estaVacio(this.inversionesServicios.pFpago)) {

      this.mostrarMensajeError('FECHA DE PAGO REQUERIDA');

      return;
    }

    if (this.estaVacio(this.inversionesServicios.pBancocdetalle)) {
      this.mostrarMensajeError('BANCO REQUERIDO');
      return;
    }


    if ((!(this.inversionesServicios.pInstrumentocdetalle == 'ACCION' || this.inversionesServicios.pInstrumentocdetalle == 'ACCOPP') && this.estaVacio(this.inversionesServicios.pBancopagocdetalle)) ||
      (this.actualizarAcciones() && this.estaVacio(this.inversionesServicios.pBancopagocdetalle))) {
      this.mostrarMensajeError('TRANSFERENCIA OBLIGATORIA');
      return;
    }

    if (this.pTasaclasificacioncdetalle == "FIJA" && this.estaVacio(this.inversionesServicios.pBasediasinterescdetalle)) {
      this.mostrarMensajeError('BASE PARA LOS DÍAS DEL INTERÉS OBLIGATORIA');
      return;
    }


    if (this.estaVacio(this.inversionesServicios.pCentrocostocdetalle)) {
      this.mostrarMensajeError('CENTRO DE COSTOS REQUERIDO');
      return;
    }

    if (this.inversionesServicios.tieneTablaPagos() && this.estaVacio(this.instrumentoComponent.registro.periodicidadpagoscapitalcdetalle)) {
      this.mostrarMensajeError('PERIODOS DE PAGO PARA EL CAPITAL REQUERIDO');
      return;
    }

    if (this.inversionesServicios.tieneTablaPagos() && this.estaVacio(this.instrumentoComponent.registro.periodicidadpagosinterescdetalle)) {
      this.mostrarMensajeError('PERIODOS DE PAGO PARA EL INTERÉS REQUERIDO');
      return;
    }

    if (this.estaVacio(this.instrumentoComponent.registro.observaciones)) {
      this.mostrarMensajeError('OBSERVACIONES OBLIGATORIAS');
      return;
    }

    if (this.pTasaclasificacioncdetalle == "FIJA") {


      if (this.estaVacio(this.inversionesServicios.pCapital) || this.inversionesServicios.pCapital <= 0) {
        this.mostrarMensajeError('VALOR NOMINAL DEBE SER MAYOR A CERO');
        return;
      }

      if (this.estaVacio(this.inversionesServicios.pFultimopago) &&
        !this.inversionesServicios.instrumentosPC()) {

        if (this.inversionesServicios.instrumentosSinTabla()) {
          this.mostrarMensajeError('FECHA VALOR REQUERIDA');
        }
        else {
          this.mostrarMensajeError('FECHA DEL VALOR REQUERIDA');
        }


        return;
      }

      const lMensajePlazo: string = "PLAZO DEBE SER MAYOR A CERO";

      if (this.inversionesServicios.instrumentosSinTablaSinPC()) {
        if (this.estaVacio(this.inversionesServicios.pPlazoxvencer) || this.inversionesServicios.pPlazoxvencer <= 0) {
          this.mostrarMensajeError(lMensajePlazo);
          return;
        }
      }
      else if (this.inversionesServicios.instrumentosPC() && this.instrumentoComponent.registro.plazo > 366) {
        this.mostrarMensajeError("PLAZO DEBE SER IGUAL O MENOR A UN AÑO");
        return;
      }
      else if (!this.inversionesServicios.plazoOpcional() && !this.inversionesServicios.escash() && (
        this.estaVacio(this.instrumentoComponent.registro.plazo) || Number(this.instrumentoComponent.registro.plazo) <= 0)) {
        this.mostrarMensajeError(lMensajePlazo);
        return;
      }

      if (this.inversionesServicios.instrumentosPC()) {
        if (this.estaVacio(this.inversionesServicios.pValornegociacion) || this.inversionesServicios.pValornegociacion <= 0) {
          this.mostrarMensajeError('EL VALOR DE LA COMPRA DEBE SER MAYOR QUE CERO');
          return;
        }
      }
      else {
        if (!this.inversionesServicios.escash() && (this.estaVacio(this.inversionesServicios.pTasa) || Number(this.inversionesServicios.pTasa) <= 0)) {
          this.mostrarMensajeError('TASA DEBE SER MAYOR A CERO');
          return;
        }

        if (this.estaVacio(this.inversionesServicios.pCalendarizacioncdetalle)) {
          this.mostrarMensajeError('BASE DE CÁLCULO REQUERIDA');
          return;
        }

      }

      if (!this.inversionesServicios.instrumentosSinTabla() &&
        (this.tablamortizacionComponent.lregistros == undefined ||
          this.tablamortizacionComponent.lregistros.length == 0) &&
        !this.esIngresadaOAnulada()) {
        this.mostrarMensajeError('DEBE GENERAR LA TABLA DE AMORTIZACIÓN');
        return;
      }

    }
    else {



      if (this.estaVacio(this.instrumentoComponent.registro.valoracciones) || this.instrumentoComponent.registro.valoracciones <= 0) {
        this.mostrarMensajeError('EL VALOR DE LAS ACCIONES DEBE SER MAYOR A CERO');
        return;
      }

      if (this.estaVacio(this.instrumentoComponent.registro.numeroacciones) || this.instrumentoComponent.registro.numeroacciones <= 0) {
        this.mostrarMensajeError('EL número DE LAS ACCIONES DEBE SER MAYOR A CERO');
        return;
      }

      if (this.estaVacio(this.instrumentoComponent.registro.preciounitarioaccion) || this.instrumentoComponent.registro.preciounitarioaccion <= 0) {
        this.mostrarMensajeError('EL PRECIO UNITARIO DEBE SER MAYOR A CERO');
        return;
      }

      if (this.estaVacio(this.instrumentoComponent.registro.preciocompra) || this.instrumentoComponent.registro.preciocompra <= 0) {
        this.mostrarMensajeError('EL PRECIO DE COMPRA SER MAYOR A CERO');
        return;
      }


      if (!this.estaVacio(this.inversionesServicios.pComisiontotal) && this.inversionesServicios.pComisiontotal < 0) {
        this.mostrarMensajeError('EL TOTAL DE LAS COMISIONES NO DEBE SER NEGATIVO');
        return;
      }


    }

    this.encerarMensajes();

    if (this.pTransaccion < 1000) this.mLabelEnviar = this.inversionesServicios.pLabelEnvioAprobar;

    this.lInstrumento[0].interesvalornominal = this.inversionesServicios.pInteres;
    this.lInstrumento[0].interesporvencer = this.inversionesServicios.pInteresporvencer;
    this.lInstrumento[0].diasvalornominal = this.inversionesServicios.pInteresnominaldias
    this.lInstrumento[0].plazorealxvencer = this.inversionesServicios.pPlazoxvencer;
    this.lInstrumento[0].diastranscurridosinteres = this.inversionesServicios.pInterestranscurridodias;

    this.lInstrumento[0].bolsavaloresccatalogo = this.instrumentoComponent.registro.bolsavaloresccatalogo;

    this.lInstrumento[0].bolsavalorescdetalle = this.inversionesServicios.pBolsavalorescdetalle;

    this.lInstrumento[0].calendarizacionccatalogo = this.instrumentoComponent.registro.calendarizacionccatalogo;
    this.lInstrumento[0].calendarizacioncdetalle = this.inversionesServicios.pCalendarizacioncdetalle;

    this.lInstrumento[0].basediasinteresccatalogo = this.instrumentoComponent.registro.basediasinteresccatalogo;
    this.lInstrumento[0].basediasinterescdetalle = this.inversionesServicios.pBasediasinterescdetalle;

    this.lInstrumento[0].calificacionriesgoinicialccatalogo = 1207;
    this.lInstrumento[0].calificacionriesgoinicialcdetalle = this.instrumentoComponent.registro.calificacionriesgoinicialcdetalle;

    this.lInstrumento[0].calificacionriesgoactualccatalogo = 1207;
    
    this.lInstrumento[0].calificacionriesgoactualcdetalle = this.inversionesServicios.pCalificacionriesgoactualcdetalle;

    this.lInstrumento[0].casavaloresccatalogo = this.instrumentoComponent.registro.casavaloresccatalogo;
    this.lInstrumento[0].casavalorescdetalle = this.instrumentoComponent.registro.casavalorescdetalle;

    this.lInstrumento[0].cinvagentebolsa = this.inversionesServicios.pCinvagentebolsa;

    this.lInstrumento[0].cinvoperadorinstitucional = this.inversionesServicios.pCinvoperadorinstitucional;

    this.lInstrumento[0].retencionfuentevalor = this.inversionesServicios.pRetencion;

    this.lInstrumento[0].clasificacioninversionccatalogo = 1203;
    this.lInstrumento[0].clasificacioninversioncdetalle = this.instrumentoComponent.registro.clasificacioninversioncdetalle;
    this.lInstrumento[0].codigotitulo = this.instrumentoComponent.registro.codigotitulo;
    this.lInstrumento[0].numerocontrato = this.instrumentoComponent.registro.numerocontrato;
    this.lInstrumento[0].comisionbolsavalores = this.inversionesServicios.pComisionBolsa;
    this.lInstrumento[0].comisionoperador = this.inversionesServicios.pComisionOperador;
    this.lInstrumento[0].comisionretencion = this.inversionesServicios.pRetencion;
    this.lInstrumento[0].compracuponccatalogo = this.instrumentoComponent.registro.compracuponccatalogo;
    this.lInstrumento[0].cotizacion = this.inversionesServicios.pCotizacion;
    this.lInstrumento[0].diasgraciacapital = this.inversionesServicios.pDiasgraciacapital;
    this.lInstrumento[0].diasgraciainteres = this.inversionesServicios.pDiasgraciainteres;
    this.lInstrumento[0].diasporvencerafechacompra = this.instrumentoComponent.registro.diasporvencerafechacompra;
    this.lInstrumento[0].emisorccatalogo = 1213;

    this.lInstrumento[0].emisorcdetalle = this.inversionesServicios.pEmisorcdetalle;

    this.lInstrumento[0].estadoccatalogo = 1204;
    this.lInstrumento[0].estadocdetalle = this.inversionesServicios.pEstadocdetalle;
    this.lInstrumento[0].fcolocacion = this.inversionesServicios.pFemision;

    if (this.inversionesServicios.pInstrumentocdetalle == 'ACCION' || this.inversionesServicios.pInstrumentocdetalle == 'ACCOPP') {
      this.lInstrumento[0].femision = this.inversionesServicios.pFcompra;;
    }
    else {
      this.lInstrumento[0].femision = this.inversionesServicios.pFemision;
    }

    this.lInstrumento[0].formaajusteinteresccatalogo = this.instrumentoComponent.registro.formaajusteinteresccatalogo;
    this.lInstrumento[0].fregistro = this.inversionesServicios.pFemision;
    this.lInstrumento[0].fcompra = this.inversionesServicios.pFcompra;
    this.lInstrumento[0].fpago = this.inversionesServicios.pFpago;

    this.lInstrumento[0].fultimopago = this.inversionesServicios.pFultimopago;

    this.lInstrumento[0].fpagoultimocupon = this.inversionesServicios.pFpagoultimocupon;
    this.lInstrumento[0].fultimacompra = this.instrumentoComponent.registro.fultimacompra;
    this.lInstrumento[0].fvencimiento = this.inversionesServicios.pFvencimiento;

    this.lInstrumento[0].instrumentoccatalogo = 1202;
    this.lInstrumento[0].instrumentocdetalle = this.inversionesServicios.pInstrumentocdetalle;
    this.lInstrumento[0].aceptantecdetalle=this.inversionesServicios.pEmisorcdetalleNuevo;
    this.lInstrumento[0].aceptanteccatalogo=1213;
    
    this.lInstrumento[0].mercadotipoccatalogo = 1211;
    this.lInstrumento[0].mercadotipocdetalle = this.inversionesServicios.pMercadotipocdetalle;
    this.lInstrumento[0].monedaccatalogo = 1214;
    this.lInstrumento[0].monedacdetalle = this.inversionesServicios.pMonedacdetalle;
    this.lInstrumento[0].numeroacciones = this.instrumentoComponent.registro.numeroacciones;
    this.lInstrumento[0].observaciones = this.instrumentoComponent.registro.observaciones;
    this.lInstrumento[0].observacionespagos = this.instrumentoComponent.registro.observacionespagos;
    this.lInstrumento[0].periodicidadpagoscapitalccatalogo = this.instrumentoComponent.registro.periodicidadpagoscapitalccatalogo;
    this.lInstrumento[0].periodicidadpagoscapitalcdetalle = this.instrumentoComponent.registro.periodicidadpagoscapitalcdetalle;
    this.lInstrumento[0].periodicidadpagosinteresccatalogo = this.instrumentoComponent.registro.periodicidadpagosinteresccatalogo;
    this.lInstrumento[0].periodicidadpagosinterescdetalle = this.instrumentoComponent.registro.periodicidadpagosinterescdetalle;

    if (this.inversionesServicios.instrumentosSinTablaSinPC()) {
      this.lInstrumento[0].plazo = this.inversionesServicios.pPlazoxvencer;
    }
    else if (this.inversionesServicios.tieneTablaPagos() && this.esIngresadaOAnulada()) {
      this.lInstrumento[0].plazo = this.inversionesServicios.pPlazoxvencer;
    }
    else {
      this.lInstrumento[0].plazo = this.instrumentoComponent.registro.plazo;
    }

    this.lInstrumento[0].porcentajecalculoprecio = this.inversionesServicios.pPorcentajecalculoprecio;

    this.lInstrumento[0].porcentajecalculodescuento = this.inversionesServicios.pPorcentajecalculodescuento;
    this.lInstrumento[0].porcentajecalculorendimiento = this.inversionesServicios.pPorcentajecalculorendimiento;

    this.lInstrumento[0].interestranscurrido = this.inversionesServicios.pinterestranscurrido;
    this.lInstrumento[0].porcentajeparticipacioncupon = this.instrumentoComponent.registro.porcentajeparticipacioncupon;
    this.lInstrumento[0].porcentajepreciocompra = this.instrumentoComponent.registro.porcentajepreciocompra;
    this.lInstrumento[0].porcentajeprecioultimacompra = this.inversionesServicios.pPorcentajeprecioultimacompra;
    this.lInstrumento[0].portafolioccatalogo = 1201;
    this.lInstrumento[0].portafoliocdetalle = "INV";
    this.lInstrumento[0].preciocompra = this.instrumentoComponent.registro.preciocompra;
    this.lInstrumento[0].preciounitarioaccion = this.instrumentoComponent.registro.preciounitarioaccion;
    this.lInstrumento[0].sectorccatalogo = 1205;
    this.lInstrumento[0].sectorcdetalle = this.inversionesServicios.pSectorcdetalle;
    this.lInstrumento[0].sistemacolocacionccatalogo = 1212;
    this.lInstrumento[0].sistemacolocacioncdetalle = this.inversionesServicios.pSistemacolocacioncdetalle;

    this.lInstrumento[0].bancopagoccatalogo = 305;

    this.lInstrumento[0].bancoccatalogo = 1224;
    this.lInstrumento[0].bancocdetalle = this.inversionesServicios.pBancocdetalle;
    this.lInstrumento[0].bancopagocdetalle = this.inversionesServicios.pBancopagocdetalle;

    this.lInstrumento[0].tasa = this.inversionesServicios.pTasa;
    this.lInstrumento[0].tasaclasificacionccatalogo = 1210;
    this.lInstrumento[0].tasaclasificacioncdetalle = this.pTasaclasificacioncdetalle;
    this.lInstrumento[0].tasainterescupon = this.instrumentoComponent.registro.tasainterescupon;
    this.lInstrumento[0].valoracciones = this.instrumentoComponent.registro.valoracciones;
    this.lInstrumento[0].valordividendospagados = this.instrumentoComponent.registro.valordividendospagados;

    if (!this.estaVacio(this.inversionesServicios.pEfectivonegociado) || Number(this.inversionesServicios.pEfectivonegociado) != 0) {
      this.lInstrumento[0].valorefectivo = this.inversionesServicios.pEfectivonegociado;
    }
    else {
      this.lInstrumento[0].valorefectivo = this.instrumentoComponent.registro.valorefectivo;
    }
    this.lInstrumento[0].valornegociacion = this.inversionesServicios.pValornegociacion;
    this.lInstrumento[0].valornominal = this.inversionesServicios.pCapital;

    this.lInstrumento[0].yield = this.inversionesServicios.pYield;

    this.lInstrumento[0].centrocostoccatalogo = 1002;

    this.lInstrumento[0].centrocostocdetalle = this.inversionesServicios.pCentrocostocdetalle;

    this.lInstrumento[0].tir = this.inversionesServicios.pTIRValue;

    this.lInstrumento[0].porcentajebolsa = this.inversionesServicios.pTASA_BOLSA_VALORES;
    this.lInstrumento[0].porcentajeoperador = this.inversionesServicios.pTASA_OPERADOR_BOLSA;
    this.lInstrumento[0].porcentajeretencion = this.inversionesServicios.pTASA_RETENCION;

    this.rqMantenimiento.lregistrosgrabar = this.lInstrumento;


    if (this.inversionesServicios.tieneTablaPagos() && this.esIngresadaOAnulada()) {
      this.tablamortizacionComponent.lregistros = [];
    }
    else {


      if (this.inversionesServicios.instrumentosSinTabla() ||
        (this.inversionesServicios.tieneTablaPagos() && this.esIngresadaOAnulada())) {

        if (this.tablamortizacionComponent.lregistros == null || this.tablamortizacionComponent.lregistros == undefined) {
          this.tablamortizacionComponent.lregistros = [];
        }

        if (this.tablamortizacionComponent.lregistros.length == 0) {
          this.tablamortizacionComponent.lregistros.push({ estadocdetalle: 'PEN' });
        }

        this.tablamortizacionComponent.lregistros[0].nfinicio = this.inversionesServicios.pFemision;
        this.tablamortizacionComponent.lregistros[0].nfvencimiento = this.inversionesServicios.pFvencimiento;
        this.tablamortizacionComponent.lregistros[0].plazo = this.instrumentoComponent.registro.plazo;

        if (!this.estaVacio(this.inversionesServicios.pEfectivonegociado) && Number(this.inversionesServicios.pEfectivonegociado) != 0) {
          this.tablamortizacionComponent.lregistros[0].proyeccioncapital = this.inversionesServicios.pEfectivonegociado;
        }
        else {
          this.tablamortizacionComponent.lregistros[0].proyeccioncapital = this.inversionesServicios.pValornegociacion;
        }

        this.tablamortizacionComponent.lregistros[0].proyecciontasa = this.inversionesServicios.pTasa;
        this.tablamortizacionComponent.lregistros[0].proyeccioninteres = this.inversionesServicios.pInteresesnegociacion;
        this.tablamortizacionComponent.lregistros[0].valormora = null;

        //

      }
      else {

        let lIndice: any;

        for (const j in this.inversionesServicios.pTIR) {

          if (!this.estaVacio(this.inversionesServicios.pTIR[j].interesimplicito)) {
            lIndice = j;
            break;
          }

        }

        for (const i in this.tablamortizacionComponent.lregistros) {

          this.tablamortizacionComponent.lregistros[i].interesimplicito = this.inversionesServicios.pTIR[lIndice].interesimplicito;
          this.tablamortizacionComponent.lregistros[i].costoamortizado = this.inversionesServicios.pTIR[lIndice].costoamortizado;

          this.tablamortizacionComponent.lregistros[i].diferenciainteresimplicito = this.inversionesServicios.pTIR[lIndice].diferenciainteresimplicito;
          this.tablamortizacionComponent.lregistros[i].capitalxamortizar = this.inversionesServicios.pTIR[lIndice].capitalxamortizar;

          lIndice++;
        }


      }

    }

    this.rqMantenimiento.lregistrostablaamortizacion = this.tablamortizacionComponent.lregistros;

    this.rqMantenimiento.contabilizar = iOmitirValidacionEdicion;

    this.rqMantenimiento.estadocdetalleAux = this.pTransaccion < 200 ? this.inversionesServicios.pEstadocdetalle : "";

    this.rqMantenimiento.cargaarchivo = 'save';
    this.crearDtoMantenimiento();
    super.grabar();

    this.asignarEditable();
    this.mMensajeCarga = null;
    this.enceraCamposExcepciones();

  }

  contabilizar() {

    let lContabiliza: any = [];

    let lprocesocDetalle: string = "";
    let lcinversionhisultimo: number = 0;

    if (this.esReajuste()) {

      lprocesocDetalle = this.inversionesServicios.pcREAJUS;

      lcinversionhisultimo = this.mCinversionhisultimo;

      let lInteresDiferencia: number = 0;
      let lCapitalDiferencia: number = 0;

      if (!this.estaVacio(this.mInteresdiferencia) && this.mInteresdiferencia != 0) lInteresDiferencia = this.redondear(Number(this.mInteresdiferencia),2);

      if (!this.estaVacio(this.mCapitaldiferencia) && this.mCapitaldiferencia != 0) lCapitalDiferencia = this.redondear(Number(this.mCapitaldiferencia),2);

      if  ((lInteresDiferencia != 0 || lCapitalDiferencia != 0) || !this.inversionesServicios.tieneTablaPagos()) {

        // INI

        if (lCapitalDiferencia != 0) {

          let ldebitoCapital: boolean = null;
          let ldebitoFondoOrdinario: boolean = null;
  
          if (lCapitalDiferencia > 0) {
            ldebitoCapital = false;
            ldebitoFondoOrdinario = true;
  
          }
          else {
            ldebitoCapital = true;
            ldebitoFondoOrdinario = false;
  
          }
  
          if (lCapitalDiferencia < 0) lCapitalDiferencia = lCapitalDiferencia * -1;
  
          lContabiliza.push({ rubrocdetalle: 'CAP', valor: lCapitalDiferencia, debito: ldebitoCapital, procesocdetalle: 'COMPRA' });
          lContabiliza.push({ rubrocdetalle: 'FONORD', valor: lCapitalDiferencia, debito: ldebitoFondoOrdinario, procesocdetalle: 'RECUP' });

        }

        // FIN


        if (lInteresDiferencia != 0) {

          let ldebitoInteres: boolean = null;
          let ldebitoFondoOrdinario: boolean = null;
  
          if (lInteresDiferencia > 0) {
            ldebitoInteres = false;
            ldebitoFondoOrdinario = true;
  
          }
          else {
            ldebitoInteres = true;
            ldebitoFondoOrdinario = false;
  
          }
  
          if (lInteresDiferencia < 0) lInteresDiferencia = lInteresDiferencia * -1;
  
          lContabiliza.push({ rubrocdetalle: 'INT', valor: lInteresDiferencia, debito: ldebitoInteres, procesocdetalle: 'COMPRA' });
          lContabiliza.push({ rubrocdetalle: 'FONORD', valor: lInteresDiferencia, debito: ldebitoFondoOrdinario, procesocdetalle: 'RECUP' });

        }

      }

    }
    else {

      lcinversionhisultimo = 0;

      lprocesocDetalle = this.inversionesServicios.pcCOMPRA;

      let lComisionBolsa = 0;
      let lComisionOperador = 0;
      let lRetencion = 0;

      if (this.inversionesServicios.pstrInstrumentoCLegal != 'CDP') {
        lComisionBolsa = this.redondear(this.inversionesServicios.pComisionBolsa, 2);
        lComisionOperador = this.redondear(this.inversionesServicios.pComisionOperador, 2);
        lRetencion = this.redondear(this.inversionesServicios.pRetencion, 2);
      }

      let lBancos: number =
        this.redondear(this.inversionesServicios.pEfectivonegociado, 2) +
        this.redondear(this.inversionesServicios.pInteresesnegociacion, 2) +
        lComisionBolsa +
        lComisionOperador;

      if (this.inversionesServicios.pstrInstrumentoCLegal == 'CDP') {
        lContabiliza.push({ rubrocdetalle: 'BANCOS', valor: this.redondear(this.inversionesServicios.pEfectivonegociado, 2), debito: false });
        lContabiliza.push({ rubrocdetalle: 'CAP', valor: this.redondear(this.inversionesServicios.pEfectivonegociado, 2), debito: true });
      }
      else if (this.inversionesServicios.pInstrumentocdetalle == 'ACCION' || this.inversionesServicios.pInstrumentocdetalle == 'ACCOPP')
      {
        lContabiliza.push({ rubrocdetalle: 'CAP', valor: this.redondear(this.inversionesServicios.pEfectivonegociado, 2), debito: true });
        lContabiliza.push({ rubrocdetalle: 'COMBOL', valor: lComisionBolsa, debito: true });
        lContabiliza.push({ rubrocdetalle: 'COMBDE', valor: lComisionOperador, debito: true });
        lContabiliza.push({ rubrocdetalle: 'BANCOS', valor: lBancos, debito: false });
      }
     else
     {

      /*
        let lKapital: number = this.redondear(this.inversionesServicios.pEfectivonegociado,2) +
          this.redondear(this.inversionesServicios.pInteresesnegociacion,2) + 
          lRetencion + 
          lComisionOperador +
          lComisionBolsa;

       lContabiliza.push({ rubrocdetalle: 'CAP', valor: lKapital, debito: true });
       lContabiliza.push({ rubrocdetalle: 'CXC', valor: lRetencion, debito: false });
       lContabiliza.push({ rubrocdetalle: 'INVCXC', valor: lKapital - lRetencion, debito: false });
       lContabiliza.push({ rubrocdetalle: 'CXPFNA', valor: lRetencion, debito: true });
       lContabiliza.push({ rubrocdetalle: 'RETFNA', valor: lRetencion, debito: false });


        lContabiliza.push({ rubrocdetalle: 'CAP', valor: this.redondear(this.inversionesServicios.pEfectivonegociado, 2), debito: null });
        lContabiliza.push({ rubrocdetalle: 'INT', valor: this.redondear(this.inversionesServicios.pInteresesnegociacion, 2), debito: null });
        lContabiliza.push({ rubrocdetalle: 'CAP', valor: lComisionBolsa, debito: null });
        lContabiliza.push({ rubrocdetalle: 'CAP', valor: lComisionOperador, debito: null });
        lContabiliza.push({ rubrocdetalle: 'COMBOL', valor: lRetencion, debito: null });
        lContabiliza.push({ rubrocdetalle: 'CXC', valor: this.redondear(lBancos, 2), debito: false });
        lContabiliza.push({ rubrocdetalle: 'CXC', valor: lRetencion, debito: null });

       */

        let lKapital: number = this.redondear(this.inversionesServicios.pEfectivonegociado,2) +
          this.redondear(this.inversionesServicios.pInteresesnegociacion,2) + 
          lComisionOperador;

        lContabiliza.push({ rubrocdetalle: 'CAP', valor: lKapital, debito: true });
        lContabiliza.push({ rubrocdetalle: 'INVCXC', valor: lKapital, debito: false });


      }

      lContabiliza.push({ rubrocdetalle: 'CTORDE', valor: this.redondear(this.inversionesServicios.pEfectivonegociado, 2), debito: true });
      lContabiliza.push({ rubrocdetalle: 'CTORAC', valor: this.redondear(this.inversionesServicios.pEfectivonegociado, 2), debito: false });

    }

    this.rqMantenimiento.cinversionhisultimo = lcinversionhisultimo;
    this.rqMantenimiento.lregistroContabilidad = lContabiliza;
    this.rqMantenimiento.procesocdetalle = lprocesocDetalle;

  }

  enceraCamposExcepciones() {
    this.instrumentoComponent.pActualizarNumeroInstrumento = 0;
    this.instrumentoComponent.pActualizaTituloContrato = 0;

  }

  limpiar() {


    this.enceraCamposExcepciones();

    this.instrumentoComponent.pEsReajuste = false;

    this.limpiarReajuste();
    this.mMensajeCarga = null;

    this.encerarMensajes();

    this.inversionesServicios.limpiarService();

    this.instrumentoComponent.mcampos.cinvagentebolsa = null;
    this.instrumentoComponent.mcampos.nombres = null;

    this.instrumentoComponent.mcampos.ccuentacon = null;
    this.instrumentoComponent.mcampos.ncuentacon = null;

    this.instrumentoComponent.mcampos.ccuentaconbanco = null;
    this.instrumentoComponent.mcampos.ncuentaconbanco = null;

    this.instrumentoComponent.crearNuevo();
    this.mcampos.cinversion = null;
    this.mcampos.codigotitulo = null;
    this.lInstrumento[0].cinversion = 0;
    this.tablamortizacionComponent.lregistros = [];

    this.inversionesServicios.pTIR = [];

    this.tablamortizacionComponent.rqMantenimiento.lregistrosTotales[0].capital = 0;
    this.tablamortizacionComponent.rqMantenimiento.lregistrosTotales[0].interes = 0;
    this.tablamortizacionComponent.rqMantenimiento.lregistrosTotales[0].total = 0;

    this.asignakCheck();

  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  validaGrabar() {
    return (
      this.tablamortizacionComponent.validaGrabar()
    );
  }

  public postCommit(resp: any) {

    this.mMensajeCarga = null;

    if (resp.Anulado != undefined && resp.Anulado) {

      this.inversionesServicios.pCcomprobanteanulacion = resp.ccomprobanteEspejo;

      this.inversionesServicios.pEstadocdetalle = "ING";

      this.inversionesServicios.pCcomprobante = null;

      this.mostrarMensajeSuccess("Comprobante Generado: " +
        resp.ccomprobanteEspejo + ' - ' +
        resp.numerocomprobantecesantiaEspejo);

      return;
    }

    if (resp.cod != undefined && resp.cod.toString().substring(0, 4) == "INV-") {

      this.mostrarMensajeError(resp.msgusu);

      if (resp.cod == "INV-0002") this.asignarEditable(2);

      return;
    }

    if (resp.ccomprobante != undefined) {

      this.inversionesServicios.pCcomprobante = resp.ccomprobante;
      this.inversionesServicios.pFcontable = resp.fcontable;
      this.inversionesServicios.pCcompania = resp.ccompania;

      this.mostrarMensajeSuccess("Comprobante Generado: " +
        resp.ccomprobante + ' - ' +
        resp.numerocomprobantecesantia);

      this.inversionesServicios.pEstadocdetalle = "APR";

      return;
    }

    if (resp.cinversion != undefined) {
      this.mcampos.cinversion = resp.cinversion;
      this.mcampos.codigotitulo = this.instrumentoComponent.registro.codigotitulo;
    }

    if (resp.SubirTablaAmortiza != undefined && resp.SubirTablaAmortiza == 1) {

      //this.inversionesServicios.construyePago(resp, this.inversionesServicios.pMercadotipocdetalle);

      this.tablamortizacionComponent.lregistros = resp.lregistros;
      this.tablamortizacionComponent.totalizar();

      this.instrumentoComponent.calcularInteres();

      this.inversionesServicios.pInteres = 0;

      for (const i in this.tablamortizacionComponent.lregistros) {
        const reg = this.tablamortizacionComponent.lregistros[i];

        if (!this.estaVacio(reg.proyeccioninteres))
        {
          this.inversionesServicios.pInteres = this.inversionesServicios.pInteres + reg.proyeccioninteres;
        }


      }
  
      const lMensajecarga: string = "TABLA DE PAGOS CARGADA EXITOSAMENTE!";

      this.mostrarMensajeSuccess(lMensajecarga);
      this.mMensajeCarga = lMensajecarga;

    }
    else {
      if (resp.cod != undefined && resp.cod == "000") {
        this.resultadoCargaComponente.lregistros = resp.lregistros;

        this.resultadoCargaComponente.postCommit(resp);
      }
      else {
        this.tablamortizacionComponent.postCommitEntityBean(
          resp,
          this.getDtoMantenimiento(this.tablamortizacionComponent.alias)
        );
        if (resp.cinversion != undefined && resp.cinversion > 0) {
          this.instrumentoComponent.registro.cinversion = resp.cinversion;
          this.lInstrumento[0].cinversion = resp.cinversion;
        }
      }
    }
  }


  mostrarLovInversiones(): void {

    this.lovInversiones.mfiltros.tasaclasificacioncdetalle = this.pTasaclasificacioncdetalle;

    if (this.inversionesServicios.pSectorcdetalle == "EXT") {
      this.lovInversiones.mfiltros.sectorcdetalle = this.inversionesServicios.pSectorcdetalle;
    }
    else {
      this.lovInversiones.mfiltrosesp.sectorcdetalle = ' not in (\'EXT\')' + ' ';
    }

    if (this.pTasaclasificacioncdetalle == "VAR") {
      this.lovInversiones.mfiltrosesp.instrumentocdetalle = ' in (\'ACCION\',\'ACCOPP\')' + ' ';
    }
    else {
      this.lovInversiones.mfiltrosesp.instrumentocdetalle = ' = \'' + this.inversionesServicios.pInstrumentocdetalle + '\'' + ' ';
    }

    if (this.pTransaccion < 1000) {

      this.lovInversiones.mfiltrosesp.estadocdetalle = ' in (\'ING\',\'ANULA\',\'PAG\')' + ' ';

    }
    else if (this.pTransaccion < 2000) {

      this.lovInversiones.mfiltrosesp.estadocdetalle = ' in (\'ENVAPR\',\'FINAPR\')' + ' ';

    }
    else if (this.pTransaccion < 3000) {

      this.lovInversiones.mfiltrosesp.estadocdetalle = ' in (\'APR\')' + ' ';

    }
    this.lovInversiones.showDialog();
  }

  fijarLovInversionesSelec(reg: any): void {
    if (reg.registro !== undefined) {

      this.msgs = [];
      this.mcampos.cinversion = reg.registro.cinversion;
      this.mcampos.codigotitulo = reg.registro.codigotitulo;
      this.instrumentoComponent.mfiltros.cinversion = this.mcampos.cinversion;
      this.lInstrumento[0].cinversion = this.mcampos.cinversion;
      this.consultar();

    }

  }

  //crearNuevo
  nuevo() {

    this.instrumentoComponent.pAlerta = "";

    this.asignarPcInversion();

    this.limpiar();

    this.limpiaTablaAmortiza();


    if (this.inversionesServicios.instrumentosSinTablaSinPC) {
      this.inversionesServicios.pCalendarizacioncdetalle = '360';
    }

    this.inversionesServicios.pPorcentajecalculoprecio = 100;
    this.asignarEditable(1);

    this.asignakCheck(true);

  }

  cancelar() {
    this.limpiar();
    this.limpiaTablaAmortiza();
    this.asignarEditable();

    this.inversionesServicios.pEstadocdetalle = null;


  }

  generaTablaAmortizacion() {

    if (this.estaVacio(this.inversionesServicios.pFemision)) {
      this.mostrarMensajeError('FECHA DE EMISIÓN REQUERIDA');
      return;
    }


    if (this.estaVacio(this.inversionesServicios.pCapital) || this.inversionesServicios.pCapital <= 0) {
      this.mostrarMensajeError('VALOR NOMINAL DEBE SER MAYOR A CERO');
      return;
    }

    if (this.estaVacio(this.inversionesServicios.pFultimopago)) {
      this.mostrarMensajeError('FECHA DEL VALOR REQUERIDA');
      return;
    }

    if (this.estaVacio(this.instrumentoComponent.registro.plazo) || this.instrumentoComponent.registro.plazo <= 0) {
      this.mostrarMensajeError('PLAZO DEBE SER MAYOR A CERO');
      return;
    }

    if (this.estaVacio(this.inversionesServicios.pTasa) || this.inversionesServicios.pTasa <= 0) {
      this.mostrarMensajeError('TASA DEBE SER MAYOR A CERO');
      return;
    }

    if (this.estaVacio(this.inversionesServicios.pCalendarizacioncdetalle)) {
      this.mostrarMensajeError('BASE DE CÁLCULO REQUERIDA');
      return;
    }


    if (this.estaVacio(this.instrumentoComponent.registro.periodicidadpagoscapitalcdetalle)) {
      this.mostrarMensajeError('PERIODICIDAD DE PAGOS DEL CAPITAL REQUERIDA');
      return;
    }

    if (this.estaVacio(this.instrumentoComponent.registro.periodicidadpagosinterescdetalle)) {
      this.mostrarMensajeError('PERIODICIDAD DE PAGOS DEL INTERÉS REQUERIDA');
      return;
    }

    if (this.estaVacio(this.inversionesServicios.pNumeropagosinteres)) {
      this.mostrarMensajeError('NUMERO DE PAGOS DEL INTERÉS REQUERIDO');
      return;
    }

    const rqConsulta: any = new Object();
    rqConsulta.CODIGOCONSULTA = 'INVERSION';
    rqConsulta.inversion = 0;
    rqConsulta.periodicidadpagoscapitalcdetalle = this.instrumentoComponent.registro.periodicidadpagoscapitalcdetalle;
    rqConsulta.periodicidadpagosinterescdetalle = this.instrumentoComponent.registro.periodicidadpagosinterescdetalle;
    rqConsulta.fcolocacion = this.inversionesServicios.pFemision;
    rqConsulta.tasa = this.inversionesServicios.pTasa;
    rqConsulta.calendarizacion = this.instrumentoComponent.obtenerCalendarizacion();
    rqConsulta.plazo = this.inversionesServicios.pInteresnominaldias;
    rqConsulta.valornominal = this.inversionesServicios.pCapital;

    this.dtoServicios.ejecutarConsultaRest(rqConsulta)
      .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false);
          if (resp.cod !== 'OK') {
            return;
          }
          this.tablamortizacionComponent.lregistros = resp.TABLAAMORTIZA;
          this.tablamortizacionComponent.totalizar();
          this.instrumentoComponent.calculoIntereses();
        },
        error => {
          this.dtoServicios.manejoError(error);
        });

  }

  imprimir(resp: any): void {


    if (this.inversionesServicios.pstrInstrumentoCLegal == 'CDP')
    {
      this.jasper.nombreArchivo = 'rptInvInversionSinTabla';
    }
    else if (this.pTasaclasificacioncdetalle == "VAR") {
      this.jasper.nombreArchivo = 'rptInvInversionRentaVariable';
    }
    else {
      this.jasper.nombreArchivo = 'rptInvInversionRentaFija';
    }

    // Agregar parametros
    this.jasper.parametros['@cinversion'] = this.instrumentoComponent.registro.cinversion;
    var ldate = new Date();
    let lfechanum: number = (ldate.getFullYear() * 10000) + ((ldate.getMonth() + 1) * 100) + ldate.getDate();
    this.jasper.parametros['@ifechacorte'] = lfechanum;

    if (this.inversionesServicios.pstrInstrumentoCLegal == 'CDP')
    {
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvInversionSinTabla';
    }
    else if (this.pTasaclasificacioncdetalle == "VAR") {
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvInversionRentaVariable';
    }
    else {
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvInversionRentaFija';
    }

    this.jasper.formatoexportar = resp;
    this.jasper.generaReporteCore();
  }

  uploadHandler(event) {

    this.subirTablaAmortizacion(event);


  }

  subirTablaAmortizacion(event) {
    this.rqMantenimiento.narchivo = event.files[0].name;
    this.lOperacion = [];
    this.rqMantenimiento.cargaarchivo = 'upload';
    this.rqMantenimiento.subirInversion = 1;
    this.rqMantenimiento.cinversion = this.instrumentoComponent.pCinversion;
    this.getBase64(event);
  }


  getBase64(inputValue: any): void {
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {
      this.propagateChange(myReader.result);
    }
    myReader.readAsDataURL(file);
  }

  cancelarSubir() {
    this.limpiarCampos();
    this.inversionesServicios.valoresPorDefault();
  }

  /**Muestra lov de cuentas contables */
  limpiarCampos() {
    this.rqMantenimiento.narchivo = '';
    this.resultadoCargaComponente.lregistros = [];
    this.lOperacion = [];
  }

  propagateChange = (value: any) => {
    this.rqMantenimiento.archivo = value;
    const rqMan = this.getRequestMantenimiento();
    this.dtoServicios.ejecutarRestMantenimiento(rqMan, null, null).subscribe(
      resp => {
        if (resp.cod === 'OK') {
          this.grabo = true;
        }
        this.encerarMensajes();
        this.respuestacore = resp;
        this.componentehijo.postCommit(resp);
        this.dtoServicios.llenarMensaje(resp, true); // solo presenta errores.
        this.enproceso = false;
      },
      error => {
        this.dtoServicios.manejoError(error);
        this.enproceso = false;
        this.grabo = false;
      }
    );
  };

  obtenerPlantillaContable() {
    const rqConsulta: any = new Object();
    rqConsulta.CODIGOCONSULTA = 'INVERSION';
    rqConsulta.where = this.inversionesServicios.obtenerWhereContabilidad(
      this.inversionesServicios.pcCOMPRA
      , sessionStorage.getItem('t')
      , this.inversionesServicios.pInstrumentocdetalle);

    rqConsulta.instrumentocdetalle = this.inversionesServicios.pInstrumentocdetalle;


    rqConsulta.tasa = this.pTasaclasificacioncdetalle;
    rqConsulta.sector = this.inversionesServicios.pSectorcdetalle;

    rqConsulta.noGenerarPlantillasContables = true;

    rqConsulta.inversion = 7;
    this.dtoServicios.ejecutarConsultaRest(rqConsulta)
      .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false);
          if (resp.cod !== 'OK') {
            return;
          }

          this.inversionesServicios.pPlantillaContable = resp.PLANTILLACONTABLE;
          this.inversionesServicios.pPlantillaContableAgente = resp.PLANTILLACONTABLEAGENTE;
          this.inversionesServicios.ptMercado = resp.Tabla1211;
          this.inversionesServicios.ptSistemaColocacion = resp.Tabla1212;
          this.inversionesServicios.ptMoneda = resp.Tabla1214;
          this.inversionesServicios.ptEstado = resp.Tabla1204;

          this.inversionesServicios.pstrInstrumentoCLegal = resp.ID_INSTRUMENTO_CLEGAL;

          //

          this.inversionesServicios.ptPortafolio = resp.Tabla1201;
          this.inversionesServicios.ptBanco = resp.Tabla1224;
          this.inversionesServicios.ptBancoPago = resp.Tabla305;
          this.inversionesServicios.ptEmisor = resp.Tabla1213;
          this.inversionesServicios.ptInstrumento = resp.Tabla1202;
          this.inversionesServicios.ptBolsaValores = resp.Tabla1215;
          this.inversionesServicios.ptClasificacion = resp.Tabla1203;
          this.inversionesServicios.ptCalendarizacion = resp.Tabla1209;
          this.inversionesServicios.ptBaseDiasInteres = resp.Tabla1222;
          this.inversionesServicios.ptPeriodos = resp.Tabla1206;
          this.inversionesServicios.ptPeriodosInteres = resp.Tabla12061;

          this.inversionesServicios.ptCupon = resp.Tabla1216;
          this.inversionesServicios.ptCasaValores = resp.Tabla1217;
          this.inversionesServicios.ptRiesgo = resp.Tabla1207;
          this.inversionesServicios.ptRiesgoActual = resp.Tabla1207;
          this.inversionesServicios.ptSector = resp.Tabla1205;
          this.inversionesServicios.ptAjusteInteres = resp.Tabla1208;
          this.inversionesServicios.ptcentrocostos = resp.Tabla1002;

          this.inversionesServicios.pAmbiente = resp.AMBIENTE;

          this.inversionesServicios.pTASA_BOLSA_VALORES_DEF = resp.TASA_BOLSA_VALORES;
          this.inversionesServicios.pTASA_OPERADOR_BOLSA_DEF = resp.TASA_OPERADOR_BOLSA;
          this.inversionesServicios.pTASA_RETENCION_DEF = resp.TASA_RETENCION;

          this.inversionesServicios.pIdAgenteDefault = resp.ID_AGENTE;
          this.inversionesServicios.pAgenteRazonSocialDefault = resp.RAZON_SOCIAL_AGENTE;
          this.inversionesServicios.pCentrocostocdetalleDefault = resp.ID_CENTRO_COSTO;
          this.inversionesServicios.pBancoContabilidadDefault = resp.ID_BANCO_CONTABILIDAD;

        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }


  asignarEditable(iEditable: number = 0) {
    this.instrumentoComponent.pEditable = iEditable;
    this.tablamortizacionComponent.pEditable = iEditable;
    this.sbsComponent.pEditable = iEditable;

  }

  inhabilitarPestanias(): boolean {
    return (((this.inversionesServicios.pEmisorcdetalle == undefined ||
      this.inversionesServicios.pEmisorcdetalle == "") &&
      //this.pTasaclasificacioncdetalle == 'FIJA' &&
      this.instrumentoComponent.pEditable == 0 &&
      (this.mcampos.cinversion == undefined || this.mcampos.cinversion == '')));

  }

  aprobar() {

    this.encerarMensajes();

    this.enviar(this.inversionesServicios.pEstadocdetalle == "FINAPR" ? this.inversionesServicios.pLabelAprobar : this.inversionesServicios.pLabelEnvioparaPago);


  }

  aprobarEjecuta() {

    this.encerarMensajes();

    this.confirmationService.confirm({
      message: 'Está seguro de aprobar ' + this.obtenerOperacion() + ' de la inversión?',
      header: 'Confirmación',
      icon: 'fa fa-question-circle',
      accept: () => {

        this.contabilizar();
        //this.rqMantenimiento.cargaarchivo = 'contabiliza';
        this.rqMantenimiento.comentario = this.inversionesServicios.pComentarios;
        this.rqMantenimiento.contabilizar = true;
        this.rqMantenimiento.cinversion = this.mcampos.cinversion;

        if (this.esReajuste()) {
          this.grabar(true);
          this.mLabelEnviar = null;
          //this.mPermiteAnular = 1;
          return;
        }
        else {
          this.rqMantenimiento.cargaarchivo = 'contabiliza';
          super.grabar();
          this.mPermiteAnular = 1;
        }

      },
      reject: () => {
      }
    });


  }

  obtenerOperacion(): string {
    let lMensaje: string = "";
    if (this.esReajuste()) {
      lMensaje = " el reajuste "
    }
    else {
      lMensaje = " la compra "
    }
    return lMensaje;
  }


  anular() {

    this.encerarMensajes();
    this.enviar(this.inversionesServicios.pLabelAnular);
  }

  private anularEjecutar() {
    this.encerarMensajes();

    this.confirmationService.confirm({
      message: 'Está seguro de anular la compra de la inversión?',
      header: 'Confirmación',
      icon: 'fa fa-question-circle',
      accept: () => {

        this.rqMantenimiento.cargaarchivo = 'anula';
        this.rqMantenimiento.comentario = this.inversionesServicios.pComentarios;
        this.rqMantenimiento.cinversion = this.mcampos.cinversion;
        this.rqMantenimiento.anular = true;
        this.rqMantenimiento.mdatos.ccomprobante = this.inversionesServicios.pCcomprobante;
        this.rqMantenimiento.mdatos.fcontable = this.inversionesServicios.pFcontable;
        this.rqMantenimiento.mdatos.ccompania = this.inversionesServicios.pCcompania;
        this.rqMantenimiento.mdatos.actualizarsaldos = true;

        super.grabar();

      },
      reject: () => {
      }
    });


  }


  enviar(istrEtiqueta: string = null) {

    let lEnviar: string = "";
    if (!this.estaVacio(istrEtiqueta)) {
      lEnviar = istrEtiqueta;
    }
    else if (this.pTransaccion < 1000) {
      lEnviar = this.inversionesServicios.pLabelEnvioAprobar;
    }
    else {
      lEnviar = this.inversionesServicios.pLabelDevolver;
    }

    this.inversionesServicios.pblnControl = 0;
    this.inversionesServicios.pComentarios = null;
    this.lovComentarios.pLabelEnviar = lEnviar;
    this.lovComentarios.showDialog();
  }

  fijarLovComentario(reg: any) {
    if (this.inversionesServicios.pblnControl > 0) {

      switch (this.inversionesServicios.pblnControl) {
        case 1:

          if (this.inversionesServicios.pEstadocdetalle == "PAG") {
            this.enviarParaPago("FINAPR");

          }
          else {
            this.enviarParaAprobacionEjecuta();
          }

          break;
        case 2:
          this.aprobarEjecuta();
          break;
        case 3:
          this.anularEjecutar();
          break;
        case 4:

          this.enviarParaAprobacionEjecuta("ING");

          break;
        case 5:
          this.enviarParaPago();
          break;
      }

      this.lovInversiones.rqMantenimiento.lregistros = [];

    }
  }

  private mensajeEnvio(): string {
    return this.inversionesServicios.pblnControl == 4 ? 'Está seguro de devolver la inversión?' : 'Está seguro de enviar la inversión?';
  }

  enviarParaPago(iestadocDetalle: string = "ENVPAG") {

    this.confirmationService.confirm({
      message: this.mensajeEnvio(),
      header: 'Confirmación',
      icon: 'fa fa-question-circle',
      accept: () => {

        this.rqMantenimiento.estadocdetalle = iestadocDetalle;
        this.rqMantenimiento.cargaarchivo = 'comentario';
        this.rqMantenimiento.cinversion = this.mcampos.cinversion;
        this.rqMantenimiento.comentario = this.inversionesServicios.pComentarios;
        this.rqMantenimiento.transaccion = this.pTransaccion;

        this.rqMantenimiento.estadocdetalleAux = this.pTransaccion >= 1000 && this.pTransaccion < 2000 ? this.inversionesServicios.pEstadocdetalle : "";

        this.enproceso = false;
        super.grabar();
        this.inversionesServicios.pEstadocdetalle = iestadocDetalle;
        this.mAprobar = "";
        this.mostrarMensajeSuccess("INVERSIÓN A SIDO ENVIADA EXITOSAMENTE");
      },
      reject: () => {
      }
    });

  }


 

  enviarParaAprobacionEjecuta(iestadocDetalle: string = "ENVAPR") {


    this.confirmationService.confirm({
      message: this.mensajeEnvio(),
      header: 'Confirmación',
      icon: 'fa fa-question-circle',
      accept: () => {

        this.rqMantenimiento.estadocdetalle = '';
        this.rqMantenimiento.reajuste = this.esReajuste();
        this.rqMantenimiento.cargaarchivo = 'comentario';
        this.rqMantenimiento.cinversion = this.mcampos.cinversion;
        this.rqMantenimiento.comentario = this.inversionesServicios.pComentarios;
        this.rqMantenimiento.transaccion = this.pTransaccion;

        this.rqMantenimiento.estadocdetalleAux = this.pTransaccion >= 1000 && this.pTransaccion < 2000 ? this.inversionesServicios.pEstadocdetalle : "";

        this.enproceso = false;

        super.grabar();
        this.inversionesServicios.pEstadocdetalle = iestadocDetalle;
        this.mostrarMensajeSuccess("INVERSIÓN A SIDO ENVIADA EXITOSAMENTE");
        this.limpiarReajuste();
      },
      reject: () => {
      }
    });

  }

  private asignakCheck(iblnCheck: boolean = null) {
    this.inversionesServicios.pblnComisionBolsa = iblnCheck;
    this.inversionesServicios.pblnComisionOperador = iblnCheck;
    this.inversionesServicios.pblnRetencionFuente = iblnCheck;

  }

  private asignarPcInversion(icinversion: number = 0) {
    this.instrumentoComponent.pCinversion = icinversion;
    this.tablamortizacionComponent.pCinversion = icinversion;
  }

  private esReajuste(icinversionhisultimo: number = this.mCinversionhisultimo): boolean {

    this.instrumentoComponent.pEsReajuste = (this.pTransaccion >= 1000 &&
      this.pTransaccion <= 2000 &&
      this.inversionesServicios.pEstadocdetalle == "FINAPR" &&
      !this.estaVacio(icinversionhisultimo) &&
      icinversionhisultimo > 0);

    return this.instrumentoComponent.pEsReajuste;

  }

  private limpiarReajuste() {
    this.mCinversionhisultimo = null;
    this.mInteresdiferencia = null;
    this.mCapitaldiferencia = null;
  }

  private esIngresadaOAnulada(): boolean {
    return (this.inversionesServicios.pEstadocdetalle == 'ING' || this.inversionesServicios.pEstadocdetalle == 'ANULA');
  }

  eliminarInversion() {

    this.encerarMensajes();

    this.confirmationService.confirm({
      message: 'Está seguro de eliminar esta inversión?',
      header: 'Confirmación',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.rqMantenimiento.cinversion = this.mcampos.cinversion;
        this.rqMantenimiento.cargaarchivo = 'eliminar';
        
        super.grabar();
        this.inversionesServicios.limpiarService();
        this.lovInversiones.rqMantenimiento.lregistros = [];
      },
      reject: () => {
      }
    });


  }

}
