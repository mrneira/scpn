import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
//import { SelectItem } from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../../../generales/catalogos/componentes/_catalogoDetalle.component';
//import { any } from 'codelyzer/util/function';
import { LovCuentasContablesComponent } from '../../../../../lov/cuentascontables/componentes/lov.cuentasContables.component';
import { LovPartidaGastoComponent } from '../../../../../../presupuesto/lov/partidagasto/componentes/lov.partidagasto.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-detalle',
  templateUrl: '_detalle.html'
})
export class DetalleComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Output() calcularTotalesIREvent = new EventEmitter();

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovCuentasContablesComponent)
  private lovcuentasContables: LovCuentasContablesComponent;

  @ViewChild(LovPartidaGastoComponent)
  private lovPartidaGasto: LovPartidaGastoComponent;

  public totaldocumentosrespaldo = 0;
  public totalvalido = 0;
  public totaltransporte = 0;

  private catalogoDetalle: CatalogoDetalleComponent

  public ltipo: SelectItem[] = [{ label: '...', value: null }, { label: 'VIATICOS', value: 'VIATICOS' }, { label: 'TRANSPORTE', value: 'TRANSPORTE' }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tconliqgastosdetalle', 'DETALLE', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    //this.consultarImpuestos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    this.registro.fingreso = this.fechaactual;
    this.registro.ccompromiso = "";
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
  }

  actualizar() {
    if (this.registro.padre === undefined) {
      this.registro.padre = this.mfiltros.padre;
    }
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
    this.calcularTotalesIREvent.emit();
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

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.secuencia', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tconcatalogo', 'nombre', 'ncuenta', 'i.ccuenta = t.ccuenta');
    consulta.addSubquery('tpptpartidagasto','nombre','npartida','t.cpartida = i.cpartidagasto and i.aniofiscal =' + this.anioactual );
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    this.CalcularValores();
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
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

  crearNuevoRegistro() {
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    super.crearnuevoRegistro();
  }

  /**Muestra lov de cuentas contables */
  mostrarlovcuentasContables(): void {
    this.lovcuentasContables.mfiltros.activa = true;
    this.lovcuentasContables.showDialog(true);
  }

  /**Retorno de lov de cuentas contables. */
  fijarLovCuentasContablesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.tipoplancdetalle = reg.registro.tipoplancdetalle;
      this.registro.mdatos.ncuenta = reg.registro.nombre;
      this.registro.ccuenta = reg.registro.ccuenta;
    }

  }

  /**Muestra lov de Partida Gasto */
  mostrarlovPartidaGasto(): void {
    this.lovPartidaGasto.mfiltros.movimiento = true;
    this.lovPartidaGasto.showDialog();
  }

  /**Retorno de lov de Partida Gasto. */
  fijarLovPartidaGastoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cpartida = reg.registro.cpartidagasto;
      this.registro.mdatos.npartida = reg.registro.nombre;
    }

  }

  private cerrarDialogo(): void {
    this.CalcularValores();
  }

  CalcularValores(): void {
    this.totalvalido = 0;
    this.totaldocumentosrespaldo = 0;
    this.totaltransporte = 0;
    for (const i in this.lregistros) {
      const reg = this.lregistros[i];
      if (reg.tipo === 'VIATICOS') {
        this.totalvalido += reg.valorvalido;
        this.totaldocumentosrespaldo += reg.total;
      } else {
        this.totaltransporte += reg.valorvalido;    
      }
    }
  }

  calculariva(): void {
    this.registro.iva = this.redondear(this.registro.subtotal * 0.12, 2);
    this.calculartotal()
  }

  calculartotal(): void {
    this.registro.total = this.registro.subtotal + this.registro.iva;
    this.registro.valorvalido = this.registro.subtotal + this.registro.iva;
  }

  setvalorvalido(): void {
    if (this.estaVacio(this.registro.comentario)) {
      this.registro.valorvalido = this.registro.subtotal + this.registro.iva;
    } else {
      this.registro.valorvalido = 0.00;
    }
  }
}
