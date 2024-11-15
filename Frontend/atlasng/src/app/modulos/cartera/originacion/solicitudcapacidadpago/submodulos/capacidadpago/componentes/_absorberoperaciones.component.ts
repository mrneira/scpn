import { Component, OnInit, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';

@Component({
  selector: 'app-absorber-operaciones',
  templateUrl: '_absorberoperaciones.html'
})
export class AbsorberOperacionesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @Output() eventoAbsorcion = new EventEmitter();

  public montoabsorcionaportes = 0;
  public lregistrosgarante: any = [];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarSolicitudAbsorcion', 'OPERACIONESPORPERSONA', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.rqConsulta.mdatos.cpersona = this.mcampos.cpersona;
    this.rqConsulta.mdatos.operacionesgarante = true;
    this.rqConsulta.mdatos.CODIGOCONSULTA = 'OPERACIONESPORPERSONA';
    super.consultar();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    if (resp.cod === "OK") {
      this.lregistrosgarante = resp.OPERACIONESPORPERSONAGARANTE;
    }
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
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
  // Fin MANTENIMIENTO *********************

  public marcar(registro: any, event: any) {
    this.eventoAbsorcion.emit({ registro: registro, evento: event });
  }

  public validaRegistros() {
    this.montoabsorcionaportes = 0;

    // Deudores
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg: any = this.lregistros[i];
        if (reg.mdatos.pagar) {
          reg.esnuevo = true;
          this.selectRegistro(reg);
          this.actualizar();
          if (reg.mdatos.montoporaportaciones) {
            this.montoabsorcionaportes = this.montoabsorcionaportes+reg.mdatos.saldo; //CCA 20221025
            //this.montoabsorcionaportes = reg.mdatos.saldo;
          }
        }
      }
    }

    // Garantes
    for (const i in this.lregistrosgarante) {
      if (this.lregistrosgarante.hasOwnProperty(i)) {
        const reggar: any = this.lregistrosgarante[i];
        if (reggar.mdatos.pagar) {
          reggar.esnuevo = true;
          this.lregistros.push(reggar);
        }
      }
    }
  }

  public limpiarRegistros() {
    this.montoabsorcionaportes = 0;

    // Deudor
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg: any = this.lregistros[i];
        reg.mdatos.pagar = false;
        reg.esnuevo = false;
        this.selectRegistro(reg);
        this.actualizar();
      }
    }

    // Garante
    for (const i in this.lregistrosgarante) {
      if (this.lregistrosgarante.hasOwnProperty(i)) {
        const reggar: any = this.lregistrosgarante[i];
        reggar.mdatos.pagar = false;
        reggar.esnuevo = false;
      }
    }
  }
}
