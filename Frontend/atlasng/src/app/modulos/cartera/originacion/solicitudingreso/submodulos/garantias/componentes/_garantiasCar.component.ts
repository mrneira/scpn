import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta, Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovOperacionGarComponent } from '../../../../../../garantias/lov/operacion/componentes/lov.operacionGar.component';
import { LovCotizadorSegurosComponent } from '../../../../../../seguros/lov/cotizador/componentes/lov.cotizador.component';

@Component({
  selector: 'app-garantias-car',
  templateUrl: '_garantiasCar.html'
})
export class GarantiasCarComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovOperacionGarComponent)
  private lovgar: LovOperacionGarComponent;

  @ViewChild(LovCotizadorSegurosComponent)
  private lovseg: LovCotizadorSegurosComponent;

  public habilitaNuevo = true;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarSolicitudGarantias', 'GARANTIASSOL', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.mdatos.formapago = "D";
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
    if (!this.validaFiltrosRequeridos()) {
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', '', this.mfiltros, this.mfiltrosesp);
    consulta.addSubqueryPorSentencia('select i.nombre from TgarClasificacion i where i.cclasificacion=(select go.cclasificacion from TgarOperacion go where go.coperacion=t.coperaciongarantia)', 'nclasificacion');
    consulta.addSubqueryPorSentencia('select i.nombre from TgarTipoGarantia i where i.ctipogarantia=(select go.ctipogarantia from TgarOperacion go where go.coperacion=t.coperaciongarantia)', 'ntipogar');
    consulta.addSubqueryPorSentencia('select i.nombre from TgarTipoBien i where (i.ctipogarantia +\'-\'+ i.ctipobien)=(select (gop.ctipogarantia +\'-\'+ gop.ctipobien) from TgarOperacion gop where gop.coperacion=t.coperaciongarantia)', 'ntipobien');
    consulta.addSubqueryPorSentencia('select i.nombre from TgarEstatus i where i.cestatus=(select go.cestatus from TgarOperacion go where go.coperacion=t.coperaciongarantia)', 'nestado');
    consulta.addSubqueryPorSentencia('select isnull(i.montoseguro,0) from TcarSolicitudSeguros i where i.csolicitud=t.csolicitud and i.coperaciongarantia = t.coperaciongarantia', 'valorprima');
    consulta.addSubqueryPorSentencia('select formapago from TcarSolicitudSeguros i where i.csolicitud=t.csolicitud and i.coperaciongarantia = t.coperaciongarantia', 'formapago');
    consulta.addSubquery('TgarOperacionAvaluo', 'valoravaluo', 'montoavaluo', 'i.coperacion = t.coperaciongarantia and i.verreg=0');
    consulta.addSubquery('TgarOperacionAvaluo', 'valorcomercial', 'monto', 'i.coperacion = t.coperaciongarantia and i.verreg=0');

    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.csolicitud = this.mcampos.csolicitud;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    if (resp.cod === "OK") {
      for (const i in resp.GARANTIASSOL) {
        if (resp.GARANTIASSOL.hasOwnProperty(i)) {
          const reg: any = resp.GARANTIASSOL[i];
          if (!this.estaVacio(reg.mdatos.valorprima) && reg.mdatos.valorprima >= 0) {
            reg.mdatos.aplicaseguro = true;
          }
          if(!this.estaVacio(reg.mdatos.formapago) && reg.mdatos.formapago === "A"){
            this.habilitaNuevo = false;
          }
        }
      }
    }
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  /**Muestra lov de garantias */
  mostrarLovGarantias(): void {
    if (this.estaVacio(this.mcampos.cpersona)) {
      this.mostrarMensajeError('PERSONA REQUERIDA');
      return;
    }
    this.lovgar.mfiltros.cpersona = this.mcampos.cpersona;
    this.lovgar.mfiltros.cestatus = 'ING';
    this.lovgar.consultar();
    this.lovgar.showDialog();
  }

  /**Retorno de lov de garantias. */
  fijarLovGarantiasSelec(reg: any): void {
    if (reg.registro !== undefined) {
      if (this.estaVacio(reg.registro.mdatos.monto)) {
        this.mostrarMensajeError('AVALÚO DE GARANTÍA NO INGRESADO');
        return;
      }

      if (reg.registro.mdatos.aplicaseguro) {
        this.mostrarLovCotizadorSeguros(reg);
      } else {
        this.llenarRegistro(reg);
      }
    }
  }

  /**Muestra lov de seguros */
  mostrarLovCotizadorSeguros(reg: any): void {
    this.lovseg.registro = reg.registro;
    this.lovseg.showDialog();
  }

  /**Retorno de lov de seguros. */
  fijarLovSeguroSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.llenarRegistro(reg);
    }
  }

  /**Llenar datos registro */
  llenarRegistro(reg: any): void {
    this.crearNuevo();
    this.selectRegistro(this.registro);
    this.registro.coperaciongarantia = reg.registro.coperacion;
    this.registro.mdatos.nclasificacion = reg.registro.mdatos.nclasificacion;
    this.registro.mdatos.ntipogar = reg.registro.mdatos.ntipogar;
    this.registro.mdatos.ntipobien = reg.registro.mdatos.ntipobien;
    this.registro.mdatos.nestado = reg.registro.mdatos.nestatus;
    this.registro.mdatos.monto = reg.registro.mdatos.monto;
    this.registro.mdatos.montoavaluo = reg.registro.mdatos.montoavaluo;
    this.registro.mdatos.aplicaseguro = (this.estaVacio(reg.registro.mdatos.aplicaseguro)) ? false : reg.registro.mdatos.aplicaseguro;
    this.registro.mdatos.valorprima = (this.estaVacio(reg.registro.mdatos.total)) ? 0 : reg.registro.mdatos.total;
    this.actualizar();
  }

}
