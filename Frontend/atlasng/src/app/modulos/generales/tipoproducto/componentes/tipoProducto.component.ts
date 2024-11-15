import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { ModulosComponent } from '../../../generales/modulos/componentes/modulos.component';
import { ProductoComponent } from '../../producto/componentes/producto.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-tipoproducto',
  templateUrl: 'tipoproducto.html'
})
export class TipoProductoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  public lmodulos: SelectItem[] = [{ label: '...', value: null }];
  public lproductototal = []; // Contien todos los productos de todos los modulos para evitar varias consultas a la base.
  public lproducto: SelectItem[] = [{ label: '...', value: null }];


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TgenTipoProducto', 'TIPOPRODUCTO', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
    // this.consultar();
  }

  ngAfterViewInit() {

  }

  crearNuevo() {
    if (this.mfiltros.cmodulo === undefined) {
      super.mostrarMensajeError('SELECCIONE UN MÓDULO PARA CREAR UN PRODUCTO');
      return;
    }
    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.cmodulo = this.mfiltros.cmodulo;
    this.registro.cproducto = this.mfiltros.cproducto;
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

  // Inicia CONSULTA *********************
  consultar() {

    this.crearDtoConsulta();

    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.nombre', this.mfiltros, this.mfiltrosesp);
    consulta.cantidad = 500;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
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

  public llenaListaModulos(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    super.llenaListaCatalogo(pLista, pListaResp, campopk, false, componentehijo);
    componentehijo.mfiltros.cmodulo = pLista[0].value;
    componentehijo.consultar();
  }

  // Filtra productos asociados a un modulo.
  public filtrarProducto(cmodulo: any) {

    this.lproducto = [];

    for (const i in this.lproductototal) {
      if (this.lproductototal.hasOwnProperty(i)) {
        const reg: any = this.lproductototal[i];
        if (reg !== undefined && reg.value !== null && reg.cmodulo === Number(cmodulo)) {
          this.lproducto.push({ label: reg.nombre, value: reg.cproducto });
        }
      }
    }
    this.mfiltros.cproducto = null;
    if (this.lproducto.length <= 0) {
      this.lproducto.push({ label: '...', value: null });
    } else {
      this.mfiltros.cproducto = this.lproducto[0].value;
    }
    this.consultar();
  }

  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.manejaRespuestaCatalogos(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  llenarConsultaCatalogos(): void {
    const mfiltrosMod = { 'negocio': true }
    const consultaModulo = new Consulta('TgenModulo', 'Y', 't.nombre', mfiltrosMod, {});
    consultaModulo.cantidad = 50;
    this.addConsultaPorAlias('MODULO', consultaModulo);

    const consultaProducto = new Consulta('TgenProducto', 'Y', 't.nombre', {}, {});
    consultaProducto.cantidad = 50;
    this.addConsultaPorAlias('PRODUCTO', consultaProducto);
  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.lmodulos, resp.MODULO, 'cmodulo');
      this.lproductototal = resp.PRODUCTO;
    }
    this.lconsulta = [];
  }

}
