import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { LovPersonasComponent } from '../../../personas/lov/personas/componentes/lov.personas.component';

@Component({
  selector: 'app-herederos',
  templateUrl: 'herederos.html'
})
export class HerederosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  lovPersonas: LovPersonasComponent;

  public lparentezco: SelectItem[] = [{ label: '...', value: null }];
  public lbancos: SelectItem[] = [{ label: '...', value: null }];
  public ltipocuenta: SelectItem[] = [{ label: '...', value: null }];
  public lexpediente: any = [];

  fecha = new Date();

  public edited = false;
  public mensaje = "";

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tprebeneficiario', 'HEREDEROS', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
    //this.mfiltros.cpersona = 0;
  }

  crearNuevo() {
    if (this.estaVacio(this.mcampos.cpersona)) {
      this.mostrarMensajeError("DEBE ESCOGER UN SOCIO");
    }
    else {
      super.crearNuevo();
      this.registro.ccatalogoparentesco = 1126;
      this.registro.cdetalleparentesco = '0';
      this.registro.tipoinstitucionccatalogo = 305
      this.registro.tipocuentaccatalogo = 306
      this.registro.pagoexterno = false;
      this.registro.estado = true;
      this.registro.curador = false;
      this.registro.curtipoinstitucionccatalogo=305;
      this.registro.curtipocuentaccatalogo=306;

    }
  }

  actualizar() {
    super.actualizar();
    //  this.grabar();
    this.registrarEtiqueta(this.registro, this.lparentezco, 'cdetalleparentesco', 'nparentezco');
    this.registrarEtiqueta(this.registro, this.lbancos, 'tipoinstitucioncdetalle', 'nbanco');
    this.registrarEtiqueta(this.registro, this.ltipocuenta, 'tipocuentacdetalle', 'ncuenta');
    this.registro.estado = true;
    this.registro.curtipocuentaccatalogo = 306;
    this.registro.curtipoinstitucionccatalogo = 305;
    this.grabar();

  }

  eliminar() {
    super.eliminar();
    this.grabar();
  }

  cancelar() {
    this.edited = false;
    this.mensaje = '';
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.fijarFiltrosConsulta();
    if (!this.validaFiltrosConsulta()) {
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    //  this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.secuencia', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nparentezco', 'i.ccatalogo = t.ccatalogoparentesco and i.cdetalle = t.cdetalleparentesco');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nbanco', 'i.ccatalogo = t.tipoinstitucionccatalogo and i.cdetalle = t.tipoinstitucioncdetalle');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'ncuenta', 'i.ccatalogo = t.tipocuentaccatalogo and i.cdetalle = t.tipocuentacdetalle');
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.secuencia = this.lexpediente[0].secuencia;
    this.mfiltros.estado = false;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
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
    this.rqMantenimiento.secuencia = this.registro.secuencia;
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    this.enproceso = false;
    this.consultar();
  }


  /**Muestra lov de personas */
  mostrarLovPersonas(): void {
    this.lovPersonas.mfiltros.tipodepersona = 'N';
    this.lovPersonas.mfiltros.csocio = 1;
    this.lovPersonas.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonasSelec(reg: any): void {
    if (reg.registro !== undefined) {
      // this.mfiltros.cpersona = reg.registro.cpersona;
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.npersona = reg.registro.nombre;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.consultarExpediente();
    }
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
    const mfiltrosParent: any = { 'ccatalogo': 1126 };
    const consultaParent = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosParent, {});
    consultaParent.cantidad = 50;
    this.addConsultaPorAlias('PARENTEZCO', consultaParent);

    const mfiltrosBanco: any = { 'ccatalogo': 305,'activo': true };
    const consultaBanco = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosBanco, {});
    consultaBanco.cantidad = 500;
    this.addConsultaPorAlias('BANCO', consultaBanco);

    const mfiltrosTipoCuenta: any = { 'ccatalogo': 306 };
    const consultaTipoCuenta = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosTipoCuenta, {});
    consultaTipoCuenta.cantidad = 50;
    this.addConsultaPorAlias('TIPOCUENTA', consultaTipoCuenta);

  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    if (resp.cod === 'OK') {

      this.llenaListaCatalogo(this.lparentezco, resp.PARENTEZCO, 'cdetalle');
      this.llenaListaCatalogo(this.lbancos, resp.BANCO, 'cdetalle');
      this.llenaListaCatalogo(this.ltipocuenta, resp.TIPOCUENTA, 'cdetalle');

    }
    this.lconsulta = [];
  }


  consultarExpediente(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaExpediente();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.encerarMensajes();
          this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
          this.manejaRespuestaExpediente(resp);
          if (this.lexpediente.length > 0) {
            this.consultar();
          } else {
            this.mostrarMensajeError("NO TIENE EXPEDIENTE");
          }

        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  llenarConsultaExpediente(): void {
    const mfiltrosExp: any = { 'cpersona': this.mcampos.cpersona };
    const mfiltrosEspExp: any = { 'cdetalletipoexp': `!='ANT'` };
    const consultaExp = new Consulta('tpreexpediente', 'Y', 't.secuencia', mfiltrosExp, mfiltrosEspExp);
    consultaExp.cantidad = 50;
    this.addConsultaPorAlias('EXPEDIENTE', consultaExp);
  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaExpediente(resp: any) {
    if (resp.cod === 'OK') {
      this.lexpediente = resp.EXPEDIENTE;
    }
    this.lconsulta = [];
  }
}
