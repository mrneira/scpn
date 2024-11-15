
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
import { LovComentariosComponent } from '../../../../inversiones/lov/comentarios/componentes/lov.comentarios.component';

@Component({
  selector: 'app-operacionesrentafija',
  templateUrl: 'operacionesrentafija.html',
  providers: [InversionesServicios]
})
export class OperacionesrentafijaComponent extends BaseComponent implements OnInit, AfterViewInit {


  @ViewChild('formFiltros') formFiltros: NgForm;

  fecha = new Date();

  private mCinvtablaamortizacion = null;
  private mFinicioNum = null;
  private mPlazo = null;
  private mFVencimientoDividendo = null;
  private mCapital = null;
  private mValorCancelado: number = null;
  private mMora = null;
  private mSubtotal = null;
  private mEmisorNombre = null;
  private mInstrumentoNombre = null;
  private mValorNominal = null;
  private mInteres = null;
  private mFVencimientoNum = null;
  private mCinversion = null;
  private mMensaje = null;
  private mInteresInversion = null;
  private mComentario: string = null;
  private mComentarioIngreso: string = null;
  private mDiferencia: number = null;
  public  mcapitalproyectado:number=null;
  public  minteresproyectado:number=null;

  @ViewChild(LovComentariosComponent) private lovComentarios: LovComentariosComponent;

  
  constructor(router: Router, dtoServicios: DtoServicios, private confirmationService: ConfirmationService, private inversionesServicios: InversionesServicios) {
    super(router, dtoServicios, 'tinvtablaamortizacion', 'CONTABILIZARENTAFIJA', false, false);
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

    this.mfiltros.estadocdetalle = 'ENVAPR';

    const consulta = new Consulta(this.entityBean, 'Y', 't.fvencimiento DESC', this.mfiltros, this.mfiltrosesp);
    consulta.cantidad = 1000000;
    consulta.addSubqueryPorSentencia('select  isnull(j.proyeccioncapital,0) + isnull(j.proyeccioninteres,0) + isnull(j.valormora,0) from tinvtablaamortizacion j where t.cinvtablaamortizacion = j.cinvtablaamortizacion', 'nsubtotal');
    consulta.addSubqueryPorSentencia('select i.nombre from tinvinversion j inner join tgencatalogodetalle i on j.emisorccatalogo = i.ccatalogo and j.emisorcdetalle = i.cdetalle where j.cinversion = t.cinversion', 'nEmisor');
    consulta.addSubqueryPorSentencia('select i.nombre from tinvinversion j inner join tgencatalogodetalle i on j.instrumentoccatalogo = i.ccatalogo and j.instrumentocdetalle = i.cdetalle where j.cinversion = t.cinversion', 'nInstrumento');
    consulta.addSubquery('tinvinversion', 'valornominal', 'nValornominal', 'i.cinversion = t.cinversion');
    consulta.addSubqueryPorSentencia('select isnull(sum(j.interesimplicito),sum(j.proyeccioninteres)) from tinvtablaamortizacion j where t.cinversion = j.cinversion', 'nInteres');
    consulta.addSubqueryPorSentencia('select isnull(sum(j.capitalxamortizar),0) from tinvtablaamortizacion j where t.cinversion = j.cinversion', 'ncapitalamortizado');
    consulta.addSubqueryPorSentencia('select isnull(sum(j.proyeccioninteres),0) from tinvtablaamortizacion j where t.cinversion = j.cinversion', 'ninteresimplicito');
   
    consulta.addSubquery('tinvinversion', 'fvencimiento', 'nFvencimiento', 'i.cinversion = t.cinversion');
    consulta.addSubquery('tinvtablaamortizacion', 'comentariosingreso', 'nComentarioIngreso', 'i.cinvtablaamortizacion = t.cinvtablaamortizacion');
    consulta.addSubqueryPorSentencia("select case when i.calendarizacioncdetalle = '360' and isnull(j.clegal,'') = 'OBLIGA' and t.plazo < 370 then case when t.plazo between 23 and 39 then 30 when t.plazo between 53 and 69 then 60 when t.plazo between 83 and 99 then 90 when t.plazo between 113 and 129 then 120 when t.plazo between 143 and 159 then 150 when t.plazo between 173 and 189 then 180 when t.plazo between 203 and 219 then 210 when t.plazo between 233 and 249 then 240 when t.plazo between 263 and 279 then 270 when t.plazo between 293 and 309 then 300 when t.plazo between 323 and 339 then 330 when t.plazo between 353 and 369 then 360 else t.plazo end when isnull(j.clegal,'') = 'CDP' then i.plazo else case when i.calendarizacioncdetalle = '360' then dbo.sp_InvConRestaDias360(cast(str(t.finicio,8) as date), cast(str(t.fvencimiento,8) as date)) else t.plazo end end from tinvinversion i inner join tgencatalogodetalle j on j.ccatalogo = i.instrumentoccatalogo and j.cdetalle = i.instrumentocdetalle where i.cinversion = t.cinversion", 'nPlazo360');

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

    if (this.estaVacio(this.mCinvtablaamortizacion))
    {
      this.mostrarMensajeError("SELECCIONE UN PAGO");
      return;
    }

    if (!this.estaVacio(this.mcampos.ccomprobante)) {
      this.mostrarMensajeError('ESTA INVERSIÓN YA HA SIDO CONTABILIZADA');
      return;
    }

    if (this.estaVacio(this.mComentario)) {
      this.mostrarMensajeError('INGRESE EL COMENTARIO PARA LA APROBACIÓN');
      return;
    }



    this.encerarMensajes();

    this.confirmationService.confirm({
      message: 'Está seguro de aprobar el pago?',
      header: 'Confirmación',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.rqMantenimiento.contabilizar = true;
        this.rqMantenimiento.procesocdetalle = 'RECUP';
        this.rqMantenimiento.cinversion = this.mCinversion;
        this.rqMantenimiento.cinvtablaamortizacion = this.mCinvtablaamortizacion;
        this.rqMantenimiento.comentario = this.mComentario;
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

    if (!this.estaVacio(this.mCinvtablaamortizacion) && Number(this.mCinvtablaamortizacion) > 0) {
      this.mostrarMensajeError("YA EXISTE UN PAGO EN PROCESO");
      return;
    }

    this.limpiaComprobante();

    this.encerarMensajes();

    this.mCapital = row.proyeccioncapital-row.diferenciainteresimplicito;
    this.mValorCancelado = row.valorcancelado;
    this.mInteres = this.estaVacio(row.interesimplicito)?row.proyeccioninteres:row.interesimplicito;
    this.mCinvtablaamortizacion = row.cinvtablaamortizacion;
    this.mFinicioNum = row.finicio;
    this.mPlazo = row.plazo;
    this.mFVencimientoDividendo = row.fvencimiento;
    this.mMora = row.valormora;
    this.mSubtotal = row.mdatos.nsubtotal;
    this.mEmisorNombre = row.mdatos.nEmisor;
    this.mInstrumentoNombre = row.mdatos.nInstrumento;
    this.mValorNominal = row.mdatos.nValornominal;
    this.mInteresInversion = row.mdatos.nInteres;
    this.mFVencimientoNum = row.mdatos.nFvencimiento;
    this.mCinversion = row.cinversion;
    this.mComentarioIngreso = row.mdatos.nComentarioIngreso
    this.mcapitalproyectado=row.proyeccioncapital;
    this.minteresproyectado=row.proyeccioninteres;
    
    //this.mPlazo = row.mdatos.nPlazo360;

    this.diferencia();

    this.lregistros.splice(index, 1);


  }

  cancelarPago() {


    this.encerarMensajes();

    let lIndiceExtracto = this.lregistros.length;

    this.lregistros.push({

      cinvtablaamortizacion: this.mCinvtablaamortizacion

    });

    this.lregistros[lIndiceExtracto] = [];

    this.lregistros[lIndiceExtracto].cinvtablaamortizacion =  this.mCinvtablaamortizacion;
    this.lregistros[lIndiceExtracto].optlock = 0;
    this.lregistros[lIndiceExtracto].proyeccioncapital = this.mCapital;
    this.lregistros[lIndiceExtracto].valorcancelado = this.mValorCancelado;

    this.lregistros[lIndiceExtracto].proyeccioninteres = this.mInteres;
    this.lregistros[lIndiceExtracto].finicio = this.mFinicioNum;

    this.lregistros[lIndiceExtracto].fvencimiento = this.mFVencimientoDividendo;
    this.lregistros[lIndiceExtracto].valormora = this.mMora;
    this.lregistros[lIndiceExtracto].cinversion = this.mCinversion;

    this.lregistros[lIndiceExtracto].mdatos = [];

    this.lregistros[lIndiceExtracto].mdatos.nsubtotal = this.mSubtotal;
    this.lregistros[lIndiceExtracto].mdatos.nEmisor = this.mEmisorNombre;
    this.lregistros[lIndiceExtracto].mdatos.nInstrumento = this.mInstrumentoNombre;
    this.lregistros[lIndiceExtracto].mdatos.nValornominal = this.mValorNominal;
    this.lregistros[lIndiceExtracto].mdatos.nInteres = this.mInteresInversion;
    this.lregistros[lIndiceExtracto].mdatos.nFvencimiento = this.mFVencimientoNum;
    this.lregistros[lIndiceExtracto].mdatos.nComentarioIngreso = this.mComentarioIngreso;

    this.lregistros[lIndiceExtracto].mdatos.nPlazo360 = this.mPlazo;

        
    

    this.limpiar();
  }

  limpiar() {
    this.mCinvtablaamortizacion = null;
    this.mFinicioNum = null;
    this.mPlazo = null;
    this.mFVencimientoDividendo = null;
    this.mCapital = null;
    this.mValorCancelado = null;
    this.mMora = null;
    this.mDiferencia = null;
    this.mSubtotal = null;
    this.mEmisorNombre = null;
    this.mInstrumentoNombre = null;
    this.mValorNominal = null;
    this.mInteres = null;
    this.mFVencimientoNum = null;
    this.mCinversion = null;
    this.mMensaje = null;
    this.mInteresInversion = null;
    this.mComentario = null;
    this.mComentarioIngreso = null;
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
  

  devolverEjecuta(iestadocDetalle: string = "PEN") {
    this.confirmationService.confirm({
      message: 'Está seguro de devolver el pago?',
      header: 'Confirmación',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.rqMantenimiento.contabilizar = false;
        this.rqMantenimiento.cinvtablaamortizacion = this.mCinvtablaamortizacion;
        this.rqMantenimiento.comentario = this.inversionesServicios.pComentarios;
        super.grabar();
        this.limpiar();
        this.mostrarMensajeSuccess("PAGO A SIDO DEVUELTO EXITOSAMENTE");
      },
      reject: () => {
      }
    });



  }

  private diferencia(): number 
  {


    this.mDiferencia = 0;


    if (!this.estaVacio(this.mCapital) && this.mCapital != 0) this.mDiferencia = Number(this.mCapital);

    if (!this.estaVacio(this.mInteres) && this.mInteres != 0) this.mDiferencia = this.mDiferencia + Number(this.mInteres);

    if (!this.estaVacio(this.mValorCancelado) && this.mValorCancelado != 0) this.mDiferencia = Number(this.mValorCancelado) - this.mDiferencia;
    
    return this.mDiferencia;
  }

}
