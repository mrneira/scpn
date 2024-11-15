import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovCuentasContablesComponent } from '../../../../contabilidad/lov/cuentascontables/componentes/lov.cuentasContables.component';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { SelectItem } from 'primeng/primeng';
import { LovClasificadorComponent } from 'app/modulos/presupuesto/lov/clasificador/componentes/lov.clasificador.component';

@Component({
  selector: 'app-enlace-cuenta-clasificador',
  templateUrl: 'enlaceCuentaClasificador.html'
})
export class EnlaceCuentaClasificadorComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  @ViewChild(LovClasificadorComponent)
  private lovclasificador: LovClasificadorComponent;
  private catalogoDetalle: CatalogoDetalleComponent;
  public lmodulos: SelectItem[] = [{ label: '...', value: null }];

  @ViewChild(LovCuentasContablesComponent)
  private lovcuentasContables: LovCuentasContablesComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tpptcuentaclasificador', 'CUENTACLASIFICADOR', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
 
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (!this.validaFiltrosRequeridos()) {
      return;
    }

    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.registro.ccuenta = this.mfiltros.ccuenta;
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
    this.validaFiltrosConsulta();
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {

    const consulta = new Consulta(this.entityBean, 'Y', 't.ccuenta', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TconCatalogo', 'nombre', 'ncuenta', 'i.ccuenta = t.ccuenta and i.ccompania = t.ccompania');
    consulta.addSubquery('tgenmodulo', 'nombre', 'nmodulo', 'i.cmodulo = t.cmodulo');
    consulta.addSubquery('tpptclasificador', 'nombre', 'npartida', 'i.cclasificador = t.cclasificador');
    consulta.cantidad = 1000;
    this.addConsulta(consulta);
    return consulta;
  }


  private fijarFiltrosConsulta() {
    return true;
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

  /**Muestra lov de plantillas contables */
  mostrarlovclasificador(): void {
    this.lovclasificador.showDialog();
  }


  /**Retorno de lov de plantillas contables. */
  fijarLovClasificadorSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.npartida = reg.registro.nombre;
      this.registro.cclasificador = reg.registro.cclasificador;
    }
  }

  /**Muestra lov de cuentas contables */
  mostrarlovcuentasContables(): void {
    this.lovcuentasContables.showDialog(true);
  }


  /**Retorno de lov de cuentas contables. */
  fijarLovCuentasContablesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.ncuenta = reg.registro.nombre;
      this.mfiltros.ccuenta = reg.registro.ccuenta;
      this.consultar();
    }
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
    const conModulo = new Consulta('tgenmodulo', 'Y', 't.nombre', { activo:true,negocio:true }, {});
    conModulo.cantidad = 100;
    this.addConsultaCatalogos('MODULOS', conModulo, this.lmodulos, super.llenaListaCatalogo, 'cmodulo');
    this.ejecutarConsultaCatalogos();
  }


}
