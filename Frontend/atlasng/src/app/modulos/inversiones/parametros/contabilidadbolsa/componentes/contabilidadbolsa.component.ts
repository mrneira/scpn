
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { LovCuentasContablesComponent } from '../../../../contabilidad/lov/cuentascontables/componentes/lov.cuentasContables.component';

@Component({
  selector: 'app-contabilidadbolsa',
  templateUrl: 'contabilidadbolsa.html'
})
export class ContabilidadbolsaComponent extends BaseComponent implements OnInit, AfterViewInit {

  fecha = new Date();

  @ViewChild(LovCuentasContablesComponent)
  private lovCuentasContables: LovCuentasContablesComponent;

  @ViewChild('formFiltros') formFiltros: NgForm;

  public lEntidad: SelectItem[] = [{ label: '...', value: null }];
  public lInstrumento: SelectItem[] = [{ label: '...', value: null }];
  public lProceso: SelectItem[] = [{ label: '...', value: null }];
  public lOperacion: SelectItem[] = [{ label: '...', value: null }];
  public lRubro: SelectItem[] = [{ label: '...', value: null }];
  public lcarrera: SelectItem[] = [{ label: '...', value: null }];
  public lregistro: SelectItem[] = [{ label: '...', value: null }];
  public lCcosto: SelectItem[] = [{ label: '...', value: null }];

  private catalogoDetalle: CatalogoDetalleComponent;
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tinvplantillacontable', 'CONTABILIDADBOLSA', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
    this.mcampos.getItem = sessionStorage.getItem('t');
  }

  ngAfterViewInit() {
  }

  crearNuevo() {

    let mensaje: string = this.validarCabecera();

    if (!this.estaVacio(mensaje)) {
      this.mostrarMensajeError(mensaje);
      return;
    }
    else {
      super.crearNuevo();

      this.mcampos.ccuentacon = null;
      this.mcampos.ncuentacon = null;

      this.registro.debito = false;

      this.registro.activo = true;

      this.registro.entidadccatalogo = this.mfiltros.entidadccatalogo;

      this.registro.entidadcdetalle = this.mfiltros.entidadcdetalle;

      this.registro.instrumentoccatalogo = 1202;

      this.registro.instrumentocdetalle = this.mfiltros.instrumentocdetalle;

      this.registro.procesoccatalogo = 1220;

      this.registro.procesocdetalle = this.mfiltros.procesocdetalle;

      this.registro.rubroccatalogo = 1219;
    

      this.registro.centrocostoccatalogo = 1002;
   

      this.registro.fingreso = this.fecha;
      this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;


    }
  }

  validarCabecera(): string {

    let lmensaje: string = "";



    if (this.estaVacio(this.mfiltros.procesocdetalle)) {
      lmensaje = "DEBE ESCOGER UN OPERACION";
    }
    else if (this.estaVacio(this.mfiltros.centrocostocdetalle)) {
      lmensaje = "DEBE ESCOGER UN CENTRO COSTO";
    }

    return lmensaje;
  }

  actualizar() {

    if (!this.estaVacio(this.registro.rubrocdetalle)) {
      this.registro.entidadccatalogo = 1215;
    }
    else {
      this.registro.entidadccatalogo = null;
    }

    this.registro.centrocostocdetalle = this.mfiltros.centrocostocdetalle;
    this.registro.ccuenta = this.mcampos.ccuentacon;
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

    this.mcampos.cpartidaingreso = registro.cpartidaingreso;
    this.mcampos.npartida = registro.mdatos.npartidaingreso;

    this.mcampos.ccuentacon = this.registro.ccuenta;
    this.mcampos.ncuentacon = this.registro.mdatos.ncuentacon;
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.lregistros = [];
    if (this.estaVacio(this.validarCabecera())) {
      this.crearDtoConsulta();
      super.consultar();
    }
  }

  public crearDtoConsulta(): Consulta {

    if (sessionStorage.getItem('t') == "905")
    {
      this.mfiltrosesp.rubrocdetalle = " not in ('CAP','INT','ING','BANCOS','COMBOL','CTORDE','CTORAC') ";
    }
    else
    {
      this.mfiltrosesp.rubrocdetalle = " in ('COMBOL') ";
    }

    const consulta = new Consulta(this.entityBean, 'Y', 't.entidadcdetalle, t.ccuenta, t.procesocdetalle, t.rubrocdetalle', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nentidad', ' t.entidadccatalogo=i.ccatalogo and t.entidadcdetalle=i.cdetalle');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'ninstrumento', ' t.instrumentoccatalogo=i.ccatalogo and t.instrumentocdetalle=i.cdetalle');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nproceso', ' t.procesoccatalogo=i.ccatalogo and t.procesocdetalle=i.cdetalle');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nrubro', ' t.rubroccatalogo=i.ccatalogo and t.rubrocdetalle=i.cdetalle');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nccosto', ' t.centrocostoccatalogo=i.ccatalogo and t.centrocostocdetalle=i.cdetalle');
    consulta.addSubquery('tconcatalogo', 'nombre', 'ncuentacon', 't.ccuenta=i.ccuenta');

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

    const mfiltrosparam = { 'ccatalogo': 'in (1215)' };
    const consultarParametro = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', {}, mfiltrosparam);
    consultarParametro.cantidad = 1000000;
    this.addConsultaPorAlias('ENTIDAD', consultarParametro);

    const mfiltrosinstrumento = { 'ccatalogo': 1202 };
    const consInstrumento = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosinstrumento, {});
    consInstrumento.cantidad = 100;
    this.addConsultaPorAlias('INSTRUMENTO', consInstrumento);

    const mfiltrosoperacion = { 'ccatalogo': 1220 };
    const mfiltrosopeesp = { "cdetalle": " in ('COMPRA', 'RECUP', 'ING') " };
    const consOperacion = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosoperacion, mfiltrosopeesp);
    consOperacion.cantidad = 100;
    this.addConsultaPorAlias('OPERACION', consOperacion);

    //if (sessionStorage.getItem('t') == "905" - GENERAL

    let lfiltrosEspRubro: any;

    if (sessionStorage.getItem('t') == "905")
    {
      lfiltrosEspRubro = { "cdetalle": " not in ('CAP','INT','ING','BANCOS','COMBOL','CTORDE','CTORAC') " };
    }
    else
    {
      lfiltrosEspRubro = { "cdetalle": " in ('COMBOL') " };
    }

    const mfiltrosrubro = { 'ccatalogo': 1219 };
    
    
    const consRubro = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosrubro, lfiltrosEspRubro);


    consRubro.cantidad = 1000;
    this.addConsultaPorAlias('RUBRO', consRubro);

    const mfiltrosccosto = { 'ccatalogo': 1002 };
    const consCcosto = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosccosto, {});
    consCcosto.cantidad = 100;
    this.addConsultaPorAlias('CCOSTO', consCcosto);

    this.ejecutarConsultaCatalogos();
  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.lInstrumento, resp.INSTRUMENTO, 'cdetalle');
      this.llenaListaCatalogo(this.lProceso, resp.OPERACION, 'cdetalle');
      this.llenaListaCatalogo(this.lRubro, resp.RUBRO, 'cdetalle');
      this.llenaListaCatalogo(this.lEntidad, resp.ENTIDAD, 'cdetalle');
      this.llenaListaCatalogo(this.lCcosto, resp.CCOSTO, 'cdetalle');
    }
    this.lconsulta = [];
  }


  mostrarLovCuentasContables(): void {


    this.lovCuentasContables.showDialog(true);
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
    return super.validaFiltrosRequeridos();
  }

  fijarLovCuentasContablesSelec(reg: any): void {

    if (reg.registro !== undefined) {
      this.msgs = [];

      this.mcampos.ccuentacon = reg.registro.ccuenta;
      this.mcampos.ncuentacon = reg.registro.nombre;
      this.registro.mdatos.ncuentacon = reg.registro.nombre;

    }
  }

  fijarLovPartidasIngresoSelec(reg: any): void {

    if (reg.registro !== undefined) {
      this.msgs = [];

      this.mcampos.cpartidaingreso = reg.registro.cpartidaingreso;
      this.mcampos.npartida = reg.registro.nombre;
      this.registro.mdatos.npartidaingreso = reg.registro.nombre;
      this.registro.cpartidaingreso = reg.registro.cpartidaingreso;

    }
  }

  // Inicia MANTENIMIENTO *********************
  grabar(): void {

    let lmensaje: string = "";

    if (!this.estaVacio(this.validarCabecera())) {
      lmensaje = "NO HA SELECCIONADO LAS OPCIONES DE CABECERA";
    }

    if (!this.estaVacio(lmensaje)) {
      this.mostrarMensajeError(lmensaje);
      return;
    }

    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }
}
