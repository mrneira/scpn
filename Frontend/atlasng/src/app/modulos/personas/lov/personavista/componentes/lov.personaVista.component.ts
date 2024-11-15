import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { NgForm } from '@angular/forms';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';

@Component({
  selector: 'app-lov-persona-vista',
  templateUrl: 'lov.personaVista.html'
})
export class LovPersonaVistaComponent extends BaseComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public displayVista = false;
  public DATOSSOCIO: any;
  public OPERACIONESPORPERSONA: any;
  public DATOSPERSONA: any;
  public OPERACIONESGARANTE: any;
  public validaRegimen = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'LOVPERSONAVISTAGENERAL', false);
  }

  ngOnInit() {
    this.formFiltrosBase = this.formFiltros;
    this.componentehijo = this;
    // En los lov va 0 para no grabar log de transaccion.
    this.rqConsulta.grabarlog = '0';
  }

  consultar() {
    this.limpiar();
    const rqConsulta: any = new Object();
    rqConsulta.CODIGOCONSULTA = 'LOVPERSONAVISTAGENERAL';
    rqConsulta.cpersona = this.mcampos.cpersona;

    this.dtoServicios.ejecutarConsultaRest(rqConsulta)
      .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false);
          if (resp.cod !== 'OK') {
            return;
          }
          this.displayVista = true;
          this.DATOSSOCIO = resp.DATOSSOCIO[0];
          this.OPERACIONESPORPERSONA = resp.OPERACIONESPORPERSONA;
          this.DATOSPERSONA = resp.DATOSPERSONA[0];
          this.OPERACIONESGARANTE = resp.OPERACIONESGARANTE;
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  showDialog() {
    //this.displayVista = true;
  }

  limpiar() {
    this.DATOSSOCIO = [];
    this.OPERACIONESPORPERSONA = [];
    this.DATOSPERSONA = [];
    this.OPERACIONESGARANTE = [];
  }
}
