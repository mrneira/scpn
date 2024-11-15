import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { SpinnerModule } from 'primeng/primeng';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from "primeng/primeng";
import { LovSaldoComponent } from '../../../../monetario/lov/saldo/componentes/lov.saldo.component';

@Component({
  selector: 'app-prelacion-cobro',
  templateUrl: 'prelacionCobro.html'
})
export class PrelacionCobroComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovSaldoComponent)
  private lovsaldo: LovSaldoComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarPrelacionCobro', 'PRELACIONCOBRO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.cmodulo = 7;
  }

  actualizar() {
    if (!this.validaDatosRegistro(this.registro)) {
      this.mostrarMensajeWarn("EXISTEN DATOS DUPLICADOS");
      return;
    }
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
    this.registro.ctipoproducto = registro.ctipoproducto;
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.orden', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TmonSaldo', 'nombre', 'nsaldo', 'i.csaldo = t.csaldo');
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
  // Fin MANTENIMIENTO *********************

  /**Muestra lov de saldo */
  mostrarlovsaldo(): void {
    this.lovsaldo.consultar();
    this.lovsaldo.showDialog();
  }

  /**Retorno de lov de saldo. */
  fijarLovSaldoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.nsaldo = reg.registro.nombre;
      this.registro.csaldo = reg.registro.csaldo;
    }
  }

  validaDatosRegistro(reg: any): boolean {
    super.encerarMensajes();
    const existeSaldo = this.lregistros.find(x => x.csaldo === reg.csaldo && Number(x.idreg) !== Number(reg.idreg));
    const existeOrden = this.lregistros.find(x => Number(x.orden) === Number(reg.orden) && Number(x.idreg) !== Number(reg.idreg));
    const existeRubro = this.lregistros.find(x => Number(x.rubro) === Number(reg.rubro) && Number(x.idreg) !== Number(reg.idreg));

    if (!this.estaVacio(existeSaldo) || !this.estaVacio(existeOrden) || !this.estaVacio(existeRubro)) {
      return false;
    }
    return true;
  }
}
