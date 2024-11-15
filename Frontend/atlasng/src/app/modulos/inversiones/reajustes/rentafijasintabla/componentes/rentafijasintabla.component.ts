
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

import { InversionesServicios } from './../../../servicios/_invservicios.service';


import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { TirComponent } from '../submodulos/tir/componentes/tir.component';

import { LovComentariosComponent } from '../../../../inversiones/lov/comentarios/componentes/lov.comentarios.component';

@Component({
  selector: "app-rentafijasintabla",
  templateUrl: "rentafijasintabla.html",
  providers: [InversionesServicios]
})
export class RentafijasintablaComponent extends BaseComponent
  implements OnInit, AfterViewInit {
  @ViewChild("formFiltros") formFiltros: NgForm;

  private mLabelEliminar: string = null;

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

    super(router, dtoServicios, "tinvtablaamortizaciontmp", "REAJUSTERENTAFIJA", false, false);
  }

  ngOnInit() {

    this.pTransaccion = Number(sessionStorage.getItem('t'));

    this.inversionesServicios.pInversionExterior =
      (this.pTransaccion >= 100 && this.pTransaccion <= 112) ||
        (this.pTransaccion >= 1100 && this.pTransaccion <= 1112) ||
        (this.pTransaccion >= 2101 && this.pTransaccion <= 2103) ||
        (this.pTransaccion >= 3100 && this.pTransaccion <= 3112) ? true : false;

    let lTran: string = sessionStorage.getItem('t');

    if (this.inversionesServicios.pInversionExterior) {
      this.inversionesServicios.pSectorcdetalle = "EXT";
    }



    if (sessionStorage.getItem('t') == "10" ||    //'PCCERO'
      sessionStorage.getItem('t') == "11" ||    //'PC'
      sessionStorage.getItem('t') == "12" ||    //'OBLIGA'
      sessionStorage.getItem('t') == "13" ||    //'TITULA'
      sessionStorage.getItem('t') == "14" ||    //'PA'
      sessionStorage.getItem('t') == "15" ||    //'CDP'
      sessionStorage.getItem('t') == "16" ||    //'BONO'
      sessionStorage.getItem('t') == "17" ||    //'BONEST'
      sessionStorage.getItem('t') == "18" ||    //'OTROS'
      sessionStorage.getItem('t') == "20" ||    //'FACCO'
      sessionStorage.getItem('t') == "21" ||    //'OTROS'
      sessionStorage.getItem('t') == "101" ||    //'OTROS'
      sessionStorage.getItem('t') == "102" ||    //'OTROS'
      sessionStorage.getItem('t') == "103" ||
      sessionStorage.getItem('t') == "1010" ||    //'PCCERO'
      
      sessionStorage.getItem('t') == "1011" ||    //'PC'
      sessionStorage.getItem('t') == "1012" ||    //'OBLIGA'
      sessionStorage.getItem('t') == "1013" ||    //'TITULA'
      sessionStorage.getItem('t') == "1014" ||    //'PA'
      sessionStorage.getItem('t') == "1015" ||    //'CDP'
      sessionStorage.getItem('t') == "1016" ||    //'BONO'
      sessionStorage.getItem('t') == "1017" ||    //'BONEST'
      sessionStorage.getItem('t') == "1018" ||    //'OTROS'
      sessionStorage.getItem('t') == "1020" ||    //'FACCO'
      sessionStorage.getItem('t') == "1021" ||    //'OTROS'
      sessionStorage.getItem('t') == "1101" ||    //'OTROS'
      sessionStorage.getItem('t') == "1102" ||    //'OTROS'
      sessionStorage.getItem('t') == "1103" ||    //'OTROS'

      sessionStorage.getItem('t') == "2010" ||    //'PCCERO'
      sessionStorage.getItem('t') == "2011" ||    //'PC'


      sessionStorage.getItem('t') == "2012" ||    //'OTROS'
      sessionStorage.getItem('t') == "2013" ||


      sessionStorage.getItem('t') == "2012" ||    //'PCCERO'
      sessionStorage.getItem('t') == "2013" ||    //'PC'
      sessionStorage.getItem('t') == "2014" ||    //'PCCERO'
      sessionStorage.getItem('t') == "2015" ||    //'PC'
      sessionStorage.getItem('t') == "2016" ||    //'PCCERO'
      sessionStorage.getItem('t') == "2017" ||    //'PC'
      sessionStorage.getItem('t') == "2020" ||    //'FACC0'
      sessionStorage.getItem('t') == "2101" ||    //'PCCERO'
      sessionStorage.getItem('t') == "2120" ||    //'PCCERO'
      sessionStorage.getItem('t') == "2102" ||    //'PC'
      sessionStorage.getItem('t') == "2103" ||    //'PC'

      sessionStorage.getItem('t') == "3010" ||    //'PCCERO'
      sessionStorage.getItem('t') == "3011" ||    //'PC'
      sessionStorage.getItem('t') == "3012" ||    //'OBLIGA'
      sessionStorage.getItem('t') == "3013" ||    //'TITULA'
      sessionStorage.getItem('t') == "3014" ||    //'PA'
      sessionStorage.getItem('t') == "3015" ||    //'CDP'
      sessionStorage.getItem('t') == "3016" ||    //'BONO'
      sessionStorage.getItem('t') == "3017" ||    //'BONEST'
      sessionStorage.getItem('t') == "3018" ||    //'OTROS'
      sessionStorage.getItem('t') == "3020" ||    //'FACCO'
      sessionStorage.getItem('t') == "3021" ||    //'OTROS'
      sessionStorage.getItem('t') == "3101" ||    //'OTROS'
      sessionStorage.getItem('t') == "3102" ||    //'OTROS'
      sessionStorage.getItem('t') == "3103") {    //'CDP'

      this.pTasaclasificacioncdetalle = "FIJA";

      if (lTran == "10" || lTran == "1010" || lTran == "2010" || lTran == "3010") {
        this.inversionesServicios.pInstrumentocdetalle = "PCCERO";
      }
      else if (lTran == "11" || lTran == "1011" || lTran == "2011" || lTran == "3011") {
        this.inversionesServicios.pInstrumentocdetalle = "PC";
      }
      else if (lTran == "12" || lTran == "1012" || lTran == "2012" || lTran == "3012") {
        this.inversionesServicios.pInstrumentocdetalle = "OBLIGA";
      }
      else if (lTran == "13" || lTran == "1013" || lTran == "2013" || lTran == "3013") {
        this.inversionesServicios.pInstrumentocdetalle = "TITULA";
      }
      else if (lTran == "14" || lTran == "1014" || lTran == "2014" || lTran == "3014") {
        this.inversionesServicios.pInstrumentocdetalle = "PA";
      }
      else if (lTran == "15" || lTran == "1015" || lTran == "2015" || lTran == "3015") {
        this.inversionesServicios.pInstrumentocdetalle = "CDP";
      }
      else if (lTran == "16" || lTran == "1016" || lTran == "2016" || lTran == "3016") {
        this.inversionesServicios.pInstrumentocdetalle = "BONO";
      }
      else if (lTran == "17" || lTran == "1017" || lTran == "2017" || lTran == "3017") {
        this.inversionesServicios.pInstrumentocdetalle = "BONEST";
      }
      else if (lTran == "18" || lTran == "1018" || lTran == "3018") {
        this.inversionesServicios.pInstrumentocdetalle = "OTROS";
      }
      if (lTran == "20" || lTran == "1020" || lTran == "2020" || lTran == "3020") {
        this.inversionesServicios.pInstrumentocdetalle = "FACCO";
      }
      else if (lTran == "21" || lTran == "1021" || lTran == "3021") {
        this.inversionesServicios.pInstrumentocdetalle = "CDP";
      }
      else if (lTran == "101" || lTran == "1101" || lTran == "2101" || lTran == "3101") {
        this.inversionesServicios.pInstrumentocdetalle = "BONO";
      }
      else if (lTran == "102" || lTran == "1102" || lTran == "2102" || lTran == "3102") {
        this.inversionesServicios.pInstrumentocdetalle = "CASHEQ";
      }
      else if (lTran == "103" || lTran == "1103" || lTran == "2103" || lTran == "3103") {
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

    if (this.inversionesServicios.pInstrumentocdetalle == "CDP" || this.inversionesServicios.pInstrumentocdetalle == "PA")
    {
      this.instrumentoComponent.pCodigoTitulo = "No. " + this.inversionesServicios.pInstrumentocdetalle;
    }
    else
    {
      this.instrumentoComponent.pCodigoTitulo = "Código Título";
    }


    this.limpiaTablaAmortiza();


    this.instrumentoComponent.pTasaclasificacioncdetalle = this.pTasaclasificacioncdetalle;
    this.sbsComponent.pTasaclasificacioncdetalle = this.pTasaclasificacioncdetalle;

    this.tablamortizacionComponent.pTransaccion = this.pTransaccion;

    this.obtenerPlantillaContable();

    this.lInstrumento.push({
      cinversion: 0
    });
    this.componentehijo = this;
    super.init(this.formFiltros);

    //comentariosingreso

    this.instrumentoComponent.pInstrumento = []; 

    this.instrumentoComponent.pInstrumento.push({ comentariosingreso: null });

    this.rqMantenimiento.lregistrosTotales = [];
    this.rqMantenimiento.lregistrosTotales.push({
      valornominal: 0,
      capital: 0,
      interes: 0,
      total: 0
    });

  }

  limpiaTablaAmortiza() {
    this.mcampos.tablaAmortiza = "TA";
    this.mcampos.tablaAmortizaSubir = "";
    this.mcampos.TIR = "";

  }

  ngAfterViewInit() {

  }

  selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  crearNuevo() {
    // No existe para el padre
  }

  actualizarForm() {

    this.asignarEditable(2);

  }

  actualizar() {

    try {
      this.registro.finicio = (this.registro.mdatos.nfinicio.getFullYear() * 10000) +
        ((this.registro.mdatos.nfinicio.getMonth() + 1) * 100) + this.registro.mdatos.nfinicio.getDate();
    }
    catch (ex) {
      this.registro.finicio = Number(this.registro.mdatos.nfinicio.toString().substring(0, 4) +
        this.registro.mdatos.nfinicio.toString().substring(5, 7) +
        this.registro.mdatos.nfinicio.toString().substring(8, 10));
    }

    try {
      this.registro.fvencimiento = (this.registro.mdatos.nfvencimiento.getFullYear() * 10000) +
        ((this.registro.mdatos.nfvencimiento.getMonth() + 1) * 100) + this.registro.mdatos.nfvencimiento.getDate();
    }
    catch (ex) {
      this.registro.fvencimiento = Number(this.registro.mdatos.nfvencimiento.toString().substring(0, 4) +
        this.registro.mdatos.nfvencimiento.toString().substring(5, 7) +
        this.registro.mdatos.nfvencimiento.toString().substring(8, 10));
    }

    super.actualizar();

  

    this.mLabelEnviar = "";

    this.encerarMensajes();

    this.totalizar();

  }


  eliminar() {
    super.eliminar();

  }

  // Inicia CONSULTA *********************
  consultar() {
    this.inversionesServicios.limpiarService();
    this.crearDtoConsulta();

    this.instrumentoComponent.mfiltros.cinversion = this.mcampos.cinversion;
    this.instrumentoComponent.consultar();

    super.consultar();

    this.obtenerInversion();
    this.lregistros = [];


  }

  public crearDtoConsulta(): Consulta {

    this.mfiltros.cinversion = this.mcampos.cinversion;
    const consulta = new Consulta(this.entityBean, 'Y', 't.fvencimiento', this.mfiltros, {});
    consulta.addSubqueryPorSentencia('select cast(str(a.finicio,8) as date) from tinvtablaamortizacion a where a.cinvtablaamortizacion = t.cinvtablaamortizacion', 'nfinicio');
    consulta.addSubqueryPorSentencia('select cast(str(a.fvencimiento,8) as date) from tinvtablaamortizacion a where a.cinvtablaamortizacion = t.cinvtablaamortizacion', 'nfvencimiento');
    consulta.addSubqueryPorSentencia('select isnull(proyeccioncapital,0) + isnull(proyeccioninteres,0) from tinvtablaamortizacion a where a.cinvtablaamortizacion = t.cinvtablaamortizacion', 'total');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nestado', ' t.estadoccatalogo = i.ccatalogo and t.estadocdetalle = i.cdetalle');

    consulta.cantidad = 100000;

    this.addConsulta(consulta);
    return consulta;
  }


  obtenerInversion() {
    const rqConsulta: any = new Object();
    rqConsulta.CODIGOCONSULTA = 'INVERSION';
    rqConsulta.inversion = 1;
    rqConsulta.reajuste = true;
    rqConsulta.cinversion = this.mcampos.cinversion;
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

          if (!this.estaVacio(lregistro[0].cinversionhisultimo) && lregistro[0].cinversionhisultimo > 0) {
            if (this.pTransaccion < 1000) {
              this.mLabelEnviar = this.inversionesServicios.pLabelEnvioAprobar;
            }
            else if (this.pTransaccion < 2000) {
              this.mLabelEnviar = this.inversionesServicios.pLabelDevolver;
            }
            else if (this.pTransaccion < 3000) {
              this.mLabelEliminar = "Anular Transacción";
              this.mLabelEnviar = this.inversionesServicios.pLabelEnvioAprobar;
            }
          }
          else {
            this.mLabelEliminar = null;
            this.mLabelEnviar = "";
          }

          if (!this.estaVacio(lregistro[0].fsistema) && lregistro[0].fsistema > 0) {
            this.instrumentoComponent.mcampos.fechaSistema = this.integerToDate(lregistro[0].fsistema);
          }
          else {
            this.instrumentoComponent.mcampos.fechaSistema = null;
          }

          this.asignarPcInversion(lregistro[0].cinversion);

         
          this.instrumentoComponent.pInstrumento[0].comentariosaprobacion = lregistro[0].comentariosaprobacion;
          this.instrumentoComponent.pInstrumento[0].comentariosanulacion = lregistro[0].comentariosanulacion;
          this.instrumentoComponent.pInstrumento[0].comentariosdevolucion = lregistro[0].comentariosdevolucion;

          this.mcampos.tasanueva = lregistro[0].tasanueva;

          

          this.inversionesServicios.pFcontable = lregistro[0].fcontable;
          this.inversionesServicios.pCcompania = lregistro[0].ccompania;
          this.inversionesServicios.pCcomprobanteanulacion = lregistro[0].ccomprobanteanulacion;

          this.inversionesServicios.pPorcentajecalculoprecio = lregistro[0].porcentajecalculoprecio;

          this.instrumentoComponent.pInstrumento[0].cinversion = lregistro[0].cinversion;
          this.instrumentoComponent.pInstrumento[0].codigotitulo = lregistro[0].codigotitulo;
          this.instrumentoComponent.pInstrumento[0].numerocontrato = lregistro[0].numerocontrato;
          this.instrumentoComponent.pInstrumento[0].tasaclasificacionccatalogo = lregistro[0].tasaclasificacionccatalogo;
          this.instrumentoComponent.pInstrumento[0].tasaclasificacioncdetalle = lregistro[0].tasaclasificacioncdetalle;
          this.inversionesServicios.pCcomprobante = lregistro[0].ccomprobante;
          this.instrumentoComponent.pInstrumento[0].optlock = lregistro[0].optlock;
          this.instrumentoComponent.pInstrumento[0].fcolocacion = lregistro[0].nfcolocacion;
          this.instrumentoComponent.pInstrumento[0].fregistro = lregistro[0].nfregistro;
          this.inversionesServicios.pFcompra = lregistro[0].nfcompra;

          this.inversionesServicios.pFemision = lregistro[0].nfemision;

          this.inversionesServicios.pFvencimiento = lregistro[0].nfvencimiento;

          this.inversionesServicios.pFultimopago = lregistro[0].nfultimopago;
          this.inversionesServicios.pFpagoultimocupon = lregistro[0].nfpagoultimocupon;

          this.instrumentoComponent.pInstrumento[0].fultimacompra = lregistro[0].nfultimacompra;

          this.inversionesServicios.pCinvagentebolsa = lregistro[0].cinvagentebolsa;

          this.inversionesServicios.pCinvoperadorinstitucional = lregistro[0].cinvoperadorinstitucional;

          this.inversionesServicios.pRazonSocialAgente = lregistro[0].nombresagente;

          this.inversionesServicios.pOperadorInstNombre = lregistro[0].nombresoperadorinst;

          this.inversionesServicios.pCapital = lregistro[0].valornominal;

          this.instrumentoComponent.pInstrumento[0].valornominal = lregistro[0].valornominal;

          if (this.pTasaclasificacioncdetalle != "FIJA") {
            this.inversionesServicios.pValornegociado = lregistro[0].valornominal;
          }

          this.inversionesServicios.pValornegociacion = lregistro[0].valornegociacion;

          this.instrumentoComponent.pInstrumento[0].valorefectivo = lregistro[0].valorefectivo;
          this.instrumentoComponent.pInstrumento[0].plazo = lregistro[0].plazo;

          this.inversionesServicios.pPlazo = lregistro[0].plazo;

          this.inversionesServicios.pTasa = lregistro[0].tasa;

          this.mcampos.tasaactual = lregistro[0].tasa;

          this.inversionesServicios.pDiasgraciacapital = lregistro[0].diasgraciacapital;
          this.inversionesServicios.pDiasgraciainteres = lregistro[0].diasgraciainteres;
          this.instrumentoComponent.pInstrumento[0].diasporvencerafechacompra = lregistro[0].diasporvencerafechacompra;
          this.instrumentoComponent.pInstrumento[0].boletin = lregistro[0].boletin;

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

          this.instrumentoComponent.pInstrumento[0].interestranscurrido = lregistro[0].interestranscurrido;

          this.instrumentoComponent.pInstrumento[0].porcentajepreciocompra = lregistro[0].porcentajepreciocompra;
          this.inversionesServicios.pPorcentajeprecioultimacompra = lregistro[0].porcentajeprecioultimacompra;
          this.instrumentoComponent.pInstrumento[0].preciounitarioaccion = lregistro[0].preciounitarioaccion;
          this.instrumentoComponent.pInstrumento[0].numeroacciones = lregistro[0].numeroacciones;
          this.instrumentoComponent.pInstrumento[0].valoracciones = lregistro[0].valoracciones;
          this.instrumentoComponent.pInstrumento[0].preciocompra = lregistro[0].preciocompra;
          this.instrumentoComponent.pInstrumento[0].valordividendospagados = lregistro[0].valordividendospagados;
          this.instrumentoComponent.pInstrumento[0].porcentajeparticipacioncupon = lregistro[0].porcentajeparticipacioncupon;
          this.instrumentoComponent.pInstrumento[0].tasainterescupon = lregistro[0].tasainterescupon;
          this.instrumentoComponent.pInstrumento[0].observaciones = lregistro[0].observaciones;
          this.instrumentoComponent.pInstrumento[0].bolsavaloresccatalogo = lregistro[0].bolsavaloresccatalogo;

          this.inversionesServicios.pBolsavalorescdetalle = lregistro[0].bolsavalorescdetalle;

          this.instrumentoComponent.pInstrumento[0].calendarizacionccatalogo = lregistro[0].calendarizacionccatalogo;
          this.inversionesServicios.pCalendarizacioncdetalle = lregistro[0].calendarizacioncdetalle;

          this.instrumentoComponent.pInstrumento[0].basediasinteresccatalogo = lregistro[0].basediasinteresccatalogo;
          this.inversionesServicios.pBasediasinterescdetalle = lregistro[0].basediasinterescdetalle;

          this.instrumentoComponent.pInstrumento[0].calificacionriesgoinicialccatalogo = lregistro[0].calificacionriesgoinicialccatalogo;
          this.instrumentoComponent.pInstrumento[0].calificacionriesgoinicialcdetalle = lregistro[0].calificacionriesgoinicialcdetalle;

          this.instrumentoComponent.pInstrumento[0].calificacionriesgoactualccatalogo = lregistro[0].calificacionriesgoactualccatalogo;

          this.inversionesServicios.pCalificacionriesgoactualcdetalle = lregistro[0].calificacionriesgoactualcdetalle;


          this.instrumentoComponent.pInstrumento[0].casavaloresccatalogo = lregistro[0].casavaloresccatalogo;
          this.instrumentoComponent.pInstrumento[0].casavalorescdetalle = lregistro[0].casavalorescdetalle;
          this.instrumentoComponent.pInstrumento[0].clasificacioninversionccatalogo = lregistro[0].clasificacioninversionccatalogo;
          this.instrumentoComponent.pInstrumento[0].clasificacioninversioncdetalle = lregistro[0].clasificacioninversioncdetalle;
          this.instrumentoComponent.pInstrumento[0].compracuponccatalogo = lregistro[0].compracuponccatalogo;

          this.instrumentoComponent.pInstrumento[0].emisorccatalogo = lregistro[0].emisorccatalogo;

          this.inversionesServicios.pEmisorcdetalle = lregistro[0].emisorcdetalle;
          this.inversionesServicios.pEmisorcdetalleNuevo = lregistro[0].aceptantecdetalle;

          this.instrumentoComponent.pInstrumento[0].formaajusteinteresccatalogo = lregistro[0].formaajusteinteresccatalogo;
          this.instrumentoComponent.pInstrumento[0].instrumentoccatalogo = lregistro[0].instrumentoccatalogo;
          this.instrumentoComponent.pInstrumento[0].mercadotipoccatalogo = lregistro[0].mercadotipoccatalogo;

          this.inversionesServicios.pMercadotipocdetalle = lregistro[0].mercadotipocdetalle;

          this.instrumentoComponent.pInstrumento[0].monedaccatalogo = lregistro[0].monedaccatalogo;


          this.inversionesServicios.pMonedacdetalle = lregistro[0].monedacdetalle;


          this.instrumentoComponent.pInstrumento[0].periodicidadpagoscapitalccatalogo = lregistro[0].periodicidadpagoscapitalccatalogo;
          this.instrumentoComponent.pInstrumento[0].periodicidadpagoscapitalcdetalle = lregistro[0].periodicidadpagoscapitalcdetalle;
          this.instrumentoComponent.pInstrumento[0].periodicidadpagosinteresccatalogo = lregistro[0].periodicidadpagosinteresccatalogo;
          this.instrumentoComponent.pInstrumento[0].periodicidadpagosinterescdetalle = lregistro[0].periodicidadpagosinterescdetalle;
          this.instrumentoComponent.pInstrumento[0].portafolioccatalogo = lregistro[0].portafolioccatalogo;
          this.instrumentoComponent.pInstrumento[0].portafoliocdetalle = lregistro[0].portafoliocdetalle;
          this.instrumentoComponent.pInstrumento[0].sectorccatalogo = lregistro[0].sectorccatalogo;

          this.inversionesServicios.pSectorcdetalle = lregistro[0].sectorcdetalle;

          this.instrumentoComponent.pInstrumento[0].sistemacolocacionccatalogo = lregistro[0].sistemacolocacionccatalogo;

          this.inversionesServicios.pSistemacolocacioncdetalle = lregistro[0].sistemacolocacioncdetalle;

          this.instrumentoComponent.pInstrumento[0].bancoccatalogo = lregistro[0].bancoccatalogo;

          this.instrumentoComponent.pInstrumento[0].bancopagoccatalogo = lregistro[0].bancopagoccatalogo;

          this.inversionesServicios.pBancocdetalle = lregistro[0].bancocdetalle;
          this.inversionesServicios.pBancopagocdetalle = lregistro[0].bancopagocdetalle;

          this.instrumentoComponent.pInstrumento[0].estadoccatalogo = lregistro[0].estadoccatalogo;

          this.inversionesServicios.pEstadocdetalle = lregistro[0].estadocdetalle;

          if (this.inversionesServicios.instrumentosSinTablaSinPC() ||
            (this.inversionesServicios.tieneTablaPagos() && this.inversionesServicios.pEstadocdetalle == 'ING')) {
            this.inversionesServicios.pPlazoxvencer = lregistro[0].plazo;
          }

          this.inversionesServicios.pCusuarioing = lregistro[0].cusuarioing;
          this.inversionesServicios.pFingreso = lregistro[0].fingreso;
          this.inversionesServicios.pCusuariomod = lregistro[0].cusuariomod;
          this.inversionesServicios.pFmodificacion = lregistro[0].fmodificacion;

          this.inversionesServicios.pinterestranscurrido = lregistro[0].interestranscurrido;

          this.instrumentoComponent.pInstrumento[0].centrocostoccatalogo = lregistro[0].centrocostoccatalogo;

          this.inversionesServicios.pCentrocostocdetalle = lregistro[0].centrocostocdetalle;

          this.inversionesServicios.pInstrumentocdetalle = lregistro[0].instrumentocdetalle;

          this.inversionesServicios.pInteres = lregistro[0].interes;

          this.inversionesServicios.pTASA_BOLSA_VALORES = lregistro[0].porcentajebolsa;
          this.inversionesServicios.pTASA_OPERADOR_BOLSA = lregistro[0].porcentajeoperador;
          this.inversionesServicios.pTASA_RETENCION = lregistro[0].porcentajeretencion;


          if (this.inversionesServicios.tieneTablaPagos() && (
            this.inversionesServicios.pEstadocdetalle == 'APR' ||
            this.inversionesServicios.pEstadocdetalle == 'PAG' ||
            this.inversionesServicios.pEstadocdetalle == 'FINAPR')) {

            this.mcampos.tablaAmortiza = "Tabla de Pagos";
            if (this.inversionesServicios.pEstadocdetalle == 'PAG') this.mcampos.tablaAmortizaSubir = "Subir Tabla de Pagos";


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
            || (this.inversionesServicios.tieneTablaPagos() && this.inversionesServicios.pEstadocdetalle == 'ING')) {
            this.instrumentoComponent.construirSinTabla(
              lregistro[0].porcentajebolsa
              , lregistro[0].porcentajeoperador
              , lregistro[0].porcentajeretencion
              , Number(this.mcampos.cinversion)
              , lregistro[0].tasanueva);
          }
          else if (this.pTransaccion < 3000) {
            this.inversionesServicios.construyePago(
              resp, this.inversionesServicios.pMercadotipocdetalle);
          }

          if (resp.TABAMOTMP.length == 0) {

           
            for (const i in resp.TABAMOORIGINAL) {
              this.crearNuevoRegistro();
              const reg = resp.TABAMOORIGINAL[i];
              resp.TABAMOORIGINAL[i].esnuevo = true;
              resp.TABAMOORIGINAL[i].crearNuevoRegistro = true;
              resp.TABAMOORIGINAL[i].mdatos.nfinicio = reg.nfinicio;
              resp.TABAMOORIGINAL[i].mdatos.nfvencimiento = reg.nfvencimiento;
              resp.TABAMOORIGINAL[i].mdatos.total = reg.total;
              resp.TABAMOORIGINAL[i].mdatos.nestado = reg.nestado;
              resp.TABAMOORIGINAL[i].idreg = Math.floor((Math.random() * 100000) + 1);;

            }

            this.lregistros = resp.TABAMOORIGINAL;

            this.totalizar();

          }

          this.tablamortizacionComponent.lregistros = resp.TABAMO;
          this.inversionesServicios.ptablaamortizaregistro = resp.TABAMO;

          if (!this.inversionesServicios.instrumentosSinTabla() && this.inversionesServicios.pEstadocdetalle != 'ING') {

            if (this.pTransaccion > 3000) {
              this.construirTabla(resp.TABAMO);
            }

       
          }


        },
        error => {
          this.dtoServicios.manejoError(error);
        });


  }

  crearNuevoRegistro() {
    super.crearnuevoRegistro();
  }


  private fijarFiltrosConsulta() {

  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();

 
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {

    super.postQueryEntityBean(resp);

    if (resp.cod == 'OK') {

      try {

        if (this.lregistros[0].proyecciontasa > 0) this.inversionesServicios.pTasa = this.lregistros[0].proyecciontasa;
      }
      catch (ex) {
      }

      if (this.inversionesServicios.instrumentosSinTablaSinPC()) {
        this.instrumentoComponent.calcularSinTabla();
      }
      else {
        this.instrumentoComponent.calcularInteresFijo();
      }
      this.totalizar();

    }



  }

  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************

  validarGrabar(iblnDespliegaMensaje: boolean = true): boolean {
    let lMensaje: string = "";

    if (this.estaVacio(this.mcampos.tasanueva) || this.mcampos.tasanueva <= 0) {
      lMensaje = "DEBE INGRESAR LA NUEVA TASA";
    }
    else if (!this.estaVacio(this.mcampos.tasanueva) && this.mcampos.tasaactual == this.mcampos.tasanueva) {
      lMensaje = "LA NUEVA TASA DEBE SER DIFERENTE A LA TASA ACTUAL";
    }

    if (this.estaVacio(lMensaje)) {
      return true;
    }
    else {
      if (iblnDespliegaMensaje) this.mostrarMensajeError(lMensaje);
      return false;
    }
  }

  grabar(): void {

    if (!this.validarGrabar()) return;

    this.lInstrumento[0].cinversion = this.mcampos.cinversion;
    this.lInstrumento[0].optlock = 0;
    this.lInstrumento[0].femision = this.inversionesServicios.pFemision;
    this.lInstrumento[0].fvencimiento = this.inversionesServicios.pFvencimiento;
    this.lInstrumento[0].fultimopago = this.inversionesServicios.pFultimopago;
    this.lInstrumento[0].fultimacompra = this.instrumentoComponent.pInstrumento[0].fultimacompra;
    this.lInstrumento[0].valornegociacion = this.inversionesServicios.pValornegociacion;

    if (!this.estaVacio(this.inversionesServicios.pEfectivonegociado) || Number(this.inversionesServicios.pEfectivonegociado) != 0) {
      this.lInstrumento[0].valorefectivo = this.inversionesServicios.pEfectivonegociado;
    }
    this.lInstrumento[0].plazo = this.inversionesServicios.pPlazoxvencer;
    this.lInstrumento[0].tasa = this.inversionesServicios.pTasa;
    this.lInstrumento[0].diasporvencerafechacompra = 0;
    this.lInstrumento[0].yield = this.inversionesServicios.pYield;
    this.lInstrumento[0].comisionbolsavalores = this.inversionesServicios.pComisionBolsa;
    this.lInstrumento[0].comisionoperador = this.inversionesServicios.pComisionOperador;
    this.lInstrumento[0].comisionretencion = this.inversionesServicios.pRetencion;
    this.lInstrumento[0].retencionfuentevalor = this.inversionesServicios.pRetencion;
    this.lInstrumento[0].porcentajebolsa = this.inversionesServicios.pTASA_BOLSA_VALORES;
    this.lInstrumento[0].porcentajeoperador = this.inversionesServicios.pTASA_OPERADOR_BOLSA;
    this.lInstrumento[0].porcentajeretencion = this.inversionesServicios.pTASA_RETENCION;
    this.lInstrumento[0].porcentajecalculoprecio = this.inversionesServicios.pPorcentajecalculoprecio;
    this.lInstrumento[0].porcentajecalculodescuento = this.inversionesServicios.pPorcentajecalculodescuento;
    this.lInstrumento[0].porcentajecalculorendimiento = this.inversionesServicios.pPorcentajecalculorendimiento;
    this.lInstrumento[0].interestranscurrido = this.inversionesServicios.pinterestranscurrido;
    this.lInstrumento[0].porcentajepreciocompra = this.instrumentoComponent.pInstrumento[0].porcentajepreciocompra
    this.lInstrumento[0].porcentajeprecioultimacompra = this.inversionesServicios.pPorcentajeprecioultimacompra
    this.lInstrumento[0].tir = this.inversionesServicios.pTIRValue;
    this.lInstrumento[0].basediasinteresccatalogo = this.instrumentoComponent.pInstrumento[0].basediasinteresccatalogo;
    this.lInstrumento[0].basediasinterescdetalle = this.inversionesServicios.pBasediasinterescdetalle;

    this.lInstrumento[0].fsistema = (this.instrumentoComponent.mcampos.fechaSistema.getFullYear() * 10000) + ((this.instrumentoComponent.mcampos.fechaSistema.getMonth() + 1) * 100) + this.instrumentoComponent.mcampos.fechaSistema.getDate();

    this.lInstrumento[0].cusuarioing = this.dtoServicios.mradicacion.cusuario;
    this.lInstrumento[0].tasanueva = this.mcampos.tasanueva;


    this.lInstrumento[0].fingreso = new Date();
    this.lmantenimiento = []; // Encerar Mantenimiento

    this.rqMantenimiento.lregistrosgrabar = this.lInstrumento;
    this.rqMantenimiento.cargaarchivo = 'reajuste';

    this.rqMantenimiento.interesnuevo = this.instrumentoComponent.mcampos.reajusteinteres;


    this.crearDtoMantenimiento();

    // Validar aquí

    this.mLabelEnviar = this.inversionesServicios.pLabelEnvioAprobar;

  }

  limpiar() {

    this.mLabelEliminar = null;

    this.mLabelEnviar = null;

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

    this.rqMantenimiento.lregistrosTotales[0].valornominal = 0;
    this.rqMantenimiento.lregistrosTotales[0].capital = 0;
    this.rqMantenimiento.lregistrosTotales[0].interes = 0;
    this.rqMantenimiento.lregistrosTotales[0].total = 0;

    this.asignakCheck();

  }

  public crearDtoMantenimiento() {
  
    super.addMantenimientoPorAlias(this.alias, this.getMantenimiento(1));
    super.grabar();


   
  }

  validaGrabar() {
    return (
      this.tablamortizacionComponent.validaGrabar()
    );
  }

  public postCommit(resp: any) {

    super.postCommitEntityBean(resp);

 

    this.router.navigate([''], { skipLocationChange: true });

  

    this.mostrarMensajeSuccess("REJUSTE REALIZADO EXITOSAMENTE");

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

      this.lovInversiones.mfiltrosesp.estadocdetalle = ' in (\'ING\',\'PAG\')' + ' ';

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
    super.cancelar();
  }

  cancelarActualizacion() {
    this.limpiar();
    this.limpiaTablaAmortiza();
    this.asignarEditable();

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

    if (this.estaVacio(this.instrumentoComponent.pInstrumento[0].plazo) || this.instrumentoComponent.pInstrumento[0].plazo <= 0) {
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


    if (this.estaVacio(this.instrumentoComponent.pInstrumento[0].periodicidadpagoscapitalcdetalle)) {
      this.mostrarMensajeError('PERIODICIDAD DE PAGOS DEL CAPITAL REQUERIDA');
      return;
    }

    if (this.estaVacio(this.instrumentoComponent.pInstrumento[0].periodicidadpagosinterescdetalle)) {
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
    rqConsulta.periodicidadpagoscapitalcdetalle = this.instrumentoComponent.pInstrumento[0].periodicidadpagoscapitalcdetalle;
    rqConsulta.periodicidadpagosinterescdetalle = this.instrumentoComponent.pInstrumento[0].periodicidadpagosinterescdetalle;
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


    if (this.pTasaclasificacioncdetalle == "VAR") {
      this.jasper.nombreArchivo = 'rptInvInversionRentaVariable';
    }
    else {
      this.jasper.nombreArchivo = 'rptInvInversionRentaFija';
    }

    // Agregar parametros
    this.jasper.parametros['@cinversion'] = this.instrumentoComponent.pInstrumento[0].cinversion;
    var ldate = new Date();
    let lfechanum: number = (ldate.getFullYear() * 10000) + ((ldate.getMonth() + 1) * 100) + ldate.getDate();
    this.jasper.parametros['@ifechacorte'] = lfechanum;


    if (this.pTasaclasificacioncdetalle == "VAR") {
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvInversionRentaVariable';
    }
    else {
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvInversionRentaFija';
    }

    this.jasper.formatoexportar = resp;
    this.jasper.generaReporteCore();
  }


  


  /**Muestra lov de cuentas contables */
  limpiarCampos() {
    this.rqMantenimiento.narchivo = '';
 
    this.lOperacion = [];
  }


  

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

          this.inversionesServicios.pstrInstrumentoCLegal = resp.ID_INSTRUMENTO_CLEGAL;

          this.inversionesServicios.ptMercado = resp.Tabla1211;
          this.inversionesServicios.ptSistemaColocacion = resp.Tabla1212;
          this.inversionesServicios.ptMoneda = resp.Tabla1214;
          this.inversionesServicios.ptEstado = resp.Tabla1204;

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
     
      this.instrumentoComponent.pEditable == 0 &&
      (this.mcampos.cinversion == undefined || this.mcampos.cinversion == '')));


  }

  aprobar() {

    this.encerarMensajes();

  
    this.enviar(this.inversionesServicios.pLabelAprobar);

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

    if (!this.validarGrabar()) return;

    let lEnviar: string = "";
    if (!this.estaVacio(istrEtiqueta)) {
      lEnviar = istrEtiqueta;
    }
    else if (this.pTransaccion < 3000) {
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

          this.enviarParaAprobacionEjecuta();
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
        super.grabar();
        this.inversionesServicios.pEstadocdetalle = iestadocDetalle;
        this.mAprobar = "";
        this.mostrarMensajeSuccess("INVERSIÓN A SIDO ENVIADA EXITOSAMENTE");
      },
      reject: () => {
      }
    });

  }


  //estadocdetalle

  enviarParaAprobacionEjecuta(iestadocDetalle: string = "ENVAPR") {


    this.confirmationService.confirm({
      message: this.mensajeEnvio(),
      header: 'Confirmación',
      icon: 'fa fa-question-circle',
      accept: () => {


        this.rqMantenimiento.estadocdetalle = '';
        this.rqMantenimiento.cargaarchivo = 'comentario';
        this.rqMantenimiento.cinversion = this.mcampos.cinversion;
        this.rqMantenimiento.comentario = this.inversionesServicios.pComentarios;
        this.rqMantenimiento.transaccion = this.pTransaccion;
        super.grabar();
        this.inversionesServicios.pEstadocdetalle = iestadocDetalle;
        this.mostrarMensajeSuccess("INVERSIÓN A SIDO ENVIADA EXITOSAMENTE");
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

  calcularPlazo() {

    if (this.estaVacio(this.registro.mdatos.nfinicio) || this.estaVacio(this.registro.mdatos.nfvencimiento)) {
      this.registro.plazo = 0;
      return;
    }

    var MILISENGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;

    var utc1 = Date.UTC(this.registro.mdatos.nfinicio.getFullYear(), this.registro.mdatos.nfinicio.getMonth() + 1, this.registro.mdatos.nfinicio.getDate());

    var utc2;

    try {
      utc2 = Date.UTC(this.registro.mdatos.nfvencimiento.getFullYear(), this.registro.mdatos.nfvencimiento.getMonth() + 1, this.registro.mdatos.nfvencimiento.getDate());
    }
    catch (ex) {
      utc2 = Date.UTC(Number(this.registro.mdatos.nfvencimiento.toString().substring(0, 4)),
        Number(this.registro.mdatos.nfvencimiento.toString().substring(5, 7)),
        Number(this.registro.mdatos.nfvencimiento.toString().substring(8, 10)));
    }

    this.registro.plazo = Math.floor((utc2 - utc1) / MILISENGUNDOS_POR_DIA);

    if (this.registro.plazo <= 0) {
      this.mostrarMensajeError("FECHA DE INICIO DEBE SER MENOR QUE LA FECHA DE VENCIMIENTO");
    }
  }

  totalizarLinea() {

    let lproyeccioncapital: number = 0;
    let lproyeccioninteres: number = 0;
    

    if (!this.estaVacio(this.registro.proyeccioncapital)) {
      lproyeccioncapital = Number(this.registro.proyeccioncapital);
    }

    if (!this.estaVacio(this.registro.proyeccioninteres)) {
      lproyeccioninteres = Number(this.registro.proyeccioninteres);
    }


    this.registro.mdatos.total = lproyeccioncapital +
      lproyeccioninteres;


  }

  construirTabla(iregistro: any): string {


    this.inversionesServicios.ptablaamortizaregistro = iregistro;

    if (this.inversionesServicios.ptablaamortizaregistro != undefined && this.inversionesServicios.ptablaamortizaregistro.length > 0) {

      const rqConsulta: any = new Object();
      rqConsulta.CODIGOCONSULTA = 'INVERSION';
      rqConsulta.inversion = 9;

      rqConsulta.cinversion = this.mcampos.cinversion;

      rqConsulta.tablaamortiza = iregistro;
      rqConsulta.fcompra = this.inversionesServicios.pFcompra;
      rqConsulta.calendarizacioncdetalle = this.inversionesServicios.pCalendarizacioncdetalle;
      rqConsulta.yield = this.inversionesServicios.pYield;
      rqConsulta.femision = this.inversionesServicios.pFemision;
      rqConsulta.tasa = this.inversionesServicios.pTasa;
      rqConsulta.fultimopago = this.inversionesServicios.pFultimopago;
      rqConsulta.pTransaccion = this.pTransaccion;

      rqConsulta.porcentajecalculoprecio = this.inversionesServicios.pPorcentajecalculoprecio;

      rqConsulta.reajuste = 1;

      this.dtoServicios.ejecutarConsultaRest(rqConsulta)
        .subscribe(
          resp => {
            this.dtoServicios.llenarMensaje(resp, false);
            if (resp.cod !== 'OK') {
              return "";
            }

            this.inversionesServicios.construyePago(resp, this.inversionesServicios.pMercadotipocdetalle);

            this.generarLRegisto(resp);

          },
          error => {
            this.dtoServicios.manejoError(error);
          });

      return "";

    }

  }

  private generarLRegisto(resp: any) {
    let lregistroTrabajo: any = [];
    lregistroTrabajo = resp.lregistros;

    let ltotal: number = null;

    const lregistrosaux = this.lregistros;
    for (const i in lregistroTrabajo) {

      const index = this.lregistros.findIndex(n => n.cinvtablaamortizacion === lregistroTrabajo[i].cinvtablaamortizacion);
      if (index >= 0) {

        lregistrosaux[index] = this.lregistros[index];

        lregistrosaux[index].actualizar = true;
        lregistrosaux[index].vpresente = Number(lregistroTrabajo[i].vpresente);
        lregistrosaux[index].ppv = Number(lregistroTrabajo[i].ppv);
        lregistrosaux[index].capitalxamortizar = Number(lregistroTrabajo[i].saldo);

        ltotal = 0;
        if (!this.estaVacio(lregistroTrabajo[i].proyeccioncapital) && lregistroTrabajo[i].proyeccioncapital != 0) {
          ltotal = Number(lregistroTrabajo[i].proyeccioncapital);
        }

        if (!this.estaVacio(lregistroTrabajo[i].proyeccioninteres) && lregistroTrabajo[i].proyeccioninteres != 0) {
          ltotal = ltotal + Number(lregistroTrabajo[i].proyeccioninteres);
        }

        lregistrosaux[index].mdatos.total = ltotal;

      }

    }
    this.lregistros = lregistrosaux;
    this.inversionesServicios.ptablaamortizaregistro = this.lregistros;
    this.obtenerTIR();

  }

  obtenerTIR() {

    let lPorcentajecalculoprecio: number = 0;

    let lValorCompra: number = null;

    if (!this.estaVacio(this.inversionesServicios.pPorcentajecalculoprecio) && Number(this.inversionesServicios.pPorcentajecalculoprecio) != 0) {
      lPorcentajecalculoprecio = this.inversionesServicios.pPorcentajecalculoprecio * 0.01;
    }

    if (!this.estaVacio(this.inversionesServicios.pEfectivonegociado) && Number(this.inversionesServicios.pEfectivonegociado) != 0) {
      lValorCompra = this.inversionesServicios.pEfectivonegociado;
    }
    else {
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

  cambiarTasa() {

    if (this.validarGrabar(false)) {

      this.mLabelEnviar = "";
      this.mLabelEliminar = "";

      this.encerarMensajes();

      if (!this.estaVacio(this.mcampos.tasanueva) && this.inversionesServicios.pTasa != this.mcampos.tasanueva)

        for (const i in this.lregistros) {
          if (this.lregistros.hasOwnProperty(i)) {

            if (this.lregistros[i].estadocdetalle == 'PEN') {

              this.lregistros[i].proyecciontasa = this.mcampos.tasanueva * 0.01;

            }

          }
        }
      this.inversionesServicios.pTasa = this.mcampos.tasanueva;

      this.instrumentoComponent.mcampos.fechaSistema = null;

      this.instrumentoComponent.calcularSinTabla(this.mcampos.tasanueva);

    }


  }

  totalizar() {

    this.rqMantenimiento.lregistrosTotales[0].capital = 0;
    this.rqMantenimiento.lregistrosTotales[0].interes = 0;
    this.rqMantenimiento.lregistrosTotales[0].total = 0;

    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {

        if (!this.estaVacio(this.lregistros[i].proyeccioncapital))
          this.rqMantenimiento.lregistrosTotales[0].capital = this.rqMantenimiento.lregistrosTotales[0].capital + this.redondear(Number(this.lregistros[i].proyeccioncapital), 2);

        if (!this.estaVacio(this.lregistros[i].proyeccioninteres))
          this.rqMantenimiento.lregistrosTotales[0].interes = this.rqMantenimiento.lregistrosTotales[0].interes + this.redondear(Number(this.lregistros[i].proyeccioninteres), 2);
      }
    }

    this.rqMantenimiento.lregistrosTotales[0].total = this.rqMantenimiento.lregistrosTotales[0].capital + this.rqMantenimiento.lregistrosTotales[0].interes;

  }

  eliminarReajuste() {
    this.encerarMensajes();

    this.confirmationService.confirm({
      message: 'Está seguro de eliminar el reajuste?',
      header: 'Confirmación',
      icon: 'fa fa-question-circle',
      accept: () => {

        this.rqMantenimiento.cargaarchivo = 'eliminarReajuste';
        this.rqMantenimiento.cinversion = this.mcampos.cinversion;
        super.grabar();

      },
      reject: () => {
      }
    });
  }
}
