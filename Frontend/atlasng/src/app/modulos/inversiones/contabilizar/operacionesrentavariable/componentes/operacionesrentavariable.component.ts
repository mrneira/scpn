
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { InversionesServicios } from './../../../servicios/_invservicios.service';

@Component({
  selector: 'app-operacionesrentavariable',
  templateUrl: 'operacionesrentavariable.html',
  providers: [InversionesServicios]
})
export class OperacionesrentavariableComponent extends BaseComponent implements OnInit, AfterViewInit {


  @ViewChild('formFiltros') formFiltros: NgForm;

  fecha = new Date();

  private mEmisorNombre = null;
  private mInstrumentoNombre = null;
  private mCinversion = null;
  private mMensaje = null;
  private mbancocdetalle: string = null;

  constructor(router: Router, dtoServicios: DtoServicios, private confirmationService: ConfirmationService, private inversionesServicios: InversionesServicios) {
    
    super(router, dtoServicios, 'tinvinversionrentavariable', 'CONTABILIZARENTAVAR', false, false);
    
    this.componentehijo = this;
  }

  ngOnInit() {
    this.limpiar();
    super.init(this.formFiltros);
    this.consultar();
  }

  ngAfterViewInit() {
  }

  cancelar() {
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cinversion', {}, this.mfiltrosesp);

    consulta.addSubqueryPorSentencia('select j.nombre from tinvinversion i inner join tgencatalogodetalle j on i.emisorccatalogo = j.ccatalogo and i.emisorcdetalle = j.cdetalle where i.cinversion = t.cinversion', 'nEmisor');
    consulta.addSubqueryPorSentencia('select j.nombre from tinvinversion i inner join tgencatalogodetalle j on i.instrumentoccatalogo = j.ccatalogo and i.instrumentocdetalle = j.cdetalle where i.cinversion = t.cinversion', 'nInstrumento');
    consulta.addSubquery('tinvinversion', 'fcompra', 'fcompra', 't.cinversion = i.cinversion');

    consulta.cantidad = 1000000;

    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {

    this.mfiltrosesp.estadocdetalle = ' in (\'PEN\')' + ' ';;

  }


  validaFiltrosConsulta(): boolean {
    return true;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);

  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {

    this.limpiaComprobante();

    if (this.estaVacio(this.mCinversion))
    {
      this.mostrarMensajeError("SELECCIONE UN PAGO");
      return;
    }

    if (!this.estaVacio(this.mcampos.ccomprobante)) {
      this.mostrarMensajeError('ESTA INVERSIÓN YA HA SIDO CONTABILIZADA');
      return;
    }

    this.encerarMensajes();

    this.confirmationService.confirm({
      message: 'Está seguro de aprobar el pago?',
      header: 'Confirmación',
      icon: 'fa fa-question-circle',
      accept: () => {

        let lPagoEnEfectivo = 0;

        let lPagoAcciones = 0;

        let lTotal = 0;

        if (!this.estaVacio(this.inversionesServicios.pPreciocompra) && Number(this.inversionesServicios.pPreciocompra) != 0) lPagoEnEfectivo = Number(this.inversionesServicios.pPreciocompra);

        if (!this.estaVacio(this.inversionesServicios.pPreciounitarioaccion) && Number(this.inversionesServicios.pPreciounitarioaccion) && !this.estaVacio(this.inversionesServicios.pNumeroacciones) && Number(this.inversionesServicios.pNumeroacciones) != 0) 
          lPagoAcciones = this.redondear(Number(this.inversionesServicios.pPreciounitarioaccion) * Number(this.inversionesServicios.pNumeroacciones),2);

        lTotal = lPagoEnEfectivo + lPagoAcciones;

        let lContabiliza: any = [];

        lContabiliza.push({ rubrocdetalle: 'BANCOS', valor: lPagoEnEfectivo, debito: true, procesocdetalle: 'RECUP' });

        lContabiliza.push({ rubrocdetalle: 'CAP', valor: lPagoAcciones, debito: true, procesocdetalle: 'RECUP' });

        lContabiliza.push({ rubrocdetalle: 'ING', valor: lTotal, debito: false, procesocdetalle: 'RECUP' });

        lContabiliza.push({ rubrocdetalle: 'CTORDE', valor: lTotal, debito: true });
        lContabiliza.push({ rubrocdetalle: 'CTORAC', valor: lTotal, debito: false });

        this.rqMantenimiento.contabilizar = true;
        this.rqMantenimiento.procesocdetalle = 'RECUP';
        this.rqMantenimiento.cinversion = this.mCinversion;
        this.rqMantenimiento.cinversionrentavariable = this.registro.cinversionrentavariable;
        this.rqMantenimiento.lregistroContabilidad = lContabiliza;
        this.rqMantenimiento.bancoforzar = this.mbancocdetalle;
        this.rqMantenimiento.efectivoExterior = lPagoEnEfectivo;

        //this.sumavalornominal


        super.grabar();
        this.limpiar();
      },
      reject: () => {
      }
    });

  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);

    if (resp.ccomprobante != undefined) {
      this.mcampos.ccomprobante = resp.ccomprobante;
      this.mcampos.numerocomprobantecesantia = resp.numerocomprobantecesantia;
    }
  }

  limpiaComprobante() {
    this.mcampos.ccomprobante = null;
    this.mcampos.numerocomprobantecesantia = null;

  }


  edit(row: any, index: number) {

    if (!this.estaVacio(this.mCinversion) && Number(this.mCinversion) > 0) {
      this.mostrarMensajeError("YA EXISTE UN PAGO EN PROCESO");
      return;
    }

    this.limpiaComprobante();

    this.encerarMensajes();

    this.mEmisorNombre = row.mdatos.nEmisor;
    this.mInstrumentoNombre = row.mdatos.nInstrumento;
    this.mCinversion = row.cinversion;

    this.inversionesServicios.pFemision = row.mdatos.fcompra;
    this.inversionesServicios.pPreciocompra = row.pagoefectivo;
    this.inversionesServicios.pPreciounitarioaccion = row.pagoaccionespreciounitario;
    this.inversionesServicios.pNumeroacciones = row.pagoaccionesnumeroacciones;
    this.inversionesServicios.pValoracciones = row.pagoaccionesmontototal;
    this.mbancocdetalle = row.bancocdetalle;

    this.lregistros.splice(index, 1);


  }

  cancelarPago() {


    this.encerarMensajes();

    let lIndiceExtracto = this.lregistros.length;

    this.lregistros.push({

      cinversion: this.mCinversion

    });

/*
    this.inversionesServicios.pFemision = row.mdatos.fcompra;
    this.inversionesServicios.pPreciocompra = row.pagoefectivo;
    this.inversionesServicios.pPreciounitarioaccion = row.pagoaccionespreciounitario;
    this.inversionesServicios.pNumeroacciones = row.pagoaccionesnumeroacciones;
    this.inversionesServicios.pValoracciones = row.pagoaccionesmontototal;
    this.mbancocdetalle = row.bancocdetalle;


*/

    this.lregistros[lIndiceExtracto] = [];

    this.lregistros[lIndiceExtracto].optlock = 0;
    this.lregistros[lIndiceExtracto].cinversion = this.mCinversion;

    this.lregistros[lIndiceExtracto].pagoaccionesmontototal = this.inversionesServicios.pValoracciones;
    this.lregistros[lIndiceExtracto].pagoefectivo = this.inversionesServicios.pPreciocompra;

    this.lregistros[lIndiceExtracto].pagoaccionespreciounitario = this.inversionesServicios.pPreciounitarioaccion;

    this.lregistros[lIndiceExtracto].pagoaccionesnumeroacciones = this.inversionesServicios.pNumeroacciones;

    this.lregistros[lIndiceExtracto].mdatos = [];

    this.lregistros[lIndiceExtracto].mdatos.nEmisor = this.mEmisorNombre;
    this.lregistros[lIndiceExtracto].mdatos.nInstrumento = this.mInstrumentoNombre;
    this.lregistros[lIndiceExtracto].mdatos.fcompra = this.inversionesServicios.pFemision;

    this.limpiar();
  }

  limpiar() {
    this.mEmisorNombre = null;
    this.mInstrumentoNombre = null;
    this.mCinversion = null;
    this.mMensaje = null;

    this.inversionesServicios.pFemision = null;
    this.inversionesServicios.pValoracciones = null;
    this.inversionesServicios.pPreciocompra = null;
    this.inversionesServicios.pPreciounitarioaccion = null;
    this.inversionesServicios.pNumeroacciones = null;
    this.inversionesServicios.pPorcentajeparticipacioncupon = null;


  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);


  }


}
