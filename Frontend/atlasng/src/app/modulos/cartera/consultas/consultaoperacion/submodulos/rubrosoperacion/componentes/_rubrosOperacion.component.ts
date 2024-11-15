import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';

@Component({
  selector: 'app-rubros-operacion',
  templateUrl: '_rubrosOperacion.html'
})
export class RubrosOperacionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public totalprecancelacion = 0;
  public montooperacion = 0;
  public montocapital = 0;
  public montocxp = 0;
  private SALDOCAPITAL = "CAP";
  private SALDOCXP = "CXP";

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'RUBROSPRECANCELACIONCARTERA', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.mcampos.fcobro = new Date(this.integerToDate(this.dtoServicios.mradicacion.fcontable));
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
    this.rqConsulta.CODIGOCONSULTA = 'RUBROSPRECANCELACIONCARTERA';
    this.rqConsulta.coperacion = this.mfiltros.coperacion;
    if (!this.estaVacio(this.mcampos.fcobro)) {
      this.rqConsulta.fcobro = this.fechaToInteger(this.mcampos.fcobro);
    }
    super.consultar();
  }

  public fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    if (this.estaVacio(this.mfiltros.coperacion)) {
      this.mostrarMensajeError('OPERACIÓN REQUERIDA');
      return false;
    }
    return true;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.manejaRespuesta(resp);
  }

  manejaRespuesta(resp: any) {
    const msgs = [];
    let montocapital = 0;
    let montocxp = 0;

    if (resp.cod === 'OK') {
      for (const i in resp.RUBROS) {
        if (resp.RUBROS.hasOwnProperty(i)) {
          const reg: any = resp.RUBROS[i];

          // Rubros no aplica renovacion
          if (reg.ctiposaldo === this.SALDOCAPITAL) {
            montocapital = montocapital + reg.monto;
          } else {
            if (reg.ctiposaldo === this.SALDOCXP) {
              montocxp = montocxp + reg.monto;
            }
          }
        }
      }

      this.lregistros = resp.RUBROS;
      this.totalprecancelacion = resp.TOTALPRECANCELACION;
      this.montocapital = montocapital;
      this.montocxp = montocxp;
    }
    this.lconsulta = [];
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any, dtoext = null) {
    super.postCommitEntityBean(resp, dtoext);
  }


}
