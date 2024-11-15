import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CanalesComponent } from '../../../generales/canales/componentes/canales.component';
import { ModulosComponent } from '../../../generales/modulos/componentes/modulos.component';
import { LovTransaccionesComponent } from '../../lov/transacciones/componentes/lov.transacciones.component';


@Component({
  selector: 'app-comp-consulta',
  templateUrl: 'componentesMantenimiento.html'
})
export class ComponentesMantenimientoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovTransaccionesComponent)
  private lovtransacciones: LovTransaccionesComponent;

  public lcanales: SelectItem[] = [{label: '...', value: null}];
  public lmodulos: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TgenCompMantenimiento', 'COMPMANT', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);

    this.mfiltros.ccanal = 'OFI';

    const canales = new CanalesComponent(this.router, this.dtoServicios);
    this.addConsultaCatalogos(canales.alias, canales.crearDtoConsulta(), this.lcanales, super.llenaListaCatalogo, 'ccanal');

    const modulos = new ModulosComponent(this.router, this.dtoServicios);
    this.addConsultaCatalogos(modulos.alias, modulos.crearDtoConsulta(), this.lmodulos, super.llenaListaCatalogo, 'cmodulo');
    this.ejecutarConsultaCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.estaVacio(this.mfiltros.ccanal) || this.estaVacio(this.mfiltros.cmodulo)) {
      this.mostrarMensajeError('FILTROS REQUERIDOS');
      return;
    }
    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.ccanal = this.mfiltros.ccanal;
    this.registro.cmodulo = this.mfiltros.cmodulo;
    this.registro.ctransaccion = this.mfiltros.ctransaccion;
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.cmodulo, t.ctransaccion, t.orden', this.mfiltros, this.mfiltrosesp);
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
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

  /**Muestra lov de transacciones */
  mostrarLovTransacciones(): void {
    this.lovtransacciones.showDialog();
  }

  /**Retorno de lov de transacciones. */
  fijarLovTransaccionesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.nmodulo = reg.registro.mdatos.nmodulo;
      this.mcampos.ntransaccion = reg.registro.nombre;
      this.mfiltros.cmodulo = reg.registro.cmodulo;
      this.mfiltros.ctransaccion = reg.registro.ctransaccion;

      this.consultar();
    }
  }

}
