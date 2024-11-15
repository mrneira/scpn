import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta, Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-tablamortizacion',
  templateUrl: 'tablamortizacion.html'
})
export class TablamortizacionComponent extends BaseComponent implements OnInit, AfterViewInit {

  

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tinvtablaamortizacion', 'TABLAAMORTIZA', false, false);
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
    if (!this.validarRegistro()) {
      return;
    }
    if (this.registro.plazo <= 0) {
      this.mostrarMensajeError(this.obtenerErrorPlazo());
      return;
    }
    super.actualizar();
    this.encerarMensajes();
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
    const rqConsulta: any = new Object();
    rqConsulta.CODIGOCONSULTA = 'INVERSION';
    rqConsulta.inversion = 2;
    rqConsulta.cinversion = this.mfiltros.cinversion;

    this.dtoServicios.ejecutarConsultaRest(rqConsulta)
      .subscribe(
      resp => {
        this.dtoServicios.llenarMensaje(resp, false);
        if (resp.cod !== 'OK') {
          return;
        }
        this.lregistros = resp.TABAMO;
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  public fijarFiltrosConsulta() {
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  totalizarLinea() {
    this.registro.total = Number(this.registro.proyeccioncapital) +
      Number(this.registro.proyeccioninteres) +
      Number(this.registro.valormora);
  }

  calcularPlazo() {

    if (!this.validarRegistro()) {
      return;
    }

    var MILISENGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;


    var utc1 = Date.UTC(this.registro.nfinicio.getFullYear(), this.registro.nfinicio.getMonth(), this.registro.nfinicio.getDate());
    var utc2 = Date.UTC(this.registro.nfvencimiento.getFullYear(), this.registro.nfvencimiento.getMonth(), this.registro.nfvencimiento.getDate());

    this.registro.plazo = Math.floor((utc2 - utc1) / MILISENGUNDOS_POR_DIA);

    if (this.registro.plazo <= 0) {
      this.mostrarMensajeError(this.obtenerErrorPlazo());
    }
  }

  validarRegistro(): boolean {
    let lRetorno: boolean = true;
    if (this.estaVacio(this.registro.nfinicio)) {
      this.mostrarMensajeError("FECHA DE INICIO REQUERIDA");
      lRetorno = false;
    }
    if (this.estaVacio(this.registro.nfvencimiento)) {
      this.mostrarMensajeError("FECHA DE VENCIMIENTO REQUERIDA");
      lRetorno = false;
    }
    if (this.registro.proyecciontasa < 0) {
      this.mostrarMensajeError("VALOR DE LA TASA DEBE SER UN NÚMERO ENTERO POSITIVO");
      lRetorno = false;
    }
    if (this.registro.proyeccioncapital < 0) {
      this.mostrarMensajeError("VALOR DEL CAPITAL SER UN NÚMERO ENTERO POSITIVO");
      lRetorno = false;
    }
    if (this.registro.proyeccioninteres < 0) {
      this.mostrarMensajeError("VALOR DEL INTERÉS SER UN NÚMERO ENTERO POSITIVO");
      lRetorno = false;
    }
    return lRetorno;
  }

  obtenerErrorPlazo(): string {
    return "FECHA DE INICIO DEBE SER MENOR QUE LA FECHA DE VENCIMIENTO";
  }



  public totalizar(): number
  {
    let lcapital: number = 0;
    let linteres: number = 0;
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {

        lcapital = lcapital + this.lregistros[i].proyeccioncapital;
        linteres = linteres + this.lregistros[i].proyeccioninteres;

      }
    }
    return lcapital + linteres;
  }

}
