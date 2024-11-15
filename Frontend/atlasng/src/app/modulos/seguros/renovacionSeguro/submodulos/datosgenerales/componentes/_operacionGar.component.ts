import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovOperacionGarComponent } from '../../../../../garantias/lov/operacion/componentes/lov.operacionGar.component';

@Component({
  selector: 'app-operacion-garRe',
  template: '<app-lov-operacion-gar (eventoOperGar)=fijarLovOperacionSelec($event)></app-lov-operacion-gar>'
})
export class OperacionGarComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(LovOperacionGarComponent)
  private lovOperacion: LovOperacionGarComponent;

  public lproducto: SelectItem[] = [{ label: '...', value: null }];
  public ltipoproducto: SelectItem[] = [{ label: '...', value: null }];
  public ltipoproductototal: any = [];
  public ltipogarantia: SelectItem[] = [{ label: '...', value: null }];
  public ltiposbien = [];
  public ltipobien: SelectItem[] = [{ label: '...', value: null }];
  public lclasificacion: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TgarOperacion', 'TGAROPERACION', true, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.camposfecha.fvencimiento = null;
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.cmodulo = 9;
    this.registro.cmoneda = 'USD';
    this.registro.renovacion = false;
  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    super.cancelar();
    this.ltipoproducto = [];
    if (this.registro.cproducto !== undefined && this.registro.cproducto !== null) {
      this.fijarListaTipoProducto(this.registro.cproducto);
    };
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'N', '', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TperPersonaDetalle', 'identificacion', 'identificacion', 'i.cpersona = t.cpersona and i.ccompania = t.ccompania and i.verreg = 0 ');
     this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  habilitarEdicion() {
    if (this.estaVacio(this.mfiltros.cpersona)) {
      this.mostrarMensajeError('PERSONA REQUERIDA');
      return false;
    }
    if (!this.validaFiltrosRequeridos()) {
      return false;
    }
    return super.habilitarEdicion();
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    if (this.mfiltros.coperacion !== 0) {
      this.fijarListaTipoProducto(this.registro.cproducto);
      this.fijarListaTipoBien(this.registro.ctipogarantia);
    }
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
  }

  validaGrabar() {
    return super.validaGrabar('NO HA REALIZADADO LA VALIDACIÓN DEL FORMULARIO[DATOS GENERAL]');
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any, dtoext = null) {
    super.postCommitEntityBean(resp, dtoext);
  }

  /**
   * Consuta informacion del producto de cartera.
   */
  public cambiarTipoProducto(): any {
    if (this.registro.cproducto === undefined || this.registro.cproducto === null) {
      this.registro.ctipoproducto = null;
      return;
    };
    this.fijarListaTipoProducto(Number(this.registro.cproducto));
    if (this.ltipoproducto.length === 0) {
      this.registro.ctipoproducto = null;
      return;
    }
    this.registro.ctipoproducto = this.ltipoproducto[0].value;
  }

  fijarListaTipoProducto(cproducto: any) {
    while (this.ltipoproducto.length > 0) {
      this.ltipoproducto.pop();
    }
    for (const i in this.ltipoproductototal) {
      if (this.ltipoproductototal.hasOwnProperty(i)) {
        const reg: any = this.ltipoproductototal[i];
        if (reg !== undefined && reg.value !== null && reg.cproducto === Number(cproducto)) {
          this.ltipoproducto.push({ label: reg.nombre, value: reg.ctipoproducto });
        }
      }
    }
  }

  cambiaTipoGarantia() {
    if (this.registro.ctipogarantia === undefined || this.registro.ctipogarantia === null) {
      this.registro.ctipobien = null;
      return;
    };
    this.fijarListaTipoBien(this.registro.ctipogarantia);
    if (this.ltipogarantia.length === 0) {
      this.registro.ctipobien = null;
      return;
    }
    this.registro.ctipobien = this.ltipobien[0].value;
  }

  cambiaRenovacion(value: boolean): void {
    this.registro.renovacion = value;
    if (!value) {
      this.registro.coperacionanterior = undefined;
    }
  }

  fijarListaTipoBien(ctipogarantia: string) {
    while (this.ltipobien.length > 0) {
      this.ltipobien.pop();
    }
    for (const i in this.ltiposbien) {
      if (this.ltiposbien.hasOwnProperty(i) && this.ltiposbien[i].ctipogarantia === ctipogarantia) {
        this.ltipobien.push({ label: this.ltiposbien[i].nombre, value: this.ltiposbien[i].ctipobien });
      }
    }
  }

  /**Muestra lov de operaciones de cartera. */
  mostrarLovOperacion(): void {
    if (this.estaVacio(this.registro.cpersona)) {
      this.mostrarMensajeInfo('SELECCIONE UN CLIENTE');
      return;
    }
    this.lovOperacion.mfiltros.cestatus = 'CAN';
    this.lovOperacion.mfiltros.cpersona = this.registro.cpersona;
    this.lovOperacion.mfiltros.ctipogarantia = this.mfiltros.ctipogarantia;
    this.lovOperacion.consultar();
    this.lovOperacion.showDialog();
  }

  /**Retorno de lov de operacion de cartera. */
  fijarLovOperacionSelec(reg: any): void {
    this.registro.coperacionanterior = reg.registro.coperacion;
    this.registro.ctipogarantia = reg.registro.ctipogarantia;
    this.cambiaTipoGarantia();
    this.registro.ctipobien = reg.registro.ctipobien;
    this.registro.cclasificacion = reg.registro.cclasificacion;
  }

}
