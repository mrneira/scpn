
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';

import {LovPaisesComponent} from '../../../../generales/lov/paises/componentes/lov.paises.component'
@Component({
  selector: 'app-emisordetalle',
  templateUrl: 'emisordetalle.html'
})
export class EmisordetalleComponent extends BaseComponent implements OnInit, AfterViewInit {

  fecha = new Date();


  @ViewChild('formFiltros') formFiltros: NgForm;

  public lEmisor: SelectItem[] = [{ label: '...', value: null }];
  public lCalificacion: SelectItem[] = [{ label: '...', value: null }];
  public lSector: SelectItem[] = [{ label: '...', value: null }];
  
  public lTipoEmisor: SelectItem[] = [{ label: '...', value: null }];
  public lEntidadCalif: SelectItem[] = [{ label: '...', value: null }];

  
  @ViewChild(LovPaisesComponent)
  private lovPaises: LovPaisesComponent;

  private catalogoDetalle: CatalogoDetalleComponent;
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tinvemisordetalle', 'EMISORDETALLE', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  mostrarLovPaises(): void {
    this.lovPaises.showDialog();
  }

  /**Retorno de lov de paises. */
  fijarLovPaisesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cpais = reg.registro.cpais;
      this.registro.mdatos.npais = reg.registro.nombre;

      
      
    }
  }

  asignarCcatalogo() {
    this.registro.emisorccatalogo = 1213;
    this.registro.calificacionriesgoactualccatalogo = 1207;
    this.registro.sectorccatalogo = 1205;
    this.registro.tipoemccatalogo = 1227;
    this.registro.enticalificadoraccatalogo = 1228;
    

  }

  crearNuevo() {
    super.crearNuevo();
    this.asignarCcatalogo();
    this.registro.fingreso = this.fecha;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    this.registro.banco = false;
  }

  actualizar() {

    if (!this.estaVacio(this.registro.porcentajemaximoinversion) && this.registro.porcentajemaximoinversion != 0 &&
      (this.registro.porcentajemaximoinversion < 0 || this.registro.porcentajemaximoinversion > 100)) {
      this.mostrarMensajeError("PORCENTAJE MÁXIMO PARA INVERTIR DEBE SER UN NÚMERO POSITIVO IGUAL O INFERIOR A 100");
      return;
    }

    this.asignarCcatalogo();
    this.registro.fmodificacion = this.fecha;
    this.registro.cusuariomod = this.dtoServicios.mradicacion.cusuario;
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
    this.lregistros = [];
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {

    const consulta = new Consulta(this.entityBean, 'Y', 't.emisorcdetalle', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nEmisor', ' t.emisorccatalogo = i.ccatalogo and t.emisorcdetalle = i.cdetalle');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nCalificacion', ' t.calificacionriesgoactualccatalogo = i.ccatalogo and t.calificacionriesgoactualcdetalle = i.cdetalle');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nSector', ' t.sectorccatalogo = i.ccatalogo and t.sectorcdetalle = i.cdetalle');
    consulta.addSubquery('tgenpais', 'nombre', 'npais', ' t.cpais = i.cpais');

    consulta.cantidad = 10;

    this.addConsulta(consulta);
    return consulta;
  }


  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.encerarMensajes();
          this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
          this.manejaRespuestaCatalogos(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  llenarConsultaCatalogos(): void {

    const mfiltrosrubro = { 'ccatalogo': 1213 };
    const consEmisor = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosrubro, {});
    consEmisor.cantidad = 500;
    this.addConsultaPorAlias('EMISOR', consEmisor);

    const mfiltrosCalificacion = { 'ccatalogo': 1207 };
    const consCalificacion = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosCalificacion, {});
    consCalificacion.cantidad = 500;
    this.addConsultaPorAlias('CALIFICACION', consCalificacion);

    const mfiltrosSector = { 'ccatalogo': 1205 };
    const consSector = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosSector, {});
    consSector.cantidad = 500;
    this.addConsultaPorAlias('SECTOR', consSector);

    const mfiltrosTipoEmisor = { 'ccatalogo': 1205 };
    const consTipoEmisor = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosTipoEmisor, {});
    consTipoEmisor.cantidad = 500;
    this.addConsultaPorAlias('TIPOEMISOR', consTipoEmisor);

    const mfiltrosEntidadCalificacion = { 'ccatalogo': 1205 };
    const consEntidadCalificacion = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEntidadCalificacion, {});
    consEntidadCalificacion.cantidad = 500;
    this.addConsultaPorAlias('ENTCALIFIC', consEntidadCalificacion);
    this.ejecutarConsultaCatalogos();
  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.lEmisor, resp.EMISOR, 'cdetalle');
      this.llenaListaCatalogo(this.lCalificacion, resp.CALIFICACION, 'cdetalle');
      this.llenaListaCatalogo(this.lSector, resp.SECTOR, 'cdetalle');
      this.llenaListaCatalogo(this.lTipoEmisor, resp.TIPOEMISOR, 'cdetalle');
      this.llenaListaCatalogo(this.lEntidadCalif, resp.ENTCALIFIC, 'cdetalle');
    }
    this.lconsulta = [];
  }


  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);

  }


  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);

  }

  private fijarFiltrosConsulta() {

  }

  validaFiltrosConsulta(): boolean {
    return true;
    //return super.validaFiltrosRequeridos();
  }


  // Inicia MANTENIMIENTO *********************
  grabar(): void {

    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }


}
