
import { any } from 'codelyzer/util/function';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { SelectItem } from 'primeng/primeng';



@Injectable()
export class InversionesServicios {

  public pLabelEnvioparaPago: string = "Enviar a Tesorería para el Pago";
  public pLabelEnvioAprobar: string = "Enviar para su Aprobación";
  public pLabelAprobar: string = "Aprobar";
  public pLabelAnular: string = "Anular";
  public pLabelDevolver: string = "Devolver";
  public mcamposinv: any = [];
  public vintes=0;
  public vcapital=0;
  // Constantes rubros de Inversiones

  public pstrInstrumentoCLegal: string = null;
  public pstrPorcentajeBolsa: string = null;
  public pstrPorcentajeAgente: string = null;
  public pstrPorcentajeRetencion: string = null;

  public pcBANCOS: string = "BANCOS";
  public pcCAPITAL: string = "CAPITAL";
  public pcCOMISIONBOLSA: string = "COMISIÓN BOLSA DE VALORES";
  public pcCOMISIONOPERADOR: string = "COMISIÓN OPERADOR DE BOLSA";
  public pcINTERES: string = "INTERÉS";
  public pcMORA: string = "MORA";
  public pcRETENCION: string = "RETENCIÓN";
  public pcTIR: string = "TASA INTERNA DE RETORNO";
  public pcCOMPRA: string = "COMPRA";
  public pcREAJUS: string = "REAJUS";

  public pblnControl: number = 0;


  public pblnComisionBolsa: boolean = null;
  public pblnComisionOperador: boolean = null;
  public pblnRetencionFuente: boolean = null;

  public pcRECUPERACION: string = "RECUP";

  // Campos de Relación de Catálogos

  public pComentarios: string = null;
  public pComentariosDevolucion: string = null;

  public pEmisorNombre: string = null;
  public pInstrumentoNombre: string = null;
  public pEmisorcdetalle: string = null;
  public pEmisorcdetalleNuevo: string = null;
  public pCentrocostocdetalle: string = null;
  public pCentrocostocdetalleDefault: string = null;
  public pBancoContabilidadDefault: string = null;
  public pInstrumentocdetalle: string = null;
  public pBancocdetalle: string = null;
  public pBancopagocdetalle: string = null;
  public pBolsavalorescdetalle: string = null;
  public pCinvagentebolsa: number = null;
  public pCinvoperadorinstitucional: number = null;
  public pCalendarizacioncdetalle: string = null;

  public pRazonSocialAgente: string = null;

  public pOperadorInstNombre: string = null;


  public pIdAgenteDefault: number = null;
  public pAgenteRazonSocialDefault: string = null;

  public pTirTitulo = "%  T I R"

  // Valores

  public pCapital: number = 0;
  public pInteres: number = 0;
  public pComisionBolsa: number = 0;
  public pComisionOperador: number = 0;
  public pRetencion: number = 0;
  public pRetencion1: number = 0;
  public pRetencion2: number = 0;
  
  public pPorcentajecalculoprecio: number = 0;
  public pinterestranscurrido: number = 0;
  public pComisiontotal: Number = 0;
  public pMora: Number = 0;

  public pValorNominal: number = null;
  public pInteresInversion: number = null;

  public pCinversion: number = null;

  public pPlazoxvencer: number = 0;

  //pAprobar: boolean = false;

  public pEfectivonegociado: number = 0;
  public pValordescuento: number = 0;

  public pComisionesnegociacion: number = 0;

  public pTotalapagar: number = 0;

  public pDiasgraciacapital: number = 0;

  public pDiasgraciainteres: number = 0;

  public pSubtotal: number = 0;

  public pDiferencia: number = 0;


  public pInteresnominaldias: number = 0;
  public pPlazo: number = 0;
  public pInterestranscurridodias: number = 0;
  public pPrecioNeto: number = 0;

  public pValorACompensar: number = 0;

  public pInteresesnegociacion: number = 0;
  public pInteresporvencer: number = 0;
  public pValornegociacion: number = 0;
  public pValornegociado: number = 0;
  public pUtilidad: number = 0;
  public pTasa: number = 0;

  public pFcontable: number = null;
  public pCcompania: number = null;
  public pCcomprobanteanulacion: string = null;
  public pMensaje: string = null;

  public pCinvtablaamortizacion: number = null;

  public ptablaamortizaregistro: any = [];

  public pTIRValue: number = 0;

  public pTIR: any = [];

  public pYield: number;

  public plregistro: any = [];
  private mlregistro: any = [];

  public pPlantillaContable: any = [];
  public pPlantillaContableAgente: any = [];

  public pBasediasinterescdetalle: string = null;

  public pSectorcdetalle: string = null;

  public pInversionExterior: boolean = null;

  public pPorcentajeprecioultimacompra: number = 0;

  public pFvencimiento: Date = null;
  public pFemision: Date = null;

  public pFinicioNum: number = null;
  public pFVencimientoNum: number = null;
  public pFVencimientoDividendo: number = null;

  public pCalificacionriesgoactualcdetalle: string = null;

  public pFpagoultimocupon: Date = null;

  public pFcompra: Date = null;
  public pFpago: Date = null;
  public pFultimopago: Date = null;

  public pDiasporvencer: number = null;

  public pCusuarioing: string = null;

  public pFingreso: Date = null;

  public pCusuariomod: string = null;

  public pFmodificacion: Date = null;

  public pAmbiente: string = null;
  public pNumeropagoscapital: Number = null;
  public pNumeropagosinteres: Number = null;

  public pPorcentajecalculodescuento: number = null;
  public pPorcentajecalculorendimiento: number = null;

  public pEstadocdetalle: string = null;

  public ptMercado: SelectItem[] = [{ label: '...', value: null }];
  public ptSistemaColocacion: SelectItem[] = [{ label: '...', value: null }];
  public ptMoneda: SelectItem[] = [{ label: '...', value: null }];
  public ptEstado: SelectItem[] = [{ label: '...', value: null }];

  public ptPortafolio: SelectItem[] = [{ label: '...', value: null }];
  public ptBanco: SelectItem[] = [{ label: '...', value: null }];
  public ptBancoPago: SelectItem[] = [{ label: '...', value: null }];
  public ptEmisor: SelectItem[] = [{ label: '...', value: null }];
  public ptInstrumento: SelectItem[] = [{ label: '...', value: null }];
  public ptBolsaValores: SelectItem[] = [{ label: '...', value: null }];
  public ptClasificacion: SelectItem[] = [{ label: '...', value: null }];
  public ptCalendarizacion: SelectItem[] = [{ label: '...', value: null }];
  public ptBaseDiasInteres: SelectItem[] = [{ label: '...', value: null }];
  public ptPeriodos: SelectItem[] = [{ label: '...', value: null }];
  public ptPeriodosInteres: SelectItem[] = [{ label: '...', value: null }];
  public ptCupon: SelectItem[] = [{ label: '...', value: null }];
  public ptCasaValores: SelectItem[] = [{ label: '...', value: null }];
  public ptRiesgo: SelectItem[] = [{ label: '...', value: null }];
  public ptRiesgoActual: SelectItem[] = [{ label: '...', value: null }];
  public ptSector: SelectItem[] = [{ label: '...', value: null }];
  public ptAjusteInteres: SelectItem[] = [{ label: '...', value: null }];
  public ptcentrocostos: SelectItem[] = [{ label: '...', value: null }];

  public pMercadotipocdetalle: string = "";
  public pSistemacolocacioncdetalle: string = "";
  public pMonedacdetalle: string = "";
  public pCcomprobante: string = null;

  public pCotizacion: number = null;

  public pTASA_BOLSA_VALORES: number = null;
  public pTASA_OPERADOR_BOLSA: number = null;
  public pTASA_RETENCION: number = null;

  public pTASA_BOLSA_VALORES_DEF: number = null;
  public pTASA_OPERADOR_BOLSA_DEF: number = null;
  public pTASA_RETENCION_DEF: number = null;

  // Renta Variable
  public pPreciounitarioaccion: number = null;
  public pNumeroacciones: number = null;
  public pValoracciones: number = null;
  public pPreciocompra: number = null;
  public pValordividendospagados: number = null;
  public pPorcentajeparticipacioncupon: number = null;

  private mNumeroCuotas: number = null;

  public generaTIR(
    iValorCompra: number = 0,
    iIntereses: number = 0,
    iComisionBolsaValores: number = 0,
    iComisionOperador: number = 0) {

    this.pTIR = [];

    this.pTirAdd(
      "Valor de Compra"
      , null
      , null
      , null
      , null
      , null
      , null
      , iValorCompra);

    this.pTirAdd(
      "Intereses"
      , null
      , null
      , null
      , null
      , null
      , null
      , iIntereses);

    if (iComisionBolsaValores != null && iComisionBolsaValores != 0) {
      this.pTirAdd(
        "Comisión Bolsa de Valores"
        , null
        , null
        , null
        , null
        , null
        , null
        , iComisionBolsaValores);
    }

    if (iComisionOperador != null && iComisionOperador != 0) {
      this.pTirAdd(
        "Comisión del Operador"
        , null
        , null
        , null
        , null
        , null
        , null
        , iComisionOperador);
    }

    let guess: number = 0.000001;

    let guess_o: number = guess;

    if (guess <= 0) {
      guess = guess_o;
    }

    let lcostoamortizado: number = (iValorCompra + iIntereses + iComisionBolsaValores + iComisionOperador);

   

    let lTIR: number = lcostoamortizado * -1;
    let lkxamortizar: number = this.pCapital;

    this.pTirAdd(
      "TOTAL"
      , null
      , null
      , null
      , null
      , null
      , null
      , lTIR
      , lkxamortizar
      , lcostoamortizado);

    let lconcepto: string = "";

    let lindice: number = 0;

    this.mNumeroCuotas = 0;

    for (const i in this.ptablaamortizaregistro) {
      if (this.ptablaamortizaregistro.hasOwnProperty(i)) {

        this.mNumeroCuotas++;

        lkxamortizar = lkxamortizar - this.ptablaamortizaregistro[i].proyeccioncapital;

        lindice++

        lconcepto = "CUOTA " + lindice;

        var lfinicio = null;
        var lfvencimiento = null;
        var ltotal = null;

        if (this.ptablaamortizaregistro[i].nfinicio == undefined) {
          lfinicio = this.ptablaamortizaregistro[i].mdatos.nfinicio;
          lfvencimiento = this.ptablaamortizaregistro[i].mdatos.nfvencimiento;
          ltotal = this.ptablaamortizaregistro[i].mdatos.total;
        }
        else {
          lfinicio = this.ptablaamortizaregistro[i].nfinicio;
          lfvencimiento = this.ptablaamortizaregistro[i].nfvencimiento;
          ltotal = this.ptablaamortizaregistro[i].total;
        }

        this.pTirAdd(
          lconcepto
          , lfinicio
          , lfvencimiento
          , this.ptablaamortizaregistro[i].plazo
          , this.ptablaamortizaregistro[i].proyecciontasa
          , this.ptablaamortizaregistro[i].proyeccioncapital
          , this.ptablaamortizaregistro[i].proyeccioninteres
          , ltotal
          , lkxamortizar
          , null);

      }
    }
  }

  public pTirAdd(
    iconcepto: string
    , infinicio: Date
    , ifvencimiento: Date
    , iplazo: number
    , iproyecciontasa: number
    , iproyeccioncapital: number
    , iproyeccioninteres: number
    , itotal: number
    , ikxamortizar: number = null
    , icostoamortizado: number = null) {

    if (iconcepto == this.pTirTitulo && this.pTIR != undefined && this.pTIR.length > 0 && this.pTIR[this.pTIR.length - 1].concepto == iconcepto) {
      this.pTIR[this.pTIR.length - 1].total = itotal;
    }
    else {
      this.pTIR.push(
        {
          concepto: iconcepto
          , nfinicio: infinicio
          , nfvencimiento: ifvencimiento
          , plazo: iplazo
          , proyecciontasa: iproyecciontasa
          , proyeccioncapital: iproyeccioncapital
          , proyeccioninteres: iproyeccioninteres
          , total: itotal
          , capitalxamortizar: ikxamortizar
          , costoamortizado: icostoamortizado
        });
    }

    if (iconcepto == this.pTirTitulo) {
      this.pTIRValue = itotal;
      this.calcularCostoAmortizado();
    }
  }

  private calcularCostoAmortizado() 
  {
    
    let linteresImplicito: number = null;
    let lcostoamortizado: number = null;
    let linteresImplicitoAdd: number = null;
    for (const j in this.pTIR) {
      if (this.pTIR.hasOwnProperty(j)) {

        if (this.pTIR[j].concepto == this.pTirTitulo) 
        {
          break;
        }

        if (!this.estaVacio(linteresImplicitoAdd)) 
        {
          this.pTIR[j].interesimplicito = this.redondear(Number(lcostoamortizado) * Number(this.pTIRValue) * 0.01,2) + linteresImplicitoAdd;
          linteresImplicitoAdd = 0;
          lcostoamortizado = this.redondear(lcostoamortizado - this.pTIR[j].total + this.pTIR[j].interesimplicito,2);
          this.pTIR[j].costoamortizado = lcostoamortizado;

          this.pTIR[j].valorajusteactivo = this.pTIR[j].interesimplicito - this.pTIR[j].proyeccioncapital - this.pTIR[j].proyeccioninteres;

          this.pTIR[j].diferenciainteresimplicito = this.pTIR[j].valorajusteactivo + this.pTIR[j].proyeccioncapital;

        }
        else if (this.estaVacio(linteresImplicitoAdd) && !this.estaVacio(this.pTIR[j].costoamortizado) && Number(this.pTIR[j].costoamortizado) != 0) 
        {
          linteresImplicitoAdd = 0.00;  
          lcostoamortizado = this.pTIR[j].costoamortizado;
        }
      }
    }



    
  }


  public Contabilizar(iProcesocDetalle: string = this.pcCOMPRA) {

    let lRubroHaber: string;

    let lRubroHaberConcepto: string;

    this.mlregistro = [];

    if (iProcesocDetalle != this.pcCOMPRA || this.estaVacio(this.pEfectivonegociado) || Number(this.pEfectivonegociado) == 0) {
      lRubroHaber = this.pcBANCOS;
      lRubroHaberConcepto = this.pcBANCOS;
      this.Actualizar(this.pcCAPITAL, 'CAP', this.pCapital);
      this.Actualizar(this.pcINTERES, 'INT', this.pInteres);
      this.Actualizar(this.pcCOMISIONBOLSA, 'COMBOL', this.pComisionBolsa);
      this.Actualizar(this.pcCOMISIONOPERADOR, 'COMOPE', this.pComisionOperador);
    }
    else {
      lRubroHaber = 'CAP';
      lRubroHaberConcepto = this.pcCAPITAL;
      let lvalorBancos = this.pEfectivonegociado - this.pRetencion;
      this.Actualizar(this.pcBANCOS, this.pcBANCOS, lvalorBancos, lRubroHaber);
    }

    this.Actualizar(this.pcRETENCION, 'RET', this.pRetencion);

    let llregistro: any = [];
    llregistro = this.plregistro;

    this.plregistro = [];

    if (this.mlregistro.length > 0) {

      let lcuenta: any = [];

      lcuenta = this.asignaCuenta(llregistro, lRubroHaberConcepto, iProcesocDetalle);

      this.plregistro.push(
        {
          rubro: lRubroHaberConcepto,
          rubroccatalogo: 1219,
          rubrocdetalle: lRubroHaber,
          valorhaber: 0,
          debito: false,
          ccuenta: lcuenta["0"].ccuenta,
          ncuenta: lcuenta["0"].ncuenta,
          cinvtablaamortizacion: lcuenta["0"].cinvtablaamortizacion,
          procesoccatalogo: 1220,
          procesocdetalle: iProcesocDetalle, 
          ccomprobante: lcuenta["0"].ccomprobante,
          fcontable: lcuenta["0"].fcontable,
          particion: lcuenta["0"].particion,
          secuencia: lcuenta["0"].secuencia,
          ccompania: lcuenta["0"].ccompania

        });

      let totalHaber: number = 0;

      let lvalor: number;

      for (const i in this.mlregistro) {
        if (this.mlregistro.hasOwnProperty(i)) {

          lcuenta = this.asignaCuenta(llregistro, this.mlregistro[i].rubro, iProcesocDetalle); 

          if (this.redondear(this.mlregistro[i].valordebe, 2) != 0) {
            lvalor = this.redondear(this.mlregistro[i].valordebe, 2);
          }
          else {
            lvalor = this.redondear(this.mlregistro[i].valorhaber, 2);
          }

          this.plregistro.push(
            {
              rubro: this.mlregistro[i].rubro,
              rubroccatalogo: 1219,
              rubrocdetalle: this.mlregistro[i].rubrocdetalle,
              debito: this.mlregistro[i].debito,
              valordebe: this.redondear(this.mlregistro[i].valordebe, 2),
              valorhaber: this.redondear(this.mlregistro[i].valorhaber, 2),
              ccuenta: lcuenta["0"].ccuenta,
              ncuenta: lcuenta["0"].ncuenta,
              valor: lvalor,
              cinvtablaamortizacion: lcuenta["0"].cinvtablaamortizacion,
              procesoccatalogo: 1220,
              procesocdetalle: iProcesocDetalle,
              ccomprobante: lcuenta["0"].ccomprobante,
              fcontable: lcuenta["0"].fcontable,
              particion: lcuenta["0"].particion,
              secuencia: lcuenta["0"].secuencia,
              ccompania: lcuenta["0"].ccompania

            });

          totalHaber = totalHaber + this.redondear(this.mlregistro[i].valorhaber, 2);
        }
      }
      this.plregistro[0].valordebe = totalHaber;
      this.plregistro[0].valor = totalHaber;
    }
  }

  private Actualizar(rubro: string, irubrocdetalle: string, valor: number, ipcRubroHaber: string = this.pcBANCOS) {
    if (this.redondear(valor, 2) != undefined && valor != 0) {
      let lDebe: number = 0;
      let lHaber: number = 0;
      let ldebito: boolean = false;
      if (rubro != ipcRubroHaber) {
        lHaber = this.redondear(valor, 2);
        ldebito = true;
      }
      else {
        lDebe = this.redondear(valor, 2);
      }
      this.mlregistro.push({ rubro: rubro, rubrocdetalle: irubrocdetalle, valordebe: lDebe, valorhaber: lHaber, debito: ldebito });
    }
  }


  validarContabilizacion(): string {
    let lstrmensaje: string = "";
    for (const i in this.plregistro) {
      if (this.plregistro[i].ccuenta == undefined || this.plregistro[i].ccuenta == "") {
        lstrmensaje = "DEBE ASIGNAR LA CUENTA CONTABLE PARA " + this.plregistro[i].rubro;
        break;
      }
    }
    return lstrmensaje;
  }

  private asignaCuenta(
    iregistro: any,
    istrRubro: string,
    iProcesocDetalle: string): any {
    let lcuenta: any = [];
    let lccuenta: string = "";
    let lncuenta: string = "";

    let lcinvtablaamortizacion: number = null;
    let lccomprobante: string = null;
    let lfcontable: number = null;
    let lparticion: number = null;
    let lsecuencia: number = null;
    let lccompania: number = null;


    for (const i in iregistro) {
      if (iregistro[i].rubro != undefined && iregistro[i].rubro == istrRubro) {
        lccuenta = iregistro[i].ccuenta;
        lncuenta = iregistro[i].ncuenta;

        lcinvtablaamortizacion = iregistro[i].cinvtablaamortizacion;
        lccomprobante = iregistro[i].ccomprobante;
        lfcontable = iregistro[i].fcontable;
        lparticion = iregistro[i].particion;
        lsecuencia = iregistro[i].secuencia;
        lccompania = iregistro[i].ccompania;


        break;
      }
    }

    if ((lccuenta == undefined || lccuenta == "") &&
      this.pCentrocostocdetalle != undefined &&
      this.pCentrocostocdetalle != "" &&
      iProcesocDetalle != undefined &&
      iProcesocDetalle != "" &&
      this.pInstrumentocdetalle != undefined &&
      this.pInstrumentocdetalle != "") {

      let lcuentaPredefinida: any = [];
      let lEntidadcCatalogo: number = 0;
      let lEntidadcdetalle: string = "";

      switch (istrRubro) {
        case this.pcBANCOS:
          lEntidadcdetalle = this.pBancocdetalle;
          lEntidadcCatalogo = 1224;
          break;
        case this.pcCAPITAL:
          lEntidadcdetalle = this.pEmisorcdetalle;
          lEntidadcCatalogo = 1213;
          break;
        case this.pcCOMISIONBOLSA:
          lEntidadcdetalle = this.pBolsavalorescdetalle;
          lEntidadcCatalogo = 1215;
          break;
        case this.pcCOMISIONOPERADOR:
          lcuentaPredefinida = this.asignaCuentaPredefinidaAgente(istrRubro, iProcesocDetalle);
          break;
        case this.pcINTERES:
          lEntidadcdetalle = this.pEmisorcdetalle;
          lEntidadcCatalogo = 1213;
          break;
        case this.pcMORA:
          break;
        case this.pcRETENCION:
          break;
        case this.pcTIR:
          break;
        default:
          break;
      }

      if (lEntidadcCatalogo > 0 || istrRubro == this.pcRETENCION) {
        lcuentaPredefinida = this.asignaCuentaPredefinida(istrRubro, iProcesocDetalle, lEntidadcCatalogo, lEntidadcdetalle);
      }

      if (lcuentaPredefinida.length > 0) {
        lccuenta = lcuentaPredefinida["0"].ccuenta;
        lncuenta = lcuentaPredefinida["0"].ncuenta;
      }
    }

    lcuenta.push({
      ccuenta: lccuenta,
      ncuenta: lncuenta,
      cinvtablaamortizacion: lcinvtablaamortizacion,
      ccomprobante: lccomprobante,
      fcontable: lfcontable,
      particion: lparticion,
      secuencia: lsecuencia,
      ccompania: lccompania

    });
    return lcuenta;
  }

  public asignaCuentaPredefinida(
    istrRubro: string
    , iProcesocDetalle: string
    , ientidadccatalogo: number
    , iEntidadcdetalle: string): any {

    let lcuenta: any = [];
    let lccuenta: string = "";
    let lncuenta: string = "";
    let ldebito: boolean = false;

    if (istrRubro == this.pcRETENCION ||
      (iEntidadcdetalle != undefined && iEntidadcdetalle != "")) {

      for (const i in this.pPlantillaContable) {
        if (
          (istrRubro == this.pcRETENCION &&
            this.pPlantillaContable[i].nombrerubro.substring(0, this.pcRETENCION.length) == this.pcRETENCION) ||

          //RETENCIÓN BOLSA DE VALORES

          (this.pPlantillaContable[i].nombrerubro == istrRubro &&
            this.pPlantillaContable[i].entidadccatalogo == ientidadccatalogo &&
            this.pPlantillaContable[i].entidadcdetalle == iEntidadcdetalle &&
            this.pPlantillaContable[i].instrumentocdetalle == this.pInstrumentocdetalle &&
            this.pPlantillaContable[i].procesocdetalle == iProcesocDetalle
            && this.pPlantillaContable[i].centrocostocdetalle == this.pCentrocostocdetalle)
        ) {
          lccuenta = this.pPlantillaContable[i].ccuenta;
          lncuenta = this.pPlantillaContable[i].nombrecuenta;
          ldebito = this.pPlantillaContable[i].debito == null ? false : this.pPlantillaContable[i].debito;
          break;

        }

      }
    }

    lcuenta.push({
      ccuenta: lccuenta,
      ncuenta: lncuenta,
      debito: ldebito
    });

    return lcuenta;
  }

  public asignaCuentaPredefinidaAgente(istrRubro: string, iProcesocDetalle: string): any {

    let lcuenta: any = [];
    let lccuenta: string = "";
    let lncuenta: string = "";
    let ldebito: boolean = false;

    if (this.pCinvagentebolsa != undefined && this.pCinvagentebolsa != 0) {

      for (const i in this.pPlantillaContableAgente) {
        if (this.pPlantillaContableAgente[i].nombrerubro == istrRubro &&
          this.pPlantillaContableAgente[i].cinvagentebolsa == this.pCinvagentebolsa &&
          this.pPlantillaContableAgente[i].instrumentocdetalle == this.pInstrumentocdetalle &&
          this.pPlantillaContableAgente[i].procesocdetalle == iProcesocDetalle
          && this.pPlantillaContable[i].centrocostocdetalle == this.pCentrocostocdetalle
        ) {
          lccuenta = this.pPlantillaContableAgente[i].ccuenta;
          lncuenta = this.pPlantillaContableAgente[i].nombrecuenta;
          ldebito = this.pPlantillaContableAgente[i].debito == null ? false : this.pPlantillaContableAgente[i].debito;
          break;
        }

      }
    }

    lcuenta.push({
      ccuenta: lccuenta,
      ncuenta: lncuenta,
      debito: ldebito
    });

    return lcuenta;
  }

  public asignarCuentaContable(inRubro: string, iProcesacDetalle: string, iEntidadcCatalogo: number, iEntidadcdetalle: string) {

    let lcuenta: any = [];
    let lccuenta: string = "";
    let lncuenta: string = "";

    for (const i in this.plregistro) {
      if (this.plregistro[i].rubro == inRubro) {

        lcuenta = this.asignaCuentaPredefinida(inRubro, iProcesacDetalle, iEntidadcCatalogo, iEntidadcdetalle);

        this.plregistro[i].ccuenta = lcuenta["0"].ccuenta;
        this.plregistro[i].ncuenta = lcuenta["0"].ncuenta;

        break;
      }
    }

  }

  public asignarCuentaContableAgente(inRubro: string, iProcesacDetalle: string) {

    let lcuenta: any = [];
    let lccuenta: string = "";
    let lncuenta: string = "";

    for (const i in this.plregistro) {
      if (this.plregistro[i].rubro == inRubro) {

        lcuenta = this.asignaCuentaPredefinidaAgente(inRubro, iProcesacDetalle);

        this.plregistro[i].ccuenta = lcuenta["0"].ccuenta;
        this.plregistro[i].ncuenta = lcuenta["0"].ncuenta;

        break;
      }
    }

  }

  limpiarService() {

    this.pCinvagentebolsa = null;
    this.pCinvoperadorinstitucional = null;
    this.pRazonSocialAgente = null;
    this.pOperadorInstNombre = null;
    this.pFcontable = null;
    this.pCcompania = null;
    this.pCcomprobanteanulacion = null;
    this.pCotizacion = null;
    this.mcamposinv=null;

    this.pFemision = null;
    this.pFvencimiento = null;

    this.pCalendarizacioncdetalle = null;

    this.pCapital = 0;
    this.pComisionBolsa = 0;
    this.pComisionOperador = 0;
    this.pInteres = 0;
    this.pRetencion = 0;
    this.pRetencion1=0;
    this.pRetencion2=0;
    this.pPorcentajecalculoprecio = 100;
    this.pUtilidad = 0;
    this.pinterestranscurrido = 0;
    this.pTIRValue = 0;

    this.pSubtotal = null;

    this.pInteresnominaldias = 0;
    this.pPlazo = 0;
    this.pInterestranscurridodias = 0;

    this.pInteresesnegociacion = 0;
    this.pInteresporvencer = 0;

    this.pEmisorcdetalle = null;
    this.pCentrocostocdetalle = null;
    this.pBancocdetalle = null;
    this.pBolsavalorescdetalle = null;
    this.pCinvagentebolsa = null;

    this.pFcompra = null;
    this.pFpago = null;
    this.pFultimopago = null;
    this.pDiasporvencer = null;
    this.pFpagoultimocupon = null;

    this.pDiasgraciacapital = 0;
    this.pDiasgraciainteres = 0;

    this.pTasa = null;
    this.pYield = 0;

    this.pCusuarioing = null;

    this.pFingreso = null;

    this.pCusuariomod = null;

    this.pFmodificacion = null;

    this.pNumeropagoscapital = null;
    this.pNumeropagosinteres = null;

    this.pPorcentajecalculodescuento = null;
    this.pPorcentajecalculorendimiento = null;

    this.pCcomprobante = null;

    this.pPlazoxvencer = null;

    this.pEstadocdetalle = null;

    this.pComisiontotal = 0;

    this.pPrecioNeto = 0;

    this.pValorACompensar = null;

    this.pCalificacionriesgoactualcdetalle = null;

    if (this.pInversionExterior == false) {
      this.pSectorcdetalle = null;
    }

    this.plregistro = [];
  }

  public calcularTotalAPagar() {

    let ltotal: number = 0;

    if (!this.estaVacio(this.pinterestranscurrido)) {
      ltotal = Number(this.pinterestranscurrido);
    }

    if (!this.estaVacio(this.pEfectivonegociado)) {
      ltotal = ltotal + Number(this.pEfectivonegociado);
    }


    if (!this.estaVacio(this.pComisionBolsa)) {
      ltotal = ltotal + Number(this.pComisionBolsa);
    }

    if (!this.estaVacio(this.pComisionOperador)) {
      ltotal = ltotal + Number(this.pComisionOperador);
    }

    this.pTotalapagar = ltotal;
  }

  private estaVacio(obj: any): boolean {
    if (obj === undefined || obj === null || obj === '' || (typeof obj === 'object' && !(obj instanceof Date) && Object.keys(obj).length === 0) || obj.length <= 0) {
      return true;
    }
    return false;
  }

  generarComisiones() {
    let lvalornominal: number = 0;
    if (!this.estaVacio(this.pCapital)) {
      lvalornominal = this.pCapital;
    }
  }

  sumaComisiones(iEditable: number = 0) {

    if (iEditable != 0) {
      this.Contabilizar(this.pcCOMPRA);
    }

    let ltotal: number = 0;
    if (!this.estaVacio(this.pComisionBolsa)) {
      ltotal = Number(this.pComisionBolsa);
    }

    if (!this.estaVacio(this.pComisionOperador)) {
      ltotal = ltotal + Number(this.pComisionOperador);
    }

    if (!this.estaVacio(this.pRetencion)) {
      ltotal = ltotal - Number(this.pRetencion);
    }
   
    
    this.pComisionesnegociacion = ltotal;
    this.calcularTotalAPagar();

  }

  escash(): boolean {

    return false;


  }

  plazoOpcional(): boolean {
    return (this.pInstrumentocdetalle == "BONEST" ||
      this.pInstrumentocdetalle == "BONO" ||
      this.pInstrumentocdetalle == "CAJA" ||
      this.pInstrumentocdetalle == "INVHIP" ||
      this.pInstrumentocdetalle == "OBLIGA" ||
      this.pInstrumentocdetalle == "TITULA" ||
      this.pInstrumentocdetalle == "VALTIT" ||
      this.pInstrumentocdetalle == "CASHEQ" ||
      this.pInstrumentocdetalle == "CASHFP" ||
      this.pInstrumentocdetalle == "CASHFS")
  }

  esBono(): boolean {
    return (this.pInstrumentocdetalle == "BONO" ||
      this.pInstrumentocdetalle == "CASHEQ" ||
      this.pInstrumentocdetalle == "CASHFP" ||
      this.pInstrumentocdetalle == "CASHFS")
  }

  calcularFechasEmisionVecimiento() {


    this.pFemision = null;
    this.pFvencimiento = null;

    for (const i in this.ptablaamortizaregistro) {
      if (this.ptablaamortizaregistro.hasOwnProperty(i)) {

        // Obtención de fecha de emisión
        if (!this.estaVacio(this.ptablaamortizaregistro[i].nfinicio)) {

          var fechaemision = this.stringToFecha(this.integerToFormatoFecha(Number(this.ptablaamortizaregistro[i].nfinicio.toString().substring(0, 4) +
            this.ptablaamortizaregistro[i].nfinicio.toString().substring(5, 7) +
            this.ptablaamortizaregistro[i].nfinicio.toString().substring(8, 10))));

          if (fechaemision < this.pFemision ||
            this.pFemision == null) {
            this.pFemision = fechaemision;
          }

        }

        // Obtención de fecha de vencimiento
        if (!this.estaVacio(this.ptablaamortizaregistro[i].nfvencimiento)) {

          var fechavencimiento = this.stringToFecha(this.integerToFormatoFecha(Number(this.ptablaamortizaregistro[i].nfvencimiento.toString().substring(0, 4) +
            this.ptablaamortizaregistro[i].nfvencimiento.toString().substring(5, 7) +
            this.ptablaamortizaregistro[i].nfvencimiento.toString().substring(8, 10))));

          if (fechavencimiento > this.pFvencimiento ||
            this.pFvencimiento == null) {
            this.pFvencimiento = fechavencimiento;
          }
        }

      }
    }
  }

  private integerToFormatoFecha(valor: number): string {
    // ejemplo yyyyMMdd 20170131    31 de enero del 2017
    const anio = valor.toString().substring(0, 4);
    const mes = valor.toString().substring(4, 6);
    const dia = valor.toString().substring(6, 8);
    const fecha = dia + '-' + mes + '-' + anio;
    return fecha;
  }

  private stringToFecha(valor: string): Date {
    // ejemplo dd-MM-yyyy 31-01-1971    31 de enero del 2017
    let anio = +valor.substring(6, 10);
    let mes = +valor.substring(3, 5) - 1;
    let dia = +valor.substring(0, 2);
    const fecha: Date = new Date(anio, mes, dia);
    return fecha;
  }

  construyePago(
    resp: any, iMercadoTipo = "", 
    iblnComisionOperador: boolean = null, 
    iblnComisionBolsa: boolean = null) {

    if (!this.instrumentosSinTabla() && this.pEstadocdetalle != 'ING') {
      for (const i in resp.lregistros) {
        if (resp.lregistros.hasOwnProperty(i)) {
          resp.lregistros[i].mdatos.nestado = resp.lregistros[i].nestado;
        }
      }

      if (resp.FEmision != undefined && resp.FEmision.length != undefined) {

        this.pFemision = this.stringToFecha(this.integerToFormatoFecha(Number(resp.FEmision.toString().substring(0, 4) +
          resp.FEmision.toString().substring(5, 7) +
          resp.FEmision.toString().substring(8, 10))));

      }
      else {

        this.pFemision = resp.FEmision;

      }
      if (resp.FechaCompra != undefined && resp.FechaCompra.length != undefined) {

        this.pFcompra = this.stringToFecha(this.integerToFormatoFecha(Number(resp.FechaCompra.toString().substring(0, 4) +
          resp.FechaCompra.toString().substring(5, 7) +
          resp.FechaCompra.toString().substring(8, 10))));

      }
      else {
        this.pFcompra = resp.FechaCompra;
      }

      if (resp.FUltimoPago != undefined && resp.FUltimoPago.length != undefined) {

        this.pFultimopago = this.stringToFecha(this.integerToFormatoFecha(Number(resp.FUltimoPago.toString().substring(0, 4) +
          resp.FUltimoPago.toString().substring(5, 7) +
          resp.FUltimoPago.toString().substring(8, 10))));
      }
      else {
        this.pFultimopago = resp.FUltimoPago;
      }

      this.pTasa = resp.TasaCupon;
      this.pCalendarizacioncdetalle = resp.BaseCalculoInteres;
      this.pYield = resp.Yield;
      this.pPorcentajecalculoprecio = resp.Porcentajecalculoprecio;

      this.ptablaamortizaregistro = resp.lregistros;
      this.pCapital = resp.Capital;
      this.pPlazoxvencer = resp.PlazoRealxVencer;

    }


    this.pInterestranscurridodias = resp.InteresTranscurridoDias;


    if (resp.FVencimiento != undefined && resp.FVencimiento.length != undefined) {

      this.pFvencimiento = this.stringToFecha(this.integerToFormatoFecha(Number(resp.FVencimiento.toString().substring(0, 4) +
        resp.FVencimiento.toString().substring(5, 7) +
        resp.FVencimiento.toString().substring(8, 10))));

    }
    else {
      this.pFvencimiento = resp.FVencimiento;
    }

    this.pEfectivonegociado = resp.ValorEfectivo;

    this.pValornegociacion = resp.ValorNegociacion;

    this.pDiasporvencer = resp.DiasxVencer;

    this.pInteresnominaldias = resp.Interesnominaldias;

    this.pValordescuento = resp.ValorDescuento;

    if (!this.estaVacio(iblnComisionBolsa) || !this.estaVacio(iblnComisionOperador)) {
      let lComsionTotal: number = 0;

      if (!this.estaVacio(iblnComisionBolsa) && !iblnComisionBolsa) {
        this.pComisionBolsa = 0;
        this.pRetencion = 0;
        this.pRetencion1=0;
      }
      else {
        this.pComisionBolsa = resp.ComisionBolsa;
        lComsionTotal = Number(resp.ComisionBolsa);
        this.pRetencion = resp.Retencion;
      }

      if (!this.estaVacio(iblnComisionOperador) && !iblnComisionOperador) {
        this.pComisionOperador = 0;
      }
      else {
        this.pComisionOperador = resp.ComisionOperador;
        lComsionTotal = lComsionTotal + Number(resp.ComisionOperador);
      }

      this.pComisiontotal = lComsionTotal;

      this.pSubtotal = resp.ValorEfectivo + resp.InteresTranscurrido + lComsionTotal - this.pRetencion;

      this.pPrecioNeto = this.redondear(this.pSubtotal * 0.0001, 4);

      this.pValorACompensar = resp.ValorEfectivo + resp.InteresTranscurrido + this.pComisionBolsa - this.pRetencion;;

    }
    else {

      this.pComisionBolsa = resp.ComisionBolsa;

      this.pComisionOperador = resp.ComisionOperador;

      this.pComisiontotal = resp.ComisionTotal;

      this.pRetencion = resp.Retencion;

      this.pSubtotal = resp.Subtotal;

      this.pPrecioNeto = resp.PrecioNeto;

      this.pValorACompensar = resp.ValorACompensar;

    }



    this.pinterestranscurrido = resp.InteresTranscurrido;

    if (iMercadoTipo == "EXTBUR") {
      this.pInteresesnegociacion = resp.Interes;
    }
    else {
      this.pInteresesnegociacion = resp.InteresNegociacion;
    }

    this.pInteres = resp.Interes;

    this.pInteresporvencer = resp.InteresPorVencer;

  }

  validarCuentasContables(): string {

    let lccuenta: string = "";
    let lMensaje: string = "";
    for (const i in this.plregistro) {
      if (this.plregistro.hasOwnProperty(i)) {

        if (lccuenta == "") {
          lccuenta = this.plregistro[i].ccuenta.toString().substring(0, 1);
        }
        else {

          if (lccuenta != this.plregistro[i].ccuenta.toString().substring(0, 1)) {
            lMensaje = "GRUPO DE CUENTA NO CORRESPONDE PARA " + this.plregistro[i].ccuenta;
            break;
          }

        }

      }
    }
    return lMensaje;

  }

  valoresPorDefault() {



    if (this.estaVacio(this.pSistemacolocacioncdetalle) || this.pSistemacolocacioncdetalle == '...') {
      this.pSistemacolocacioncdetalle = "PRIM";
    }

    if (this.estaVacio(this.pMonedacdetalle) || this.pMonedacdetalle == '...') {
      this.pMonedacdetalle = "USD";
    }

    if ((this.pMonedacdetalle == "USD" || this.pMonedacdetalle == '...') && (this.estaVacio(this.pCotizacion) || this.pCotizacion == 0)) {
      this.pCotizacion = 1;
    }
    if (this.estaVacio(this.pEstadocdetalle) || this.pEstadocdetalle == '...') {
      this.pEstadocdetalle = 'ING';
    }

    if (this.estaVacio(this.pCentrocostocdetalle) || this.pCentrocostocdetalle == '...') {
      this.pCentrocostocdetalle = this.pCentrocostocdetalleDefault;
    }

    if (this.estaVacio(this.pBancocdetalle) || this.pBancocdetalle == '...') {
      this.pBancocdetalle = this.pBancoContabilidadDefault;
    }

    this.pTASA_BOLSA_VALORES = this.pTASA_BOLSA_VALORES_DEF;
    this.pTASA_OPERADOR_BOLSA = this.pTASA_OPERADOR_BOLSA_DEF;
    this.pTASA_RETENCION = this.pTASA_RETENCION_DEF;

    this.generaPorcentajeString();

  }

  generaPorcentajeString() {
    this.pstrPorcentajeBolsa = String(this.pTASA_BOLSA_VALORES * 0.01) + '%';
    this.pstrPorcentajeAgente = String(this.pTASA_OPERADOR_BOLSA * 0.01) + '%';
    this.pstrPorcentajeRetencion = String(this.pTASA_RETENCION) + '%';
  }

  instrumentosSinTablaSinPC(): boolean {
    return (this.pstrInstrumentoCLegal == 'CDP' ||
      this.pInstrumentocdetalle == 'BONO' ||
      this.pInstrumentocdetalle == 'BONEST' ||
      this.pInstrumentocdetalle == "CASHEQ" ||
      this.pInstrumentocdetalle == "CASHFP" ||
      this.pInstrumentocdetalle == "CASHFS");

  }

  instrumentosSinTabla(): boolean {
    return (this.instrumentosSinTablaSinPC() ||
      this.instrumentosPC());
  }

  instrumentosPC(): boolean {
    return (this.pstrInstrumentoCLegal == 'PC');
  }

  private redondear(value, precision): number {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  contabilizaCentroCosto() {
    this.asignarCuentaContable(this.pcBANCOS, this.pcCOMPRA, 1224, this.pBancocdetalle);
    this.asignarCuentaContable(this.pcCAPITAL, this.pcCOMPRA, 1213, this.pEmisorcdetalle);
    this.asignarCuentaContable(this.pcINTERES, this.pcCOMPRA, 1213, this.pEmisorcdetalle);
    this.asignarCuentaContable(this.pcCOMISIONBOLSA, this.pcCOMPRA, 1215, this.pBolsavalorescdetalle);
    this.asignarCuentaContableAgente(this.pcCOMISIONOPERADOR, this.pcCOMPRA);
    this.asignarCuentaContable(this.pcRETENCION, this.pcCOMPRA, 0, "");
  }

  obtenerWhereContabilidad(
    iProceso: string
    , isesion: string
    , iInstrumentocDetalle: string = null) {

    let lCondicion = " p.procesocdetalle = '" + iProceso + "' and p.instrumentocdetalle"

    if (isesion == "19" || isesion == "110" || isesion == "1019" || isesion == "1110") {
      lCondicion = lCondicion + " in ('ACCION','ACCOPP')";
    }
    else {
      lCondicion = lCondicion + " = '" + iInstrumentocDetalle + "'"
    }
    return lCondicion + " and ";
  }

  tieneTablaPagos(): boolean {

    return (this.pstrInstrumentoCLegal == 'OBLIGA' ||
      this.pstrInstrumentoCLegal == "INVHIP")

  }

  fechaRestar(basecalculo: string, fechafinal: number, fechainicial: number): number {

    if (fechafinal < fechainicial) {

      let fechaaux: number = fechafinal;
      fechafinal = fechainicial;
      fechainicial = fechaaux;
      
    }


    if (basecalculo == "360") {
      return this.Resta360(fechafinal, fechainicial);
    }
    else {
      return this.dateDiff(this.integerToDate(fechainicial), this.integerToDate(fechafinal));
    }

  }

  Resta360(fechafinal: number, fechainicial: number): number {
    if (fechafinal == fechainicial) {
      return 0;
    }

    let anios: number = this.GetAnio(fechafinal) - this.GetAnio(fechainicial);
    let meses: number = this.GetMes(fechafinal) - this.GetMes(fechainicial);
    // evalua el dia de la fecha final
    let diafinal: number = this.GetDia360(fechafinal);
    let diainicial: number = this.GetDia360(fechainicial);

    // calcula el numero de dias.
    let dias: number = diafinal - diainicial;
    if (diafinal >= 28 && diainicial >= 28) {
      // en Restas 29-feb - 31-enero es 30
      // en Restas 29-mar - 29-febero da 30
      dias = 0;
    }
    anios = anios * 12 * 30; // dias de los anios.
    meses = meses * 30; // dias de los meses, este valor puede ser negativo por que los dias se incluyen en los anios.
    // dias de la Resta.
    dias = anios + meses + dias;
    return dias;
  }

  public GetAnio(fecha: number): number {
    return Number(fecha.toString().substring(0, 4));
  }

  public GetMes(fecha: number): number {

    return Number(fecha.toString().substring(4, 6));

  }

  public GetDia360(fecha: number): number {
    let dia: number = this.GetDia(fecha);
    if (dia > 30) {
      dia = 30;
    }
    let mes: number = this.GetMes(fecha);
    let mod: number = this.GetAnio(fecha) % 4;
    //// Si es febrero y no es biciesto devuelve 30 dias.
    //// si es febrero y es biciesto devuelve 30 dias.
    if (mes == 2) { // 1 enero, 2 febrero etc no es lo mismo que en java.
      if ((mod == 0) && (dia == 29)) {
        dia = 30;
      }
      if ((mod != 0) && (dia == 28)) {
        dia = 30;
      }
    }
    return dia;
  }

  public GetDia(fecha: number): number {
    return Number(fecha.toString().substring(6, 8));
  }

  dateDiff(ifinicio: Date, iffin: Date): number {

    var MILISENGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;

    var utc1 = Date.UTC(ifinicio.getFullYear(), ifinicio.getMonth(), ifinicio.getDate());
    var utc2 = Date.UTC(iffin.getFullYear(), iffin.getMonth(), iffin.getDate());

    return Math.floor((utc2 - utc1) / MILISENGUNDOS_POR_DIA);

  }

  public integerToDate(valor: number): Date {
    if (this.estaVacio(valor)) {
      return null;
    }
    const anio = valor.toString().substring(0, 4);
    const mes = valor.toString().substring(4, 6);
    let dia = valor.toString().substring(6, 8);
    if (this.estaVacio(dia)) {
      dia = '01';
    }
    return new Date(Number(anio), (Number(mes) - 1), Number(dia));
  }

}