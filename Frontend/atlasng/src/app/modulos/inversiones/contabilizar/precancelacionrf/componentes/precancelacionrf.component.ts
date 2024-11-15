
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
  selector: 'app-precancelacionrf',
  templateUrl: 'precancelacionrf.html',
  providers: [InversionesServicios]
})
export class PrecancelacionrfComponent extends BaseComponent implements OnInit, AfterViewInit {


  @ViewChild('formFiltros') formFiltros: NgForm;

  fecha = new Date();

  private mEmisorNombre = null;
  private mInstrumentoNombre = null;
  private mCinversion = null;
  private mMensaje = null;

  constructor(router: Router, dtoServicios: DtoServicios, private confirmationService: ConfirmationService, private inversionesServicios: InversionesServicios) {
    
    super(router, dtoServicios, 'tinvprecancelacion', 'PRECANCONRF', false, false);
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
    this.mfiltrosesp.cinversion="NOT IN (SELECT cinversion FROM tinvinversion WHERE estadocdetalle ='CAN')";
    const consulta = new Consulta(this.entityBean, 'Y', 't.cinversion', {}, this.mfiltrosesp);

    consulta.addSubqueryPorSentencia('select j.nombre from tinvinversion i inner join tgencatalogodetalle j on i.emisorccatalogo = j.ccatalogo and i.emisorcdetalle = j.cdetalle where i.cinversion = t.cinversion', 'nEmisor');
    consulta.addSubqueryPorSentencia('select j.nombre from tinvinversion i inner join tgencatalogodetalle j on i.instrumentoccatalogo = j.ccatalogo and i.instrumentocdetalle = j.cdetalle where i.cinversion = t.cinversion', 'nInstrumento');
    consulta.addSubquery('tinvinversion', 'fcompra', 'fcompra', 't.cinversion = i.cinversion');
    consulta.addSubquery("tinvinversion","valornominal","nValornominal","i.cinversion = t.cinversion");

    consulta.cantidad = 1000000;

    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {

    this.mfiltrosesp.estadocdetalle = ' in (\'ING\')' + ' ';

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
      this.mostrarMensajeError('ESTA OPERACIÓN YA HA SIDO CONTABILIZADA');
      return;
    }

    this.encerarMensajes();

    this.confirmationService.confirm({
      message: 'Está seguro de aprobar la Operación?',
      header: 'Confirmación',
      icon: 'fa fa-question-circle',
      accept: () => {

        let lTotal: number = 0;

        if (!this.estaVacio(this.inversionesServicios.pCapital) && Number(this.inversionesServicios.pCapital) != 0) lTotal = Number(this.inversionesServicios.pCapital);
        if (!this.estaVacio(this.inversionesServicios.pInteres) && Number(this.inversionesServicios.pInteres) != 0) lTotal = lTotal + Number(this.inversionesServicios.pInteres);
        if (!this.estaVacio(this.inversionesServicios.pMora) && Number(this.inversionesServicios.pMora) != 0) lTotal = lTotal + Number(this.inversionesServicios.pMora);

        let lContabiliza: any = [];
        lContabiliza.push({ rubrocdetalle: 'BANCOS', valor: lTotal, debito: true, procesocdetalle: 'RECUP' });

        if (!this.estaVacio(this.inversionesServicios.pCapital) && Number(this.inversionesServicios.pCapital) != 0) lContabiliza.push({ rubrocdetalle: 'CAP', valor: this.inversionesServicios.pCapital, debito: false, procesocdetalle: 'RECUP' });
        if (!this.estaVacio(this.inversionesServicios.pInteres) && Number(this.inversionesServicios.pInteres) != 0) lContabiliza.push({ rubrocdetalle: 'INT', valor: this.inversionesServicios.pInteres, debito: false, procesocdetalle: 'RECUP' });
        if (!this.estaVacio(this.inversionesServicios.pMora) && Number(this.inversionesServicios.pMora) != 0) lContabiliza.push({ rubrocdetalle: 'ING', valor: this.inversionesServicios.pMora, debito: false, procesocdetalle: 'RECUP' });

        this.rqMantenimiento.contabilizar = true;
        this.rqMantenimiento.procesocdetalle = 'PRECAN';
        this.rqMantenimiento.cinversion = this.mCinversion;
        this.rqMantenimiento.cinvprecancelacion = this.registro.cinvprecancelacion;
        this.rqMantenimiento.lregistroContabilidad = lContabiliza;
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
    this.inversionesServicios.pValorNominal = row.mdatos.nValornominal;
    this.inversionesServicios.pCapital = this.redondear(row.capital,2);
    this.inversionesServicios.pInteres = this.redondear(row.interes,2);
    this.inversionesServicios.pMora = this.redondear(row.mora,2);

    this.inversionesServicios.pSubtotal = !this.estaVacio(this.inversionesServicios.pCapital) && Number(this.inversionesServicios.pCapital) != 0 ? Number(this.inversionesServicios.pCapital) : 0;
    if (!this.estaVacio(this.inversionesServicios.pInteres) && Number(this.inversionesServicios.pInteres) != 0) this.inversionesServicios.pSubtotal = this.inversionesServicios.pSubtotal + Number(this.inversionesServicios.pInteres);
    if (!this.estaVacio(this.inversionesServicios.pMora) && Number(this.inversionesServicios.pMora) != 0) this.inversionesServicios.pSubtotal = this.inversionesServicios.pSubtotal + Number(this.inversionesServicios.pMora);

    this.lregistros.splice(index, 1);

  }

  cancelarPago() {


    this.encerarMensajes();

    let lIndiceExtracto = this.lregistros.length;

    this.lregistros.push({

      cinversion: this.mCinversion

    });

    this.lregistros[lIndiceExtracto] = [];

    this.lregistros[lIndiceExtracto].optlock = 0;
    this.lregistros[lIndiceExtracto].cinversion = this.mCinversion;


    this.lregistros[lIndiceExtracto].mdatos = [];
    this.lregistros[lIndiceExtracto].mdatos.nValornominal = this.inversionesServicios.pValorNominal;
    this.lregistros[lIndiceExtracto].capital = this.inversionesServicios.pCapital;
    this.lregistros[lIndiceExtracto].interes = this.inversionesServicios.pInteres;
    this.lregistros[lIndiceExtracto].mora = this.inversionesServicios.pMora

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
    this.inversionesServicios.pValorNominal = null;
    this.inversionesServicios.pCapital = null;
    this.inversionesServicios.pInteres = null;
    this.inversionesServicios.pMora = null;
    this.inversionesServicios.pSubtotal = null;

  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);

  }

}
