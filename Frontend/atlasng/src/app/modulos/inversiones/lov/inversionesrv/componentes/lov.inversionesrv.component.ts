
import { Component, OnInit, AfterViewInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-lov-inversionesrv',
  templateUrl: 'lov.inversionesrv.html'
})
export class LovInversionesrvComponent extends BaseComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoCliente = new EventEmitter();
  displayLov = false;


  public pEliminarContabilidadAnulada: boolean = false;

  pfEmisionInicial: Date;
  pfEmisionFinal: Date;

  public lEstado: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {

    super(router, dtoServicios, 'TinvInversion', 'LOVINVERSIONES', false, true);

  }

  ngOnInit() {
    this.formFiltrosBase = this.formFiltros;
    this.componentehijo = this;
    // En los lov va 0 para no grabar log de transaccion.
    this.rqConsulta.grabarlog = '0';

  }

  consultar() {
    this.crearDtoConsulta();
    const consulta: Consulta = this.getConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {

    let lfechaInicial: number;
    if (!this.estaVacio(this.pfEmisionInicial)) {
      try {
        lfechaInicial = (this.pfEmisionInicial.getFullYear() * 10000) + ((this.pfEmisionInicial.getMonth() + 1) * 100) + this.pfEmisionInicial.getDate();
      }
      catch (ex) {
        lfechaInicial = 0;
      }
    }
    else {
      lfechaInicial = 0;
    }

    const lfechaLImite: number = 99999999;

    let lfechaFinal: number;
    if (!this.estaVacio(this.pfEmisionFinal)) {
      try {
        lfechaFinal = (this.pfEmisionFinal.getFullYear() * 10000) + ((this.pfEmisionFinal.getMonth() + 1) * 100) + this.pfEmisionFinal.getDate();
      }
      catch (ex) {
        lfechaFinal = lfechaLImite;
      }
    }
    else {
      lfechaFinal = lfechaLImite;
    }


    if (lfechaInicial != 0 && lfechaFinal != lfechaLImite) {
      this.mfiltrosesp.fcompra = 'between ' + lfechaInicial + ' and ' + lfechaFinal + ' ';
    }

    if (this.pEliminarContabilidadAnulada) {
      this.mfiltrosesp.ccomprobante = null;
    }

    if (!this.estaVacio(this.mcampos.estadocdetalle))
      this.mfiltrosesp.estadocdetalle = " in (\'" + this.mcampos.estadocdetalle + "\')";

    this.mfiltrosesp.tasaclasificacioncdetalle = " in (\'VAR\')";


    const consulta = new Consulta(this.entityBean, 'Y', 't.cinversion desc', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tconcomprobante', 'anulado', 'nanulado', 'i.ccomprobante = t.ccomprobante ');
    consulta.addSubquery('tconcomprobante', 'eliminado', 'neliminado', 'i.ccomprobante = t.ccomprobante ');

    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nnombre', 'i.ccatalogo = 1213 AND i.cdetalle = t.emisorcdetalle ');

    consulta.cantidad = 15;
    this.addConsulta(consulta);
    return consulta;
  }

  public getConsulta(): Consulta {
    const consulta = super.getConsulta(this.alias);
    return consulta;
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);

    this.rqMantenimiento.lregistros = [];

    if (this.pEliminarContabilidadAnulada) {

      for (const i in this.lregistros) {
        if (this.lregistros.hasOwnProperty(i)) {

          if (this.lregistros[i].ccomprobante == null || this.lregistros[i].mdatos.nanulado || this.lregistros[i].mdatos.neliminado) {
            this.rqMantenimiento.lregistros.push({
              cinversion: this.lregistros[i].cinversion
              , tasaclasificacionccatalogo: this.lregistros[i].tasaclasificacionccatalogo
              , tasaclasificacioncdetalle: this.lregistros[i].tasaclasificacioncdetalle
              , optlock: this.lregistros[i].optlock
              , codigotitulo: this.lregistros[i].codigotitulo
              , numerocontrato: this.lregistros[i].numerocontrato
              , ccomprobante: this.lregistros[i].ccomprobante
              , fcolocacion: this.lregistros[i].fcolocacion
              , fregistro: this.lregistros[i].fregistro
              , femision: this.lregistros[i].femision
              , fvencimiento: this.lregistros[i].fvencimiento
              , fultimopago: this.lregistros[i].fultimopago
              , cinvagentebolsa: this.lregistros[i].cinvagentebolsa
              , valornominal: this.lregistros[i].valornominal
              , valornegociacion: this.lregistros[i].valornegociacion
              , valorefectivo: this.lregistros[i].valorefectivo
              , plazo: this.lregistros[i].plazo
              , tasa: this.lregistros[i].tasa
              , diasgraciacapital: this.lregistros[i].diasgraciacapital
              , diasgraciainteres: this.lregistros[i].diasgraciainteres
              , boletin: this.lregistros[i].boletin
              , cotizacion: this.lregistros[i].cotizacion
              , yield: this.lregistros[i].yield
              , comisionbolsavalores: this.lregistros[i].comisionbolsavalores
              , comisionoperador: this.lregistros[i].comisionoperador
              , comisionretencion: this.lregistros[i].comisionretencion
              , porcentajecalculoprecio: this.lregistros[i].porcentajecalculoprecio
              , porcentajecalculodescuento: this.lregistros[i].porcentajecalculodescuento
              , porcentajecalculorendimiento: this.lregistros[i].porcentajecalculorendimiento
              , porcentajepreciocompra: this.lregistros[i].porcentajepreciocompra
              , preciounitarioaccion: this.lregistros[i].preciounitarioaccion
              , numeroacciones: this.lregistros[i].numeroacciones
              , valoracciones: this.lregistros[i].valoracciones
              , preciocompra: this.lregistros[i].preciocompra
              , valordividendospagados: this.lregistros[i].valordividendospagados
              , porcentajeparticipacioncupon: this.lregistros[i].porcentajeparticipacioncupon
              , tasainterescupon: this.lregistros[i].tasainterescupon
              , observaciones: this.lregistros[i].observaciones
              , bolsavaloresccatalogo: this.lregistros[i].bolsavaloresccatalogo
              , bolsavalorescdetalle: this.lregistros[i].bolsavalorescdetalle
              , calendarizacionccatalogo: this.lregistros[i].calendarizacionccatalogo
              , calendarizacioncdetalle: this.lregistros[i].calendarizacioncdetalle
              , calificacionriesgoinicialccatalogo: this.lregistros[i].calificacionriesgoinicialccatalogo
              , calificacionriesgoinicialcdetalle: this.lregistros[i].calificacionriesgoinicialcdetalle
              , casavaloresccatalogo: this.lregistros[i].casavaloresccatalogo
              , casavalorescdetalle: this.lregistros[i].casavalorescdetalle
              , clasificacioninversionccatalogo: this.lregistros[i].clasificacioninversionccatalogo
              , clasificacioninversioncdetalle: this.lregistros[i].clasificacioninversioncdetalle
              , compracuponccatalogo: this.lregistros[i].compracuponccatalogo
              , compracuponcdetalle: this.lregistros[i].compracuponcdetalle
              , emisorccatalogo: this.lregistros[i].emisorccatalogo
              , emisorcdetalle: this.lregistros[i].emisorcdetalle
              , formaajusteinteresccatalogo: this.lregistros[i].formaajusteinteresccatalogo
              , formaajusteinterescdetalle: this.lregistros[i].formaajusteinterescdetalle
              , instrumentoccatalogo: this.lregistros[i].instrumentoccatalogo
              , instrumentocdetalle: this.lregistros[i].instrumentocdetalle
              , mercadotipoccatalogo: this.lregistros[i].mercadotipoccatalogo
              , mercadotipocdetalle: this.lregistros[i].mercadotipocdetalle
              , monedaccatalogo: this.lregistros[i].monedaccatalogo
              , monedacdetalle: this.lregistros[i].monedacdetalle
              , periodicidadpagoscapitalccatalogo: this.lregistros[i].periodicidadpagoscapitalccatalogo
              , periodicidadpagoscapitalcdetalle: this.lregistros[i].periodicidadpagoscapitalcdetalle
              , periodicidadpagosinteresccatalogo: this.lregistros[i].periodicidadpagosinteresccatalogo
              , periodicidadpagosinterescdetalle: this.lregistros[i].periodicidadpagosinterescdetalle
              , portafolioccatalogo: this.lregistros[i].portafolioccatalogo
              , portafoliocdetalle: this.lregistros[i].portafoliocdetalle
              , sectorccatalogo: this.lregistros[i].sectorccatalogo
              , sectorcdetalle: this.lregistros[i].sectorcdetalle
              , sistemacolocacionccatalogo: this.lregistros[i].sistemacolocacionccatalogo
              , sistemacolocacioncdetalle: this.lregistros[i].sistemacolocacioncdetalle
              , estadoccatalogo: this.lregistros[i].estadoccatalogo
              , estadocdetalle: this.lregistros[i].estadocdetalle
              , centrocostoccatalogo: this.lregistros[i].centrocostoccatalogo
              , centrocostocdetalle: this.lregistros[i].centrocostocdetalle
              , cusuarioing: this.lregistros[i].cusuarioing
              , fingreso: this.lregistros[i].fingreso
              , cusuariomod: this.lregistros[i].cusuariomod
              , fmodificacion: this.lregistros[i].fmodificacion
            });
          }
        }
      }
    }
    else {
      this.rqMantenimiento.lregistros = this.lregistros;
    }
  }

  private fijarFiltrosConsulta() {
  }

  seleccionaRegistro(evento: any) {
    this.eventoCliente.emit({ registro: evento.data });
    // para oculatar el dialogo.
    this.displayLov = false;
  }

  showDialog() {

    this.consultarCatalogos();
    this.displayLov = true;
  }

  private manejaRespuestaCatalogos(resp: any) {
    if (resp.cod === 'OK') {

      this.llenaListaCatalogo(this.lEstado, resp.ESTADO, 'cdetalle');

    }
  }

  llenarConsultaCatalogos(): void {

    const mfiltrosCatalogo: any = { 'ccatalogo': 1204 };

    let mfiltrosEstado: any = {};
    if (!this.estaVacio(this.mfiltrosesp.estadocdetalle))
    {
      mfiltrosEstado = { 'cdetalle': this.mfiltrosesp.estadocdetalle };
    }

    const consultaEstado = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosCatalogo, mfiltrosEstado);
    consultaEstado.cantidad = 50;
    this.addConsultaPorAlias('ESTADO', consultaEstado);
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

}
