import { Component, OnInit, AfterViewInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-condiciones-arreglo-pago',
  templateUrl: '_condicionesArregloPago.html'
})
export class CondicionesArregloPagoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @Output() eventoCondiciones = new EventEmitter();

  @ViewChild('formFiltros') formFiltros: NgForm;

  public valoradio = null;
  public ltabla: any = [];
  public larreglorubros: any = [];
  public mtotales: any = {};
  public esrenovacion = false;
  public ltablaamortizacion: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarOperacionArregloPago', 'TCAROPEARREGLOPAGO', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.valoradio = 'numcuota';
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', '', this.mfiltros, this.mfiltrosesp);
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.mcampos.simulacion = false;
    this.crearDtoMantenimiento();

    super.grabar();
  }

  grabarSimulacion(): void {
    super.encerarMensajes();
    if (this.estaVacio(this.registro.coperacion)) {
      super.mostrarMensajeError('NÚMERO DE OPERACIÓN REQUERIDA');
      return;
    }

    if (this.estaVacio(this.registro.valorcuota) && this.estaVacio(this.registro.numerocuotas)) {
      super.mostrarMensajeError('NÚMERO DE CUOTAS O VALOR DE CUOTA REQUERIDOS');
      return;
    }

    if (this.estaVacio(this.mcampos.destino)) {
      super.mostrarMensajeError('DESTINO DEL CRÉDITO ES REQUERIDO');
      return;
    }

  //  if (this.esrenovacion && this.registro.montoincremento >= 0) {
  //    super.mostrarMensajeError('VALOR DEL INCREMENTO DEBE SER MAYOR A CERO');
  //    return;
   // }

    this.lmantenimiento = []; // Encerar Mantenimiento
    this.mcampos.simulacion = true;

    this.rqMantenimiento['CODMODULOORIGEN'] = sessionStorage.getItem('m');
    this.rqMantenimiento['CODTRANSACCIONORIGEN'] = sessionStorage.getItem('t');
    this.rqMantenimiento['cmodulo'] = 7;
    this.rqMantenimiento['ctransaccion'] = 49;
    this.rqMantenimiento['essimulacion'] = true;
    this.rqMantenimiento['rollback'] = true;
    this.rqMantenimiento['coperacion'] = this.registro.coperacion;
    this.rqMantenimiento['ARREGLORUBROS'] = this.larreglorubros;
    this.rqMantenimiento.mdatos.saldocapital = this.registro.mdatos.montoanterior;

    this.registro.esnuevo = true;
    this.registro.csolicitud = 0;
    this.selectRegistro(this.registro);
    this.actualizar();

    super.addMantenimientoPorAlias(this.alias, this.getMantenimiento(1));
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any, dtoext = null) {
    super.postCommitEntityBean(resp, dtoext);

    if (resp.cod === 'OK') {
      if (this.mcampos.simulacion) {
        this.eventoCondiciones.emit(resp);
      }

      if (!this.estaVacio(resp.TABLA)) {
        this.ltabla = resp.TABLA;
        this.mtotales = resp.TOTALES[0];
      }
    }
  }

  public cambiaRadio() {
    if (this.valoradio === 'valcuota') {
      this.registro.valorcuota = null;
    } else {
      this.registro.numerocuotas = null;
    }
  }

  public limpiar() {
    this.valoradio = 'numcuota';
    this.registro.valorcuota = null;
    this.registro.numerocuotas = null;
    this.registro.mdatos.montoincremento = null;
    this.ltabla = null;
  }

  public calcularMonto() {
    this.registro.montoincremento = 0;
    if (this.esrenovacion) {
      this.registro.montoincremento = super.redondear(Number(this.registro.mdatos.monto), 2) - + super.redondear(Number(this.registro.mdatos.montoanterior), 2)
    }
  }

}
