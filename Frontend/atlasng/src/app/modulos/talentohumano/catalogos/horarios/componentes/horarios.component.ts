import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';

import { HorarioPadreComponent } from './_horarioPadre.component';
import { HorarioDetalleComponent } from './_horarioDetalle.component';
import { LovCatalogosComponent } from '../../../../generales/lov/catalogos/componentes/lov.catalogos.component';
import { LovHorarioComponent } from '../../../lov/horario/componentes/lov.horario.component';

@Component({
  selector: 'app-horarios',
  templateUrl: 'horarios.html'
})
export class HorariosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(HorarioPadreComponent)
  catalogoPadreComponent: HorarioPadreComponent;

  @ViewChild(HorarioDetalleComponent)
  catalogoDetalleComponent: HorarioDetalleComponent;

  @ViewChild(LovHorarioComponent)
  private lovHorario: LovHorarioComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'MANTUSUARIO', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  selectRegistro(registro: any) {
    // No existe para el padre
  }

  crearNuevo() {
    // No existe para el padre
  }

  actualizar() {
    // No existe para el padre
  }

  eliminar() {
    // No existe para el padre
  }

  cancelar() {
    // No existe para el padre
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    // Consulta datos.
    const conCatalogoPadre = this.catalogoPadreComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.catalogoPadreComponent.alias, conCatalogoPadre);

    const conCatalogoDetalle = this.catalogoDetalleComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.catalogoDetalleComponent.alias, conCatalogoDetalle);
  }

  private fijarFiltrosConsulta() {
    this.catalogoPadreComponent.fijarFiltrosConsulta();
    this.catalogoDetalleComponent.fijarFiltrosConsulta();
  }

  validaFiltrosConsulta(): boolean {
    return this.catalogoPadreComponent.validaFiltrosRequeridos() && this.catalogoDetalleComponent.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.catalogoPadreComponent.postQueryEntityBean(resp);
    this.catalogoDetalleComponent.postQueryEntityBean(resp);
  }

  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    super.addMantenimientoPorAlias(this.catalogoPadreComponent.alias, this.catalogoPadreComponent.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.catalogoDetalleComponent.alias, this.catalogoDetalleComponent.getMantenimiento(2));

    // para adicionar otros entity bean super.addMantenimientoPorAlias('alias',mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  public postCommit(resp: any) {
    this.catalogoPadreComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.catalogoPadreComponent.alias));
    this.catalogoDetalleComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.catalogoDetalleComponent.alias));

  }


  /**Muestra lov de catalogos */
  mostrarLovHorarios(): void {
    this.lovHorario.showDialog();
  }

  /**Retorno de lov de catalogos. */
  fijarLovHorariosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.chorario = reg.registro.chorario;
      this.mcampos.nombre = reg.registro.nombre;
      this.catalogoPadreComponent.mfiltros.chorario = reg.registro.chorario;
      this.catalogoDetalleComponent.mfiltros.chorario = reg.registro.chorario;

      this.consultar();
    }
  }

  validaGrabar() {
    return this.catalogoPadreComponent.validaGrabar();
  }
  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta("C")).subscribe(
      resp => {
        this.manejaRespuestaCatalogos(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      }
    );
  }

  llenarConsultaCatalogos(): void {
  
    const mfiltrosTipo: any = { 'ccatalogo': 1116 };
    const mfiltrosespTipo: any = { 'cdetalle': null };
    const consultaTipo = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosTipo, mfiltrosespTipo);
    consultaTipo.cantidad = 50;
    this.addConsultaPorAlias('TIPO', consultaTipo);

    const mfiltrosDias: any = { 'ccatalogo': 5 };
    const mfiltrosespDias: any = { 'cdetalle': null };
    const consultaDias = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosDias, mfiltrosespDias);
    consultaDias.cantidad = 50;
    this.addConsultaPorAlias('DIAS', consultaDias);
  }
  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.catalogoPadreComponent.ljornada, resp.JORNADA, 'cdetalle');
      this.llenaListaCatalogo(this.catalogoPadreComponent.ltipo, resp.TIPO, 'cdetalle');
      this.llenaListaCatalogo(this.catalogoDetalleComponent.ldias, resp.DIAS, 'cdetalle');




    }
    this.lconsulta = [];
  }

}
