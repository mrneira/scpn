import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';
import {CatalogoDetalleComponent} from '../../../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import {AccordionModule} from 'primeng/primeng';

@Component({
  selector: 'app-detalle',
  templateUrl: '_detalle.html'
})
export class DetalleComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  @Output() calcularTotalesDebitoCreditoEvent = new EventEmitter();

  public lregplantilla: any = [];
  public totalDebito = 0;
  public totalCredito = 0;
  indice: number;
  ccuenta = '';
  public ccompromiso = '';
  cpartida = '';


  public lcentrocostoscdetalle: SelectItem[] = [{label: '...', value: null}];
  private catalogoDetalle: CatalogoDetalleComponent

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TconComprobanteDetalle', 'DETALLE', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.mcampos.nsucursal = this.dtoServicios.mradicacion.nsucursal;
    this.mcampos.nagencia = this.dtoServicios.mradicacion.nagencia;
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.registro.centrocostosccatalogo = 1002;
    this.registro.debito = true;
  }

  cpartidagastoFocus(reg:any, index: number){
    this.indice = index;
    this.cpartida = reg.cpartida;
  }

  ccompromisoFocus(reg:any, index: number){
    this.indice = index;
    this.ccompromiso = reg.ccompromiso;
  }

  presupuestoBlur(reg: any, index: number){

    if ((reg.ccompromiso === this.ccompromiso) && (reg.cpartida === this.cpartida)){
      return;
    } 

    if (reg.ccuenta === undefined){
      this.lregistros[index].ccompromiso = undefined;
      this.lregistros[index].cpartida =undefined;
      return;
    }

    if ( reg.ccompromiso === undefined || reg.cpartida === undefined || reg.ccompromiso === null 
      || reg.cpartida === null || reg.ccompromiso === '' || reg.cpartida === '' ){
      return;
    }


    delete this.rqConsulta.parametro_ccuenta;
    this.rqConsulta.CODIGOCONSULTA = 'PPT_COMPROMISOPARTIDAGASTO';
    this.rqConsulta.storeprocedure = "sp_PptConCompromisoPartidaGasto";
    this.rqConsulta.parametro_ccompromiso = reg.ccompromiso;
    this.rqConsulta.parametro_cpartidagasto = reg.cpartida;
    this.rqConsulta.parametro_valor = reg.monto;
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuestaCompromiso(resp, index);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
      this.rqConsulta.CODIGOCONSULTA = null;
  }

  private manejaRespuestaCompromiso(resp: any, index: number) {
    let compromiso; 
    if (resp.cod !== 'OK' ){
      super.mostrarMensajeError("SALDO POR DEVENGAR DE COMPROMISO Y PARTIDA ES MENOR AL SOLICITADO EN EL COMPROBANTE CONTABLE");
      this.lregistros[index].ccompromiso = undefined;
      this.lregistros[index].cpartida = undefined;
    }else if (resp.PPT_COMPROMISOPARTIDAGASTO.length === 1) {
      compromiso = resp.PPT_COMPROMISOPARTIDAGASTO[0];
      this.lregistros[index].ccompromiso = compromiso.ccompromiso;
      this.lregistros[index].cpartida = compromiso.cpartidagasto;
    }
    else{
      this.lregistros[index].ccompromiso = undefined;
      this.lregistros[index].cpartida = undefined;
    }
    this.rqConsulta.CODIGOCONSULTA = null;
  }  


  actualizar() {
    if (this.registro.padre === undefined) {
      this.registro.padre = this.mfiltros.padre;
    }
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
    this.calcularTotalesDebitoCreditoEvent.emit();
  }

  cancelar() {
    super.cancelar();
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.ccomprobante', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tconcatalogo', 'tipoplancdetalle', 'tipoplancdetalle', 'i.ccuenta = t.ccuenta');
    consulta.addSubquery('tconcatalogo', 'nombre', 'ncuenta', 'i.ccuenta = t.ccuenta');
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
   return true;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
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

  /**Retorno de lov de concepto contables. */
  fijarLovConceptoContablesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.nombre = reg.registro.nombre;

    }
  }


  crearNuevoRegistro() {
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    super.crearnuevoRegistro();

  }


  /**Retorno de lov de cuentas contables. */
  fijarLovCuentasContablesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.ncuenta = reg.registro.nombre;
      this.registro.ccuenta = reg.registro.ccuenta;
      this.registro.cmoneda = reg.registro.cmoneda;
    }

  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1002;
    const conCentroCostos = this.catalogoDetalle.crearDtoConsulta();
    this.addConsultaCatalogos('CENTROCOSTOS', conCentroCostos, this.lcentrocostoscdetalle , super.llenaListaCatalogo, 'cdetalle');
    this.ejecutarConsultaCatalogos();
  }

  private cerrarDialogo(): void {
    this.calcularTotalesDebitoCreditoEvent.emit();
  }

}
