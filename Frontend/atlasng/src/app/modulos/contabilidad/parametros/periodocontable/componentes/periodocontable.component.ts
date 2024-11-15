import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-periodo-contable',
  templateUrl: 'periodocontable.html'
})
export class PeriodoContableComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public lmesperiodocdetalle: SelectItem[] = [{label: '...', value: null}];
  private catalogoDetalle: CatalogoDetalleComponent;
  public nuevo = false;
  public permiteactivar = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tconperiodocontable', 'PERIODOCONTABLE', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
    this.consultar();  // para ejecutar consultas automaticas.

  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.registro.mesperiodoccatalogo = 1024;
    this.nuevo = true;
  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    this.encerarMensajes();
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
    this.nuevo = false;

    if (this.registro.anio === this.anioactual){
      if (this.registro.mesperiodocdetalle === this.mesactual.toString()){
        this.permiteactivar = true;
        return;
      }
    }
    this.permiteactivar = false;
  }

  // Inicia CONSULTA *********************

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1024;
    const conMesperiodo = this.catalogoDetalle.crearDtoConsulta();
    conMesperiodo.orderby = 'cdetalle';
    conMesperiodo.cantidad = 12;
    this.addConsultaCatalogos('MESPERIODO', conMesperiodo, this.lmesperiodocdetalle, super.llenaListaCatalogo, 'cdetalle');


    this.ejecutarConsultaCatalogos();

  }

  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.anio desc, t.mesperiodocdetalle desc', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'nmes', 'i.ccatalogo=t.mesperiodoccatalogo and i.cdetalle=t.mesperiodocdetalle');
    consulta.orderby = 'anio desc, mesperiodocdetalle desc';
    consulta.cantidad = 24;


    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
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

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  cerrarDialogo(){
    if (this.nuevo){
    this.registro.mdatos.nmes = this.lmesperiodocdetalle.find(x => x.value === this.registro.mesperiodocdetalle).label;
    }
  }

  validarAnio(){
    if (this.registro.anio < this.anioactual){
      super.mostrarMensajeError('EL AÑO DEBE SER MAYOR AL AÑO ACTUAL');
      this.registro.anio = undefined
      return;
    }
  }
}
