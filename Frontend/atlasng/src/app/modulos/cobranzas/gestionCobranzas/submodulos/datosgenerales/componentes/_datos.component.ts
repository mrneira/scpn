import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {DtoServicios} from '../../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../../util/shared/componentes/base.component';
import {LovCantonesComponent} from '../../../../../generales/lov/cantones/componentes/lov.cantones.component';
import {LovPaisesComponent} from '../../../../../generales/lov/paises/componentes/lov.paises.component';
import {LovParroquiasComponent} from '../../../../../generales/lov/parroquias/componentes/lov.parroquias.component';
import {LovProvinciasComponent} from '../../../../../generales/lov/provincias/componentes/lov.provincias.component';
import {SelectItem} from 'primeng/primeng';

@Component({
  selector: 'app-datos',
  template: `<app-lov-paises (eventoCliente)=fijarLovPaisesSelec($event)></app-lov-paises>
             <app-lov-provincias (eventoCliente)=fijarLovProvinciasSelec($event)></app-lov-provincias>
             <app-lov-cantones (eventoCliente)=fijarLovCantonesSelec($event)></app-lov-cantones>
             <app-lov-parroquias (eventoCliente)=fijarLovParroquiasSelec($event)></app-lov-parroquias>`
})
export class DatosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(LovPaisesComponent)
  private lovPaises: LovPaisesComponent;

  @ViewChild(LovProvinciasComponent)
  private lovProvincias: LovProvinciasComponent;

  @ViewChild(LovCantonesComponent)
  private lovCantones: LovCantonesComponent;

  @ViewChild(LovParroquiasComponent)
  private lovParroquias: LovParroquiasComponent;

  public lclasecredito: SelectItem[] = [{label: '...', value: null}];

  public ldestinofinanciero: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarSolicitudDatos', 'TCARSOLICITUDDATOS', true, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.camposfecha.finiciopagos = null;
  }

  ngAfterViewInit() {}

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

  consultar() {}

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'N', '', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenPais', 'nombre', 'npais', 'i.cpais = t.cpais');
    consulta.addSubquery('TgenProvincia', 'nombre', 'nprovincia', 'i.cpais = t.cpais and i.cpprovincia=t.cpprovincia');
    consulta.addSubquery('TgenCanton', 'nombre', 'ncanton', 'i.cpais = t.cpais and i.cpprovincia=t.cpprovincia and i.ccanton=t.ccanton');
    consulta.addSubquery('TgenParroquia', 'nombre', 'nparroquia', 'i.cpais = t.cpais and i.cpprovincia=t.cpprovincia and i.ccanton=t.ccanton and i.cparroquia=t.cparroquia');
    consulta.addSubquery('TcarActEconomica', 'nombre', 'nactividad', 'i.cactividad = t.cactividad');
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {}

  validaFiltrosConsulta(): boolean {
    return true;
  }

  habilitarEdicion() {
    return super.habilitarEdicion();
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  
  grabar(): void {}

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

  mostrarLovPaises(): void {
    this.lovPaises.mfiltros.cpais = 'EC';
    this.lovPaises.consultar();
    this.lovPaises.showDialog();
  }

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

  mostrarLovProvincias(): void {
    if (this.estaVacio(this.registro.cpais)) {
      this.mostrarMensajeError('PAÍS REQUERIDO');
      return;
    }
    this.lovProvincias.mfiltros.cpais = this.registro.cpais;
    this.lovProvincias.consultar();
    this.lovProvincias.showDialog();
  }

  fijarLovProvinciasSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cpprovincia = reg.registro.cpprovincia;
      this.registro.mdatos.nprovincia = reg.registro.nombre;
      this.registro.ccanton = null;
      this.registro.mdatos.ncanton = null;
      this.mostrarLovCantones();
    }
  }

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

  fijarLovCantonesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.ccanton = reg.registro.ccanton;
      this.registro.mdatos.ncanton = reg.registro.nombre;
      this.mostrarLovParroquias();
    }
  }

  mostrarLovParroquias(): void {
    if (this.estaVacio(this.registro.cpais)) {
      this.mostrarMensajeError('PAÍS REQUERIDO');
      return;
    }
    if (this.estaVacio(this.registro.cpprovincia)) {
      this.mostrarMensajeError('PROVINCIA REQUERIDO');
      return;
    }
    if (this.estaVacio(this.registro.ccanton)) {
      this.mostrarMensajeError('CANTÓN REQUERIDO');
      return;
    }
    this.lovParroquias.mfiltros.cpais = this.registro.cpais;
    this.lovParroquias.mfiltros.cpprovincia = this.registro.cpprovincia;
    this.lovParroquias.mfiltros.ccanton = this.registro.ccanton;
    this.lovParroquias.consultar();
    this.lovParroquias.showDialog();
  }

  fijarLovParroquiasSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cparroquia = reg.registro.cparroquia;
      this.registro.mdatos.nparroquia = reg.registro.nombre;
    }
  }
}