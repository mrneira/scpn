import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-validacionespecial',
  templateUrl: 'validacionespecial.html'
})

export class ValidacionespecialComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  public ltipodocumentocdetalle: SelectItem[] = [{ label: '...', value: null }];
  private catalogoDetalle: CatalogoDetalleComponent;
  secuenciaactual: number;

  public lproducto: SelectItem[] = [{ label: '...', value: null }];
  public ltipoproducto: SelectItem[] = [{ label: '...', value: null }];
  public ltipoproductogen: any = [];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tcarvalidacion', 'ValidacionEspecial', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultar();  // para ejecutar consultas automaticas.
    //this.consultarCatalogos();
    this.registro.cmodulo = 7;
    this.consultarCatalogosDetalle();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.mostrarDialogoGenerico = true;
    this.registro.cmodulo = 7;
  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    this.encerarMensajes();
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
    this.mostrarDialogoGenerico = true;
    this.secuenciaactual = this.registro.secuenciaactual;
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cproducto', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgenproducto', 'nombre', 'nproducto', 'i.cproducto=t.cproducto and i.cmodulo=t.cmodulo');
    consulta.addSubquery('tgentipoproducto', 'nombre', 'ntipoproducto', 'i.cproducto=t.cproducto and i.cmodulo=t.cmodulo and i.ctipoproducto = t.ctipoproducto');
    consulta.addSubquery('tgenmodulo', 'nombre', 'nmodulo', 'i.cmodulo = t.cmodulo');
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

  cerrarDialogo() {
  }

  consultarCatalogosDetalle(): any {
    this.encerarConsultaCatalogos();
    let tipocdetalle = 'PPRIV', cmodulo = 7;

    const mfiltrosProducto: any = { 'cmodulo': cmodulo };
    const consultaProducto = new Consulta('tgenproducto', 'Y', 't.cproducto', mfiltrosProducto, {});
    consultaProducto.cantidad = 100;
    consultaProducto.addFiltroEspecial('cproducto', "in (SELECT cproducto FROM tgenproducto WHERE tipocdetalle ='" + tipocdetalle + "' AND cmodulo =" + cmodulo + ")");
    this.addConsultaCatalogos('PRODUCTO', consultaProducto, this.lproducto, super.llenaListaCatalogo, 'cproducto');

    const mfiltrosparamcalif = { 'cmodulo': cmodulo };
    const consultaParametrosCalificacion = new Consulta('tgentipoproducto', 'Y', 't.cproducto', mfiltrosparamcalif, {});
    consultaParametrosCalificacion.cantidad = 500;
    this.addConsultaCatalogos('TIPOPRODUCTOGEN', consultaParametrosCalificacion, this.ltipoproductogen, this.llenarProducto, '', this.componentehijo, false);

    this.ejecutarConsultaCatalogos();
  }

  public llenarProducto(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    this.componentehijo.ltipoproductogen = pListaResp;

  }

  consultartipo(producto: any) {
    this.ltipoproducto = [{ label: '...', value: null }];
    for (const i in this.ltipoproductogen) {
      if (this.ltipoproductogen.hasOwnProperty(i)) {
        const reg = this.ltipoproductogen[i];
        if (reg.cproducto === producto.cproducto && reg.cmodulo === producto.cmodulo) {
          if (!this.existeLista(reg.cproducto, reg.ctipoproducto)) {
            this.ltipoproducto.push({ label: reg.nombre, value: reg.ctipoproducto });
          }
        }
      }
    }
  }

  existeLista(cproducto: any, ctipoproducto: any): boolean {
    let existe = false;
    if (this.lregistros === undefined) {
      return false;
    }
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        if (reg.ctipoproducto === ctipoproducto && reg.cproducto === cproducto) {
          existe = true;
          break;
        }
      }
    }
    return existe;
  }


}
