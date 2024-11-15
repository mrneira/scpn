import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-condicion-socio',
  templateUrl: 'condicionSocio.html'
})
export class CondicionSocioComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public lestados: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarCondicionSocio', 'CONDICIONSOCIO', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.optlock = 0;
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
    this.registrarEtiqueta(registro, this.lestados, 'cestadosocio', 'nestadosocio');
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.ccondicionsocio', this.mfiltros, this.mfiltrosesp, this.mfiltrosigual);
    consulta.addSubquery('TsocEstadoSocio', 'nombre', 'nestadosocio', 'i.cestadosocio = t.cestadosocio');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = [];
    this.crearDtoMantenimiento();
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);

    this.enproceso = false;
    this.consultar();
  }
  // Fin MANTENIMIENTO *********************

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    const conEstado = new Consulta('TsocEstadoSocio', 'Y', 't.nombre', this.mfiltros, this.mfiltrosesp);
    conEstado.cantidad = 50;
    this.addConsultaCatalogos('ESTADOSOCIO', conEstado, this.lestados, super.llenaListaCatalogo, 'cestadosocio');

    this.ejecutarConsultaCatalogos();
  }

}
