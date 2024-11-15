
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CuotasComponent } from '../submodulos/cuotas/componentes/cuotas.component';
import { NgClass } from '@angular/common';
import { InversionesServicios } from './../../../servicios/_invservicios.service';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
//import { LovInversionesComponent } from '../../../../inversiones/lov/inversiones/componentes/lov.inversiones.component';

@Component({
  selector: 'app-pagomora',
  templateUrl: 'pagomora.html',
  providers: [InversionesServicios]
})
export class PagomoraComponent extends BaseComponent implements OnInit, AfterViewInit {

  public lBanco: SelectItem[] = [{ label: '...', value: null }];
  public lestado: SelectItem[] = [{ label: '...', value: null }];

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(CuotasComponent)
  cuotasComponent: CuotasComponent;

//  @ViewChild(LovInversionesComponent) private lovInversiones: LovInversionesComponent;

  private pTransaccion: number = Number(sessionStorage.getItem('t'));
  private pFechaEtiqueta: string = null;

  private numerocheque: string = null;

  fecha = new Date();

  constructor(router: Router, dtoServicios: DtoServicios, private inversionesServicios: InversionesServicios, private confirmationService: ConfirmationService) {
    super(router, dtoServicios, 'tinvcontabilizacion', 'PAGOSMORA', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {

    this.pFechaEtiqueta = "Fecha de Vencimiento Inicial";

    this.obtenerPlantillaContable();
    super.init(this.formFiltros);
    this.llenarEstado();
    this.cuotasComponent.limpiar();
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
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

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {

    this.cuotasComponent.pEstadoCondicion = this.mcampos.estado;

    this.cuotasComponent.pFechaIni = 0;
    this.cuotasComponent.pFechaFin = 0;

    if (!this.estaVacio(this.mcampos.finicial)) {
      this.cuotasComponent.pFechaIni = (this.mcampos.finicial.getFullYear() * 10000) + ((this.mcampos.finicial.getMonth() + 1) * 100) + this.mcampos.finicial.getDate();
    }

    if (!this.estaVacio(this.mcampos.ffinal)) {
      this.cuotasComponent.pFechaFin = (this.mcampos.ffinal.getFullYear() * 10000) + ((this.mcampos.ffinal.getMonth() + 1) * 100) + this.mcampos.ffinal.getDate();
    }

    if (this.cuotasComponent.pFechaIni == 0 || this.cuotasComponent.pFechaFin == 0)
    {
      return;
    }

    this.cuotasComponent.pCinversionConsulta = this.mcampos.cinversion;

    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {

    this.mfiltros.cinvcontabilizacion = 0;
    const consulta = new Consulta(this.entityBean, 'N', '', this.mfiltros, this.mfiltrosesp);
    this.addConsulta(consulta);

    this.cuotasComponent.mfiltros.ccuenta = '';

    this.cuotasComponent.crearDtoConsulta();

    return consulta;

  }

  validaFiltrosConsulta(): boolean {
    return this.cuotasComponent.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {

    this.cuotasComponent.postQuery(resp);
    super.postQueryEntityBean(resp);
    this.asignarTransferencia();

  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {

    if (!this.estaVacio(this.inversionesServicios.pMensaje)) {
      this.mostrarMensajeError(this.inversionesServicios.pMensaje);
      return;
    }

    if (this.rqMantenimiento.lregistrosTmp == undefined || this.rqMantenimiento.lregistrosTmp.length == 0) {
      this.mostrarMensajeError("NO EXISTEN REGISTROS PARA PROCESAR. GRABACIÓN CANCELADA");
    }
    else {

      this.encerarMensajes();

      if (this.estaVacio(this.inversionesServicios.pMora) || this.inversionesServicios.pMora == 0) {
        this.mostrarMensajeError("INGRESE EL VALOR EN MORA");
        return;
      }
      else if (this.inversionesServicios.pMora <= 0) {
        this.mostrarMensajeError("VALOR EN MORAO DEBE SER MAYOR A CERO");
        return;
      }

      if (this.estaVacio(this.inversionesServicios.pComentarios)) {
        this.mostrarMensajeError("INGRESE EL COMENTARIO PARA LA APROBACIÓN DEL PAGO");
        return;
      }

      this.confirmationService.confirm({
        message: 'Está seguro de registrar el pago de la mora para su aprobación?',
        header: 'Confirmación',
        icon: 'fa fa-question-circle',
        accept: () => {
          this.grabaDetalle();
        },
        reject: () => {
        }
      });


    }
  }

  private grabaDetalle() {

    this.encerarMensajes();

    this.confirmationService.confirm({
      message: 'Está seguro de aprobar la transacción?',
      header: 'Confirmación',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.rqMantenimiento.contabilizar = true;
        this.rqMantenimiento.procesocdetalle = this.mcampos.procesocdetalle;
        this.rqMantenimiento.cinversion = this.registro.cinversion;
        this.rqMantenimiento.cinvtablaamortizacion = this.mcampos.cinvtablaamortizacion;
        super.grabar();
      },
      reject: () => {
      }
    });

    this.lregistros = []

    this.rqMantenimiento.comentario = this.inversionesServicios.pComentarios;

    //this.rqMantenimiento.valorcancelado = this.inversionesServicios.pTotalapagar;

    this.rqMantenimiento.valormora = this.redondear(Number(this.inversionesServicios.pMora),2);

    if (!this.estaVacio(this.inversionesServicios.pMora) && this.redondear(Number(this.inversionesServicios.pMora),2) != 0)
    {
      this.inversionesServicios.ptablaamortizaregistro.push({ rubrocdetalle: 'BANCOS', valor: this.redondear(Number(this.inversionesServicios.pMora),2), debito: true });
      this.inversionesServicios.ptablaamortizaregistro.push({ rubrocdetalle: 'ING', valor: this.redondear(Number(this.inversionesServicios.pMora),2), debito: false });
    }

    this.rqMantenimiento.cinversion = this.inversionesServicios.pCinversion;

    this.rqMantenimiento.cinvtablaamortizacion = this.inversionesServicios.pCinvtablaamortizacion;

    this.rqMantenimiento.procesocdetalle = this.inversionesServicios.pcRECUPERACION;

    this.rqMantenimiento.lregistroContabilidad = this.inversionesServicios.ptablaamortizaregistro;

    this.rqMantenimiento.estadocdetalle = "ENVAPR";

    this.crearDtoMantenimiento();

    this.rqMantenimiento.mora = 1;

    super.grabar();

    this.inversionesServicios.pDiferencia = null;
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {

    if (resp.cod != undefined && (resp.cod.toString().substring(0, 3) == "INV" || resp.cod.toString().substring(0, 4) == "BMON")) {
      this.cancelarPago();
      return;
    }

    super.postCommitEntityBean(resp);

    if (resp.ccomprobante != undefined) {
      this.mcampos.cinversion = null;
      this.mcampos.codigotitulo = null;
      this.mcampos.ccomprobante = resp.ccomprobante;
      this.mcampos.numerocomprobantecesantia = resp.numerocomprobantecesantia;

    }

    this.limpiarAplicacion();

  }

  limpiarAplicacion() {

    this.mcampos.bancocdetalle = null;
    this.numerocheque = null;
    this.cuotasComponent.limpiar();
    this.asignarTransferencia();
    this.lregistros = [];
  }

  asignarTransferencia() {

    this.rqMantenimiento.lregistrosTmp = [];
    this.cuotasComponent.pConciliacionExtracto = this.rqMantenimiento.lregistrosTmp;

  }

  cancelarPago() {


    this.encerarMensajes();

    let lIndiceExtracto = this.cuotasComponent.lregistros.length;

    this.cuotasComponent.lregistros.push({
      cinvtablaamortizacion: this.inversionesServicios.pCinvtablaamortizacion
    });

    this.cuotasComponent.lregistros[lIndiceExtracto] = [];

    try {
      this.cuotasComponent.lregistros[lIndiceExtracto].cinvtablaamortizacion = this.inversionesServicios.pCinvtablaamortizacion;
    }
    catch (ex) { }

    try {
      this.cuotasComponent.lregistros[lIndiceExtracto].tabamo_estado = this.cuotasComponent.pTabamoEstado;
    }
    catch (ex) { }

    this.cuotasComponent.lregistros[lIndiceExtracto].tabamo_fechainicio = this.inversionesServicios.pFinicioNum;
    this.cuotasComponent.lregistros[lIndiceExtracto].tabamo_plazo360 = this.inversionesServicios.pPlazo;
    this.cuotasComponent.lregistros[lIndiceExtracto].tabamo_fechavencimiento = this.inversionesServicios.pFVencimientoDividendo;
    this.cuotasComponent.lregistros[lIndiceExtracto].tabamo_capital = this.inversionesServicios.pCapital;
    this.cuotasComponent.lregistros[lIndiceExtracto].tabamo_interes = this.inversionesServicios.pInteres;
    this.cuotasComponent.lregistros[lIndiceExtracto].tabamo_mora = this.inversionesServicios.pMora;
    this.cuotasComponent.lregistros[lIndiceExtracto].tabamo_subtotal = this.inversionesServicios.pSubtotal;
    this.cuotasComponent.lregistros[lIndiceExtracto].emisor = this.inversionesServicios.pEmisorNombre;
    this.cuotasComponent.lregistros[lIndiceExtracto].instrumento = this.inversionesServicios.pInstrumentoNombre;
    this.cuotasComponent.lregistros[lIndiceExtracto].valornominal = this.inversionesServicios.pValorNominal;
    this.cuotasComponent.lregistros[lIndiceExtracto].interesbasadoenvalornominal = this.inversionesServicios.pInteresInversion;
    this.cuotasComponent.lregistros[lIndiceExtracto].fvencimiento = this.inversionesServicios.pFVencimientoNum;
    this.cuotasComponent.lregistros[lIndiceExtracto].cinversion = this.inversionesServicios.pCinversion;

    this.cuotasComponent.lregistros[lIndiceExtracto].tabamo_valorcancelado = this.inversionesServicios.pTotalapagar;

    this.cuotasComponent.lregistros[lIndiceExtracto].comentariomoradev = this.inversionesServicios.pComentariosDevolucion;

    let lregistroEliminar: any = [];

    let lregistroEliminarSubindice: number = 0;

    let lblnControl: boolean = true;

    for (const i in this.rqMantenimiento.lregistrosTmp) {
      if (this.rqMantenimiento.lregistrosTmp.hasOwnProperty(i)) {

        if (this.rqMantenimiento.lregistrosTmp[i].tabamo_fechavencimiento != undefined
          && this.rqMantenimiento.lregistrosTmp[i].tabamo_fechavencimiento > 0) {
          lregistroEliminar[lregistroEliminarSubindice] = i;
          lregistroEliminarSubindice++;
        }
      }
    }

    for (const j in lregistroEliminar) {
      lregistroEliminarSubindice = lregistroEliminarSubindice - 1;
      this.rqMantenimiento.lregistrosTmp.splice(lregistroEliminar[lregistroEliminarSubindice], 1);
    }

    this.cuotasComponent.limpiar();
  }

  obtenerPlantillaContable() {
    const rqConsulta: any = new Object();
    rqConsulta.CODIGOCONSULTA = 'INVERSION';
    rqConsulta.inversion = 7;

    rqConsulta.noGenerarPlantillasContables = true;

    this.dtoServicios.ejecutarConsultaRest(rqConsulta)
      .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false);
          if (resp.cod !== 'OK') {
            return;
          }

          this.inversionesServicios.pPlantillaContable = resp.PLANTILLACONTABLE;
          this.inversionesServicios.pPlantillaContableAgente = resp.PLANTILLACONTABLEAGENTE;
          this.inversionesServicios.pAmbiente = resp.AMBIENTE;

        },
        error => {
          this.dtoServicios.manejoError(error);
        });



  }

  private guardarRentaVariable() {

    this.lregistros = []
    for (const i in this.inversionesServicios.plregistro) {
      if (this.inversionesServicios.plregistro.hasOwnProperty(i)) {

        super.crearNuevo();

        this.lregistros.push({
          cinversion: this.inversionesServicios.pCinversion
        });

        let j: number = this.lregistros.length - 1;


        this.lregistros[j].actualizar = false;
        this.lregistros[j].esnuevo = true;

        this.lregistros[j].procesoccatalogo = 1220;
        this.lregistros[j].procesocdetalle = this.inversionesServicios.pcRECUPERACION;
        this.lregistros[j].rubroccatalogo = 1219;
        this.lregistros[j].rubrocdetalle = this.inversionesServicios.plregistro[i].rubrocdetalle;

        this.lregistros[j].idreg = Math.floor((Math.random() * 100000) + 1);

        this.lregistros[j].valor = this.inversionesServicios.plregistro[i].valor;
        this.lregistros[j].ccuenta = this.inversionesServicios.plregistro[i].ccuenta;
        this.lregistros[j].debito = this.inversionesServicios.plregistro[i].valordebe != 0 ? true : false;
        this.lregistros[j].fingreso = this.fecha;
        this.lregistros[j].cusuarioing = this.dtoServicios.mradicacion.cusuario;

      }
    }


    this.crearDtoMantenimiento();

    super.grabar();

    this.limpiarAplicacion();


  }

  private manejaRespuestaCatalogos(resp: any) {
    if (resp.cod === 'OK') {

      this.llenaListaCatalogo(this.lBanco, resp.BANCO, 'cdetalle');

    }
    this.lconsulta = [];
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

    const mfiltrosBanco: any = { 'ccatalogo': 1224 };
    const consultaBanco = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosBanco, {});
    consultaBanco.cantidad = 50;
    this.addConsultaPorAlias('BANCO', consultaBanco);

  }

  llenarEstado() {
    this.lestado = [];
    this.lestado.push({ label: '...', value: null });
    this.lestado.push({ label: 'TODOS', value: 'TODOS' });
    this.lestado.push({ label: 'DEVUELTOS', value: 'DEV' });
  }


  /*
  mostrarLovInversiones(): void {
    this.lovInversiones.mfiltros.tasaclasificacioncdetalle = "FIJA";
    this.lovInversiones.mfiltrosesp.estadocdetalle = " in ('APR') ";
    this.lovInversiones.showDialog();
  }

  fijarLovInversionesSelec(reg: any): void {

    this.mcampos.fvencimiento = null;

    if (reg.registro !== undefined) {

      this.msgs = [];
      this.mcampos.cinversion = reg.registro.cinversion;
      this.mcampos.codigotitulo = reg.registro.codigotitulo;

      this.consultar();

    }

  }

  */

  private totalizar()
  {
    this.inversionesServicios.pSubtotal = 0;
    if (!this.estaVacio(this.inversionesServicios.pCapital) && this.inversionesServicios.pCapital != 0) this.inversionesServicios.pSubtotal = Number(this.inversionesServicios.pCapital);
    if (!this.estaVacio(this.inversionesServicios.pInteres) && this.inversionesServicios.pInteres != 0) this.inversionesServicios.pSubtotal = this.inversionesServicios.pSubtotal + Number(this.inversionesServicios.pInteres);
    //if (!this.estaVacio(this.inversionesServicios.pMora) && this.inversionesServicios.pMora != 0) this.inversionesServicios.pSubtotal = this.inversionesServicios.pSubtotal + Number(this.inversionesServicios.pMora);
  }

  private obtenerDiferencia()
  {

    let lCuotaDividento: number = 0;

    if (!this.estaVacio(this.inversionesServicios.pCapital) && this.inversionesServicios.pCapital != 0) lCuotaDividento = Number(this.inversionesServicios.pCapital);

    if (!this.estaVacio(this.inversionesServicios.pInteres) && this.inversionesServicios.pInteres != 0) lCuotaDividento = lCuotaDividento + Number(this.inversionesServicios.pInteres);

    let lValorCancelado: number = 0;

    if (!this.estaVacio(this.inversionesServicios.pTotalapagar) && this.inversionesServicios.pTotalapagar != 0) lValorCancelado = this.inversionesServicios.pTotalapagar;

    this.inversionesServicios.pDiferencia = lValorCancelado - lCuotaDividento;

  }

}
