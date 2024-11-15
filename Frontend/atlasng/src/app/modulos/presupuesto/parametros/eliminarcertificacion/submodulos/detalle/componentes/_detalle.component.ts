import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { AccordionModule } from 'primeng/primeng';
import { LovPartidaGastoComponent } from '../../../../../lov/partidagasto/componentes/lov.partidagasto.component';

@Component({
  selector: 'app-detalle',
  templateUrl: '_detalle.html'
})
export class DetalleComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;


  @ViewChild(LovPartidaGastoComponent)
  private lovPartidaGasto: LovPartidaGastoComponent;

  @Output() calcularTotalesEvent = new EventEmitter();

  public totalCantidad = 0;
  public totalValor = 0;
  public indice: number;
  private catalogoDetalle: CatalogoDetalleComponent

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tpptcertificaciondetalle', 'DETALLE', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
  }

  actualizar() {
    if (this.registro.padre === undefined) {
      this.registro.padre = this.mfiltros.padre;
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
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.secuencia', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tpptpartidagasto', 'nombre', 'npartida', 'i.cpartidagasto = t.cpartidagasto and i.aniofiscal = 2019');
    consulta.cantidad = 100;
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
    let lista = resp.DETALLE;
    let listaResp = [];
    resp.DETALLE = undefined;
    for (const i in lista) {
      if (lista.hasOwnProperty(i)) {
        const reg = lista[i];
        reg.mdatos.cpartidagasto = reg.cpartidagasto;
        reg.mdatos.npartida = reg.mdatos.npartida;
        listaResp.push(reg);
      }
    }
    resp.DETALLE = listaResp;
    super.postQueryEntityBean(resp);
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
    super.crearnuevoRegistro();
  }

  
  /**Muestra lov de Partida Gasto */
  mostrarlovPartidaGasto(): void {
    this.lovPartidaGasto.mfiltros.movimiento = true;
    this.lovPartidaGasto.showDialog();
  }

  /**Retorno de lov de Partida Gasto. */
  fijarLovPartidaGastoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.cpartidagasto = reg.registro.cpartidagasto;
      this.registro.mdatos.vasignacioninicial = reg.registro.vasignacioninicial;
      this.registro.mdatos.vmodificado = reg.registro.vmodificado;
      this.registro.mdatos.vcodificado = reg.registro.vcodificado;
      this.registro.mdatos.vcomprometido = reg.registro.vcomprometido;
      this.registro.mdatos.vdevengado = reg.registro.vdevengado;
      this.registro.mdatos.vpagado = reg.registro.vpagado;
      this.registro.mdatos.vsaldoporcomprometer = reg.registro.vsaldoporcomprometer;
      this.registro.mdatos.vsaldopordevengar = reg.registro.vsaldopordevengar;
      this.registro.mdatos.vsaldoporpagar = reg.registro.vsaldoporpagar;
      this.registro.mdatos.npartida = reg.registro.nombre;
      this.registro.mdatos.aniofiscal = reg.registro.aniofiscal;
    }

  }

  validarSaldoPorComprometer():void{
    this.msgs = [];
    if (this.registro.valor > this.registro.mdatos.vsaldoporcomprometer){
      super.mostrarMensajeError("VALOR NO PUEDE SUPERAR EL SALDO POR COMPROMETER");
      this.registro.valor = undefined;
      return;
    }
  }

  consultarCatalogos(): void {

  }

  cerrarDialogo(): void {
    this.calcularTotales();
  }

  cambiarCantidad(indice, event): void {
     this.calcularTotales();
  }

  validarCantidad(): void {
  }

  calcularTotales(): void {
    this.totalValor = 0;
    for (const i in this.lregistros) {
      const reg = this.lregistros[i];
      this.totalValor += reg.valor;
    }
  }

}
