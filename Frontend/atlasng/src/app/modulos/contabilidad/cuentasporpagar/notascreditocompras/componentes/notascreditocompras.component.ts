import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovProveedoresComponent } from '../../../lov/proveedores/componentes/lov.proveedores.component';
import { retry } from 'rxjs/operator/retry';
import { LovCuentasContablesComponent } from '../../../lov/cuentascontables/componentes/lov.cuentasContables.component';
import { AccionesRegistroComponent } from '../../../../../util/shared/componentes/accionesRegistro.component';

@Component({
  selector: 'app-notascreditocompras',
  templateUrl: 'notascreditocompras.html'
})
export class NotasCreditoComprasComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') 
  formFiltros: NgForm;
  @ViewChild(LovProveedoresComponent)
  lovproveedores: LovProveedoresComponent;
  @ViewChild(LovCuentasContablesComponent)
  private lovcuentascontables: LovCuentasContablesComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tconnotacreditocompras', 'NOTASCREDITOCOMPRAS', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.mcampos.notascruzadas = true;
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.mcampos.cpersona === undefined){
      super.mostrarMensajeError("SELECCIONE UN PROVEEDOR");
      return;
    }
    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.cpersona = this.mcampos.cpersona;
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
  }

  eliminarRegistro(registro: any) {
    if ((registro.ccomprobante !== null && registro.ccomprobante !== undefined)){
      super.mostrarMensajeError("LA NOTA DE CREDITO NO PUEDE SER EDITADA SI YA TIENE ASOCIADA UN COMPROBANTE CONTABLE");
      return;
    }
    this.componentehijo.selectRegistro(registro);
    this.componentehijo.eliminar();
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    if ((registro.ccomprobante !== null && registro.ccomprobante !== undefined)){
      super.mostrarMensajeError("LA NOTA DE CREDITO NO PUEDE SER EDITADA SI YA TIENE ASOCIADA UN COMPROBANTE CONTABLE");
      return;
    }
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.mfiltrosesp = {};
    if (!this.mcampos.notascruzadas){
      this.mfiltrosesp.cctaporpagar = ' is null';
    }

    this.mfiltros.cpersona = this.mcampos.cpersona; 
    const consulta = new Consulta(this.entityBean, 'Y', 't.cnotacreditocompras', this.mfiltros, this.mfiltrosesp);
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  fijarLovProveedores(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.mcampos.nproveedor = reg.registro.nombre;
      this.consultar();
    }
  }

  mostrarlovproveedores(): void {
    this.lovproveedores.showDialog();
  }

  mostrarlovcuentascontables(): void {
 
    this.lovcuentascontables.mfiltros.movimiento = true;
    this.lovcuentascontables.consultar();
    this.lovcuentascontables.showDialog(true);
  }  

  fijarLovCuentasContablesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.ncuenta = reg.registro.nombre;
      this.registro.ccuentaafectacion = reg.registro.ccuenta;
    }
  }

  desplegarNotasCruzadas(event){
    this.consultar();
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
    this.rqMantenimiento.mdatos.actualizarsaldosenlinea = true;
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod === 'OK'){
      this.enproceso = false;
      this.consultar();
    }else{
      super.mostrarMensajeError(resp.msgusu);
    }
  }

}
