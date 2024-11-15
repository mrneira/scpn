import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';


@Component({
  selector: 'app-comprobante',
  templateUrl: '_comprobante.html'
})
export class ComprobanteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public fcontable: string;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tconcuentaporpagar', 'CABECERA', true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.crearNuevo();
    this.mcampos.camposfecha.fcontable = null;
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.registro.sustentoccatalogo = 1008;
    this.registro.tcomprobanteccatalogo = 1007
    this.registro.porcentajeivaccatalogo = 1011;
    this.registro.porcentajeiceccatalogo = 1010;
    this.registro.porretbienesccatalogo = 1006;
    this.registro.porretserviciosccatalogo = 1004;
    this.registro.formapagoccatalogo = 1009;
    this.registro.estadocxpccatalogo = 1005;
    this.registro.estadocxpcdetalle = "INGRE";
    this.registro.centrocostosccatalogo = 1002;
    this.registro.baseimponible = 0;
    this.registro.baseimpgrav = 0;
    this.registro.montoiva = 0;
    this.registro.baseimpice = 0;
    this.registro.montoice = 0;
    this.registro.valormulta = 0;
    this.registro.valornotascredito = 0;
    this.registro.ruteopresupuesto = true;
    this.registro.exentoretencion = false;
  }

  actualizar() {
    if (this.registro.padre === undefined) {
      this.registro.padre = this.mfiltros.padre;
    }
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

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cctaporpagar', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tconplantilla', 'nombre', 'pnombre', 'i.cplantilla = t.cplantilla');
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
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
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any, dtoext = null) {
    if (resp.hasOwnProperty('fcontable')) {
      this.fcontable = super.integerToFormatoFecha(resp.fcontable);
    }
    super.postCommitEntityBean(resp, dtoext);
  }
}
