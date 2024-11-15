import {Component, OnInit, AfterViewInit, ViewChild, EventEmitter, Input} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../util/shared/componentes/base.component';

import {SelectItem} from 'primeng/primeng';
import {LoteResultadoCabeceraComponent} from '../submodulos/loteresultadocabecera/componentes/_loteResultadoCabecera.component';
import {LoteResultadoPrevioComponent} from '../submodulos/loteresultadoprevio/componentes/_loteResultadoPrevio.component';
import {LoteResultadoIndividualComponent} from '../submodulos/loteresultadoindividual/componentes/_loteResultadoIndividual.component';
import {LoteResultadoFinComponent} from '../submodulos/loteresultadofin/componentes/_loteResultadoFin.component';

@Component({
  selector: 'app-consulta-ejecucion',
  templateUrl: 'consultaEjecucion.html'
})
export class ConsultaEjecucionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LoteResultadoCabeceraComponent)
  loteResultadoCabeceraComponent: LoteResultadoCabeceraComponent;

  @ViewChild(LoteResultadoPrevioComponent)
  loteResultadoPrevioComponent: LoteResultadoPrevioComponent;

  @ViewChild(LoteResultadoIndividualComponent)
  loteResultadoIndividualComponent: LoteResultadoIndividualComponent;

  @ViewChild(LoteResultadoFinComponent)
  loteResultadoFinComponent: LoteResultadoFinComponent;

  public llote: SelectItem[] = [{label: '...', value: null}];
  filtroLote: any;
  fproceso: any;

  numeroejecucion = 0;
  index = 0;

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
    this.fijarFiltrosConsulta();
    // Consulta datos.
    const conLoteResultadoCabecera = this.loteResultadoCabeceraComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.loteResultadoCabeceraComponent.alias, conLoteResultadoCabecera);

    const conLoteResultadoPrevio = this.loteResultadoPrevioComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.loteResultadoPrevioComponent.alias, conLoteResultadoPrevio);

    const conLoteResultadoIndividual = this.loteResultadoIndividualComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.loteResultadoIndividualComponent.alias, conLoteResultadoIndividual);

    const conLoteResultadoFin = this.loteResultadoFinComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.loteResultadoFinComponent.alias, conLoteResultadoFin);

  }
  private fijarFiltrosConsulta() {
    if (!this.estaVacio(this.fproceso)) {
      const fechaProceso = this.fechaToInteger(this.fproceso);
      this.loteResultadoCabeceraComponent.mfiltros.fproceso = fechaProceso;
      this.loteResultadoPrevioComponent.mfiltros.fproceso = fechaProceso;
      this.loteResultadoIndividualComponent.mfiltros.fproceso = fechaProceso;
      this.loteResultadoFinComponent.mfiltros.fproceso = fechaProceso;
    }
    this.loteResultadoCabeceraComponent.mfiltros.clote = this.filtroLote;
    this.loteResultadoPrevioComponent.mfiltros.clote = this.filtroLote;
    this.loteResultadoIndividualComponent.mfiltros.clote = this.filtroLote;
    this.loteResultadoFinComponent.mfiltros.clote = this.filtroLote;
  }

  validaFiltrosConsulta(): boolean {
    return this.loteResultadoCabeceraComponent.validaFiltrosConsulta() && this.loteResultadoPrevioComponent.validaFiltrosRequeridos()
      && this.loteResultadoIndividualComponent.validaFiltrosRequeridos() && this.loteResultadoFinComponent.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.loteResultadoCabeceraComponent.postQuery(resp);
    this.loteResultadoPrevioComponent.postQuery(resp);
    this.loteResultadoIndividualComponent.postQuery(resp);
    this.loteResultadoFinComponent.postQuery(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {

  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
    const consultaLote = new Consulta('TloteCodigo', 'Y', 't.nombre', {}, {});
    consultaLote.cantidad = 100;
    this.addConsultaCatalogos('LOTE', consultaLote, this.llote, this.llenarLote, 'clote', this.componentehijo);
    this.ejecutarConsultaCatalogos();
  }
  public llenarLote(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    super.llenaListaCatalogo(pLista, pListaResp, campopk, false, componentehijo);
    componentehijo.filtroLote = pLista[0].value;
  }
  fijarNumeroEjecucion(event: any) {
    this.numeroejecucion = event.numeroejecucion;

    this.loteResultadoPrevioComponent.mfiltros.numeroejecucion = this.numeroejecucion;
    this.loteResultadoPrevioComponent.consultar();

    this.loteResultadoIndividualComponent.mfiltros.numeroejecucion = this.numeroejecucion;
    this.loteResultadoIndividualComponent.consultar();

    this.loteResultadoFinComponent.mfiltros.numeroejecucion = this.numeroejecucion;
    this.loteResultadoFinComponent.consultar();

    this.index = 1;
  }

  handleChange(e) {
    this.index = e.index;
  }
}
