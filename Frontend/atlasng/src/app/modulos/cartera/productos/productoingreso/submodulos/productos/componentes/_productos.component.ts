import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { DtoServicios } from "../../../../../../../util/servicios/dto.servicios";
import { Consulta, Mantenimiento } from "../../../../../../../util/dto/dto.component";
import { BaseComponent } from "../../../../../../../util/shared/componentes/base.component";
import { SelectItem } from "primeng/primeng";

@Component({
  selector: "app-productos",
  templateUrl: "_productos.html"
})
export class ProductosComponent extends BaseComponent
  implements OnInit, AfterViewInit {
  public ltablaamortizacion: SelectItem[] = [{ label: "...", value: null }];
  public lbasecalculo: SelectItem[] = [{ label: "...", value: null }];
  public lfrecuenciainteres: SelectItem[] = [{ label: "...", value: null }];
  public lorigenfondos: SelectItem[] = [{ label: "...", value: null }];
  public ldestinofondos: SelectItem[] = [{ label: "...", value: null }];
  public ltipocredito: SelectItem[] = [{ label: '...', value: null }];
  public lsegmentos: SelectItem[] = [{ label: "...", value: null }];
  public lflujo: SelectItem[] = [{ label: "...", value: null }];
  public lconvenio: SelectItem[] = [{ label: "...", value: null }];
  public checkableAportaciones = false;
  public checkableReajuste = false;
  public checkableGarantia = false;
  public checkableRenovacion = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, "TcarProducto", "PRODUCTO", true, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
  }

  ngAfterViewInit() { }

  crearNuevo() {
    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.verreg = 0;
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
    const consulta = new Consulta(this.entityBean, "Y", "t.nombre", this.mfiltros, this.mfiltrosesp);
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.verreg = 0;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  habilitarEdicion() {
    if (!this.validaFiltrosRequeridos()) {
      return;
    }
    super.habilitarEdicion();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    if (resp.cod === "OK") {
      super.postQueryEntityBean(resp);
      if (resp.PRODUCTO.length > 0) {
        this.checkableAportaciones = resp.PRODUCTO[0].montoporaportaciones;
        this.checkableReajuste = resp.PRODUCTO[0].tasareajustable;
        this.checkableGarantia = resp.PRODUCTO[0].exigegarantia;
        this.checkableRenovacion = resp.PRODUCTO[0].renovacion;
      }
    }
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  validaGrabar() {
    return super.validaGrabar('NO HA REALIZADADO LA VALIDACIÓN DEL FORMULARIO [PRODUCTO]');
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  marcarAportaciones(value: boolean): void {
    this.checkableAportaciones = value;
    this.registro.porcentajeaportaciones = null;
  }

  marcarReajuste(value: boolean): void {
    this.checkableReajuste = value;
    this.registro.numerocuotasreajuste = null;
  }

  marcarGarantia(value: boolean): void {
    this.checkableGarantia = value;
    this.registro.porcentajegarantia = null;
  }

  marcarRenovacion(value: boolean): void {
    this.checkableRenovacion = value;
    this.registro.porcentajerenovacion = null;
  }
}
