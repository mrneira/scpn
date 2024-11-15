import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';

@Component({
  selector: 'app-tabla-acciones-judiciales',
  templateUrl: '_tablaAccionesJudiciales.html'
})
export class TablaAccionesJudicialesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public mostrarDialogoAccionJudicial = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcobCobranzaLegal', 'TABLA', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {}

  crearNuevo() {}

  actualizar() {}

  eliminar() {}

  cancelar() {}

  public selectRegistro(registro: any) {}

  consultar() {
    this.mostrarDialogoAccionJudicial = false;
    if (!this.validaFiltrosRequeridos()) {
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.secuencia desc', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'netapa', 'i.cdetalle = t.cdetalleetapa and i.ccatalogo = t.ccatalogoetapa');
    consulta.cantidad = 50;
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

  public fijarFiltrosConsulta() {}

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  
  grabar(): void {}

  public crearDtoMantenimiento() {}

  public postCommit(resp: any) {}

  public agregarAccionJudicial(){
    if (!this.validaFiltrosRequeridos()) {
      return;
    }
    this.mostrarDialogoAccionJudicial = true;
  }

  public guardarAccionJudicial(){
    alert("Guardar Acción Judicial");
  }

  public cerrarDialogoAccionesJudiciales(){
    this.mostrarDialogoAccionJudicial = false;
  }
}
