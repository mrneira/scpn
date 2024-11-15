import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';
import { OperacionArregloPagoComponent } from './operacionArregloPago.component';
import { RubrosArregloPagoComponent } from './rubrosArregloPago.component';
import { LovOperacionArregloPagoComponent } from '../../../lov/arreglopago/componentes/lov.operacionArregloPago.component';

@Component({
  selector: 'app-ing-arreglo-pagos',
  templateUrl: 'aprobarArregloPago.html'
})
export class AprobarArregloPagoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(OperacionArregloPagoComponent)
  operacionArreglo: OperacionArregloPagoComponent;

  @ViewChild(RubrosArregloPagoComponent)
  rubrosArreglo: RubrosArregloPagoComponent;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  @ViewChild(LovOperacionArregloPagoComponent)
  private lovOperacionArreglo: LovOperacionArregloPagoComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'INGRESOARREGLOPAGO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
  }

  actualizar() {
  }

  eliminar() {
    super.eliminar();
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

    const conOperacionArreglo = this.operacionArreglo.crearDtoConsulta();
    this.addConsultaPorAlias(this.operacionArreglo.alias, conOperacionArreglo);

    const conrubrosArreglo = this.rubrosArreglo.crearDtoConsulta();
    this.addConsultaPorAlias(this.rubrosArreglo.alias, conrubrosArreglo);
  }

  private fijarFiltrosConsulta() {
    this.operacionArreglo.fijarFiltrosConsulta();
    this.rubrosArreglo.fijarFiltrosConsulta();
  }

  validaFiltrosConsulta(): boolean {
    return this.operacionArreglo.validaFiltrosRequeridos() && this.rubrosArreglo.validaFiltrosRequeridos();
  }

  public postQuery(resp: any) {
    this.operacionArreglo.postQuery(resp);
    this.rubrosArreglo.postQuery(resp);
    this.operacionArreglo.registro.cestatus = 'APR';
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    if (this.estaVacio(this.operacionArreglo.mfiltros.coperacion)) {
      this.mostrarMensajeError('DEBE ELEGIR UNA OPERACION');
      return;
    }
    this.lmantenimiento = []; // Encerar Mantenimiento

    this.operacionArreglo.formvalidado = true;
    this.rqMantenimiento.coperacion = this.operacionArreglo.mfiltros.coperacion;
    this.rqMantenimiento.ctipoarreglopago = this.operacionArreglo.registro.ctipoarreglopago;

    super.grabar(false);
  }

  validaGrabar() {
    return this.operacionArreglo.validaGrabar() && this.rubrosArreglo.validaGrabar();
  }

  public postCommit(resp: any) {
    this.operacionArreglo.postCommit(resp, this.getDtoMantenimiento(this.operacionArreglo.alias));
    this.rubrosArreglo.postCommit(resp, this.getDtoMantenimiento(this.rubrosArreglo.alias));

  }

  /**Muestra lov de personas */
  mostrarLovPersona(): void {
    this.lovPersonas.mfiltros.csocio = 1;
    this.lovPersonas.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.mcampos.nombre = reg.registro.nombre;

      this.lovOperacionArreglo.mfiltrosesp.cestatus = 'in (\'PAG\')';
      this.lovOperacionArreglo.mfiltrosesp.coperacion = 'in (select o.coperacion from TcarOperacion o where cpersona=' + this.mcampos.cpersona + ')';
      this.lovOperacionArreglo.consultar();
      this.lovOperacionArreglo.showDialog();
    }
  }

  /**Muestra lov de operaciones de cartera. */
  mostrarLovOperacion(): void {
    if (this.mcampos.cpersona === undefined) {
      this.mostrarMensajeInfo('SELECCIONE UN CLIENTE');
      return;
    }
    this.lovOperacionArreglo.showDialog();
  }

  /**Retorno de lov de operacion de cartera. */
  fijarLovOperacionSelec(reg: any): void {
    this.mcampos.ntipoprod = reg.registro.mdatos.ntipoarreglopago;

    this.operacionArreglo.mfiltros.coperacion = reg.registro.coperacion;
    this.operacionArreglo.mfiltros.ctipoarreglopago = reg.registro.ctipoarreglopago;

    this.rubrosArreglo.mfiltros.coperacion = reg.registro.coperacion;
    this.rubrosArreglo.mfiltros.ctipoarreglopago = reg.registro.ctipoarreglopago;

    this.consultar();
  }

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const consultaTipoArreglo = new Consulta('TcarTipoArregloPago', 'Y', 't.nombre', {}, {});
    consultaTipoArreglo.cantidad = 30;
    this.addConsultaCatalogos('TIPOARREGLO', consultaTipoArreglo, this.operacionArreglo.ltipoarreglo, super.llenaListaCatalogo, 'ctipoarreglopago');

    this.ejecutarConsultaCatalogos();
  }

  public llenarRubrosArreglo(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    for (const item of componentehijo.rubrosArreglo.lregistros) {
      componentehijo.rubrosArreglo.selectRegistro(item);
      componentehijo.rubrosArreglo.eliminar();
    }

    for (const i in pListaResp) {
      if (pListaResp.hasOwnProperty(i)) {
        const item = pListaResp[i];
        componentehijo.rubrosArreglo.crearNuevo();

        componentehijo.rubrosArreglo.registro.coperacion = componentehijo.operacionArreglo.registro.coperacion;
        componentehijo.rubrosArreglo.registro.ctipoarreglopago = componentehijo.operacionArreglo.registro.ctipoarreglopago;
        componentehijo.rubrosArreglo.registro.csaldo = item.csaldo;
        componentehijo.rubrosArreglo.registro.csaldodestino = item.csaldodestino;
        componentehijo.rubrosArreglo.registro.pagoobligatorio = item.pagoobligatorio;
        componentehijo.rubrosArreglo.registro.mdatos.nsaldo = item.mdatos.nsaldo;
        componentehijo.rubrosArreglo.registro.mdatos.nsaldodestino = item.mdatos.nsaldodestino;

        componentehijo.rubrosArreglo.selectRegistro(componentehijo.rubrosArreglo.registro);
        componentehijo.rubrosArreglo.actualizar();
      }
    }

  }

}
