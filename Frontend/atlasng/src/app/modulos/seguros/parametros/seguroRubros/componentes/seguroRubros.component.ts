import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-tipo-rubros',
  templateUrl: 'seguroRubros.html'
})
export class SeguroRubrosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public ltiposeguro: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TsgsTipoSeguroRubros', 'SEGURORUBROS', false, false);
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
    this.registro.optlock = 0;
    this.registro.ctiposeguro = this.mfiltros.ctiposeguro;
    this.mcampos.valor = 0;
  }

  actualizar() {
    if (this.mcampos.porcentajevalor === "true") {
      this.registro.esporcentaje = true;
      this.registro.porcentaje = this.mcampos.valor;
      this.registro.esvalor = false;
      this.registro.valor = 0;
    } else {
      this.registro.esporcentaje = false;
      this.registro.porcentaje = 0;
      this.registro.esvalor = true;
      this.registro.valor = this.mcampos.valor;
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
    if (registro.esporcentaje) {
      this.mcampos.porcentajevalor = "true";
      this.mcampos.valor = registro.porcentaje;
    } else {
      this.mcampos.porcentajevalor = "false";
      this.mcampos.valor = registro.valor;
    }
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.ctiposeguro', this.mfiltros, this.mfiltrosesp);
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
}
