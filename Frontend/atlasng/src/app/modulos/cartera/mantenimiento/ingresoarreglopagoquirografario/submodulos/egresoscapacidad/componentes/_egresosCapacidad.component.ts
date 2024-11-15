import { Component, OnInit, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { Router } from "@angular/router";
import { DtoServicios } from "../../../../../../../util/servicios/dto.servicios";
import { Consulta } from "../../../../../../../util/dto/dto.component";
import { BaseComponent } from "../../../../../../../util/shared/componentes/base.component";

@Component({
  selector: "app-egresos-capacidad",
  templateUrl: "_egresosCapacidad.html"
})
export class EgresosCapacidadComponent extends BaseComponent
  implements OnInit, AfterViewInit {

  @Output() eventoEgreso = new EventEmitter();

  public habilitaeditable = false;
  public condicionCalicacEgreso ; //CCA 20221117
  public msgCalificacion = "";//CCA 20221117

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, "TcarSolicitudCapacidadPagoie", "EGRESOS", true, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
  }

  ngAfterViewInit() { }

  crearNuevo() {
    super.crearNuevo();
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

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, "Y", "t.secuencia", this.mfiltros, this.mfiltrosesp);
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.verreg = 0;
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    this.actualizarEgresos();
    super.habilitarEdicion();
    if(this.condicionCalicacEgreso==0){
      this.msgCalificacion = '*--- SOCIO CUMPLE CALIFICACIÓN A-1 ---*'
      
    }else{
      this.msgCalificacion = '*--- SOCIO NO CUMPLE CALIFICACIÓN A-1 ---*'
    }
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  public actualizarEgresos() {
    this.registro.totalegresos = 0;
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        this.registro.totalegresos = this.registro.totalegresos + this.lregistros[i].valor;
      }
    }
    this.eventoEgreso.emit();
    return this.registro.totalegresos;
  }

}
