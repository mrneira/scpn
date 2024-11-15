import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { NgForm } from '@angular/forms';
import { BaseLovComponent } from '../../../../../util/shared/componentes/baseLov.component';

@Component({
  selector: 'app-lov-estado-transaccion',
  templateUrl: 'lov.estadotransaccion.html'
})
export class LovEstadoTransaccionComponent extends BaseLovComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Input() habilitarfiltros = false; verreg = 0; modulo = -1; cestado = ''; fcontable = -1; tipotransaccion = 'P';
  @Output() eventoCliente = new EventEmitter();

  public TRANSACCIONESTADO: any;
  public mostrarDialogoGenericoDetalle = false;
  public ldetallepagos: any[];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'TESORIAESTADOTRANSACCION', false, true);
  }

  ngOnInit() {
    this.componentehijo = this;
  }

  consultar() {
    this.limpiar();
    this.rqConsulta = [];
    this.rqConsulta.CODIGOCONSULTA = 'TESORIAESTADOTRANSACCION';
    this.rqConsulta.storeprocedure = "sp_TesConReporteBceParametros";
    this.rqConsulta.parametro_verreg = this.verreg;
    this.rqConsulta.parametro_modulo = this.modulo;
    this.rqConsulta.parametro_cestado = this.cestado;
    this.rqConsulta.parametro_fcontable = this.fcontable;
    this.rqConsulta.parametro_tipotransaccion = this.tipotransaccion
    this.rqConsulta.parametro_identificacion = this.estaVacio(this.mfiltros.identificacionbeneficiario) ? '' : this.mfiltros.identificacionbeneficiario;
    this.rqConsulta.parametro_nombre = this.estaVacio(this.mfiltros.nombrebeneficiario) ? '' : this.mfiltros.nombrebeneficiario;
    this.rqConsulta.parametro_referenciainterna = this.estaVacio(this.mfiltros.referenciainterna) ? '' : this.mfiltros.referenciainterna;
    this.rqConsulta.parametro_secuenciainterna = this.estaVacio(this.mfiltros.secuenciainterna) ? -1 : this.mfiltros.secuenciainterna;
    super.consultar();
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  seleccionaRegistro(evento: any) {
    this.eventoCliente.emit({ registro: evento.data });
    // para oculatar el dialogo.
    this.displayLov = false;
  }

  showDialog(movimiento: any) {
    this.displayLov = true;
    this.limpiar();
  }

  limpiar() {
    this.TRANSACCIONESTADO = [];
    this.limpiaLista(this.lregistros);
  }

  Detalle(registro: any) {
    this.obtnerdetallepagos(registro);
    this.mostrarDialogoGenericoDetalle = true;
  }

  obtnerdetallepagos(registro) {
    this.rqConsulta = [];
    this.rqConsulta.CODIGOCONSULTA = "HISTORICOPAGO";
    this.rqConsulta.storeprocedure = "sp_TesConObtenerHistorialPagos";
    this.rqConsulta.parametro_ctestransaccion = registro.ctestransaccion;
    this.rqConsulta.parametro_verreg = 0;
    this.rqConsulta.parametro_tipotransaccion = this.tipotransaccion;
    this.msgs = [];

    this.dtoServicios
      .ejecutarConsultaRest(this.getRequestConsulta("C"))
      .subscribe(
        resp => {
          this.manejaRespuestaDetalle(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        }
      );
  }

  private manejaRespuestaDetalle(resp: any) {
    this.ldetallepagos = [];
    if (resp.cod === "OK") {
      this.ldetallepagos = resp.HISTORICOPAGO;
      this.rqConsulta = { mdatos: {} };
    }
  }
}
