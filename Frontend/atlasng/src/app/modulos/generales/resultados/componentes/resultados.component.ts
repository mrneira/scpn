import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { LovCatalogosDetalleComponent } from '../../../generales/lov/catalogosdetalle/componentes/lov.catalogosDetalle.component';


@Component({
  selector: 'app-resultados',
  templateUrl: 'resultados.html'
})
export class ResultadosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovCatalogosDetalleComponent)
  private lovCatalogosDetalle: LovCatalogosDetalleComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TgenResultados', 'RESULTADO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);

    this.lovCatalogosDetalle.mdesabilitaFiltros['ccatalogo'] = true;
    this.lovCatalogosDetalle.mfiltros.ccatalogo = 3;
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (!this.validaFiltrosConsulta()) {
      return;
    }
    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.ccatalogo = this.mfiltros.ccatalogo;
    this.registro.cdetalle = this.mfiltros.cdetalle;
    this.registro.cresultadosql=this.mfiltros.cresultadosql;
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.cresultado', this.mfiltros, this.mfiltrosesp);
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    if (this.mfiltros.ccatalogo === undefined || this.mfiltros.ccatalogo === null) {
      this.mostrarMensajeError('FILTRO DE CATÁLOGO REQUERIDO');
      return false;
    }
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

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  /**Muestra lov de catalogos detalle */
  mostrarLovCatalogosDetalle(): void {
    this.lovCatalogosDetalle.consultar();
    this.lovCatalogosDetalle.showDialog();
  }

  /**Retorno de lov de catalogos detalle */
  fijarLovCatalogosDetalleSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.ccatalogo = reg.registro.ccatalogo;
      this.mfiltros.cdetalle = reg.registro.cdetalle;
      this.mcampos.ncatalogodetalle = reg.registro.nombre;

      this.consultar();
    }
  }

}
