import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
//import { LovProveedoresComponent } from '../../../lov/proveedores/componentes/lov.proveedores.component';
import { SelectItem } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';

@Component({
  selector: 'app-cobromigradas',
  templateUrl: 'cobromigradas.html'
})
export class CobromigradasComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  selectedRegistros: any = [];
  lregistrospendientes: any = [];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tconcuentaporcobrarmigrada', 'tconcuentaporcobrarmigrada', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    let finicio = new Date(this.anioactual, this.fechaactual.getMonth(), 1);
    // this.mfiltros.fingresoini = finicio;
    // this.mfiltros.fingresofin = this.fechaactual;
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
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


  //#region consultacuentasporpagar
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.estadocxccdetalle = 'MIGRAD';
    //this.mfiltros.tipocxc = 'LT'; //FILTRO PARA LIQUIDACION TOTAL DE REGISTRO
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cctaporcobrarmigrada', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tperproveedor','nombre','nbeneficiario','t.cpersona = i.cpersona and i.cliente = 0');
    consulta.addSubquery('tconcatalogo','nombre','ncuenta','t.ccuentaafectacion = i.ccuenta ');
    consulta.cantidad = 500;
    this.addConsulta(consulta);
    return consulta;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }


  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  //#endregion
  

  //Inicia MANTENIMIENTO *********************
  grabar(): void {

    if (this.selectedRegistros.length === 0 || this.estaVacio(this.selectedRegistros)) {
      super.mostrarMensajeError("NO EXISTEN REGISTROS SELECCIONADOS PARA REALIZAR COBRO");
      return;
    }

    this.crearDtoMantenimiento();
    super.grabar();
    this.lregistros=[];
  }

  public crearDtoMantenimiento() {
    // tslint:disable-next-line:forin
    this.lregistros = [];
    //for (const i in this.selectedRegistros) {
      const reg = this.selectedRegistros;
      reg.esnuevo = true;
      reg.estadocxccdetalle = 'COBRAD';
      this.lregistros.push(reg);
    //}
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    this.lregistros = [];
    this.lregistrospendientes = [];
  }

  // fijarLovProveedores(reg: any): void {
  //   if (reg.registro !== undefined) {
  //     this.mfiltros.cpersona = reg.registro.cpersona;
  //     this.mcampos.identificacion = reg.registro.identificacion;
  //     this.mcampos.nombre = reg.registro.nombre;
  //   }
  // }

  // mostrarlovproveedores(): void {
  //   this.lovproveedores.showDialog();
  // }
}
