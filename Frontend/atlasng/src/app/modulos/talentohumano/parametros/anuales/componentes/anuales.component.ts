import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { ParametroanualComponent } from '../../../lov/parametroanual/componentes/lov.parametroanual.component';

import { LovFuncionariosComponent } from '../../../lov/funcionarios/componentes/lov.funcionarios.component';

import { DatosGeneralesComponent } from "../submodulos/cabecera/componentes/datosgenerales.component";
import { AcumulacionesComponent } from "../submodulos/acumulaciones/componentes/acumulaciones.component";
import { HorasExtrasComponent } from "../submodulos/horasextras/componentes/horasextras.component";
import { ImpuestoRentaComponent } from "../submodulos/impuestorenta/componentes/impuestorenta.component";
import { PagodecimoComponent } from "../submodulos/pagodecimo/componentes/pagodecimo.component";
import { GastodeducibleComponent } from "../submodulos/gastodeducible/componentes/gastodeducible.component";
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';

@Component({
  selector: 'app-parametrizacionanual',
  templateUrl: 'anuales.html'
})
export class ParametrizacionAnualComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(ParametroanualComponent)
  private lovParametro: ParametroanualComponent;
  
  @ViewChild(GastodeducibleComponent)
  private tablaGastoDeducible: GastodeducibleComponent;


  @ViewChild(DatosGeneralesComponent)
  private tablaCabecera: DatosGeneralesComponent;

  @ViewChild(HorasExtrasComponent)
  private tablaHorasExtras: HorasExtrasComponent;

  @ViewChild(AcumulacionesComponent)
  private tablaDetalle: AcumulacionesComponent;

  @ViewChild(ImpuestoRentaComponent)
  private tablaImpuestoRenta: ImpuestoRentaComponent;

  @ViewChild(PagodecimoComponent)
  private tablaPagoDecimo: PagodecimoComponent;

  @ViewChild(LovFuncionariosComponent)
  private lovFuncionarios: LovFuncionariosComponent;

  
  private catalogoDetalle: CatalogoDetalleComponent;

  public ltipo: SelectItem[] = [{ label: '...', value: null }];


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CAPACITACIONDATOS', false);
  }



  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);

    this.tablaDetalle.ins = true;
    this.tablaHorasExtras.ins = true;
    this.tablaImpuestoRenta.ins = true;
    this.tablaDetalle.editable= true;
    this.tablaDetalle.del= true;
    this.tablaHorasExtras.del= true;
    this.tablaHorasExtras.editable= true;
    this.tablaImpuestoRenta.editable= true;
    this.tablaImpuestoRenta.del= true;
    this.tablaPagoDecimo.ins= true;
    this.tablaPagoDecimo.del= true;
    this.tablaPagoDecimo.editable= true;
    this.tablaPagoDecimo.mcampos.fmin=this.fechaactual;    
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

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {

    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();

    const consCabecera = this.tablaCabecera.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaCabecera.alias, consCabecera);

    const conshoras = this.tablaHorasExtras.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaHorasExtras.alias, conshoras);

    const consDetalle = this.tablaDetalle.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaDetalle.alias, consDetalle);

    const consImpuestoRenta = this.tablaImpuestoRenta.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaImpuestoRenta.alias, consImpuestoRenta);

    const consPagoDecimo = this.tablaPagoDecimo.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaPagoDecimo.alias, consPagoDecimo);

    const consGastosD = this.tablaGastoDeducible.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaGastoDeducible.alias, consGastosD);
    
  }
  private fijarFiltrosConsulta() {
    this.tablaCabecera.mfiltros.anio = this.mcampos.anio;
    this.tablaDetalle.mfiltros.anio = this.mcampos.anio;
    this.tablaHorasExtras.mfiltros.anio = this.mcampos.anio;
    this.tablaImpuestoRenta.mfiltros.anio = this.mcampos.anio;
    this.tablaPagoDecimo.mfiltros.anio = this.mcampos.anio;
    this.tablaGastoDeducible.mfiltros.anio = this.mcampos.anio;

  }

  consultarCatalogos(): void {
  

    this.encerarConsultaCatalogos();
   
    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1140;
    const constipoHoraExtra = this.catalogoDetalle.crearDtoConsulta();
    constipoHoraExtra.cantidad = 20;
    this.addConsultaCatalogos('TIPOHORAEXTRA', constipoHoraExtra, this.tablaHorasExtras.ltipo, super.llenaListaCatalogo, 'cdetalle',);

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1114;
    const consRegimen = this.catalogoDetalle.crearDtoConsulta();
    consRegimen.cantidad = 20;
    this.addConsultaCatalogos('TIPOREGIMEN', consRegimen, this.tablaHorasExtras.lregimen, super.llenaListaCatalogo, 'cdetalle');

    
    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 4;
    const consMes = this.catalogoDetalle.crearDtoConsulta();
    consMes.cantidad = 20;
    this.addConsultaCatalogos('TMESES', consMes, this.tablaPagoDecimo.lmes, this.llenarMes, '', this.componentehijo);

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1130;
    const consRegion = this.catalogoDetalle.crearDtoConsulta();
    consRegion.cantidad = 50;
    this.addConsultaCatalogos('TREGION', consRegion, this.tablaPagoDecimo.lregion, super.llenaListaCatalogo, 'cdetalle',this.componentehijo);

    this.ejecutarConsultaCatalogos();
  }
  public llenarMes(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    for (let i in pListaResp) {
      let reg = pListaResp[i];
      this.componentehijo.tablaPagoDecimo.lmes.push({ label: reg.nombre, value: reg.cdetalle });
      this.componentehijo.tablaCabecera.lmes.push({ label: reg.nombre, value: reg.cdetalle });
     
    }
  }

  validaFiltrosConsulta(): boolean {
    return (
      this.tablaCabecera.validaFiltrosRequeridos() &&
      this.tablaDetalle.validaFiltrosRequeridos() &&
      this.tablaHorasExtras.validaFiltrosRequeridos() &&
      this.tablaImpuestoRenta.validaFiltrosRequeridos())&&
      this.tablaPagoDecimo.validaFiltrosRequeridos() &&
      this.tablaGastoDeducible.validaFiltrosRequeridos();
  }


  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.tablaCabecera.postQuery(resp);
    this.tablaDetalle.postQuery(resp);
    this.tablaHorasExtras.postQuery(resp);
    this.tablaImpuestoRenta.postQuery(resp);
    this.tablaPagoDecimo.postQuery(resp);
    this.tablaGastoDeducible.postQuery(resp);
    

  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.mdatos.anio = this.tablaCabecera.registro.anio;
    this.rqMantenimiento.mdatos.nuevo = this.tablaCabecera.registro.esnuevo;
    this.crearDtoMantenimiento();
    super.grabar();
  }


  public crearDtoMantenimiento() {
    super.addMantenimientoPorAlias(this.tablaCabecera.alias, this.tablaCabecera.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.tablaDetalle.alias, this.tablaDetalle.getMantenimiento(2));
    super.addMantenimientoPorAlias(this.tablaHorasExtras.alias, this.tablaHorasExtras.getMantenimiento(3));
    super.addMantenimientoPorAlias(this.tablaImpuestoRenta.alias, this.tablaImpuestoRenta.getMantenimiento(4));
    super.addMantenimientoPorAlias(this.tablaPagoDecimo.alias, this.tablaPagoDecimo.getMantenimiento(5));
    super.addMantenimientoPorAlias(this.tablaGastoDeducible.alias, this.tablaGastoDeducible.getMantenimiento(6));
  
  }

  public postCommit(resp: any) {

    if (resp.cod === 'OK') {

      this.tablaCabecera.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaCabecera.alias));
      this.tablaDetalle.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaDetalle.alias));
      this.tablaHorasExtras.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaHorasExtras.alias));
      this.tablaImpuestoRenta.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaImpuestoRenta.alias));
      this.tablaPagoDecimo.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaPagoDecimo.alias));
      this.tablaGastoDeducible.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaGastoDeducible.alias));

    }

    if (!this.estaVacio(resp.FINALIZADA)) {

      this.mcampos.anio = resp.FINALIZADA[0];
      this.tablaCabecera.mcampos.anio = this.mcampos.anio;
      this.tablaImpuestoRenta.mcampos.anio= this.mcampos.anio;
      this.tablaDetalle.mcampos.anio = this.mcampos.anio;
      this.tablaHorasExtras.mcampos.anio= this.mcampos.anio;
      this.tablaPagoDecimo.mcampos.anio= this.mcampos.anio;
      this.tablaGastoDeducible.mcampos.anio= this.mcampos.anio;
      
    }
  }

  mostrarLovParametro(): void {
    this.lovParametro.mfiltros.verreg=0;
    this.lovParametro.showDialog();
  }

  /**Retorno de lov de paises. */
  fijarLovParametroSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.anio = reg.registro.anio;
      this.tablaDetalle.mcampos.anio = reg.registro.anio;
      this.tablaHorasExtras.mcampos.anio = reg.registro.anio;
      this.tablaCabecera.mcampos.anio = reg.registro.anio;
      this.tablaImpuestoRenta.mcampos.anio = reg.registro.anio;
      this.tablaPagoDecimo.mcampos.anio = reg.registro.anio;
      this.tablaGastoDeducible.mcampos.anio = reg.registro.anio;
      

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
      this.registro.mdatos.nnombre = reg.registro.primernombre;
      this.registro.mdatos.napellido = reg.registro.primerapellido;
    }
  }



}
