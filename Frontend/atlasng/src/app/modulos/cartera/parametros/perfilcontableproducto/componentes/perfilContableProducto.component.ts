import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-perfil-producto',
  templateUrl: 'perfilContableProducto.html'
})
export class PerfilContableProductoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public lsaldo: SelectItem[] = [];
  public lproducto: SelectItem[] = [{ label: '...', value: null }];
  public ltipoproductototal: any = [];
  public ltipoproducto: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarPerfilTipoProducto', 'PERFILTIPOPRODUCTO', false, true);

    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.estaVacio(this.mfiltros.ctipoproducto)) {
      this.mostrarMensajeError('TIPO DE PRODUCTO REQUERIDO');
      return;
    }
    super.crearNuevo();
    this.registro.cmodulo = 7;
    this.registro.cproducto = this.mfiltros.cproducto;
    this.registro.ctipoproducto = this.mfiltros.ctipoproducto;
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

  validaFiltrosConsulta(): boolean {
    return true;
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cproducto', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenTipoProducto', 'nombre', 'nnombre', 'i.cmodulo = 7 and i.cproducto = t.cproducto and i.ctipoproducto = t.ctipoproducto');
    consulta.addSubquery('TmonSaldo', 'nombre', 'nsaldo', 'i.cmodulo = 7 and i.csaldo = t.csaldo');
    consulta.addSubquery('TmonSaldo', 'codigocontable', 'codigocontable', 'i.cmodulo = 7 and i.csaldo = t.csaldo');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
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

    // para adicionar otros entity bean super.addMantenimientoPorAlias('alias',mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    const mfiltrosTasa = { cmodulo: 7 };
    const conModSaldo = new Consulta('TmonSaldo', 'Y', 't.nombre', mfiltrosTasa, null);
    conModSaldo.cantidad = 1000;
    this.addConsultaCatalogos('SALDO', conModSaldo, this.lsaldo, super.llenaListaCatalogo, 'csaldo');

    const mfiltrosProd: any = { 'cmodulo': 7 };
    const consultaProd = new Consulta('TgenProducto', 'Y', 't.nombre', mfiltrosProd, {});
    consultaProd.cantidad = 50;
    this.addConsultaCatalogos('PRODUCTO', consultaProd, this.lproducto, super.llenaListaCatalogo, 'cproducto');

    const mfiltrosTipoProd: any = { 'cmodulo': 7, 'verreg': 0 };
    const consultaTipoProd = new Consulta('TcarProducto', 'Y', 't.nombre', mfiltrosTipoProd, {});
    consultaTipoProd.cantidad = 100;
    this.addConsultaCatalogos('TIPOPRODUCTO', consultaTipoProd, this.ltipoproductototal, this.llenaTipoProducto, null, this.componentehijo);
    this.ejecutarConsultaCatalogos();

  }

  public llenaTipoProducto(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null, campoetiqueta = null): any {
    componentehijo.ltipoproductototal = pListaResp;
  }

  cambiarTipoProducto(event: any): any {
    if (this.mfiltros.cproducto === undefined || this.mfiltros.cproducto === null) {
      this.mfiltros.cproducto = null;
      this.mfiltros.ctipoproducto = null;
      this.consultar();
      return;
    };
    this.fijarListaTipoProducto(event.value);
  }


  fijarListaTipoProducto(cproducto: any) {
    this.ltipoproducto = [];

    for (const i in this.ltipoproductototal) {
      if (this.ltipoproductototal.hasOwnProperty(i)) {
        const reg: any = this.ltipoproductototal[i];
        if (reg !== undefined && reg.value !== null && reg.cproducto === Number(cproducto)) {
          this.ltipoproducto.push({ label: reg.nombre, value: reg.ctipoproducto });
        }
      }
    }

    this.mfiltros.ctipoproducto = null;
    if (this.ltipoproducto.length <= 0) {
      this.ltipoproducto.push({ label: '...', value: null });
    } else {
      this.mfiltros.ctipoproducto = this.ltipoproducto[0].value;
    }
    this.consultar();
  }


}
