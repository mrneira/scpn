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
    if (!this.estaVacio(this.mcampos.coperacion)) {
      this.rqConsulta.mdatos.coperacion = this.mcampos.coperacion;
    }
    this.rqConsulta.mdatos.CODIGOCONSULTA = 'OPERACIONESPORPERSONA';
    super.consultar();
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

  public saldoabsorveneg = 0;//CCA 202209
  public validaRegistros() {
    this.saldoabsorveneg = 0;//CCA 202209
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg: any = this.lregistros[i];
        if (reg.mdatos.pagar) {
          reg.esnuevo = true;
          this.selectRegistro(reg);
          this.actualizar();
          this.saldoabsorveneg = this.saldoabsorveneg+this.lregistros[i].mdatos.saldo;//CCA 202209
        }
      }
    }
  }

  public limpiarRegistros() {
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg: any = this.lregistros[i];
        reg.mdatos.pagar = false;
        reg.esnuevo = false;
        this.selectRegistro(reg);
        this.actualizar();
      }
    }
  }
}
