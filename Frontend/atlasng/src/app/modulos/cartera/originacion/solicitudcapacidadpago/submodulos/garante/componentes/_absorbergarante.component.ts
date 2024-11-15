import { Component, OnInit, AfterViewInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';

@Component({
  selector: 'app-absorber-garante',
  templateUrl: '_absorbergarante.html'
})
export class AbsorberGaranteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @Output() eventoAbsorcion = new EventEmitter();

  public montoabsorcion = 0;
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
    if (event) {
      this.montoabsorcion = this.montoabsorcion + registro.mdatos.saldo;
    } else {
      this.montoabsorcion = this.montoabsorcion - registro.mdatos.saldo;
    }
    this.eventoAbsorcion.emit({ registro: registro, evento: event });
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
