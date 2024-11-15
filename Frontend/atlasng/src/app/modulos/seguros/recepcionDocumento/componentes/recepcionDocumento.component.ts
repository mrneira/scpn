import { SelectItem } from 'primeng/primeng';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';

@Component({
  selector: 'app-pago-seguro',
  templateUrl: 'recepcionDocumento.html'
})
export class RecepcionDocumentoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public selectedRegistros: any;
  public lestado: SelectItem[] = [{ label: '...', value: null }];
  private ccatalogoestado = 600;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TsgsPoliza', 'RECEPCIONDOCUMENTO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.consultarCatalogos();
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.fingreso', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TsgsTipoSeguroDetalle', 'nombre', 'ntiposeguro', 'i.ctiposeguro = t.ctiposeguro and i.verreg = 0');
    consulta.addSubqueryPorSentencia('SELECT p.identificacion FROM tcaroperacion o, tperpersonadetalle p WHERE o.cpersona = p.cpersona AND p.verreg = 0 AND o.coperacion = t.coperacioncartera', 'identificacion');
    consulta.addSubqueryPorSentencia('SELECT p.nombre FROM tcaroperacion o, tperpersonadetalle p WHERE o.cpersona = p.cpersona AND p.verreg = 0 AND o.coperacion = t.coperacioncartera', 'npersona');
    consulta.cantidad = 100;
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.cdetalleestado = 'ING';
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    if (resp.cod === "OK") {
      this.selectedRegistros = [];
    }
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    if (this.estaVacio(this.mcampos.cestado)) {
      this.mostrarMensajeError("ESTADO ES REQUERIDO");
      return;
    }
    if (!this.validaRegistros()) {
      this.mostrarMensajeError("NO HA SELECCIONADO REGISTROS");
      return;
    }

    this.lmantenimiento = []; // Encerar Mantenimiento
    super.addMantenimientoPorAlias(this.alias, this.getMantenimiento(1));
    super.grabar();
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod === "OK") {
      this.enproceso = false;
      this.consultar();
    }
  }
  // Fin MANTENIMIENTO *********************

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosEstado: any = { 'ccatalogo': this.ccatalogoestado, 'activo': true };
    const consultaEstado = new Consulta('TgenCatalogoDetalle', 'Y', 't.nombre', mfiltrosEstado, {});
    consultaEstado.cantidad = 100;
    this.addConsultaCatalogos('ESTADODOCUMENTO', consultaEstado, this.lestado, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }

  validaRegistros(): boolean {
    for (const i in this.selectedRegistros) {
      if (this.selectedRegistros.hasOwnProperty(i)) {
        const reg: any = this.selectedRegistros[i];
        reg.actualizar = true;
        reg.ccatalogoestado = this.ccatalogoestado;
        reg.cdetalleestado = this.mcampos.cestado;
        this.selectRegistro(reg);
        this.actualizar();
      }
    }
    if (this.selectedRegistros != null && this.selectedRegistros.length > 0) {
      return true;
    }
    return false;
  }
}
