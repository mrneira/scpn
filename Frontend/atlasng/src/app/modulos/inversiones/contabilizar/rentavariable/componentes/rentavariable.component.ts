
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
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { RubrosComponent } from '../submodulos/rubros/componentes/rubros.component';

@Component({
  selector: "app-rentavariable",
  templateUrl: "rentavariable.html"
})
export class RentavariableComponent extends BaseComponent
  implements OnInit, AfterViewInit {
  @ViewChild("formFiltros") formFiltros: NgForm;

  private lInstrumento: any = [];
  @ViewChild(JasperComponent)

  public jasper: JasperComponent;

  @ViewChild(InstrumentoComponent)
  instrumentoComponent: InstrumentoComponent;

  @ViewChild(LovInversionesComponent) private lovInversiones: LovInversionesComponent;

  @ViewChild(RubrosComponent)
  rubrosComponent: RubrosComponent;

  constructor(router: Router, dtoServicios: DtoServicios, private confirmationService: ConfirmationService) {

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

  actualizar() {
  }

  eliminar() {
    // No existe para el padre
  }

  // Inicia CONSULTA *********************
  consultar() {

    this.obtenerInversion();
    this.rubrosComponent.mfiltros.cinversion = this.mcampos.cinversion;
    this.rubrosComponent.consultar();

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

        this.mcampos.ccomprobante = null;
        this.mcampos.numerocomprobantecesantia = null;

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
        
        this.rubrosComponent.registro.centrocostoccatalogo = lregistro[0].centrocostoccatalogo;
        this.rubrosComponent.registro.centrocostocdetalle = lregistro[0].centrocostocdetalle;
        
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

    if (!this.estaVacio(this.mcampos.ccomprobante)) {
      this.mostrarMensajeError('ESTA INVERSIÓN YA HA SIDO CONTABILIZADA');
      return;
    }

    if (this.estaVacio(this.instrumentoComponent.registro.codigotitulo)) {
      this.mostrarMensajeError('BUSQUE A LA INVERSIÓN A CONTABILIZAR');
      return;
    }

    this.encerarMensajes();

    this.confirmationService.confirm({
      message: 'Está seguro de contabilizar la inversión?',
      header: 'Confirmación',
      icon: 'fa fa-question-circle',
      accept: () => {
        this.rqMantenimiento.contabilizar = true;
        this.rqMantenimiento.procesocdetalle = "COMPRA";
        this.rqMantenimiento.cinversion = this.lInstrumento[0].cinversion;
        super.grabar();
      },
      reject: () => {
      }
    });
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  validaGrabar() {
    return true;
  }

  public postCommit(resp: any) {

    if (resp.cinversion != undefined && resp.cinversion > 0) {
      this.instrumentoComponent.registro.cinversion = resp.cinversion;
      this.lInstrumento[0].cinversion = resp.cinversion;
    }
    if (resp.ccomprobante != undefined)
    {
      this.mcampos.cinversion = null;
      this.mcampos.codigotitulo = null;
      this.mcampos.ccomprobante = resp.ccomprobante;
      this.mcampos.numerocomprobantecesantia = resp.numerocomprobantecesantia;
      this.lovInversiones.lregistros = [];
      this.lovInversiones.rqMantenimiento.lregistros = [];
    }
  }

  mostrarLovInversiones(): void {
    this.lovInversiones.pEliminarContabilidadAnulada = true;
    this.lovInversiones.mfiltros.tasaclasificacioncdetalle = "VAR";
    this.lovInversiones.mfiltrosesp.ccomprobante = 'is null ';
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
  }

  cancelar() {
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
