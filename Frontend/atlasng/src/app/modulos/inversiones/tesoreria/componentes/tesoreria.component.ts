
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { InversionesServicios } from './../../servicios/_invservicios.service';
import { LovComentariosComponent } from '../../../inversiones/lov/comentarios/componentes/lov.comentarios.component';


@Component({
  selector: 'app-tesoreria',
  templateUrl: 'tesoreria.html',
  providers: [InversionesServicios]
})
export class TesoreriaComponent 
  extends BaseComponent implements OnInit, AfterViewInit {

  
  @ViewChild('formFiltros') formFiltros: NgForm;



  fecha = new Date();

  private mCinvtablaamortizacion = null;
  private mFinicioNum = null;
  private mPlazo = null;
  private mFVencimientoDividendo = null;
  private mcomisionBolsa = null;
  private mcomisionOperador = null;
  private mRetencion = null;
  private mMora = null;
  private mSubtotal = null;
  private mEmisorNombre = null;
  private mInstrumentoNombre = null;
  private mValorEfectivo = null;
  private mInteres = null;
  private mFEmisionNum = null;
  private mCinversion = null;
  private mMensaje = null;
  private mInteresInversion = null;
  private mComentario: string = null;
  private mComentarioPago: string = null;

  @ViewChild(LovComentariosComponent) private lovComentarios: LovComentariosComponent;


  constructor(router: Router, dtoServicios: DtoServicios, private confirmationService: ConfirmationService, private inversionesServicios: InversionesServicios) {
    super(router, dtoServicios, 'tinvinversion', 'TESORERIA', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
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
    this.mfiltros.estadocdetalle = 'ENVPAG';
    const consulta = new Consulta(this.entityBean, 'Y', 't.femision DESC', this.mfiltros, {});
    consulta.cantidad = 1000000;
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nEmisor', 'i.ccatalogo = t.emisorccatalogo AND i.cdetalle = t.emisorcdetalle ');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nInstrumento', 'i.ccatalogo = t.instrumentoccatalogo AND i.cdetalle = t.instrumentocdetalle ');

    consulta.addSubqueryPorSentencia('select isnull(i.valorefectivo,0) + isnull(i.interestranscurrido,0) from tinvinversion i where t.cinversion = i.cinversion', 'nsubtotal');
    consulta.addSubqueryPorSentencia('select round(ISNULL(i.comisionbolsavalores,0),2) from tinvinversion i where t.cinversion = i.cinversion', 'ncbolsa');

    consulta.addSubqueryPorSentencia('select round(ISNULL(i.comisionoperador,0),2) from tinvinversion i where t.cinversion = i.cinversion', 'ncoperador');

    consulta.addSubqueryPorSentencia('select round(ISNULL(i.comisionretencion,0),2) from tinvinversion i where t.cinversion = i.cinversion', 'nretencion');
    this.addConsulta(consulta);
    return consulta;
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

    if (this.estaVacio(this.mCinversion)) {
      this.mostrarMensajeError("SELECCIONE UNA INVERSIÓN");
      return;
    }

    if (!this.estaVacio(this.mcampos.ccomprobante)) {
      this.mostrarMensajeError('ESTA INVERSIÓN YA HA SIDO CONTABILIZADA');
      return;
    }

    if (this.estaVacio(this.mComentario)) {
      this.mostrarMensajeError('INGRESE EL COMENTARIO PARA REALIZAR EL PAGO');
      return;
    }

    this.encerarMensajes();

    this.confirmationService.confirm({
      message: 'Está seguro de realizar el pago?',
      header: 'Confirmación',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.rqMantenimiento.estadocdetalle = 'PAG';
        this.rqMantenimiento.cinversion = this.mCinversion;
        
        this.rqMantenimiento.comentario = this.mComentario;
        super.grabar();
        this.limpiar();
        this.mostrarMensajeSuccess("INVERSIÓN HA SIDO PAGADA EXITOSAMENTE");
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

    if (!this.estaVacio(this.mCinvtablaamortizacion) && Number(this.mCinvtablaamortizacion) > 0) {
      this.mostrarMensajeError("YA EXISTE UN PAGO EN PROCESO");
      return;
    }

    this.limpiaComprobante();

    this.encerarMensajes();

    this.mEmisorNombre = row.mdatos.nEmisor;
    this.mInstrumentoNombre = row.mdatos.nInstrumento;
    this.mFEmisionNum = row.femision;
    this.mValorEfectivo = row.valorefectivo;
    this.mSubtotal = row.mdatos.nsubtotal;
    this.mCinversion = row.cinversion;
    this.mComentarioPago = row.comentariospago;
    this.mInteresInversion = row.interestranscurrido;


    this.mcomisionBolsa = row.mdatos.ncbolsa;
    this.mcomisionOperador = row.mdatos.ncoperador;
    this.mRetencion = row.mdatos.nretencion;
    this.mInteres = row.proyeccioninteres;
    this.mCinvtablaamortizacion = row.cinvtablaamortizacion;
    this.mFinicioNum = row.finicio;




    this.lregistros.splice(index, 1);


  }

  cancelarPago() {


    this.encerarMensajes();

    let lIndiceExtracto = this.lregistros.length;

    this.lregistros.push({

      cinvtablaamortizacion: this.mCinvtablaamortizacion

    });

    this.lregistros[lIndiceExtracto] = [];

    this.lregistros[lIndiceExtracto].cinvtablaamortizacion = this.mCinvtablaamortizacion;
    this.lregistros[lIndiceExtracto].optlock = 0;
    this.lregistros[lIndiceExtracto].proyeccioninteres = this.mInteres;
    this.lregistros[lIndiceExtracto].finicio = this.mFinicioNum;
    this.lregistros[lIndiceExtracto].plazo = this.mPlazo;
    this.lregistros[lIndiceExtracto].fvencimiento = this.mFVencimientoDividendo;
    this.lregistros[lIndiceExtracto].cinversion = this.mCinversion;
    this.lregistros[lIndiceExtracto].valorefectivo = this.mValorEfectivo;
    this.lregistros[lIndiceExtracto].interestranscurrido = this.mInteresInversion;
    this.lregistros[lIndiceExtracto].femision = this.mFEmisionNum;

    this.lregistros[lIndiceExtracto].comentariospago = this.mComentarioPago;

    this.lregistros[lIndiceExtracto].mdatos = [];
    this.lregistros[lIndiceExtracto].mdatos.nsubtotal = this.mSubtotal;

    this.lregistros[lIndiceExtracto].mdatos.ncbolsa = this.mcomisionBolsa;
    this.lregistros[lIndiceExtracto].mdatos.ncoperador = this.mcomisionOperador;
    this.lregistros[lIndiceExtracto].mdatos.nretencion = this.mRetencion;


    this.lregistros[lIndiceExtracto].mdatos.nEmisor = this.mEmisorNombre;
    this.lregistros[lIndiceExtracto].mdatos.nInstrumento = this.mInstrumentoNombre;
    



    this.limpiar();
  }

  limpiar() {
    this.mCinversion = null;
    this.mCinvtablaamortizacion = null;
    this.mFinicioNum = null;
    this.mPlazo = null;
    this.mFVencimientoDividendo = null;
    this.mcomisionBolsa = null;
    this.mcomisionOperador = null;
    this.mRetencion = null;
    this.mMora = null;
    this.mSubtotal = null;
    this.mEmisorNombre = null;
    this.mInstrumentoNombre = null;
    this.mValorEfectivo = null;
    this.mInteres = null;
    this.mFEmisionNum = null;
    this.mCinversion = null;
    this.mMensaje = null;
    this.mInteresInversion = null;
    this.mComentario = null;
    this.mComentarioPago = null;
  }


  enviar(istrEtiqueta: string = null) {

    let lEnviar: string = "";
    if (!this.estaVacio(istrEtiqueta)) {
      lEnviar = istrEtiqueta;
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
      this.devolverEjecuta();
    }
  }

  devolverEjecuta() {
    this.confirmationService.confirm({
      message: 'Está seguro de devolver el pago?',
      header: 'Confirmación',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.rqMantenimiento.estadocdetalle = 'ENVAPR';
        this.rqMantenimiento.cinversion = this.mCinversion;
        this.rqMantenimiento.comentario = this.inversionesServicios.pComentarios;
        super.grabar();
        this.limpiar();
        this.mostrarMensajeSuccess("PAGO A SIDO DEVUELTO EXITOSAMENTE");
      },
      reject: () => {
      }
    });
  }

  
}
