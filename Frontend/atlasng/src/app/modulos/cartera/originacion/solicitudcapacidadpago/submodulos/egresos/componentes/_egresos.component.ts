import { Component, OnInit, AfterViewInit,  EventEmitter, Output } from '@angular/core';
import { Router } from "@angular/router";
import { DtoServicios } from "../../../../../../../util/servicios/dto.servicios";
import { Consulta } from "../../../../../../../util/dto/dto.component";
import { BaseComponent } from "../../../../../../../util/shared/componentes/base.component";

@Component({
  selector: "app-egresos",
  templateUrl: "_egresos.html"
})
export class EgresosComponent extends BaseComponent
  implements OnInit, AfterViewInit {

  @Output() eventoEgreso = new EventEmitter();

  public habilitaeditable = false;

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
    //this.lregistros.splice(0,1); //CCA cambios 20210129 Elimina Cuota del SCPN
    this.actualizarEgresos();
    super.habilitarEdicion();
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  public actualizarEgresos() {
    this.registro.totalegresos = 0;
    //CCA cambios egresos SCPN e ISSPOL no pueden ser cero
    var banderaScpn = 0;
    var banderaIsspol = 0;
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        this.registro.totalegresos = this.registro.totalegresos + this.lregistros[i].valor;
        /*banderaScpn = this.lregistros.length;
        banderaIsspol = this.lregistros.length;
        banderaScpn = banderaScpn -3;
        banderaIsspol = banderaIsspol -2;
        if(this.lregistros[banderaIsspol].secuencia == 6 &&  this.lregistros[banderaIsspol].valor== 0 ){
          
          if(this.lregistros[banderaScpn].secuencia == 5 &&  this.lregistros[banderaScpn].valor== 0 ){
            document.getElementById("mensajeError").style.display = 'block'
          }else{
            document.getElementById("mensajeError").style.display = 'none'
          }
          document.getElementById("mensajeErrorISSPOL").style.display = 'block'
        }else{
          if(this.lregistros[banderaScpn].secuencia == 5 &&  this.lregistros[banderaScpn].valor== 0 ){
            document.getElementById("mensajeError").style.display = 'block'
          }else{
            document.getElementById("mensajeError").style.display = 'none'
          }
          document.getElementById("mensajeErrorISSPOL").style.display = 'none'
        }*/ //CCA cambios 20210129
      }
    }
    this.eventoEgreso.emit();
    return this.registro.totalegresos;
  }

}
