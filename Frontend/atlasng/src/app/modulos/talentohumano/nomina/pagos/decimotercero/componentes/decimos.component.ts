import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovNominaComponent } from '../../../../lov/nomina/componentes/lov.nomina.component';

import { ConfirmationService } from 'primeng/primeng';
import { LovFuncionariosComponent } from '../../../../lov/funcionarios/componentes/lov.funcionarios.component';

import { DatosgeneralesComponent } from "../submodulos/datosgenerales/componentes/datosgenerales.component";
import { DetalleComponent } from '../submodulos/detalle/componentes/detalle.component';


import { MenuItem } from 'primeng/components/common/menuitem';
import { AppService } from 'app/util/servicios/app.service';

@Component({
  selector: 'app-decimos',
  templateUrl: 'decimos.html'
})
export class DecimoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovNominaComponent)
  private lovNomina: LovNominaComponent;


  @ViewChild(DatosgeneralesComponent)
  tablaCabecera: DatosgeneralesComponent;

  @ViewChild(DetalleComponent)
  private tablaDetalle: DetalleComponent;


  @ViewChild(LovFuncionariosComponent)
  private lovFuncionarios: LovFuncionariosComponent;

  public ltipo: SelectItem[] = [{ label: '...', value: null }];
  public nuevo = true;
  public cerrada = false;
  public nuevaNomina = false;

  public ldatos: any = [];


  constructor(router: Router, dtoServicios: DtoServicios, public route: ActivatedRoute, public appService: AppService, private confirmationService: ConfirmationService) {
    super(router, dtoServicios, 'ABSTRACT', 'NOMINAGENERAL', false);
  }
  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {

  }

  actualizar() {
  }

  eliminar() {
  }

  cancelar() {
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

    const consRolPago = this.tablaDetalle.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaDetalle.alias, consRolPago);

    const consIngreso = this.tablaDetalle.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaDetalle.alias, consIngreso);

    const consEgreso = this.tablaDetalle.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaDetalle.alias, consEgreso);

  }
  public crearDtoConsultaDetalle(reg: any) {
    
  }
  private fijarFiltrosConsulta() {
    this.tablaCabecera.mfiltros.cnomina = this.mcampos.cnomina;
    this.tablaCabecera.mcampos.cnomina = this.mcampos.cnomina;
    
  }
  private fijarFiltrosConsultaDetalle(reg: any) {
    
  }


  guardarCambios() {
    this.rqMantenimiento.mdatos = {};
    this.grabar();
  }

  finalizarIngreso(): void {
    this.rqMantenimiento.mdatos = {};
    this.confirmationService.confirm({
      message: 'Está seguro de finalizar la nómina?',
      header: 'Nómina',
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
        this.rqMantenimiento.mdatos.lregistros = this.tablaDetalle.lregistros;
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
      this.tablaDetalle.validaFiltrosRequeridos()

    );
  }


  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.tablaCabecera.postQuery(resp);
    

    this.tablaDetalle.postQuery(resp);
   
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
    const TipoNomina = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosTipoNomina, {});
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
      this.tablaDetalle.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaDetalle.alias));
     
    } else {
      super.mostrarMensajeError(resp.msgs);
    }
    if (!this.estaVacio(resp.DATOS)) {
      this.tablaDetalle.lregistros = resp.ROLPAGO;

    }

    if (!this.estaVacio(resp.NOMINA)) {
      this.mcampos.cnomina = resp.NOMINA;

      this.tablaCabecera.mcampos.cnomina = this.mcampos.cnomina;
      this.tablaDetalle.mcampos.cnomina = this.mcampos.cnomina;
    
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

    if (this.tablaCabecera.registro.tipocdetalle === 'GEN' && this.tablaCabecera.registro.estadicdetalle === 'GEN') {
      this.rqConsulta.CODIGOCONSULTA = 'ROLPAGOS';
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
            this.tablaDetalle.lregistros = resp.DECIMOS;
           


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
