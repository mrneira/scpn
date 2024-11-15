import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DtoServicios } from "../../../../../../../util/servicios/dto.servicios";
import { Consulta } from "../../../../../../../util/dto/dto.component";
import { BaseComponent } from "../../../../../../../util/shared/componentes/base.component";
import { EgresosCapacidadComponent } from './../../egresoscapacidad/componentes/_egresosCapacidad.component';
import { IngresosCapacidadComponent } from "../../ingresoscapacidad/componentes/_ingresosCapacidad.component";
import { AbsorberOperacionesComponent } from './_absorberoperaciones.component';
import { ConsolidadoApComponent } from './_consolidadoap.component';

@Component({
  selector: "app-capacidad-deudor",
  templateUrl: "_capacidadDeudor.html"
})
export class CapacidadDeudorComponent extends BaseComponent
  implements OnInit, AfterViewInit {

  @ViewChild(EgresosCapacidadComponent)
  egresosCapacidadComponent: EgresosCapacidadComponent;

  @ViewChild(IngresosCapacidadComponent)
  ingresosCapacidadComponent: IngresosCapacidadComponent;

  @ViewChild(AbsorberOperacionesComponent)
  absorberComponent: AbsorberOperacionesComponent;

  @ViewChild(ConsolidadoApComponent)
  consolidadoComponent: ConsolidadoApComponent; //CCA 20221025

  public aprobado = false;
  public porcentajecapacidadpago = 0;
  public habilitaAbsorcion = false;
  public habilitaConsolidado = false;//CCA 20221025
  public condicionCalicacDeudor; //CCA 20221117
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, "TcarSolicitudCapacidadPago", "DEUDOR", true, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
  }

  ngAfterViewInit() { }

  crearNuevo() {
  }

  actualizar() {
    super.actualizar();
    this.registro.cusuario = this.dtoServicios.mradicacion.cusuario;
    this.registro.crelacion = 1;
  }

  eliminar() {
  }

  cancelar() {
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
    const consulta = new Consulta(this.entityBean, "Y", "t.ccapacidad", this.mfiltros, this.mfiltrosesp);
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
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

  public calculaCapacidadPago() {
    super.encerarMensajes();
    this.registro.capacidadpago = 0;
    this.registro.porcentajecoberturacuota = 0;
    this.registro.resolucion = "";

    //CCA 20211202 
    if (!this.estaVacio(this.registro.totalingresos) && this.registro.totalingresos > 0) {
      if(this.ingresosCapacidadComponent.montoseleccionado==0)
      {
        this.registro.capacidadpago = super.redondear((((this.ingresosCapacidadComponent.totalRMU)*this.porcentajecapacidadpago/100)+this.ingresosCapacidadComponent.montoRancho),2);
      }
      else{
        this.registro.capacidadpago = super.redondear((((this.ingresosCapacidadComponent.totalRMU)*this.porcentajecapacidadpago/100)+this.ingresosCapacidadComponent.montoseleccionado+this.ingresosCapacidadComponent.montoRancho),2);//CCA 20221114
      }
    }
    if(!this.estaVacio(this.registro.totalingresos) && this.registro.totalingresos > 0 && this.registro.totalegresos == 0){
      this.registro.capacidadpago = super.redondear(((this.registro.capacidadpago) - (this.registro.totalegresos)), 2)
    }
    if (!this.estaVacio(this.registro.totalegresos) && this.registro.totalegresos > 0) {
      this.registro.capacidadpago = super.redondear(((this.registro.capacidadpago) - (this.registro.totalegresos)), 2);      
    }
    //CCA 20211202

    this.registro.porcentajecoberturacuota = Math.round((this.registro.valorcuota / this.registro.capacidadpago) * 100);
    if(this.registro.ctipoarreglopago == "RES"){
      if(this.registro.capacidadpago >= 0){
        this.aprobado = true;
        this.registro.resolucion = "APROBADO";
      }else{
        this.aprobado = false;
        this.registro.resolucion = "NEGADO";
      }
    }else if (this.registro.capacidadpago >= this.registro.valorcuota) {
      this.aprobado = true;
      this.registro.resolucion = "APROBADO";
    } else {
      this.aprobado = false;
      this.registro.resolucion = "NEGADO";
    }
    
  }

  private actualizarEgresos() {
    this.egresosCapacidadComponent.condicionCalicacEgreso= this.condicionCalicacDeudor;//CCA 20221117
    this.registro.totalegresos = 0;
    this.registro.totalegresos = this.egresosCapacidadComponent.registro.totalegresos;
    this.calculaCapacidadPago();
  }

  private actualizarIngresos() {
    this.registro.totalingresos = 0;
    this.registro.totalingresos = this.ingresosCapacidadComponent.registro.totalingresos;
    this.calculaCapacidadPago();
  }

  private actualizarAbsorcion(data: any) {
    super.encerarMensajes();
    if (data.evento && (this.registro.monto < data.registro.mdatos.saldo)) {
      data.registro.mdatos.pagar = false;
      super.mostrarMensajeError("EL MONTO DE LA OPERACIÓN A CANCELAR ES MAYOR AL MONTO DE LA SOLICITUD");
      return;
    }

    for (const i in this.egresosCapacidadComponent.lregistros) {
      if (this.egresosCapacidadComponent.lregistros.hasOwnProperty(i)) {
        const reg = this.egresosCapacidadComponent.lregistros[i];
        if (Number(reg.secuencia) === Number(data.registro.coperacion)) {
          if (data.evento) {
            reg.valor = 0;
          } else {
            reg.valor = data.registro.mdatos.valorcuotaencurso;
          }
          break;
        }
      }
    }

    this.egresosCapacidadComponent.registro.totalegresos = 0;
    for (const i in this.egresosCapacidadComponent.lregistros) {
      if (this.egresosCapacidadComponent.lregistros.hasOwnProperty(i)) {
        this.egresosCapacidadComponent.registro.totalegresos = this.egresosCapacidadComponent.registro.totalegresos + this.egresosCapacidadComponent.lregistros[i].valor;
      }
    }

    this.actualizarEgresos();
  }

}
