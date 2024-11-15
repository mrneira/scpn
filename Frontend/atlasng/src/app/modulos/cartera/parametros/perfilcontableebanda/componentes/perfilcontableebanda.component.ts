import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-perfilcontableebanda',
  templateUrl: 'perfilcontableebanda.html'
})
export class PerfilContableEbandaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public lsaldo: SelectItem[] = [];
  public lproducto: SelectItem[] = [{ label: '...', value: null }];
  public ltipoproductototal: any = [];
  public ltipo: any = [];
  public ltipoproducto: SelectItem[] = [{ label: '...', value: null }];
  public lmodulos: SelectItem[] = [{ label: '...', value: null }];
  public lestatus: SelectItem[] = [{ label: '...', value: null }];
  public lestadooperacion: SelectItem[] = [{ label: '...', value: null }];
  public lsegmento: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tcarperfilebanda', 'PERFILBANDA', false, true);

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

    const consulta = new Consulta(this.entityBean, 'Y', 't.cestatus, t.cestadooperacion, t.cbanda', this.mfiltros, {});
    consulta.addSubquery('TgenTipoProducto', 'nombre', 'nnombre', 'i.cmodulo = 7 and i.cproducto = t.cproducto and i.ctipoproducto = t.ctipoproducto');
    consulta.addSubquery('tcarestatus', 'nombre', 'nestatus', 'i.cestatus = t.cestatus');
    consulta.addSubquery('tcarestadooperacion', 'nombre', 'nestadooperacion', 'i.cestadooperacion = t.cestadooperacion');
    consulta.addSubquery('tcarsegmento', 'nombre', 'nsegmento', 'i.csegmento = t.csegmento');
    consulta.addSubquery('tgenmodulo', 'nombre', 'nmodulo', 'i.cmodulo = t.cmodulo');
    consulta.addSubquery('TgenProducto', 'nombre', 'nproducto', 'i.cproducto = t.cproducto and i.cmodulo=t.cmodulo');
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

    const mfiltrosProd: any = { 'cmodulo': 7 };
    const consultaProd = new Consulta('TgenProducto', 'Y', 't.nombre', mfiltrosProd, {});
    consultaProd.cantidad = 100;
    this.addConsultaCatalogos('PRODUCTO', consultaProd, this.lproducto, super.llenaListaCatalogo, 'cproducto');

    const mfiltrosTipoProd: any = { 'cmodulo': 7, 'activo': true, 'verreg': 0 };
    const consultaTipoProd = new Consulta('TcarProducto', 'Y', 't.nombre', mfiltrosTipoProd, {});
    consultaTipoProd.cantidad = 100;
    this.addConsultaCatalogos('TIPOPRODUCTO', consultaTipoProd, this.ltipoproductototal, this.llenaTipoProducto, null, this.componentehijo);

    const mfiltrosEstatus: any = { escontable: true };
    const conEstatus = new Consulta('tcarestatus', 'Y', 't.nombre', mfiltrosEstatus, {});
    conEstatus.cantidad = 100;
    this.addConsultaCatalogos('ESTATUS', conEstatus, this.lestatus, super.llenaListaCatalogo, 'cestatus');

    const mfiltrosEstado: any = {};
    const conEstadoOperacion = new Consulta('tcarestadooperacion', 'Y', 't.nombre', mfiltrosEstado, {});
    conEstadoOperacion.cantidad = 100;
    this.addConsultaCatalogos('ESTADOOPERACION', conEstadoOperacion, this.lestadooperacion, super.llenaListaCatalogo, 'cestadooperacion');

    const mfiltrosSegmento: any = {};
    const conSegmento = new Consulta('tcarsegmento', 'Y', 't.nombre', mfiltrosSegmento, {});
    conSegmento.cantidad = 100;
    this.addConsultaCatalogos('SEGMENTO', conSegmento, this.lsegmento, super.llenaListaCatalogo, 'csegmento');

    this.ejecutarConsultaCatalogos();
  }

  public llenaTipoProducto(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null, campoetiqueta = null): any {
    componentehijo.ltipoproductototal = pListaResp;
  }

  cambiarTipoProducto(event: any): any {
    if (this.mfiltros.cproducto === undefined || this.mfiltros.cproducto === null) {
      this.mfiltros.cproducto = null;
      this.mfiltros.ctipoproducto = null;
      return;
    };
    this.fijarListaTipoProducto(event.value);
  }

  fijarListaTipoProducto(cproducto: any) {
    this.ltipoproducto = [];
    for (const i in this.ltipoproductototal) {
      if (this.ltipoproductototal.hasOwnProperty(i)) {
        const reg: any = this.ltipoproductototal[i];
        if (reg.cproducto === cproducto) {
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

  validarDuplicado() {
    if (this.registro.esnuevo) {
      if (this.registro.cestatus !== undefined && this.registro.cestadooperacion !== undefined
        && this.registro.csegmento !== undefined && this.registro.cbanda !== undefined
        && this.mfiltros.cproducto !== undefined && this.mfiltros.ctipoproducto !== undefined
      ) {
        let regaux: any;
        regaux = this.lregistros.find(x => x.cestatus === this.registro.cestatus
          && x.cestadooperacion === this.registro.cestadooperacion
          && x.csegmento === this.registro.csegmento
          && x.cbanda === parseInt(this.registro.cbanda, 0)
          && x.cproducto === this.registro.cproducto
          && x.ctipoproducto === this.registro.ctipoproducto)
        if (regaux !== undefined) {
          super.mostrarMensajeError('Código de Banda: ' + this.registro.cbanda + 'Ya existe');
          return;
        }
      }
    }
  }
}
