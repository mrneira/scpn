
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
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { InversiondetalleComponent } from '../submodulos/inversiondetalle/componentes/inversiondetalle.component';
import { ValoresRentaVariable } from './_valoresrentavariable.service';

@Component({
  selector: "app-rentavariable",
  templateUrl: "rentavariable.html",
  providers: [ValoresRentaVariable]
})
export class RentavariableComponent extends BaseComponent
  implements OnInit, AfterViewInit {
  @ViewChild("formFiltros") formFiltros: NgForm;

  private lInstrumento: any = [];
  @ViewChild(JasperComponent)

  public jasper: JasperComponent;

  @ViewChild(InstrumentoComponent)
  instrumentoComponent: InstrumentoComponent;

  @ViewChild(InversiondetalleComponent)
  inversiondetalleComponent: InversiondetalleComponent;

  @ViewChild(LovInversionesComponent) private lovInversiones: LovInversionesComponent;

  constructor(router: Router, dtoServicios: DtoServicios, private valoresRentaVariable: ValoresRentaVariable) {

    super(router, dtoServicios, "ABSTRACT", "RENTAVARIABLE", false);
  }

  ngOnInit() {
    this.lInstrumento.push({
      cinversion: 0
    });

    this.componentehijo = this;
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {


  }

  selectRegistro(registro: any) {
    // No existe para el padre
  }

  crearNuevo() {
    // No existe para el padre
  }

  actualizarEditable(ipEditable: number) {
    this.instrumentoComponent.pEditable = ipEditable;

    this.inversiondetalleComponent.pEditable = ipEditable;
  }

  actualizar() {
    this.actualizarEditable(2);
  }

  eliminar() {
    // No existe para el padre
  }

  // Inicia CONSULTA *********************
  consultar() {


    this.obtenerInversion();
    this.inversiondetalleComponent.mfiltros.cinversion = this.mcampos.cinversion;
    this.inversiondetalleComponent.consultar();

  }

  obtenerInversion() {
    const rqConsulta: any = new Object();
    rqConsulta.CODIGOCONSULTA = 'INVERSION';
    rqConsulta.inversion = 1;
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

        this.instrumentoComponent.registro.cinversion = lregistro[0].cinversion;
        this.instrumentoComponent.registro.codigotitulo = lregistro[0].codigotitulo;
        this.instrumentoComponent.registro.numerocontrato = lregistro[0].numerocontrato;
        this.instrumentoComponent.registro.tasaclasificacionccatalogo = lregistro[0].tasaclasificacionccatalogo;
        this.instrumentoComponent.registro.tasaclasificacioncdetalle = lregistro[0].tasaclasificacioncdetalle;
        this.instrumentoComponent.registro.ccomprobante = lregistro[0].ccomprobante;
        this.instrumentoComponent.registro.optlock = lregistro[0].optlock;
        this.instrumentoComponent.registro.fcolocacion = lregistro[0].nfcolocacion;
        this.instrumentoComponent.registro.fregistro = lregistro[0].nfregistro;
        this.instrumentoComponent.registro.femision = lregistro[0].nfemision;
        this.instrumentoComponent.registro.fvencimiento = lregistro[0].nfvencimiento;
        this.instrumentoComponent.registro.fultimopago = lregistro[0].nfultimopago;
        this.instrumentoComponent.registro.cinvagentebolsa = lregistro[0].cinvagentebolsa;
        this.instrumentoComponent.mcampos.cinvagentebolsa = lregistro[0].cinvagentebolsa;
        this.instrumentoComponent.mcampos.nombres = lregistro[0].nombresagente;

        this.instrumentoComponent.registro.valornominal = lregistro[0].valornominal;
        this.instrumentoComponent.registro.valornegociacion = lregistro[0].valornegociacion;
        this.instrumentoComponent.registro.valorefectivo = lregistro[0].valorefectivo;
        this.instrumentoComponent.registro.plazo = lregistro[0].plazo;
        this.instrumentoComponent.registro.tasa = lregistro[0].tasa;
        this.instrumentoComponent.registro.diasgraciacapital = lregistro[0].diasgraciacapital;
        this.instrumentoComponent.registro.diasgraciainteres = lregistro[0].diasgraciainteres;
        this.instrumentoComponent.registro.boletin = lregistro[0].boletin;
        this.instrumentoComponent.registro.cotizacion = lregistro[0].cotizacion;
        this.instrumentoComponent.registro.yield = lregistro[0].yield;
        this.instrumentoComponent.registro.comisionbolsavalores = lregistro[0].comisionbolsavalores;
        this.instrumentoComponent.registro.comisionoperador = lregistro[0].comisionoperador;
        this.instrumentoComponent.registro.comisionretencion = lregistro[0].comisionretencion;

        this.valoresRentaVariable.pComisionBolsa = lregistro[0].comisionbolsavalores;
        this.valoresRentaVariable.pComisionOperador = lregistro[0].comisionoperador;
        this.valoresRentaVariable.pRetencion = lregistro[0].comisionretencion;

        this.instrumentoComponent.registro.porcentajecalculoprecio = lregistro[0].porcentajecalculoprecio;
        this.instrumentoComponent.registro.porcentajecalculodescuento = lregistro[0].porcentajecalculodescuento;
        this.instrumentoComponent.registro.porcentajecalculorendimiento = lregistro[0].porcentajecalculorendimiento;

        this.instrumentoComponent.registro.interestranscurrido = lregistro[0].interestranscurrido;
        

        this.instrumentoComponent.registro.porcentajepreciocompra = lregistro[0].porcentajepreciocompra;
        this.instrumentoComponent.registro.preciounitarioaccion = lregistro[0].preciounitarioaccion;
        this.instrumentoComponent.registro.numeroacciones = lregistro[0].numeroacciones;
        this.instrumentoComponent.registro.valoracciones = lregistro[0].valoracciones;
        this.instrumentoComponent.registro.preciocompra = lregistro[0].preciocompra;
        this.instrumentoComponent.registro.valordividendospagados = lregistro[0].valordividendospagados;
        this.instrumentoComponent.registro.porcentajeparticipacioncupon = lregistro[0].porcentajeparticipacioncupon;
        this.instrumentoComponent.registro.tasainterescupon = lregistro[0].tasainterescupon;
        this.instrumentoComponent.registro.observaciones = lregistro[0].observaciones;
        this.instrumentoComponent.registro.bolsavaloresccatalogo = lregistro[0].bolsavaloresccatalogo;
        this.instrumentoComponent.registro.bolsavalorescdetalle = lregistro[0].bolsavalorescdetalle;
        this.instrumentoComponent.registro.calendarizacionccatalogo = lregistro[0].calendarizacionccatalogo;
        this.instrumentoComponent.registro.calendarizacioncdetalle = lregistro[0].calendarizacioncdetalle;
        this.instrumentoComponent.registro.calificacionriesgoinicialccatalogo = lregistro[0].calificacionriesgoinicialccatalogo;
        this.instrumentoComponent.registro.calificacionriesgoinicialcdetalle = lregistro[0].calificacionriesgoinicialcdetalle;
        this.instrumentoComponent.registro.casavaloresccatalogo = lregistro[0].casavaloresccatalogo;
        this.instrumentoComponent.registro.casavalorescdetalle = lregistro[0].casavalorescdetalle;
        this.instrumentoComponent.registro.clasificacioninversionccatalogo = lregistro[0].clasificacioninversionccatalogo;
        this.instrumentoComponent.registro.clasificacioninversioncdetalle = lregistro[0].clasificacioninversioncdetalle;
        this.instrumentoComponent.registro.compracuponccatalogo = lregistro[0].compracuponccatalogo;
        this.instrumentoComponent.registro.compracuponcdetalle = lregistro[0].compracuponcdetalle;
        this.instrumentoComponent.registro.emisorccatalogo = lregistro[0].emisorccatalogo;
        this.instrumentoComponent.registro.emisorcdetalle = lregistro[0].emisorcdetalle;
        this.instrumentoComponent.registro.formaajusteinteresccatalogo = lregistro[0].formaajusteinteresccatalogo;
        this.instrumentoComponent.registro.formaajusteinterescdetalle = lregistro[0].formaajusteinterescdetalle;
        this.instrumentoComponent.registro.instrumentoccatalogo = lregistro[0].instrumentoccatalogo;
        this.instrumentoComponent.registro.instrumentocdetalle = lregistro[0].instrumentocdetalle;
        this.instrumentoComponent.registro.mercadotipoccatalogo = lregistro[0].mercadotipoccatalogo;
        this.instrumentoComponent.registro.mercadotipocdetalle = lregistro[0].mercadotipocdetalle;
        this.instrumentoComponent.registro.monedaccatalogo = lregistro[0].monedaccatalogo;
        this.instrumentoComponent.registro.monedacdetalle = lregistro[0].monedacdetalle;
        this.instrumentoComponent.registro.periodicidadpagoscapitalccatalogo = lregistro[0].periodicidadpagoscapitalccatalogo;
        this.instrumentoComponent.registro.periodicidadpagoscapitalcdetalle = lregistro[0].periodicidadpagoscapitalcdetalle;
        this.instrumentoComponent.registro.periodicidadpagosinteresccatalogo = lregistro[0].periodicidadpagosinteresccatalogo;
        this.instrumentoComponent.registro.periodicidadpagosinterescdetalle = lregistro[0].periodicidadpagosinterescdetalle;
        this.instrumentoComponent.registro.portafolioccatalogo = lregistro[0].portafolioccatalogo;
        this.instrumentoComponent.registro.portafoliocdetalle = lregistro[0].portafoliocdetalle;
        this.instrumentoComponent.registro.sectorccatalogo = lregistro[0].sectorccatalogo;
        this.instrumentoComponent.registro.sectorcdetalle = lregistro[0].sectorcdetalle;
        this.instrumentoComponent.registro.sistemacolocacionccatalogo = lregistro[0].sistemacolocacionccatalogo;
        this.instrumentoComponent.registro.sistemacolocacioncdetalle = lregistro[0].sistemacolocacioncdetalle;

        this.instrumentoComponent.registro.bancoccatalogo = lregistro[0].bancoccatalogo;
        this.instrumentoComponent.registro.bancocdetalle = lregistro[0].bancocdetalle;

        this.instrumentoComponent.registro.estadoccatalogo = lregistro[0].estadoccatalogo;
        this.instrumentoComponent.registro.estadocdetalle = lregistro[0].estadocdetalle;
        this.instrumentoComponent.registro.cusuarioing = lregistro[0].cusuarioing;
        this.instrumentoComponent.registro.fingreso = lregistro[0].fingreso;
        this.instrumentoComponent.registro.cusuariomod = lregistro[0].cusuariomod;
        this.instrumentoComponent.registro.fmodificacion = lregistro[0].fmodificacion;
        this.instrumentoComponent.totalizaComisiones();
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  private fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
  }

  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {

    if (this.instrumentoComponent.pEditable == 0)
    {
        this.mostrarMensajeError('LOS DATOS NO HAN SIDO EDITADOS');
        return;
    }

    if (this.estaVacio(this.instrumentoComponent.registro.codigotitulo)) {
      this.mostrarMensajeError('CÓDIGO DE TÍTULO REQUERIDO');
      return;
    }

    if (this.estaVacio(this.instrumentoComponent.registro.numerocontrato)) {
      this.mostrarMensajeError('NÚMERO DE CONTRATO REQUERIDO');
      return;
    }

    if (this.estaVacio(this.instrumentoComponent.registro.portafoliocdetalle)) {
      this.mostrarMensajeError('PORTAFOLIO REQUERIDO');
      return;
    }

    if (this.estaVacio(this.instrumentoComponent.registro.mercadotipocdetalle)) {
      this.mostrarMensajeError('MERCADO REQUERIDO');
      return;
    }

    if (this.estaVacio(this.instrumentoComponent.registro.sistemacolocacioncdetalle)) {
      this.mostrarMensajeError('SISTEMA DE COLOCACIÓN REQUERIDO');
      return;
    }

    if (this.estaVacio(this.instrumentoComponent.registro.emisorcdetalle)) {
      this.mostrarMensajeError('EMISOR REQUERIDO');
      return;
    }

    if (this.estaVacio(this.instrumentoComponent.registro.instrumentocdetalle)) {
      this.mostrarMensajeError('INSTRUMENTO REQUERIDO');
      return;
    }

    if (this.estaVacio(this.instrumentoComponent.registro.sectorcdetalle)) {
      this.mostrarMensajeError('SECTOR REQUERIDO');
      return;
    }


    if (this.estaVacio(this.instrumentoComponent.registro.monedacdetalle)) {
      this.mostrarMensajeError('MONEDA REQUERIDA');
      return;
    }

    if (this.instrumentoComponent.registro.monedacdetalle != "USD" && (this.estaVacio(this.instrumentoComponent.registro.cotizacion) || this.instrumentoComponent.registro.cotizacion <= 0)) {
      this.mostrarMensajeError('LA COTIZACIÓN DEBE SER UN VALOR MAYOR A CERO');
      return;
    }

    if (this.estaVacio(this.instrumentoComponent.registro.clasificacioninversioncdetalle)) {
      this.mostrarMensajeError('CLASIFICACIÓN DE LA INVERSIÓN REQUERIDA');
      return;
    }

    if (this.estaVacio(this.instrumentoComponent.mcampos.cinvagentebolsa)) {
      this.mostrarMensajeError('CONTACTO CASA DE VALORES REQUERIDO');
      return;
    }

    if (this.estaVacio(this.instrumentoComponent.registro.femision)) {
      this.mostrarMensajeError('FECHA DE EMISIÓN REQUERIDA');
      return;
    }




    if (this.estaVacio(this.instrumentoComponent.registro.fregistro)) {
      this.mostrarMensajeError('FECHA DE REGISTRO REQUERIDA');
      return;
    }

    if (this.estaVacio(this.instrumentoComponent.registro.bancocdetalle)) {
      this.mostrarMensajeError('BANCO REQUERIDO');
      return;
    }

    if (this.inversiondetalleComponent.lregistros == undefined || this.inversiondetalleComponent.lregistros.length == 0) {
      this.mostrarMensajeError('DEBE REGISTRAR EL DETALLE DE LA INVERSIÓN');
      return;
    }


    this.encerarMensajes();

    this.lInstrumento[0].bolsavaloresccatalogo = this.instrumentoComponent.registro.bolsavaloresccatalogo;
    this.lInstrumento[0].bolsavalorescdetalle = this.instrumentoComponent.registro.bolsavalorescdetalle;
    this.lInstrumento[0].calendarizacionccatalogo = this.instrumentoComponent.registro.calendarizacionccatalogo;
    this.lInstrumento[0].calendarizacioncdetalle = this.instrumentoComponent.registro.calendarizacioncdetalle;
    this.lInstrumento[0].calificacionriesgoinicialccatalogo = this.instrumentoComponent.registro.calificacionriesgoinicialccatalogo;
    this.lInstrumento[0].calificacionriesgoinicialcdetalle = this.instrumentoComponent.registro.calificacionriesgoinicialcdetalle;
    this.lInstrumento[0].casavaloresccatalogo = this.instrumentoComponent.registro.casavaloresccatalogo;
    this.lInstrumento[0].casavalorescdetalle = this.instrumentoComponent.registro.casavalorescdetalle;
    this.lInstrumento[0].cinvagentebolsa = this.instrumentoComponent.registro.cinvagentebolsa;

    this.lInstrumento[0].clasificacioninversionccatalogo = this.instrumentoComponent.registro.clasificacioninversionccatalogo;
    this.lInstrumento[0].clasificacioninversioncdetalle = this.instrumentoComponent.registro.clasificacioninversioncdetalle;
    this.lInstrumento[0].codigotitulo = this.instrumentoComponent.registro.codigotitulo;
    this.lInstrumento[0].numerocontrato = this.instrumentoComponent.registro.numerocontrato;
    this.lInstrumento[0].comisionbolsavalores = this.instrumentoComponent.registro.comisionbolsavalores;
    this.lInstrumento[0].comisionoperador = this.instrumentoComponent.registro.comisionoperador;
    this.lInstrumento[0].comisionretencion = this.instrumentoComponent.registro.comisionretencion;
    this.lInstrumento[0].compracuponccatalogo = this.instrumentoComponent.registro.compracuponccatalogo;
    this.lInstrumento[0].compracuponcdetalle = this.instrumentoComponent.registro.compracuponcdetalle;
    this.lInstrumento[0].cotizacion = this.instrumentoComponent.registro.cotizacion;
    this.lInstrumento[0].diasgraciacapital = this.instrumentoComponent.registro.diasgraciacapital;
    this.lInstrumento[0].diasgraciainteres = this.instrumentoComponent.registro.diasgraciainteres;
    this.lInstrumento[0].emisorccatalogo = this.instrumentoComponent.registro.emisorccatalogo;
    this.lInstrumento[0].emisorcdetalle = this.instrumentoComponent.registro.emisorcdetalle;
    this.lInstrumento[0].estadoccatalogo = this.instrumentoComponent.registro.estadoccatalogo;
    this.lInstrumento[0].estadocdetalle = this.instrumentoComponent.registro.estadocdetalle;


    this.lInstrumento[0].fcolocacion = this.instrumentoComponent.registro.femision;

    this.lInstrumento[0].femision = this.instrumentoComponent.registro.femision;
    this.lInstrumento[0].formaajusteinteresccatalogo = this.instrumentoComponent.registro.formaajusteinteresccatalogo;
    this.lInstrumento[0].formaajusteinterescdetalle = this.instrumentoComponent.registro.formaajusteinterescdetalle;
    this.lInstrumento[0].fregistro = this.instrumentoComponent.registro.fregistro;
    this.lInstrumento[0].fultimopago = this.instrumentoComponent.registro.fultimopago;
    this.lInstrumento[0].fvencimiento = this.instrumentoComponent.registro.fvencimiento;
    this.lInstrumento[0].instrumentoccatalogo = this.instrumentoComponent.registro.instrumentoccatalogo;
    this.lInstrumento[0].instrumentocdetalle = this.instrumentoComponent.registro.instrumentocdetalle;
    this.lInstrumento[0].mercadotipoccatalogo = this.instrumentoComponent.registro.mercadotipoccatalogo;
    this.lInstrumento[0].mercadotipocdetalle = this.instrumentoComponent.registro.mercadotipocdetalle;
    this.lInstrumento[0].monedaccatalogo = this.instrumentoComponent.registro.monedaccatalogo;
    this.lInstrumento[0].monedacdetalle = this.instrumentoComponent.registro.monedacdetalle;
    this.lInstrumento[0].numeroacciones = this.instrumentoComponent.registro.numeroacciones;
    this.lInstrumento[0].observaciones = this.instrumentoComponent.registro.observaciones;

    this.lInstrumento[0].periodicidadpagoscapitalccatalogo = this.instrumentoComponent.registro.periodicidadpagoscapitalccatalogo;
    this.lInstrumento[0].periodicidadpagoscapitalcdetalle = this.instrumentoComponent.registro.periodicidadpagoscapitalcdetalle;
    this.lInstrumento[0].periodicidadpagosinteresccatalogo = this.instrumentoComponent.registro.periodicidadpagosinteresccatalogo;
    this.lInstrumento[0].periodicidadpagosinterescdetalle = this.instrumentoComponent.registro.periodicidadpagosinterescdetalle;
    this.lInstrumento[0].plazo = this.instrumentoComponent.registro.plazo;
    this.lInstrumento[0].porcentajecalculodescuento = this.instrumentoComponent.registro.porcentajecalculodescuento;
    this.lInstrumento[0].porcentajecalculoprecio = this.instrumentoComponent.registro.porcentajecalculoprecio;
    this.lInstrumento[0].porcentajecalculorendimiento = this.instrumentoComponent.registro.porcentajecalculorendimiento;

    this.lInstrumento[0].interestranscurrido = this.instrumentoComponent.registro.interestranscurrido;
    

    this.lInstrumento[0].porcentajeparticipacioncupon = this.instrumentoComponent.registro.porcentajeparticipacioncupon;
    this.lInstrumento[0].porcentajepreciocompra = this.instrumentoComponent.registro.porcentajepreciocompra;
    this.lInstrumento[0].portafolioccatalogo = this.instrumentoComponent.registro.portafolioccatalogo;
    this.lInstrumento[0].portafoliocdetalle = this.instrumentoComponent.registro.portafoliocdetalle;
    this.lInstrumento[0].preciocompra = this.instrumentoComponent.registro.preciocompra;
    this.lInstrumento[0].preciounitarioaccion = this.instrumentoComponent.registro.preciounitarioaccion;
    this.lInstrumento[0].sectorccatalogo = this.instrumentoComponent.registro.sectorccatalogo;
    this.lInstrumento[0].sectorcdetalle = this.instrumentoComponent.registro.sectorcdetalle;
    this.lInstrumento[0].sistemacolocacionccatalogo = this.instrumentoComponent.registro.sistemacolocacionccatalogo;
    this.lInstrumento[0].sistemacolocacioncdetalle = this.instrumentoComponent.registro.sistemacolocacioncdetalle;

    this.lInstrumento[0].bancoccatalogo = this.instrumentoComponent.registro.bancoccatalogo;
    this.lInstrumento[0].bancocdetalle = this.instrumentoComponent.registro.bancocdetalle;

    this.lInstrumento[0].tasa = this.instrumentoComponent.registro.tasa;
    this.lInstrumento[0].tasaclasificacionccatalogo = this.instrumentoComponent.registro.tasaclasificacionccatalogo;
    this.lInstrumento[0].tasaclasificacioncdetalle = this.instrumentoComponent.registro.tasaclasificacioncdetalle;
    this.lInstrumento[0].tasainterescupon = this.instrumentoComponent.registro.tasainterescupon;
    this.lInstrumento[0].valoracciones = this.instrumentoComponent.registro.valoracciones;
    this.lInstrumento[0].valordividendospagados = this.instrumentoComponent.registro.valordividendospagados;
    this.lInstrumento[0].valorefectivo = this.instrumentoComponent.registro.valorefectivo;
    this.lInstrumento[0].valornegociacion = this.instrumentoComponent.registro.valornegociacion;
    this.lInstrumento[0].valornominal = this.instrumentoComponent.registro.valornominal;
    this.lInstrumento[0].yield = this.instrumentoComponent.registro.yield;

    this.lInstrumento[0].centrocostoccatalogo = 1002;
    
    this.rqMantenimiento.lregistrosgrabar = this.lInstrumento;
   
    this.rqMantenimiento.cargaarchivo = 'save';
    this.crearDtoMantenimiento();

    this.actualizarEditable(0);

  }

  public crearDtoMantenimiento() {

    this.lmantenimiento = []; // Encerar Mantenimiento
    super.addMantenimientoPorAlias(this.alias, this.getMantenimiento(1));

    if (this.lInstrumento[0].cinversion > 0) {
      super.addMantenimientoPorAlias(this.inversiondetalleComponent.alias, this.inversiondetalleComponent.getMantenimiento(2));
    }

    super.grabar();
  }


  limpiar() {

    this.encerarMensajes();

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

 
    this.valoresRentaVariable.plregistro = [];
    this.inversiondetalleComponent.lregistros = [];
  }


  validaGrabar() {
    return true;
  }

  public postCommit(resp: any) {

    if (resp.cinversion != undefined && resp.cinversion > 0) {
      this.instrumentoComponent.registro.cinversion = resp.cinversion;

    
        if (this.inversiondetalleComponent.lregistros.length > 0) {
          

        for (const i in this.inversiondetalleComponent.lregistros) {
          
            this.inversiondetalleComponent.lregistros[i].cinversion = resp.cinversion;
  
        }

        this.inversiondetalleComponent.grabar();
      }

      this.lInstrumento[0].cinversion = resp.cinversion;
    }
  }

  mostrarLovInversiones(): void {
    this.lovInversiones.mfiltros.tasaclasificacioncdetalle = "VAR";
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

  nuevo() {
    this.limpiar();
    this.actualizarEditable(1);
    this.instrumentoComponent.registro.estadocdetalle = 'ING';
    this.instrumentoComponent.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;

  }

  cancelar() {
    this.encerarMensajes();
    this.limpiar();
    this.actualizarEditable(0);
  }

  imprimir(resp: any): void {


    this.jasper.nombreArchivo = 'rptInvInversionRentaVariable';

    // Agregar parametros
    var ldate = new Date();
    let lfechanum: number = (ldate.getFullYear() * 10000) + ((ldate.getMonth() + 1) * 100) + ldate.getDate();
    this.jasper.parametros['@ifechacorte'] = lfechanum;
    this.jasper.parametros['@cinversion'] = this.instrumentoComponent.registro.cinversion;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvInversionRentaVariable';
    this.jasper.formatoexportar = resp;
    this.jasper.generaReporteCore();
  }

}
