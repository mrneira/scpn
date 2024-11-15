import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovNominaComponent } from '../../../lov/nomina/componentes/lov.nomina.component';

import { ConfirmationService } from 'primeng/primeng';
import { LovFuncionariosComponent } from '../../../lov/funcionarios/componentes/lov.funcionarios.component';

import { DatosgeneralesComponent } from "../submodulos/datosgenerales/componentes/datosgenerales.component";
import { RolpagoComponent } from "../submodulos/rolpago/componentes/rolpago.component";
import { IngresoComponent } from "../submodulos/ingreso/componentes/ingreso.component";
import { EgresoComponent } from "../submodulos/egreso/componentes/egreso.component";
import { MenuItem } from 'primeng/components/common/menuitem';
import { AppService } from 'app/util/servicios/app.service';

@Component({
  selector: 'app-nomina',
  templateUrl: 'nomina.html'
})
export class NominaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovNominaComponent)
  private lovNomina: LovNominaComponent;


  @ViewChild(DatosgeneralesComponent)
  tablaCabecera: DatosgeneralesComponent;

  @ViewChild(RolpagoComponent)
  private tablaRolPago: RolpagoComponent;

  @ViewChild(IngresoComponent)
  private tablaIngreso: IngresoComponent;

  @ViewChild(EgresoComponent)
  private tablaEgreso: EgresoComponent;

  @ViewChild(LovFuncionariosComponent)
  private lovFuncionarios: LovFuncionariosComponent;

  public ltipo: SelectItem[] = [{ label: '...', value: null }];
  public nuevo = true;
  public cerrada = false;
  public nuevaNomina = false;
  public tipo: any;
  public ldatos: any = [];


  constructor(router: Router, dtoServicios: DtoServicios, public route: ActivatedRoute, public appService: AppService, private confirmationService: ConfirmationService) {
    super(router, dtoServicios, 'ABSTRACT', 'NOMINAGENERAL', false);
  }
  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros, this.route);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
    this.route['queryParams'].subscribe((p: any) => {
      if (p.sol) {
        const sol = JSON.parse(p.sol);
        this.ldatos = sol.ldatos;

        this.tablaCabecera.registro.cnomina = sol.cnomina;
        this.componentehijo.mcampos.cnomina = sol.cnomina;
        this.componentehijo.nuevaNomina = sol.nuevaNomina;
        this.tablaCabecera.nuevo = sol.nuevaNomina;
        this.componentehijo.cerrada = sol.cerrada;
        this.tablaCabecera.registro.tipocdetalle = sol.tipo;
        this.tipo = sol.tipo;
        this.nuevo = this.nuevaNomina;
        if (this.nuevaNomina) {
          this.componentehijo.nuevo = true;
          this.tablaCabecera.tipo =sol.tipo;
        } else {
          this.consultar();
          this.componentehijo.nuevo = false;

        }
      }
    });
  }

  crearNuevo() {

  }

  actualizar() {
  }

  eliminar() {
  }

  cancelar() {
  }
  descargarBytes(bytes: any): void {
    const linkElement = document.createElement('a');
    try {
      let contenttype = '';
      if (this.tablaCabecera.mcampos.tipo === 'PDF') {
        contenttype = 'application/pdf';
      } else if (this.tablaCabecera.mcampos.tipo === 'EXCEL') {
        contenttype = 'application/vnd.ms-excel';
      } else {
        contenttype = 'application/octet-stream';
      }
      var blob = new Blob([this.base64ToArrayBuffer(bytes)], { type: contenttype });
      const bloburl = URL.createObjectURL(blob);

      if (this.tablaCabecera.mcampos.tipo === 'PDF') {
        window.open(bloburl);
        return;
      } else {
        linkElement.href = bloburl;
        if (this.tablaCabecera.mcampos.tipo === 'EXCEL') {
          linkElement.download = "ROL-" + this.tablaCabecera.registro.anio + "-" + this.tablaCabecera.registro.mescdetalle + '.' + "xls";
        } else {
          linkElement.download = "ROL" + '.' + this.tablaCabecera.mcampos.tipo;

        }

        const clickEvent = new MouseEvent('click', {
          'view': window,
          'bubbles': true,
          'cancelable': false
        });
        linkElement.dispatchEvent(clickEvent);

      }

    } catch (ex) {
    }
  }

  base64ToArrayBuffer(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }
  generarRol() {
    this.rqConsulta.CODIGOCONSULTA = 'DECIMOSTMP';
    this.rqConsulta.mdatos.lregistros = this.tablaRolPago.lregistros;
    this.rqConsulta.mdatos.tipo = this.tablaCabecera.mcampos.tipo;
    this.rqConsulta.mdatos.tiporeporte = this.tablaCabecera.mcampos.tiporeporte;
    this.rqConsulta.mdatos.nomina = this.tablaCabecera.registro;

    this.msgs = [];
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.lregistros = [];
          if (resp.cod === 'OK') {

            this.descargarBytes(resp.DECIMOSTMP);

          }

        },
        error => {
          this.dtoServicios.manejoError(error);
        });

  }
  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.encerarConsulta();
    if (this.estaVacio(this.mcampos.cnomina)) {
      this.mostrarMensajeError('ELIJA UNA NÓMINA PARA REALIZAR EL MANTENIMIENTO');
      return;
    }

    this.crearDtoConsulta();
    super.consultar();
  }
  consultarDetalleNuevos(reg: any) {
    this.encerarConsulta();
    delete this.rqConsulta.CODIGOCONSULTA;
    this.crearDtoConsultaDetalle(reg);
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();

    const consCabecera = this.tablaCabecera.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaCabecera.alias, consCabecera);

    const consRolPago = this.tablaRolPago.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaRolPago.alias, consRolPago);

    const consIngreso = this.tablaRolPago.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaRolPago.alias, consIngreso);

    const consEgreso = this.tablaRolPago.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaRolPago.alias, consEgreso);

  }
  public crearDtoConsultaDetalle(reg: any) {
    this.fijarFiltrosConsultaDetalle(reg);
    const consIngreso = this.tablaIngreso.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaIngreso.alias, consIngreso);

    const consEgreso = this.tablaEgreso.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaEgreso.alias, consEgreso);

  }
  private fijarFiltrosConsulta() {
    this.tablaCabecera.mfiltros.cnomina = this.mcampos.cnomina;
    this.tablaCabecera.mcampos.cnomina = this.mcampos.cnomina;
    this.tablaRolPago.mfiltros.cnomina = this.mcampos.cnomina;
    this.tablaRolPago.mcampos.cnomina = this.mcampos.cnomina;
  }
  private fijarFiltrosConsultaDetalle(reg: any) {
    this.tablaIngreso.mcampos.crol = reg.registro.crol;
    this.tablaEgreso.mcampos.crol = reg.registro.crol;
  }


  guardarCambios() {
    this.rqMantenimiento.mdatos = {};
    this.grabar();
  }

  finalizarIngreso(): void {
    this.rqMantenimiento.mdatos = {};
    this.confirmationService.confirm({
      message: 'Está seguro de finalizar el pago de décimos?',
      header: 'Pago de décimos',
      icon: 'fa fa-question-circle',
      accept: () => {

        let mensaje = '';
        if (mensaje !== '') {
          super.mostrarMensajeError(mensaje);
          return;

        }
        //this.rqMantenimiento.mdatos=[];
        this.rqMantenimiento.mdatos.nuevo = false;
        this.rqMantenimiento.mdatos.nomina = this.tablaCabecera.registro;
        this.rqMantenimiento.mdatos.lregistros = this.tablaRolPago.lregistros;
        this.rqMantenimiento.mdatos.cerrada = true;

        this.grabar();
      },
      reject: () => {
      }
    });



  }
  reacalcular() {
    this.rqMantenimiento.mdatos = {};
    let mensaje = '';
    if (mensaje !== '') {
      super.mostrarMensajeError(mensaje);
      return;

    }
    this.rqMantenimiento.mdatos.nuevo = false;
    this.rqMantenimiento.mdatos.cnomina = this.tablaCabecera.registro.cnomina;

    this.grabar();

  }
  validaFiltrosConsulta(): boolean {
    return (
      this.tablaCabecera.validaFiltrosRequeridos() &&
      this.tablaRolPago.validaFiltrosRequeridos()

    );
  }


  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.tablaCabecera.postQuery(resp);
    let totali = 0;
    let totale = 0;
    if (!this.estaVacio(resp.INGRESO)) {
      for (const i in resp.INGRESO) {
        if (resp.INGRESO.hasOwnProperty(i)) {
          const reg = resp.INGRESO[i];
          totali = totali + reg.calculado;
        }
      }
      this.tablaIngreso.mcampos.total = totali;
    }
    if (!this.estaVacio(resp.EGRESO)) {
      for (const i in resp.EGRESO) {
        if (resp.EGRESO.hasOwnProperty(i)) {
          const reg = resp.EGRESO[i];
          totale = totale + reg.calculado;
        }
      }
      this.tablaEgreso.mcampos.total = totale;
    }

    this.tablaRolPago.postQuery(resp);
    this.tablaIngreso.postQuery(resp);
    this.tablaEgreso.postQuery(resp);
    this.nuevaNomina = false;
    this.nuevo = false;


  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {

    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();

    this.rqMantenimiento.mdatos.ldatos = this.ldatos;
    this.rqMantenimiento.mdatos.nuevo = this.nuevaNomina;
    this.rqMantenimiento.mdatos.tipo = this.tipo;
    if (this.nuevo) {
      this.tablaCabecera.selectRegistro(this.tablaCabecera.registro);
      this.tablaCabecera.actualizar();

    }
    super.addMantenimientoPorAlias(this.tablaCabecera.alias, this.tablaCabecera.getMantenimiento(1));
    super.grabar();
  }
  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosMes: any = { 'ccatalogo': 4 };
    const consultaMes = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosMes, {});
    consultaMes.cantidad = 50;
    this.addConsultaCatalogos('MESES', consultaMes, this.tablaCabecera.lmeses, super.llenaListaCatalogo, 'cdetalle');

    const mfiltrosTipo: any = { 'ccatalogo': 1148 };
    const consultaTipo = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosTipo, {});
    consultaTipo.cantidad = 50;
    this.addConsultaCatalogos('ESTADONOMINA', consultaTipo, this.tablaCabecera.lestado, super.llenaListaCatalogo, 'cdetalle');

    const mfiltrosTipoNomina: any = { 'ccatalogo': 1153 };
    const mfiltrosesp: any = { 'cdetalle': 'not in (\'GEN\')' };
    const TipoNomina = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosTipoNomina, mfiltrosesp);
    TipoNomina.cantidad = 50;
    this.addConsultaCatalogos('TIPONOMINA', TipoNomina, this.tablaCabecera.ltipo, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {

    if (resp.cod === 'OK') {

      this.tablaCabecera.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaCabecera.alias));
      this.tablaRolPago.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaRolPago.alias));
      this.tablaIngreso.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaIngreso.alias));
      this.tablaEgreso.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaEgreso.alias));
    } else {
      super.mostrarMensajeError(resp.msgs);
    }
    if (!this.estaVacio(resp.DATOS)) {
      this.tablaRolPago.lregistros = resp.ROLPAGO;

    }

    if (!this.estaVacio(resp.NOMINA)) {
      this.mcampos.cnomina = resp.NOMINA;

      this.tablaCabecera.mcampos.cnomina = this.mcampos.cnomina;
      this.tablaRolPago.mcampos.cnomina = this.mcampos.cnomina;
      this.tablaIngreso.mcampos.cnomina = this.mcampos.cnomina;
      this.tablaEgreso.mcampos.cnomina = this.mcampos.cnomina;
      this.tablaCabecera.registro.cnomina = resp.NOMINA;
      this.tablaCabecera.registro.estadicdetalle = 'GEN';
      this.tablaCabecera.registro.esnuevo = false;
      this.tablaCabecera.registro.actualizar = true;
      this.nuevaNomina = false;
      this.nuevo = false;

    }

    if (resp.RECALCULADO) {
      this.enproceso = false;

      super.encerarConsulta();
      this.rqConsulta = { 'mdatos': {} };
      this.consultar();

    }


    if (resp.cerrada) {
      this.nuevaNomina = false;
      this.cerrada = resp.cerrada;
      this.tablaCabecera.registro.estadicdetalle = "APR";
      this.nuevo = false;

    }
  }


  consultarDetalle(reg: any) {

    if (this.tablaCabecera.registro.estadicdetalle === 'GEN') {
      this.rqConsulta.CODIGOCONSULTA = 'ROLDECIMO';
    } else {
      this.consultarDetalleNuevos(reg);
      return;
    }

    this.rqConsulta.mdatos.ldatos = reg.registro;
    this.rqConsulta.mdatos.registro = this.tablaCabecera.registro;

    this.msgs = [];
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.lregistros = [];
          if (resp.cod === 'OK') {
            this.tablaIngreso.lregistros = resp.INGRESOS;
            this.tablaEgreso.lregistros = resp.EGRESOS;
            this.tablaEgreso.mcampos.total = resp.TOTALE;
            this.tablaIngreso.mcampos.total = resp.TOTALEI;


          } else {
            super.mostrarMensajeError(resp.msgusu)
          }

        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }
  mostrarLovNomina(): void {
    this.lovNomina.showDialog();
  }

  /**Retorno de lov de paises. */
  fijarLovNominaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cnomina = reg.registro.cnomina;
      this.mcampos.nmes = reg.registro.mdatos.nmes;
      this.cerrada = reg.registro.cerrada;
      this.consultar();
    }
  }
  mostrarLovFuncionario(): void {
    this.lovFuncionarios.showDialog();
  }

  validaGrabar() {
    return this.tablaCabecera.validaGrabar()
  }
  /**Retorno de lov de personas. */
  fijarLovFuncionarioSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cfuncionario = reg.registro.cfuncionario;
      this.registro.cfuncionario = reg.registro.cfuncionario;
      this.mcampos.nfuncionario = reg.registro.primernombre + " " + reg.registro.primerapellido;
      //this.registro.mdatos.nnombre = reg.registro.primernombre;
      //this.registro.mdatos.napellido = reg.registro.primerapellido;
    }
  }



}
