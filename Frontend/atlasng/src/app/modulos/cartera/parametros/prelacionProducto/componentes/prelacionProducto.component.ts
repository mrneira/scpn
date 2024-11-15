import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { SpinnerModule } from 'primeng/primeng';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from "primeng/primeng";

@Component({
  selector: 'app-prelacion-producto',
  templateUrl: 'prelacionProducto.html'
})
export class PrelacionProductoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public lproducto: SelectItem[] = [{ label: "...", value: null }];
  public ltipoproducto: SelectItem[] = [{ label: "...", value: null }];
  public ltipoproductototal: SelectItem[] = [{ label: "...", value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tcarprelacionproducto', 'PRELACIONPRODUCTO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
    this.consultarCatalogos();
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.cmodulo = 7;
    this.registro.optlock = 0;
    this.registro.verreg = 0;
  }


  actualizar() {
    if (!this.validaDatosRegistro(this.registro)) {
      this.mostrarMensajeWarn("EXISTEN DATOS DUPLICADOS");
      return;
    }
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.orden', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgenproducto', 'nombre', 'nproducto', 'i.cmodulo = t.cmodulo and i.cproducto = t.cproducto');
    consulta.addSubquery('tgentipoproducto', 'nombre', 'ntipoproducto', 'i.cmodulo = t.cmodulo and i.ctipoproducto = t.ctipoproducto and i.cproducto = t.cproducto');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.verreg = 0;
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

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosProd: any = { cmodulo: 7 };
    const consultaProd = new Consulta("TgenProducto", "Y", "t.nombre", mfiltrosProd, {});
    consultaProd.cantidad = 50;
    this.addConsultaCatalogos("PRODUCTO", consultaProd, this.lproducto, super.llenaListaCatalogo, 'cproducto');

    const mfiltrosTipoProd: any = { cmodulo: 7, 'activo': true, 'verreg': 0 };
    const consultaTipoProd = new Consulta("TcarProducto", "Y", "t.nombre", mfiltrosTipoProd, {});
    consultaTipoProd.cantidad = 100;
    this.addConsultaCatalogos("TIPOPRODUCTO", consultaTipoProd, null, this.llenarTipoProducto, null, this.componentehijo);

    this.ejecutarConsultaCatalogos();
  }

  public llenarTipoProducto(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    componentehijo.ltipoproductototal = pListaResp;
  }

  limpiar() {
    this.ltipoproducto = [];
    this.registro.ctipoproducto = null;
    this.consultar();
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
    this.registro.ctipoproducto = null;
    this.ltipoproducto.push({ label: "...", value: null });

    for (const i in this.ltipoproductototal) {
      if (this.ltipoproductototal.hasOwnProperty(i)) {
        const reg: any = this.ltipoproductototal[i];
        if (reg !== undefined && reg.value !== null && reg.cproducto === Number(cproducto)) {
          this.ltipoproducto.push({ label: reg.nombre, value: reg.ctipoproducto });
        }
      }
    }
  }

  validaDatosRegistro(reg: any): boolean {
    super.encerarMensajes();
    const existeOrden = this.lregistros.find(x => Number(x.orden) === Number(reg.orden) && Number(x.idreg) !== Number(reg.idreg));
    const existeProducto = this.lregistros.find(x => Number(x.cproducto) === Number(reg.cproducto) && Number(x.ctipoproducto) === Number(reg.ctipoproducto) && Number(x.idreg) !== Number(reg.idreg));

    if (!this.estaVacio(existeOrden) || !this.estaVacio(existeProducto)) {
      return false;
    }
    return true;
  }

}
