import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { AccordionModule } from 'primeng/primeng';
import { LovPartidaGastoComponent } from '../../../../../lov/partidagasto/componentes/lov.partidagasto.component';

@Component({
  selector: 'app-detalle',
  templateUrl: '_detalle.html'
})
export class DetalleComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;


  @ViewChild(LovPartidaGastoComponent)
  private lovPartidaGasto: LovPartidaGastoComponent;

  @Output() calcularTotalesEvent = new EventEmitter();

  public totalValor = 0;
  public indice: number;
  private catalogoDetalle: CatalogoDetalleComponent

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tpptcompromisodetalle', 'DETALLE', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
  }

  actualizar() {
  }

  eliminar() {
  }

  cancelar() {
  }

  public selectRegistro(registro: any) {
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.secuencia', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tpptpartidagasto', 'nombre', 'npartida', 'i.cpartidagasto = t.cpartidagasto and i.aniofiscal=2019');
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    for(const i of resp.DETALLE){
      i.actualizar = true;
    }
    this.lregistros = resp.DETALLE;
    this.calcularTotales();
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.crearDtoMantenimiento();
     super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  crearNuevoRegistro() {
    super.crearnuevoRegistro();
  }
  
  /**Muestra lov de Partida Gasto */
  mostrarlovPartidaGasto(): void {
  }

  /**Retorno de lov de Partida Gasto. */
  fijarLovPartidaGastoSelec(reg: any): void {
  }

  consultarCatalogos(): void {
  }

  calcularTotales(): void {
    this.totalValor = 0;
    for (const i in this.lregistros) {
      const reg = this.lregistros[i];
      this.totalValor += reg.valor;
    }
  }

}
