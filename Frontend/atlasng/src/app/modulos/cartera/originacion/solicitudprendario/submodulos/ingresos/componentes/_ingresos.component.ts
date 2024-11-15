import { any } from 'codelyzer/util/function';
import { Component, OnInit, AfterViewInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { DtoServicios } from "../../../../../../../util/servicios/dto.servicios";
import { Consulta, Mantenimiento } from "../../../../../../../util/dto/dto.component";
import { BaseComponent } from "../../../../../../../util/shared/componentes/base.component";
import { SelectItem } from "primeng/primeng";

@Component({
  selector: "app-ingresos",
  templateUrl: "_ingresos.html"
})
export class IngresosComponent extends BaseComponent
  implements OnInit, AfterViewInit {

  @Output() eventoIngreso = new EventEmitter();

  public habilitaeditable = false;
  public lconyuge: any = [];
  public porcentajecapacidadpago = 0;
  public montoseleccionado = 0;

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

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    this.limpiarCheck();
    this.actualizarIngresos();
    this.registro.totalingresosoriginal = this.redondear(this.registro.totalingresos,2);
    super.habilitarEdicion();
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    // No existe para el padre
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
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        this.registro.totalingresos = this.registro.totalingresos + this.lregistros[i].valor;
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
          reg.valor = (((this.registro.totalingresosoriginal * this.porcentajecapacidadpago) / 100) * reg.mdatos.porcentaje) / 100;
          reg.mdatos.marcar = true;
        } else {
          super.mostrarMensajeError('SOCIO NO REGISTRA INFORMACIÓN DE CÓNYUGE');
          this.limpiarCheck();
          return;
        }
      } else {
        reg.valor = super.redondear((((this.registro.totalingresosoriginal * this.porcentajecapacidadpago) / 100) * reg.mdatos.porcentaje) / 100, 2);
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
