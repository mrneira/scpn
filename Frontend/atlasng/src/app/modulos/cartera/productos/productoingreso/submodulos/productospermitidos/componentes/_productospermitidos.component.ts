import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta, Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-productos-permitidos',
  templateUrl: '_productospermitidos.html'
})
export class ProductosPermitidosComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild('formFiltros') formFiltros: NgForm;

  public lproducto: SelectItem[] = [{ label: "...", value: null }];
  public ltipoproductototal: SelectItem[] = [{ label: "...", value: null }];
  public ltipoproducto: SelectItem[] = [{ label: "...", value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tcarproductopermitidos', 'PRODUCTOPERMITIDO', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (!this.validaFiltrosRequeridos()) {
      return;
    }
    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.verreg = 0;
    this.registro.cmodulo = 7;
    this.registro.cproducto = this.mfiltros.cproducto;
    this.registro.ctipoproducto = this.mfiltros.ctipoproducto;
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
    this.fijarListaTipoProducto(registro.cproductopermitido);
    this.registro.ctipoproductopermitido = registro.ctipoproductopermitido;
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (!this.validaFiltrosRequeridos()) {
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public consultarAnterior() {
    if (!this.validaFiltrosRequeridos()) {
      return;
    }
    super.consultarAnterior();
  }

  public consultarSiguiente() {
    if (!this.validaFiltrosRequeridos()) {
      return;
    }
    super.consultarSiguiente();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cproductopermitido, t.ctipoproductopermitido', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgenproducto', 'nombre', 'nproductopermitido', 'i.cmodulo = t.cmodulo and i.cproducto = t.cproductopermitido');
    consulta.addSubquery('tgentipoproducto', 'nombre', 'ntipoproductopermitido', 'i.cmodulo = t.cmodulo and i.cproducto = t.cproductopermitido and i.ctipoproducto = t.ctipoproductopermitido');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
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

  limpiar() {
    this.ltipoproducto = [];
    this.registro.ctipoproductopermitido = null;
    this.ltipoproducto.push({ label: '...', value: null });
  }

  cambiarTipoProducto(event: any): any {
    if (this.registro.cproductopermitido === undefined || this.registro.cproductopermitido === null) {
      this.limpiar();
      return;
    }
    this.fijarListaTipoProducto(Number(event.value));
  }

  fijarListaTipoProducto(cproducto: any) {
    this.ltipoproducto = [];
    this.ltipoproducto.push({ label: '...', value: null });
    this.registro.ctipoproductopermitido = null;

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
    const existe = this.lregistros.find(x => Number(x.cproductopermitido) === Number(reg.cproductopermitido) && Number(x.ctipoproductopermitido) === Number(reg.ctipoproductopermitido) && Number(x.idreg) !== Number(reg.idreg));

    if (!this.estaVacio(existe)) {
      return false;
    }
    return true;
  }

}
