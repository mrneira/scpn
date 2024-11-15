import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovProveedoresComponent } from '../../../lov/proveedores/componentes/lov.proveedores.component';
import { retry } from 'rxjs/operator/retry';
import { LovCuentasporpagarComponent } from '../../../lov/cuentasporpagar/componentes/lov.cuentasporpagar.component';
import { AccionesRegistroComponent } from '../../../../../util/shared/componentes/accionesRegistro.component';

@Component({
  selector: 'app-crucenotascreditocompras',
  templateUrl: 'crucenotascreditocompras.html'
})
export class CruceNotasCreditoComprasComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros')
  formFiltros: NgForm;
  @ViewChild(LovProveedoresComponent)
  lovproveedores: LovProveedoresComponent;
  @ViewChild(LovCuentasporpagarComponent)
  private lovcuentasporpagar: LovCuentasporpagarComponent;
  selectedRegistros: any = [];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tconnotacreditocompras', 'NOTASCREDITOCOMPRAS', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
  }

  actualizar() {
  }

  eliminar() {
  }

  cancelar() {
  }

  public selectRegistro(registro: any) {
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.mfiltrosesp.cctaporpagar = ' is null';
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
      this.mostrarlovcuentasporpagar();
    }
  }

  mostrarlovproveedores(): void {
    this.lovproveedores.showDialog();
  }

  fijarLovCuentasporpagar(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cctaporpagar = reg.registro.cctaporpagar;
      this.mcampos.ccompcontable = reg.registro.ccompcontable;
      this.mcampos.valorpagar = reg.registro.valorpagar - reg.registro.valornotascredito;
      this.mcampos.valorapagar = reg.registro.valorpagar - reg.registro.valornotascredito;
      this.mcampos.totalnotascredito = 0;
      this.msgs = [];
      this.consultar();
    }
  }

  mostrarlovcuentasporpagar(): void {
    this.lovcuentasporpagar.mfiltros.cpersona = this.mcampos.cpersona;
    this.lovcuentasporpagar.mfiltros.estadocxpcdetalle = "CONTAB";
    this.lovcuentasporpagar.showDialog();
    this.lovcuentasporpagar.consultar();
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
    this.rqMantenimiento.mdatos.cctaporpagar = this.mcampos.cctaporpagar;
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod === 'OK') {
      this.recargar();
    } else {
      super.mostrarMensajeError(resp.msgusu);
    }
  }

  checked(reg, event) {

    if (event.currentTarget.checked === true) {
      const valorapagar = Math.round(this.mcampos.valorapagar * 100)/100;
      if ((valorapagar - reg.total) >= 0 ) {
        this.mcampos.totalnotascredito += reg.total;
        this.mcampos.valorapagar = this.mcampos.valorpagar - this.mcampos.totalnotascredito;
        this.selectedRegistros.push(reg);
      }
      else{
        event.currentTarget.checked = false;
      }
    }else{
      this.mcampos.totalnotascredito -= reg.total;
      this.mcampos.valorapagar = this.mcampos.valorpagar + this.mcampos.totalnotascredito;
      this.selectedRegistros.pop(reg);
    }

  }
}
