import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-tipo-seguro',
  templateUrl: 'seguroProducto.html'
})
export class SeguroProductoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  private modulocartera = 7;
  public ltiposeguro: SelectItem[] = [{ label: '...', value: null }];
  public lproducto: SelectItem[] = [{ label: '...', value: null }];
  public ltipoproducto: SelectItem[] = [{ label: '...', value: null }];
  public ltipoproductototal: any = [];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TsgsTipoSeguroProducto', 'SEGUROPRODUCTO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (!this.validaFiltrosRequeridos()) {
      return;
    }

    super.crearNuevo();
    this.registro.cmodulo = this.modulocartera;
    this.registro.ctiposeguro = this.mfiltros.ctiposeguro;
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
    this.fijarListaTipoProducto(registro.cproducto);
    this.registro.ctipoproducto = registro.ctipoproducto;
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.ctiposeguro', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenModulo', 'nombre', 'nmodulo', 't.cmodulo = i.cmodulo');
    consulta.addSubquery('TgenProducto', 'nombre', 'nproducto', 'i.cmodulo = t.cmodulo and i.cproducto = t.cproducto');
    consulta.addSubquery('TgenTipoProducto', 'nombre', 'ntipoproducto', 'i.cmodulo = t.cmodulo and i.cproducto = t.cproducto and i.ctipoproducto = t.ctipoproducto');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
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
  // Fin MANTENIMIENTO *********************

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    const mfiltrosTipoSeguro: any = { verreg: 0 };
    const conTipoSeguro = new Consulta('TsgsTipoSeguroDetalle', 'Y', 't.nombre', mfiltrosTipoSeguro, {});
    conTipoSeguro.cantidad = 100;
    this.addConsultaCatalogos('TIPOSEGURO', conTipoSeguro, this.ltiposeguro, super.llenaListaCatalogo, 'ctiposeguro');

    const mfiltrosProd: any = { cmodulo: this.modulocartera };
    const consultaProd = new Consulta('TgenProducto', 'Y', 't.nombre', mfiltrosProd, {});
    consultaProd.cantidad = 100;
    this.addConsultaCatalogos('PRODUCTO', consultaProd, this.lproducto, super.llenaListaCatalogo, 'cproducto');

    const mfiltrosTipoProd: any = { cmodulo: this.modulocartera, 'activo': true, 'verreg': 0 };
    const consultaTipoProd = new Consulta('TcarProducto', 'Y', 't.nombre', mfiltrosTipoProd, {});
    consultaTipoProd.cantidad = 100;
    this.addConsultaCatalogos('TIPOPRODUCTO', consultaTipoProd, this.ltipoproducto, this.llenarTipoProducto, '', this.componentehijo);

    this.ejecutarConsultaCatalogos();
  }

  public llenarTipoProducto(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    this.componentehijo.ltipoproductototal = pListaResp;
  }

  cambiarTipoSeguro(event: any): any {
    if (this.estaVacio(this.mfiltros.ctiposeguro)) {
      return;
    }
    this.mcampos.ntiposeguro = this.ltiposeguro.find(x => x.value === event.value).label;
    this.consultar();
  }

  limpiar() {
    this.ltipoproducto = [];
    this.registro.ctipoproducto = null;
    this.ltipoproducto.push({ label: '...', value: null });
  }

  cambiarTipoProducto(event: any): any {
    if (this.registro.cproducto === undefined || this.registro.cproducto === null) {
      this.limpiar();
      return;
    }
    this.fijarListaTipoProducto(Number(event.value));
  }

  fijarListaTipoProducto(cproducto: any) {
    this.ltipoproducto = [];
    this.ltipoproducto.push({ label: '...', value: null });
    this.registro.ctipoproducto = null;

    for (const i in this.ltipoproductototal) {
      if (this.ltipoproductototal.hasOwnProperty(i)) {
        const reg: any = this.ltipoproductototal[i];
        if (reg !== undefined && reg.value !== null && reg.cproducto === Number(cproducto)) {
          this.ltipoproducto.push({ label: reg.nombre, value: reg.ctipoproducto });
        }
      }
    }
  }

}
