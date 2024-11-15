import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovCantonesComponent } from '../../../../../../generales/lov/cantones/componentes/lov.cantones.component';
import { LovPaisesComponent } from '../../../../../../generales/lov/paises/componentes/lov.paises.component';
import { LovProvinciasComponent } from '../../../../../../generales/lov/provincias/componentes/lov.provincias.component';

@Component({
  selector: 'app-operacion-gar',
  template: `<app-lov-paises (eventoCliente)=fijarLovPaisesSelec($event)></app-lov-paises>
             <app-lov-provincias (eventoCliente)=fijarLovProvinciasSelec($event)></app-lov-provincias>
             <app-lov-cantones (eventoCliente)=fijarLovCantonesSelec($event)></app-lov-cantones>`
})
export class OperacionGarComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(LovPaisesComponent)
  private lovPaises: LovPaisesComponent;

  @ViewChild(LovProvinciasComponent)
  private lovProvincias: LovProvinciasComponent;

  @ViewChild(LovCantonesComponent)
  private lovCantones: LovCantonesComponent;

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
    const consulta = new Consulta(this.entityBean, 'N', 't.coperacion', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TperPersonaDetalle', 'identificacion', 'identificacion', 'i.cpersona = t.cpersona and i.ccompania = t.ccompania and i.verreg = 0 ');
    consulta.addSubquery('TgenPais', 'nombre', 'npais', 'i.cpais = t.cpais');
    consulta.addSubquery('TgenProvincia', 'nombre', 'nprovincia', 'i.cpais = t.cpais and i.cpprovincia=t.cpprovincia');
    consulta.addSubquery('TgenCanton', 'nombre', 'ncanton', 'i.cpais = t.cpais and i.cpprovincia=t.cpprovincia and i.ccanton=t.ccanton');
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
    if (this.mfiltros.cproducto !== 0) {
      this.fijarListaTipoProducto(this.registro.cproducto);
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
    this.llenatipoBien(this.registro.ctipogarantia);
  }

  llenatipoBien(ctipogarantia: string) {
    while (this.ltipobien.length > 0) {
      this.ltipobien.pop();
    }
    this.ltipobien.push({ label: '...', value: null });

    if (this.ltiposbien.length <= 0 || this.estaVacio(ctipogarantia)) {
      this.mfiltros.ctipobien = null;
      return;
    }
    for (const i in this.ltiposbien) {
      if (this.ltiposbien.hasOwnProperty(i) && this.ltiposbien[i].ctipogarantia === ctipogarantia) {
        this.ltipobien.push({ label: this.ltiposbien[i].nombre, value: this.ltiposbien[i].ctipobien });
      }
    }
    this.registro.ctipobien = null;
    if (this.ltipobien.length > 1) {
      this.registro.ctipobien = this.ltipobien[1].value;
    }
  }

  /**Muestra lov de paises */
  mostrarLovPaises(): void {
    this.lovPaises.mfiltros.cpais = 'EC';
    this.lovPaises.consultar();
    this.lovPaises.showDialog();
  }

  /**Retorno de lov de paises. */
  fijarLovPaisesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cpais = reg.registro.cpais;
      this.registro.mdatos.npais = reg.registro.nombre;

      this.registro.cpprovincia = null;
      this.registro.mdatos.nprovincia = null;
      this.registro.ccanton = null;
      this.registro.mdatos.ncanton = null;
      this.mostrarLovProvincias();
    }
  }

  /**Muestra lov de provincias */
  mostrarLovProvincias(): void {
    if (this.estaVacio(this.registro.cpais)) {
      this.mostrarMensajeError('PAÍS REQUERIDO');
      return;
    }
    this.lovProvincias.mfiltros.cpais = this.registro.cpais;
    this.lovProvincias.consultar();
    this.lovProvincias.showDialog();
  }

  /**Retorno de lov de provincias. */
  fijarLovProvinciasSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cpprovincia = reg.registro.cpprovincia;
      this.registro.mdatos.nprovincia = reg.registro.nombre;

      this.registro.ccanton = null;
      this.registro.mdatos.ncanton = null;
      this.mostrarLovCantones();
    }
  }

  /**Muestra lov de cantones */
  mostrarLovCantones(): void {
    if (this.estaVacio(this.registro.cpais)) {
      this.mostrarMensajeError('PAÍS REQUERIDO');
      return;
    }
    if (this.estaVacio(this.registro.cpprovincia)) {
      this.mostrarMensajeError('PROVINCIA REQUERIDO');
      return;
    }
    this.lovCantones.mfiltros.cpais = this.registro.cpais;
    this.lovCantones.mfiltros.cpprovincia = this.registro.cpprovincia;
    this.lovCantones.consultar();
    this.lovCantones.showDialog();
  }

  /**Retorno de lov de cantones. */
  fijarLovCantonesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.ccanton = reg.registro.ccanton;
      this.registro.mdatos.ncanton = reg.registro.nombre;
    }
  }

}
