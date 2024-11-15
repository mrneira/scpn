import {Component, OnInit, AfterViewInit, ViewChild, EventEmitter, Output} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../util/shared/componentes/base.component';

import {SelectItem} from 'primeng/primeng';
import {LoteModuloComponent} from '../submodulos/lotemodulo/componentes/_loteModulo.component';
import {TransaccionesEjecucionComponent} from '../submodulos/transaccionesejecucion/componentes/_transaccionesEjecucion.component';
import {TareasModuloLoteComponent} from '../submodulos/tareasmodulolote/componentes/_tareasModuloLote.component';

@Component({
  selector: 'app-definicion-lotes',
  templateUrl: 'definicionLotes.html'
})
export class DefinicionLotesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LoteModuloComponent)
  loteModuloComponent: LoteModuloComponent;

  @ViewChild(TransaccionesEjecucionComponent)
  transaccionesEjecucionComponent: TransaccionesEjecucionComponent;

  @ViewChild(TareasModuloLoteComponent)
  tareasModuloLoteComponent: TareasModuloLoteComponent;

  public llote: SelectItem[] = [{label: '...', value: null}];

  filtroLote: any;

  constructor(router: Router, dtoServicios: DtoServicios) {// ya estan definidos los alias
    super(router, dtoServicios, 'ABSTRACT', 'DEFINICIONLOTES', false, false); // true cuendo es pk compuesto
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {// primero crea un registro
    // No existe para el padre
  }

  actualizar() { // Cuando doy confirmar se ejecuta
    // No existe para el padre
  }

  eliminar() {
    // No existe para el padre
  }

  cancelar() {
    // No existe para el padre
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
    this.loteModuloComponent.mfiltros.clote = this.filtroLote;
    this.transaccionesEjecucionComponent.mfiltros.clote = this.filtroLote;
    this.tareasModuloLoteComponent.mfiltros.clote = this.filtroLote;

    this.fijarFiltrosConsulta();

    // Consulta datos.
    const conComboLoteModulo = this.loteModuloComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.loteModuloComponent.alias, conComboLoteModulo);

    const conTransaccionesEjecucion = this.transaccionesEjecucionComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.transaccionesEjecucionComponent.alias, conTransaccionesEjecucion);

    const conTareasModuloLoteComponent = this.tareasModuloLoteComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.tareasModuloLoteComponent.alias, conTareasModuloLoteComponent);
  }
  private fijarFiltrosConsulta() {
    this.loteModuloComponent.fijarFiltrosConsulta();
    this.transaccionesEjecucionComponent.fijarFiltrosConsulta();
    this.tareasModuloLoteComponent.fijarFiltrosConsulta();
  }

  validaFiltrosConsulta(): boolean {
    return this.loteModuloComponent.validaFiltrosRequeridos() && this.transaccionesEjecucionComponent.validaFiltrosRequeridos()
      && this.tareasModuloLoteComponent.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.loteModuloComponent.postQuery(resp);
    this.transaccionesEjecucionComponent.postQuery(resp);
    this.tareasModuloLoteComponent.postQuery(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = [];
    super.addMantenimientoPorAlias(this.loteModuloComponent.alias, this.loteModuloComponent.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.transaccionesEjecucionComponent.alias, this.transaccionesEjecucionComponent.getMantenimiento(2));
    super.addMantenimientoPorAlias(this.tareasModuloLoteComponent.alias, this.tareasModuloLoteComponent.getMantenimiento(3));
    super.grabar();
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }
  validaGrabar() {
    return this.loteModuloComponent.validaGrabar() && this.transaccionesEjecucionComponent.validaGrabar()
      && this.tareasModuloLoteComponent.validaGrabar();
  }
  public postCommit(resp: any) {
    this.loteModuloComponent.postCommit(resp, this.getDtoMantenimiento(this.loteModuloComponent.alias));
    this.transaccionesEjecucionComponent.postCommit(resp, this.getDtoMantenimiento(this.transaccionesEjecucionComponent.alias));
    this.tareasModuloLoteComponent.postCommit(resp, this.getDtoMantenimiento(this.tareasModuloLoteComponent.alias));
  }
  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
    const consultaLote = new Consulta('TloteCodigo', 'Y', 't.nombre', {}, {});
    this.addConsultaCatalogos('LOTE', consultaLote, this.llote, this.llenarLote, 'clote', this.componentehijo);
    this.ejecutarConsultaCatalogos();
  }
  public llenarLote(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    super.llenaListaCatalogo(pLista, pListaResp, campopk, false, componentehijo);
    componentehijo.filtroLote = pLista[0].value;
    componentehijo.consultar();
  }

}
