import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { ModulosComponent } from '../../../generales/modulos/componentes/modulos.component';

@Component({
  selector: 'app-transaccion',
  templateUrl: 'transaccion.html'
})
export class TransaccionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public lmodulos: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TgenTransaccion', 'TRANSACCION', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
     this.consultarCatalogos();
  }

  ngAfterViewInit() {
   
  }

  crearNuevo() {
    if (this.estaVacio(this.mfiltros.cmodulo)) {
      this.mostrarMensajeError('MÓDULO REQUERIDO');
      return;
    }
    super.crearNuevo();
    this.registro.cmodulo = this.mfiltros.cmodulo;
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
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.nombre', this.mfiltros, this.mfiltrosesp);
    consulta.cantidad = 50;
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

  cambiarModulo(event: any): any {
    if (this.mfiltros.cmodulo === undefined || this.mfiltros.cmodulo === null) {
      return;
    };
    this.consultar();
  }
  
  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuestaCatalogos(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  llenarConsultaCatalogos(): void {
    const mfiltrosModulo: any = { 'activo': true };
    const consultaModulo = new Consulta('TgenModulo', 'Y', 't.nombre', mfiltrosModulo, {});
    consultaModulo.cantidad = 50;
    this.addConsultaPorAlias('MODULO', consultaModulo);
  }
  
  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.lmodulos, resp.MODULO, 'cmodulo');

    }
    this.lconsulta = [];
  }

}
