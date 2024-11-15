
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
  selector: 'app-ventaacciones',
  templateUrl: 'ventaacciones.html',
  providers: [InversionesServicios]
})
export class VentaaccionesComponent extends BaseComponent implements OnInit, AfterViewInit {


  @ViewChild('formFiltros') formFiltros: NgForm;

  fecha = new Date();

  private mEmisorNombre = null;
  private mInstrumentoNombre = null;
  private mCinversion = null;
  private mMensaje = null;

  constructor(router: Router, dtoServicios: DtoServicios, private confirmationService: ConfirmationService, private inversionesServicios: InversionesServicios) {
    
    super(router, dtoServicios, 'tinvventaacciones', 'CONTABVENTAACC', false, false);
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

        let lTotal: number = 0;

        if (!this.estaVacio(this.registro.montototal) && Number(this.registro.montototal) != 0) lTotal = Number(this.registro.montototal);

        let lContabiliza: any = [];

        lContabiliza.push({ rubrocdetalle: 'BANCOS', valor: lTotal, debito: true, procesocdetalle: 'RECUP' });
        lContabiliza.push({ rubrocdetalle: 'INT', valor: lTotal, debito: false, procesocdetalle: 'RECUP' });

        this.rqMantenimiento.contabilizar = true;
        this.rqMantenimiento.procesocdetalle = 'VENACC';
        this.rqMantenimiento.cinversion = this.mCinversion;
        this.rqMantenimiento.cinvventaaccion = this.registro.cinvventaaccion;
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
    this.inversionesServicios.pValordividendospagados = row.montototal;

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

    this.lregistros[lIndiceExtracto].montototal = this.inversionesServicios.pValordividendospagados;

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
    this.inversionesServicios.pValordividendospagados = null;

  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);

  }

}
