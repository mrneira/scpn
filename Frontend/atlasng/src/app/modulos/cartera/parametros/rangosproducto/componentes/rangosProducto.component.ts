import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';
import {LovProductoComponent} from '../../../../generales/lov/producto/componentes/lov.producto.component';
import {LovTipoProductoComponent} from '../../../../generales/lov/tipoproducto/componentes/lov.tipoProducto.component';
import {MonedasComponent} from '../../../../generales/monedas/componentes/monedas.component';
import {SaldoComponent} from '../../../../monetario/saldo/componentes/saldo.component';

@Component({
  selector: 'app-rangos-producto',
  templateUrl: 'rangosProducto.html'
})
export class RangosProductoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;


  @ViewChild(LovProductoComponent)
  private lovproducto: LovProductoComponent;

  @ViewChild(LovTipoProductoComponent)
  private lovtipoProducto: LovTipoProductoComponent;

  public lmoneda: SelectItem[] = [];

  public lsaldo: SelectItem[] = [];

  public ltasareferencial: SelectItem[] = [];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarProductoRangos', 'TCARPRODUCTORANGOS', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.estaVacio(this.mcampos.ctipoproducto)) {
      this.mostrarMensajeError('TIPO DE PRODUCTO REQUERIDO');
      return;
    }
    super.crearNuevo();
    this.registro.cmodulo = 7;
    this.registro.plazominimo = 1;
    this.registro.cproducto = this.mcampos.cproducto;
    this.registro.ctipoproducto = this.mcampos.ctipoproducto;
  }

  validaGrabar() {
    if (this.estaVacio(this.mcampos.ctipoproducto)) {
      this.mostrarMensajeError('TIPO DE PRODUCTO REQUERIDO');
      return false;
    }
    else {
      if (this.lregistros.length > 0) {
        return true;
      }
      else {
        this.mostrarMensajeError('DEBE INGRESAR AL MENOS UN REGISTRO');
      }
    }
  }

  actualizar() {
    if (this.registro.plazominimo <= "0") {
      this.mostrarMensajeError('PLAZO MÍNIMO NO PUEDE SER NEGATIVO O CERO');
      return;
    }
    this.encerarMensajes();
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

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    this.mfiltros.cproducto = this.mcampos.cproducto;
    this.mfiltros.ctipoproducto = this.mcampos.ctipoproducto;
    const consulta = new Consulta(this.entityBean, 'Y', 't.cproducto', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenTipoProducto', 'nombre', 'nnombre', 'i.cmodulo = 7 and i.cproducto = t.cproducto and i.ctipoproducto = t.ctipoproducto');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  validaFiltrosConsulta(): boolean {
    return this.validaFiltrosRequeridos();
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.cproducto = this.mcampos.cproducto;
    this.mfiltros.ctipoproducto = this.mcampos.ctipoproducto;
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

  /**Muestra lov de producto */
  mostrarlovproducto(): void {
    this.lovproducto.showDialog(7);
    if (!this.lovproducto.consultar()) {
      this.lovproducto.consultar();
    }
  }



  /**Retorno de lov de producto. */
  fijarLovProductoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.nombre = reg.registro.nombre;
      this.mcampos.cproducto = reg.registro.cproducto;
    }
    this.mcampos.tnombre = null;
    this.mcampos.ctipoproducto = null;

    this.mostrarlovtipoProducto();
  }

  /**Muestra lov de tipo producto */
  mostrarlovtipoProducto(): void {
    this.lovtipoProducto.cmodulo = 7;
    if (this.lovtipoProducto.cproducto !== this.mcampos.cproducto) {
      this.lovtipoProducto.cproducto = this.mcampos.cproducto;
      this.lovtipoProducto.consultar();
    }
    this.lovtipoProducto.displayLov = true;
  }


  /**Retorno de lov de tipo de producto. */
  fijarLovTipoProductoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.tnombre = reg.registro.nombre;
      this.mcampos.ctipoproducto = reg.registro.ctipoproducto;
      this.consultar();
    }
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    const consultaTasaRef = new Consulta('TgenTasareferencial', 'Y', 't.nombre', null, null);
    consultaTasaRef.cantidad = 50;
    this.addConsultaCatalogos('TASAREFERENCIAL', consultaTasaRef, this.ltasareferencial, super.llenaListaCatalogo, 'ctasareferencial');

    const conModMoneda = new Consulta('TgenMoneda', 'Y', 't.nombre', null, null);
    this.addConsultaCatalogos('MONEDA', conModMoneda, this.lmoneda, super.llenaListaCatalogo);

    const mfiltrosTasa = {cmodulo: 7};
    const conModSaldo = new Consulta('TmonSaldo', 'Y', 't.nombre', mfiltrosTasa, null);
    this.addConsultaCatalogos('SALDO', conModSaldo, this.lsaldo, super.llenaListaCatalogo);

    this.ejecutarConsultaCatalogos();

  }
}
