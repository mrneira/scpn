import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';


@Component({
  selector: 'app-expediente',
  templateUrl: 'expediente.html'
})
export class ExpedienteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public lestado: SelectItem[] = [{ label: '...', value: null }];
  public lbancos: SelectItem[] = [{ label: '...', value: null }];
  public ltipocuenta: SelectItem[] = [{ label: '...', value: null }];
  public ltipoNovedad: SelectItem[] = [{ label: '...', value: null }];

  fecha = new Date();
  mensaje = "";
  public edited = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TpreExpediente', 'EXPEDIENTE', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.llenarEstado();

  }

  ngAfterViewInit() {
    //this.mfiltros.cpersona = 0;
  }

  crearNuevo() {

  }

  actualizar() {

  }


  cancelar() {

  }


  // Inicia CONSULTA *********************
  consultar() {
    if (!this.validaFiltrosConsulta()) {
      return;
    }

    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.secuencia', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nestado', 't.ccatalogoestado = i.ccatalogo and t.cdetalleestado = i.cdetalle');
    consulta.addSubquery('tperpersonadetalle', 'nombre', 'npersona', 't.cpersona = i.cpersona and t.ccompania = i.ccompania and i.verreg = 0');
    consulta.addSubquery('tperpersonadetalle', 'identificacion', 'cedula', 't.cpersona = i.cpersona and t.ccompania = i.ccompania and i.verreg = 0');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'netapa', 't.ccatalogoetapa = i.ccatalogo and t.cdetalleetapa = i.cdetalle');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'ntipo', 't.ccatalogotipoexp = i.ccatalogo and t.cdetalletipoexp = i.cdetalle');
    this.addConsulta(consulta);

    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.ccompania = this.dtoServicios.mradicacion.ccompania
    this.mfiltros.anticipo = false;
    this.mfiltrosesp.cdetalleestado = "not in ('NEG')";
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
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

  }

  llenarEstado() {
    this.lestado = [];
    this.lestado.push({ label: '...', value: null });
    this.lestado.push({ label: 'ACTIVO', value: 'ACT' });
    this.lestado.push({ label: 'INACTIVO', value: 'INA' });
  }
}
