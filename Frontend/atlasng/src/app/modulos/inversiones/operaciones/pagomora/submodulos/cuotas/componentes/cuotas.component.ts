
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
  selector: 'app-cuotas',
  templateUrl: 'cuotas.html'
})
export class CuotasComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public pConciliacionExtracto: any = [];

  private pTransaccion: number = Number(sessionStorage.getItem('t'));

  public pFechaIni: number = 0;
  public pFechaFin: number = 0;

  public pCinversionConsulta: number = 0;

  public pEstadoCondicion: string = null;

  public pTabamoEstado: string = null;

  fecha = new Date();

  constructor(router: Router, dtoServicios: DtoServicios, private inversionesServicios: InversionesServicios) {
    super(router, dtoServicios, 'tconconciliacionbancariaeb', 'MORAINV', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    super.cancelar();
  }

  // Inicia CONSULTA *********************
  consultar() {
  }


  public crearDtoConsulta() {

    if (this.estaVacio(this.pFechaIni) || Number(this.pFechaIni) == 0 || this.estaVacio(this.pFechaFin) || Number(this.pFechaFin) == 0)
    {
      return;
    }

    let lfechainicial: number = 0;
    let lfechafinal: number = 99999999;

    if ((!this.estaVacio(this.pFechaIni) &&
      this.pFechaIni > 0) ||
      (!this.estaVacio(this.pFechaFin) &&
        this.pFechaFin > 0)) {

      if (!this.estaVacio(this.pFechaIni) && this.pFechaIni > 0) lfechainicial = this.pFechaIni;

      if (!this.estaVacio(this.pFechaFin) && this.pFechaFin > 0) lfechafinal = this.pFechaFin;

    }
    else {
      if (this.estaVacio(this.pEstadoCondicion) && (this.estaVacio(this.pCinversionConsulta) || this.pCinversionConsulta == 0)) {
        return;
      }
    }

    const rqConsulta: any = new Object();

    rqConsulta.CODIGOCONSULTA = 'REGISTROCUOTAS';

    if (!this.estaVacio(this.pCinversionConsulta) || this.pCinversionConsulta != 0) rqConsulta.cinversion = this.pCinversionConsulta;

    rqConsulta.finicial = lfechainicial;
    rqConsulta.ffinal = lfechafinal;
    rqConsulta.procesocdetalle = this.inversionesServicios.pcRECUPERACION;

    rqConsulta.whereAdicional = "tinv.estadocdetalle = 'APR'";

    rqConsulta.pRentaVariable = "FIJA";

    rqConsulta.whereAdicional = rqConsulta.whereAdicional + " AND isnull(tinvtabamo.mora,0) in (0,2) ";

    let lwhereEstado: string = "";

    if (!this.estaVacio(this.pEstadoCondicion) && this.pEstadoCondicion != "..." && this.pEstadoCondicion != "TODOS") {
      lwhereEstado = " AND isnull(tinvtabamo.mora,0) = 1 ";
    }

    rqConsulta.whereAdicional = rqConsulta.whereAdicional + lwhereEstado;

    rqConsulta.incluyePagados = true;

    this.dtoServicios.ejecutarConsultaRest(rqConsulta)
      .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false);
          if (resp.cod !== 'OK') {
            return;
          }
        

          this.lregistros = resp.REGISTROCUOTAS;
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  public fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  edit(row: any, index: number) {

    if (!this.estaVacio(row.mensaje) && this.inversionesServicios.pAmbiente != "D") {
      this.mostrarMensajeError(row.mensaje);
      return;
    }

    if (!this.estaVacio(this.inversionesServicios.pCinvtablaamortizacion) && Number(this.inversionesServicios.pCinvtablaamortizacion) > 0) {
      this.mostrarMensajeError("YA EXISTE UN PAGO EN PROCESO");
      return;
    }

    this.encerarMensajes();
    this.inversionesServicios.limpiarService();

    this.inversionesServicios.pCapital = row.tabamo_capital;
    this.inversionesServicios.pInteres = row.tabamo_interes;
    this.inversionesServicios.pCentrocostocdetalle = row.centrocostocdetalle;
    this.inversionesServicios.pInstrumentocdetalle = row.instrumentocodigo;
    this.inversionesServicios.pBancocdetalle = row.bancocdetalle;
    this.inversionesServicios.pEmisorcdetalle = row.emisorcdetalle +"/"+this.estaVacio(row.aceptantecdetalle)?"":row.aceptantecdetalle;
         //ACECPTANTE FACTURA COMERCIAL
   
    this.inversionesServicios.pDiferencia = 0;

    if (this.estaVacio(row.tabamo_valorcancelado) || Number(row.tabamo_valorcancelado) == 0) {
      this.inversionesServicios.pTotalapagar = row.tabamo_subtotal;
    }
    else {

      if (!this.estaVacio(row.tabamo_capital) && row.tabamo_capital != 0) this.inversionesServicios.pDiferencia = Number(row.tabamo_capital);
      if (!this.estaVacio(row.tabamo_interes) && row.tabamo_interes != 0) this.inversionesServicios.pDiferencia = this.inversionesServicios.pDiferencia + Number(row.tabamo_interes);
      this.inversionesServicios.pDiferencia = Number(row.tabamo_valorcancelado) - this.inversionesServicios.pDiferencia;

      this.inversionesServicios.pTotalapagar = row.tabamo_valorcancelado;
    }

    try {
      this.inversionesServicios.pCinvtablaamortizacion = row.cinvtablaamortizacion;
    }
    catch (ex) { }

    try {
      this.pTabamoEstado = row.tabamo_estado;
    }
    catch (ex) { }

    var fechaNow = new Date(Date.now());
    let fechaInt: number = this.fechaToInteger(fechaNow);


    this.inversionesServicios.ptablaamortizaregistro = [];

    this.inversionesServicios.Contabilizar(this.inversionesServicios.pcRECUPERACION);

    this.inversionesServicios.pCinvtablaamortizacion = row.cinvtablaamortizacion;
    this.inversionesServicios.pFinicioNum = row.tabamo_fechainicio;
    this.inversionesServicios.pPlazo = row.tabamo_plazo360;
    this.inversionesServicios.pFVencimientoDividendo = row.tabamo_fechavencimiento;
    this.inversionesServicios.pMora = row.tabamo_mora;
    this.inversionesServicios.pSubtotal = row.tabamo_subtotal;
    this.inversionesServicios.pEmisorNombre = row.emisor;
    this.inversionesServicios.pInstrumentoNombre = row.instrumento;
    this.inversionesServicios.pValorNominal = row.valornominal;
    this.inversionesServicios.pInteresInversion = row.interesbasadoenvalornominal;
    this.inversionesServicios.pFVencimientoNum = row.fvencimiento;
    this.inversionesServicios.pCinversion = row.cinversion;

    let lMensaje = "";
    if (!this.estaVacio(row.mensaje)) {
      lMensaje = "NO EXISTE LA PLANTILLA CONTABLE PARA ESTE PAGO.  CONTÁCTESE CON SISTEMAS.";
    }

    this.inversionesServicios.pMensaje = lMensaje;

    if (this.inversionesServicios.plregistro == undefined || this.inversionesServicios.plregistro.length == 0) {
      this.mostrarMensajeError("NO ESTÁ PARAMETRIZADA LA PLANTILLA CONTABLE PARA ESTA INVERSIÓN.");
    }
    else {

      var ldate = new Date();
      let lfechanum: number = (ldate.getFullYear() * 10000) + ((ldate.getMonth() + 1) * 100) + ldate.getDate();
      let lfechastr: string = lfechanum.toString().substring(0, 8);
      let lhoranum = (ldate.getHours() * 10000) + (ldate.getMinutes() * 100) + ldate.getSeconds();
      let lhorastr: string = lhoranum.toString().substring(0, 6);

      let lconciliacionbancariaid: number = parseInt(lfechastr + lhorastr, 10);

      this.lregistros.splice(index, 1);

      let lIndice = this.pConciliacionExtracto.length;

      for (const i in this.inversionesServicios.plregistro) {
        if (this.inversionesServicios.plregistro.hasOwnProperty(i)) {

          this.pConciliacionExtracto.push({
            cconconciliacionbancariaextracto: row.cconconciliacionbancariaextracto
          });

          this.pConciliacionExtracto[lIndice] = [];
          this.pConciliacionExtracto[lIndice].conciliacionbancariaid = lconciliacionbancariaid;
          this.pConciliacionExtracto[lIndice].rubro = this.inversionesServicios.plregistro[i].rubro;
          this.pConciliacionExtracto[lIndice].ccuenta = this.inversionesServicios.plregistro[i].ccuenta;
          this.pConciliacionExtracto[lIndice].ncuenta = this.inversionesServicios.plregistro[i].ncuenta;
          this.pConciliacionExtracto[lIndice].valordebe = this.inversionesServicios.plregistro[i].valordebe;
          this.pConciliacionExtracto[lIndice].valorhaber = this.inversionesServicios.plregistro[i].valorhaber;
          this.pConciliacionExtracto[lIndice].procesoccatalogo = this.inversionesServicios.plregistro[i].procesoccatalogo;
          this.pConciliacionExtracto[lIndice].procesocdetalle = this.inversionesServicios.plregistro[i].procesocdetalle;
          this.pConciliacionExtracto[lIndice].rubroccatalogo = this.inversionesServicios.plregistro[i].rubroccatalogo;
          this.pConciliacionExtracto[lIndice].rubrocdetalle = this.inversionesServicios.plregistro[i].rubrocdetalle;
          this.pConciliacionExtracto[lIndice].valor = this.inversionesServicios.plregistro[i].valor;
          this.pConciliacionExtracto[lIndice].debito = this.inversionesServicios.plregistro[i].debito;
          this.pConciliacionExtracto[lIndice].tabamo_fechavencimiento = row.tabamo_fechavencimiento;
          this.pConciliacionExtracto[lIndice].tabamo_fechainicio = row.tabamo_fechainicio;
          this.pConciliacionExtracto[lIndice].tabamo_plazo = row.tabamo_plazo;
          this.pConciliacionExtracto[lIndice].tabamo_capital = row.tabamo_capital;
          this.pConciliacionExtracto[lIndice].tabamo_tasa = row.tabamo_tasa;
          this.pConciliacionExtracto[lIndice].tabamo_interes = row.tabamo_interes;
          this.pConciliacionExtracto[lIndice].tabamo_mora = row.tabamo_mora;
          this.pConciliacionExtracto[lIndice].tabamo_subtotal = row.tabamo_subtotal;
          this.pConciliacionExtracto[lIndice].emisor = row.emisor;
          this.pConciliacionExtracto[lIndice].instrumentocodigo = row.instrumentocodigo;
          this.pConciliacionExtracto[lIndice].valornominal = row.valornominal;
          this.pConciliacionExtracto[lIndice].interesbasadoenvalornominal = row.interesbasadoenvalornominal;
          this.pConciliacionExtracto[lIndice].clasificacioninversion = row.clasificacioninversion;
          this.pConciliacionExtracto[lIndice].fcompra = row.fcompra;
          this.pConciliacionExtracto[lIndice].fvencimiento = row.fvencimiento;
          this.pConciliacionExtracto[lIndice].estado = row.estado;
          this.pConciliacionExtracto[lIndice].cinversion = row.cinversion;
          this.pConciliacionExtracto[lIndice].cinvtablaamortizacion = row.cinvtablaamortizacion;
          this.pConciliacionExtracto[lIndice].mensaje = row.mensaje;
          this.pConciliacionExtracto[lIndice].centrocostocdetalle = row.centrocostocdetalle;
          this.pConciliacionExtracto[lIndice].bancocdetalle = row.bancocdetalle;
          this.pConciliacionExtracto[lIndice].emisorcdetalle = row.emisorcdetalle;
          this.pConciliacionExtracto[lIndice].comentariosdevolucion = row.comentariosdevolucion;
          lIndice++;

        }


      }



    }

  }

  limpiar() {

    this.inversionesServicios.pTotalapagar = null;

    this.pTabamoEstado = null;
    this.inversionesServicios.pCinvtablaamortizacion = null;
    this.inversionesServicios.pFinicioNum = null;
    this.inversionesServicios.pPlazo = null;
    this.inversionesServicios.pFVencimientoDividendo = null;
    this.inversionesServicios.pCapital = null;
    this.inversionesServicios.pMora = null;
    this.inversionesServicios.pSubtotal = null;
    this.inversionesServicios.pEmisorNombre = null;
    this.inversionesServicios.pInstrumentoNombre = null;
    this.inversionesServicios.pValorNominal = null;
    this.inversionesServicios.pInteres = null;
    this.inversionesServicios.pFVencimientoNum = null;
    this.inversionesServicios.pCinversion = null;
    this.inversionesServicios.pMensaje = null;
    this.inversionesServicios.pInteresInversion = null;
    this.inversionesServicios.pComentariosDevolucion = null

    this.inversionesServicios.pPreciounitarioaccion = null;
    this.inversionesServicios.pNumeroacciones = null;
    this.inversionesServicios.pValoracciones = null;
    this.inversionesServicios.pPreciocompra = null;
    this.inversionesServicios.pValordividendospagados = null;
    this.inversionesServicios.pPorcentajeparticipacioncupon = null;
    this.inversionesServicios.pFemision = null;

    this.inversionesServicios.pComentarios = null;
  }

}
