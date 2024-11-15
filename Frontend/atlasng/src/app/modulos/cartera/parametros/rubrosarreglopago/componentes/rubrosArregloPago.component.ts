import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovSaldoComponent } from '../../../../monetario/lov/saldo/componentes/lov.saldo.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-calf-arreglo',
  templateUrl: 'rubrosArregloPago.html'
})
export class RubrosArregloPagoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild('saldo')
  private lovsaldo: LovSaldoComponent;

  @ViewChild('saldodestino')
  private lovsaldodestino: LovSaldoComponent;

  public ltipoarreglopago: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarRubrosArregloPago', 'RUBROSARREGLOPAGO', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.estaVacio(this.mfiltros.ctipoarreglopago)) {
      this.mostrarMensajeError('TIPO DE NEGOCIACIÓN DE PAGO REQUERIDO');
      return;
    }
    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.ctipoarreglopago = this.mfiltros.ctipoarreglopago;
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.ctipoarreglopago', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TmonSaldo', 'nombre', 'nsaldo', 'i.csaldo=t.csaldo');
    consulta.addSubquery('TmonSaldo', 'nombre', 'nsaldodestino', 'i.csaldo=t.csaldodestino');
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

  /**Muestra lov de saldo */
  mostrarlovsaldo(): void {
    this.lovsaldo.showDialog();
  }

  /**Retorno de lov de saldo. */
  fijarLovSaldoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.nsaldo = reg.registro.nombre;
      this.registro.csaldo = reg.registro.csaldo;

    }
  }

  /**Muestra lov de saldo */
  mostrarlovsaldodestino(): void {
    this.lovsaldodestino.showDialog();
  }

  /**Retorno de lov de saldo. */
  fijarLovSaldoDestinoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.nsaldodestino = reg.registro.nombre;
      this.registro.csaldodestino = reg.registro.csaldo;

    }
  }

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const consultaTipArreglo = new Consulta('TcarTipoArregloPago', 'Y', 't.nombre', {}, {});
    consultaTipArreglo.cantidad = 30;
    this.addConsultaCatalogos('TIPOARREGLO', consultaTipArreglo, this.ltipoarreglopago, this.llenaTipoArreglo, 'ctipoarreglopago', this.componentehijo, false);

    this.ejecutarConsultaCatalogos();
  }

  public llenaTipoArreglo(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    super.llenaListaCatalogo(pLista, pListaResp, campopk, agregaRegistroVacio, componentehijo);

    componentehijo.mfiltros.ctipoarreglopago = pLista[0].value;
  }

}
