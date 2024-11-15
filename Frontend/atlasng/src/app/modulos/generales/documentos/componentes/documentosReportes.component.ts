import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-documentos-reporte',
  templateUrl: 'documentosReportes.html'
})
export class DocumentosReportesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public lmodulos: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tgendocumentos', 'DOCUMENTOREPORTE', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (!super.validaFiltrosRequeridos('FILTROS REQUERIDOS')) {
      return;
    }
    super.crearNuevo();
    this.registro.activo = false;
    this.registro.cmodulo = this.mfiltros.cmodulo;
    super.registrarEtiqueta(this.registro, this.lmodulos, 'cmodulo', 'nmodulo')
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.nombre', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenModulo', 'nombre', 'nmodulo', 't.cmodulo = i.cmodulo');
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

  validaGrabar() {
    if (!super.validaFiltrosRequeridos('FILTROS REQUERIDOS')) {
      return false;
    }
    else {
      if (this.lregistros.length > 0) {
        return true;
      }
      else {
        this.mostrarMensajeError('DEBE INGRESAR AL MENOS UN REGISTRO');
      }
    }
  }

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

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosMod: any = { 'activo': true, 'negocio': true };
    const consultaMod = new Consulta('TgenModulo', 'Y', 't.nombre', mfiltrosMod, {});
    consultaMod.cantidad = 100;
    this.addConsultaCatalogos('MODULO', consultaMod, this.lmodulos, super.llenaListaCatalogo, 'cmodulo');

    this.ejecutarConsultaCatalogos();
  }

}
