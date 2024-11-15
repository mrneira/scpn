import { Component, OnInit, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { Router } from "@angular/router";
import { DtoServicios } from "../../../../../../../util/servicios/dto.servicios";
import { Consulta } from "../../../../../../../util/dto/dto.component";
import { BaseComponent } from "../../../../../../../util/shared/componentes/base.component";

@Component({
  selector: "app-ingresos-capacidad",
  templateUrl: "_ingresosCapacidad.html"
})
export class IngresosCapacidadComponent extends BaseComponent
  implements OnInit, AfterViewInit {

  @Output() eventoIngreso = new EventEmitter();

  private estatusBaja = false;
  public habilitaeditable = false;
  public lconyuge: any = [];
  public porcentajecapacidadpago = 0;
  public montoseleccionado = 0;
  public porcentajermurancho = 0; //CCA cambios 20210210
  public totalSoloRMU = 0;//CCA cambios 20210210
  public montoRancho =0; // CCA 20211202
  public totalRMU = 0; // CCA 20211202
  public montoOtros = 0;//CCA 20221114

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, "TcarSolicitudCapacidadPagoie", "INGRESOS", true, true);
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

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  habilitarEdicion() {
    if (!this.validaFiltrosConsulta()) {
      return;
    }
    super.habilitarEdicion();
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    this.limpiarCheck();
    this.actualizarIngresos();
    this.registro.totalingresosoriginal = this.redondear(this.registro.totalingresos,2);
    super.habilitarEdicion();
  
  }

  public setStatusBaja(status:any){
    this.estatusBaja = status;
  }
  
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
  }

  validaGrabar() {
    return super.validaGrabar('NO HA REALIZADADO LA VALIDACIÓN DEL FORMULARIO [CAPACIDAD DE PAGO INGRESO]');
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  public actualizarIngresos() {
    this.registro.totalingresos = 0;
    this.porcentajermurancho = 0; // CCA cambios ingreso
    if(this.estatusBaja){
      for (const i in this.lregistros){
        if(this.lregistros[i]['nombre'] === "RANCHO"){
          this.lregistros[i]['valor'] = 0.00;
          break;
        }
      }
    }
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        this.registro.totalingresos = this.registro.totalingresos + this.lregistros[i].valor;
        this.totalSoloRMU = this.lregistros[0].valor;// CCA cambios prestamos 20200806
        this.totalRMU = this.lregistros[0].valor;// CCA 20211202
        if(this.lregistros[i].secuencia == 1 || this.lregistros[i].secuencia == 2){
          this.porcentajermurancho= this.porcentajermurancho + (this.lregistros[i].valor); //CCA cambios capacidad 06082020
        }else{
          if(this.lregistros[i].secuencia == 5){ //CCA 20221114 todo if
            this.montoOtros = this.totalRMU*this.lregistros[i].mdatos.porcentaje/100;
            if (this.lregistros[i].valor>=(this.montoOtros)){ 
              this.lregistros[i].valor = this.totalRMU*this.lregistros[i].mdatos.porcentaje/100;
              this.montoOtros = this.lregistros[i].valor;
              this.montoseleccionado=this.montoOtros;
            }else{
              this.montoOtros = this.lregistros[i].valor;
              this.montoseleccionado=this.montoOtros;
            }
          }
          this.porcentajermurancho= this.porcentajermurancho + this.lregistros[i].valor;
        }
      }
      if(this.estatusBaja){
        this.montoRancho =0.00; // CCA 20211202
      }else{
        this.montoRancho =this.lregistros[1].valor; // CCA 20211202
      }
    }
    //this.registro.totalingresos = this.registro.totalingresos - this.montoseleccionado;
    this.eventoIngreso.emit();
    return this.registro.totalingresos;
  }

  marcarConyuge(value: boolean, index: any): void {
    this.limpiarCheck();
    if (value) {
      const reg = this.lregistros[index];
      if (reg.secuencia === 3 || reg.secuencia === 4) {
        if (this.lconyuge !== undefined && this.lconyuge.length > 0) {
          if (reg.secuencia === 3 && this.lconyuge[0].cpersonaconyugue === null) {
            super.mostrarMensajeError('CÓNYUGE REGISTRADO NO ES SOCIO');
            this.limpiarCheck();
            return;
          }
          if (reg.secuencia === 4 && this.lconyuge[0].cpersonaconyugue !== null) {
            super.mostrarMensajeError('CÓNYUGE REGISTADO ES SOCIO');
            this.limpiarCheck();
            return;
          }
          reg.valor = ((this.totalSoloRMU) * reg.mdatos.porcentaje) / 100;//CCA cambios adicional calcule 20% de todo el RMU 18112020
          reg.mdatos.marcar = true;
        } else {
          super.mostrarMensajeError('SOCIO NO REGISTRA INFORMACIÓN DE CÓNYUGE');
          this.limpiarCheck();
          return;
        }
      } else {
        //reg.valor = super.redondear(((this.totalSoloRMU ) * reg.mdatos.porcentaje) / 100, 2);//CCA cambios adicional calcule 20% de todo el RMU 18112020
        reg.valor = this.montoOtros; //CCA 20221114
        reg.mdatos.marcar = true;
      }
      this.montoseleccionado = reg.valor;
    } else {
      super.encerarMensajes();
    }
    this.actualizarIngresos();
  }

  private limpiarCheck() {
    this.montoseleccionado = 0;
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        if (reg.mdatos.check) {
          reg.valor = 0;
          reg.mdatos.marcar = false;
        }
      }
    }
    this.actualizarIngresos();
  }

}
