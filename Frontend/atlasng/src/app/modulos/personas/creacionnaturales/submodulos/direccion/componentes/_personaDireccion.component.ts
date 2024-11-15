import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta, Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovPaisesComponent } from '../../../../../generales/lov/paises/componentes/lov.paises.component';
import { LovProvinciasComponent } from '../../../../../generales/lov/provincias/componentes/lov.provincias.component';
import { LovCantonesComponent } from '../../../../../generales/lov/cantones/componentes/lov.cantones.component';
import { LovParroquiasComponent } from '../../../../../generales/lov/parroquias/componentes/lov.parroquias.component';
import { LovCiudadesComponent } from '../../../../../generales/lov/ciudades/componentes/lov.ciudades.component';
import { LovMapsComponent } from '../../../../../../util/componentes/maps/componentes/lov.maps.component';

@Component({
  selector: 'app-persona-direccion',
  templateUrl: '_personaDireccion.html'
})
export class PersonaDireccionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(LovPaisesComponent)
  private lovPaises: LovPaisesComponent;

  @ViewChild(LovProvinciasComponent)
  private lovProvincias: LovProvinciasComponent;

  @ViewChild(LovCantonesComponent)
  private lovCantones: LovCantonesComponent;

  @ViewChild(LovParroquiasComponent)
  private lovParroquias: LovParroquiasComponent;

  @ViewChild(LovCiudadesComponent)
  private lovCiudades: LovCiudadesComponent;

  @ViewChild(LovMapsComponent)
  private lovMapa: LovMapsComponent;

  public ltipodireccion: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TperPersonaDireccion', 'DIRECCION', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.verreg = 0;
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.registro.tipodireccionccatalogo = 304;
  }

  actualizar() {
    var corregirT = true;
    var corregirC = true;
    if (!this.estaVacio(this.registro.telefonofijo)) {
      var arrayT = this.registro.telefonofijo.split("");
      var codigoT = arrayT[1] + arrayT[2];
      if (parseInt(codigoT) < 2 || parseInt(codigoT) > 7) {
        this.mostrarMensajeError("CODIGO PROVINCIAL DE TELEFONO FIJO INCORRECTO");
        corregirT = false;
      }
      else {
        corregirT = true;
      }
    }

    // if (!this.estaVacio(this.registro.celular)) {
    //   var arrayC = this.registro.celular.split("");
    //   var codigoC = arrayC[1] + arrayC[2];
    //   if (codigoC !== '09') {
    //     this.mostrarMensajeError("CODIGO DE CELULAR INCORRECTO");
    //     corregirC = false;
    //   }
    //   else {
    //     corregirC = true;
    //   }
    // }

    if (this.estaVacio(this.registro.extencion)) {
      this.registro.extencion = null;
    }

    if (corregirT === true && corregirC === true) {
      super.actualizar();
      this.encerarMensajes();
    }
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
    if (this.estaVacio(this.mfiltros.cpersona)) {
      super.mostrarMensajeError("PERSONA REQUERIDA");
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.secuencia', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'ntipodireccion', 'i.ccatalogo = t.tipodireccionccatalogo and i.cdetalle = t.tipodireccioncdetalle');
    consulta.addSubquery('TgenPais', 'nombre', 'npais', 'i.cpais = t.cpais');
    consulta.addSubquery('TgenProvincia', 'nombre', 'nprovincia', 'i.cpais = t.cpais and i.cpprovincia=t.cpprovincia');
    consulta.addSubquery('TgenCanton', 'nombre', 'ncanton', 'i.cpais = t.cpais and i.cpprovincia=t.cpprovincia and i.ccanton=t.ccanton');
    consulta.addSubquery('TgenParroquia', 'nombre', 'nparroquia', 'i.cpais = t.cpais and i.cpprovincia=t.cpprovincia and i.ccanton=t.ccanton and i.cparroquia=t.cparroquia');
    consulta.addSubquery('TgenCiudad', 'nombre', 'nciudad', 'i.cpais = t.cpais and i.cpprovincia=t.cpprovincia and i.ccanton=t.ccanton and i.cciudad=t.cciudad');
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.mfiltros.verreg = 0;
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


  /**Muestra lov de paises */
  mostrarLovPaises(): void {
    this.lovPaises.showDialog();

    if (this.estaVacio(this.registro.cpais)) {
      this.lovPaises.mfiltros.cpais = 'EC';
    } else {
      this.lovPaises.mfiltros.cpais = this.registro.cpais;
    }
    this.lovPaises.consultar();
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
      this.registro.cpprovincia = Number(reg.registro.cpprovincia);
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
    this.lovCantones.mfiltrosesp.cpprovincia = "=" + this.registro.cpprovincia;
    this.lovCantones.consultar();
    this.lovCantones.showDialog();
  }

  /**Retorno de lov de cantones. */
  fijarLovCantonesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.ccanton = Number(reg.registro.ccanton);
      this.registro.mdatos.ncanton = reg.registro.nombre;
      this.mostrarLovCiudades();
    }
  }

  /**Muestra lov de ciudades */
  mostrarLovCiudades(): void {
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
    this.lovCiudades.mfiltros.cpais = this.registro.cpais;
    this.lovCantones.mfiltrosesp.cpprovincia = "=" + this.registro.cpprovincia;
    this.lovParroquias.mfiltrosesp.ccanton = "=" + this.registro.ccanton;
    this.lovCiudades.consultar();
    this.lovCiudades.showDialog();
  }

  /**Retorno de lov de ciudades. */
  fijarLovCiudadesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cciudad = reg.registro.cciudad;
      this.registro.mdatos.nciudad = reg.registro.nombre;
      this.mostrarLovParroquias();
    }
  }

  /**Muestra lov de parroquias */
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
    this.lovParroquias.mfiltrosesp.cpais = "='" + this.registro.cpais + "'";
    this.lovParroquias.mfiltrosesp.cpprovincia = "=" + this.registro.cpprovincia;
    this.lovParroquias.mfiltrosesp.ccanton = "=" + this.registro.ccanton;
    this.lovParroquias.consultar();
    this.lovParroquias.showDialog();
  }

  /**Retorno de lov de parroquias. */
  fijarLovParroquiasSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cparroquia = Number(reg.registro.cparroquia);
      this.registro.mdatos.nparroquia = reg.registro.nombre;
    }
  }

  /**Muestra lov de Personas */
  mostrarLovMapa(reg: any): void {
    this.lovMapa.clearAll();
    this.lovMapa.inicializar(reg.latitud, reg.longitud);
    this.selectRegistro(reg);
    if (!this.estaVacio(reg.latitud) && !this.estaVacio(reg.longitud)) {
      this.lovMapa.addMarker(reg.latitud, reg.longitud, reg.mdatos.ntipodireccion);
    }
    this.mostrarDialogoGenerico = false;
    this.lovMapa.showDialog();
  }

  /**Retorno de lov de Mapa. */
  fijarLovMapa(coords: any): void {
    super.actualizar();
    this.registro.latitud = coords.lat;
    this.registro.longitud = coords.lng;

  }

}
