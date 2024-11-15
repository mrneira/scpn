import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';

@Component({
  selector: 'app-desembolso-masivo',
  templateUrl: 'desembolsoMasivo.html'
})
export class DesembolsoMasivoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  selectedRegistros;
  mostrarGrabar = true;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarOperacion', 'OPERACIONESDESEMBOLSOMASIVO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
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
    this.rqConsulta.mdatos.CODIGOCONSULTA = 'OPERACIONESDESEMBOLSOMASIVO';
    super.consultar();
  }

  public postQuery(resp: any) {
    let operaciones = [];
    if(resp["cod"] == "OK"){
      for (let index = 0; index < resp["OPERACIONESDESEMBOLSOMASIVO"].length; index++) {
        if(resp["OPERACIONESDESEMBOLSOMASIVO"][index]["cestadooperacion"] == "N"){
          operaciones.push(resp["OPERACIONESDESEMBOLSOMASIVO"][index]);
        }
      }
      resp["OPERACIONESDESEMBOLSOMASIVO"] = operaciones;
      super.postQueryEntityBean(resp);
    }
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    if (this.estaVacio(this.selectedRegistros)) {
      super.mostrarMensajeError("REGISTROS SELECCIONADOS SON REQUERIDOS");
      return;
    }

    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    super.grabar();
  }

  public crearDtoMantenimiento() {
    this.rqMantenimiento.OPERACIONESDESEMBOLSOMASIVO = this.selectedRegistros;
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod === "OK") {
      this.mostrarGrabar = false;
      this.recargar();
    }
  }
  // Fin MANTENIMIENTO *********************


  manejaRespuesta(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.lregistros = resp.OPERACIONESDESEMBOLSOMASIVO;
    }
    this.lconsulta = [];
  }

  validaRegistros() {
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg: any = this.lregistros[i];

        for (const j in this.selectedRegistros) {
          if (this.selectedRegistros.hasOwnProperty(j)) {
            const mar: any = this.selectedRegistros[j];
            if (!this.estaVacio(reg) && !this.estaVacio(mar) && reg.coperacion === mar.coperacion) {
              reg.esnuevo = true;
              reg.mdatos.masivo = true;
            }
          }
        }
      }
    }
  }
}