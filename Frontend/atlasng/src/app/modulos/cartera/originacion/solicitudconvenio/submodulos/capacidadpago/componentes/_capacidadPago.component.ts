import { any } from 'codelyzer/util/function';
import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { DtoServicios } from "../../../../../../../util/servicios/dto.servicios";
import { Consulta, Mantenimiento } from "../../../../../../../util/dto/dto.component";
import { BaseComponent } from "../../../../../../../util/shared/componentes/base.component";
import { SelectItem } from "primeng/primeng";
import { ReincorporadosComponent } from './_reincorporados.component';
import { EgresosComponent } from '../../egresos/componentes/_egresos.component';
import { IngresosComponent } from './../../ingresos/componentes/_ingresos.component';

@Component({
  selector: "app-capacidad-pago",
  templateUrl: "_capacidadPago.html"
})
export class CapacidadPagoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(ReincorporadosComponent)
  reincorporadosComponent: ReincorporadosComponent;

  @ViewChild(EgresosComponent)
  egresosComponent: EgresosComponent;

  @ViewChild(IngresosComponent)
  ingresosComponent: IngresosComponent;

  public aprobado = false;
  public porcentajecapacidadpago = 0;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, "TcarSolicitudCapacidadPago", "DEUDOR", true, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
  }

  ngAfterViewInit() { }


  actualizar() {
    super.actualizar();
    this.registro.cusuario = this.dtoServicios.mradicacion.cusuario;
    this.registro.crelacion = 1;
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
    const consulta = new Consulta(this.entityBean, "Y", "t.ccapacidad", this.mfiltros, this.mfiltrosesp);
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
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  public calculaCapacidadPago() {
    this.registro.capacidadpago = 0;
    this.registro.porcentajecoberturacuota = 0;
    this.registro.resolucion = "";

    if (!this.estaVacio(this.registro.totalingresos) && this.registro.totalingresos > 0) {
      this.registro.capacidadpago = super.redondear(((this.registro.totalingresos * this.porcentajecapacidadpago) / 100), 2) + this.ingresosComponent.montoseleccionado;
    }
    if (!this.estaVacio(this.registro.totalegresos) && this.registro.totalegresos > 0) {
      this.registro.capacidadpago = super.redondear((this.registro.capacidadpago - this.registro.totalegresos), 2);
    }

    this.registro.porcentajecoberturacuota = Math.round((this.registro.valorcuota / this.registro.capacidadpago) * 100);

    if (this.registro.capacidadpago >= this.registro.valorcuota) {
      this.aprobado = true;
      this.registro.resolucion = "APROBADO";
    } else {
      this.aprobado = false;
      this.registro.resolucion = "NEGADO";
    }
  }

  private actualizarEgresos() {
    this.registro.totalegresos = 0;
    this.registro.totalegresos = this.egresosComponent.registro.totalegresos;
    this.calculaCapacidadPago();
  }

  private actualizarIngresos() {
    this.registro.totalingresos = 0;
    this.registro.totalingresos = this.ingresosComponent.registro.totalingresos;
    this.calculaCapacidadPago();
  }

}
