import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';

@Component({
  selector: 'app-novedades',
  templateUrl: 'novedades.html'
})
export class NovedadesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  lovPersonas: LovPersonasComponent;

  public lestado: SelectItem[] = [{ label: '...', value: null }];
  public lbancos: SelectItem[] = [{ label: '...', value: null }];
  public ltipocuenta: SelectItem[] = [{ label: '...', value: null }];
  public ltipoNovedad: SelectItem[] = [{ label: '...', value: null }];

  fecha = new Date();

  public edited = false;
  public mensaje = "";

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tsocnovedadades', 'NOVEDADES', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.llenarEstado();
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
      this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
      this.registro.ccatalogonovedad = 220;
      this.registro.ccatalogobanco = 305;
      this.registro.ccatalogotipocuenta = 306;
      this.registro.cpersona = this.mfiltros.cpersona;
      this.registro.fecha = this.fecha;
      this.registro.cusuario = this.dtoServicios.mradicacion.cusuario;
      this.registro.retencion = false;
      this.registro.automatico = false;
      this.registro.estado = 'ACT';
      this.registro.reverso = 'N';
      this.registro.valor = 0;
      this.registro.pagado = false;
    }
  }

  actualizar() {
    if (this.registro.fechaoficio > this.registro.fecharecepcion) {
      this.mensaje = "Fecha de oficio no puede ser mayor que fecha de recepción";
      this.edited = true;
      return;
    }
    else {
      this.edited = false;
      this.mensaje = '';
    }
    super.actualizar();
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
    if (!this.validaFiltrosConsulta()) {
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.fecharecepcion asc', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'ntiponovedad', 'i.ccatalogo = t.ccatalogonovedad and i.cdetalle = t.cdetallenovedad');
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.ccompania = this.dtoServicios.mradicacion.ccompania
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
    let tvalor = 0;
    this.rqMantenimiento.cpersona = this.mcampos.cpersona;
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg: any = this.lregistros[i];
        if (reg !== undefined && reg.value !== null && reg.estado == 'ACT' && !reg.retencion) {
          tvalor = tvalor + reg.valor;
        }
      }
    }
    this.rqMantenimiento.tvalor = tvalor;
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  validarDocumento() {
    this.rqConsulta.CODIGOCONSULTA = 'NOVEDADESOFICIO';
    this.rqConsulta.mdatos.cpersona = this.registro.cpersona;
    this.rqConsulta.mdatos.numerooficio = this.registro.numerooficio;

    this.msgs = [];
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false);
          if (resp.cod != 'OK') {
            this.mensaje = resp.msgusu;
            this.edited = true;
          }
          else {
            this.edited = false;
            this.mensaje = '';
          }

        })
    this.lconsulta = [];
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {

    super.postCommitEntityBean(resp);
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
      this.mfiltros.cpersona = reg.registro.cpersona;
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.npersona = reg.registro.nombre;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.consultar();
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
    const mfiltrosProf: any = { 'ccatalogo': 220 };
    const mfiltrosespProf: any = {'clegal': 'is null','cdetalle': `not in ('15','16','17','18','21','22')`};
    const consultaProf = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosProf, mfiltrosespProf);
    consultaProf.cantidad = 50;
    this.addConsultaPorAlias('TIPONOVEDAD', consultaProf);

    const mfiltrosBanco: any = { 'ccatalogo': 305,'activo': true };
    const consultaBanco = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosBanco, {});
    consultaProf.cantidad = 200;
    this.addConsultaPorAlias('BANCO', consultaBanco);

    const mfiltrosTipoCuenta: any = { 'ccatalogo': 306 };
    const consultaTipoCuenta = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosTipoCuenta, {});
    consultaProf.cantidad = 50;
    this.addConsultaPorAlias('TIPOCUENTA', consultaTipoCuenta);

  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    if (resp.cod === 'OK') {

      this.llenaListaCatalogo(this.ltipoNovedad, resp.TIPONOVEDAD, 'cdetalle');
      this.llenaListaCatalogo(this.lbancos, resp.BANCO, 'cdetalle');
      this.llenaListaCatalogo(this.ltipocuenta, resp.TIPOCUENTA, 'cdetalle');

    }
    this.lconsulta = [];
  }

  llenarEstado() {
    this.lestado = [];
    this.lestado.push({ label: '...', value: null });
    this.lestado.push({ label: 'ACTIVO', value: 'ACT' });
    this.lestado.push({ label: 'INACTIVO', value: 'INA' });
  }
}
