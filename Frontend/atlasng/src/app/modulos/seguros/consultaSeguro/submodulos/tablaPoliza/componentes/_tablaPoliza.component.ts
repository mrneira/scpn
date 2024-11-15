import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { GestorDocumentalComponent } from '../../../../../gestordocumental/componentes/gestordocumental.component';

@Component({
  selector: 'app-tabla-poliza',
  templateUrl: '_tablaPoliza.html'
})
export class TablaPolizaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(GestorDocumentalComponent)
  private lovGestor: GestorDocumentalComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TsgsPoliza', 'TABLA', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    // this.consultar();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    // No existe para la consulta de tabla cobranza
  }

  actualizar() {
    // No existe para la consulta de tabla cobranza
  }

  eliminar() {
    // No existe para la consulta de tabla cobranza
  }

  cancelar() {
    // No existe para la consulta de tabla cobranza
  }

  public selectRegistro(registro: any) {
    // No existe para la consulta de tabla cobranza
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (!this.validaFiltrosRequeridos()) {    
      return;
    }
    this.rqConsulta.CODIGOCONSULTA = "CONSULTASEGUROS";
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.secuencia', this.mfiltros, this.mfiltrosesp);   
    this.rqConsulta.coperacioncartera = this.mfiltros.coperacioncartera;
    this.rqConsulta.coperaciongarantia = this.mfiltros.coperaciongarantia;
    this.rqConsulta.cpersona = this.mcampos.cpersona;
    consulta.addSubquery('tsgstiposegurodetalle', 'nombre', 'ntiposeguro', 'i.ctiposeguro = t.ctiposeguro and i.verreg = 0');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nestado', 'i.ccatalogo = t.ccatalogoestado and i.cdetalle = t.cdetalleestado');
    consulta.cantidad = 100;
    this.addConsulta(consulta);
    return consulta;
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

  public fijarFiltrosConsulta() {

  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }
  descargarArchivo(cgesarchivo: any): void {
    this.lovGestor.consultarArchivo(cgesarchivo, true);
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    // No existe para la consulta de tabla cobranza
  }

  public crearDtoMantenimiento() {
    // No existe para la consulta de tabla cobranza
  }

  public postCommit(resp: any) {
    // No existe para la consulta de tabla cobranza
  }


}
