import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';


@Component({
  selector: 'app-transacciones',
  templateUrl: '_transacciones.html'
})
export class TransaccionesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public mostrarDialogoDetalle = false;
  public mostrarDialogoDetalleMovimiento = false;
  public lpagos: any = [];
  public lmovimientos: any = [];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarOperacionTransaccion', 'MOVIMIENTO', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {}

  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.mfiltros.reverso = 'N';
    const consulta = new Consulta(this.entityBean, 'Y', 't.freal', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenTransaccion', 'nombre', 'ntransaccion', 'i.ctransaccion = t.ctransaccion and i.cmodulo = t.cmodulo');
    consulta.addSubquery('TcarOperacion', 'montoarreglopago', 'montoarreglopago', 'i.coperacion = t.coperacion');
    consulta.addSubquery('TcarOperacion', 'cestadooperacion', 'cestadooperacion', 'i.coperacion = t.coperacion');
    consulta.setCantidad(100);
    this.addConsulta(consulta);
    return consulta;
  }

  validaFiltrosConsulta(): boolean {
    if (this.mfiltros.coperacion === 0 || this.mfiltros.coperacion === undefined) {
      this.mostrarMensajeError('OPERACIÓN REQUERIDA');
      return;
    }
    return super.validaFiltrosConsulta();
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  
  cerrarDialogo() {
    this.mostrarDialogoDetalle = false;
    this.mostrarDialogoDetalleMovimiento = false;
  }

  mostrarDialogoPagos(registro: any) {
    this.mcampos.total = registro.monto;
    this.consultarPagosOperacion(registro.mensaje);
    this.mostrarDialogoDetalle = true;
  }

  public consultarPagosOperacion(mensaje: string) {
    const rqConsulta: any = new Object();
    rqConsulta.CODIGOCONSULTA = 'CONSULTATRANSACCIONCARTERA';
    rqConsulta.coperacion = this.mfiltros.coperacion;
    rqConsulta.mensaje = mensaje;
    this.lpagos = [];
    this.dtoServicios.ejecutarConsultaRest(rqConsulta)
      .subscribe(
        resp => {
          this.dtoServicios.msgs = [];
          this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
          if (resp.cod !== 'OK') {
            return;
          }
          this.lpagos = resp.TRANSACCIONES;
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  mostrarDialogoMovimiento(registro: any) {
    this.consultaMovimientos(registro);
    this.mostrarDialogoDetalleMovimiento = true;
  }

  consultaMovimientos(reg: any) {
    const rqConsulta: any = new Object();
    rqConsulta.CODIGOCONSULTA = 'MOVIMIENTOSRECUPERACION';
    rqConsulta.coperacion = this.mfiltros.coperacion;
    rqConsulta.mensajeaconsultar = reg.mensaje;
    rqConsulta.fmovimiento = reg.fcontable;
    this.lmovimientos = [];
    this.dtoServicios.ejecutarConsultaRest(rqConsulta)
      .subscribe(
        resp => {
          this.dtoServicios.msgs = [];
          this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
          if (resp.cod !== 'OK') {
            return;
          }
          this.lmovimientos = resp.MOVIMIENTOS;
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }
}