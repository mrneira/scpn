
import { Component, OnInit, AfterViewInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { InversionesServicios } from './../../../servicios/_invservicios.service';

@Component({
  selector: 'app-lov-comentarios',
  templateUrl: 'lov.comentarios.html'
})
export class LovComentariosComponent extends BaseComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoCliente = new EventEmitter();
  displayLov = false;

  public pLabelEnviar: string = null;

  constructor(router: Router, dtoServicios: DtoServicios, private inversionesServicios: InversionesServicios) {

    super(router, dtoServicios, 'ABSTRACT', 'LOVCOMENTARIO', false);

  }

  ngOnInit() {
    this.formFiltrosBase = this.formFiltros;
    this.componentehijo = this;
    
  }

  consultar() {
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  private fijarFiltrosConsulta() {
  }

  showDialog() {
    this.displayLov = true;
  }

  private enviar() {
    if (this.estaVacio(this.inversionesServicios.pComentarios)) {
      this.mostrarMensajeError("INGRESE EL COMENTARIO");
      return;
    }
    this.encerarMensajes();

    switch (this.pLabelEnviar) {
      case this.inversionesServicios.pLabelEnvioAprobar:
        this.inversionesServicios.pblnControl = 1;
        break;
      case this.inversionesServicios.pLabelAprobar:
        this.inversionesServicios.pblnControl = 2;
        break;
      case this.inversionesServicios.pLabelAnular:
        this.inversionesServicios.pblnControl = 3;
        break;
      case this.inversionesServicios.pLabelDevolver:
        this.inversionesServicios.pblnControl = 4;
        break;
      case this.inversionesServicios.pLabelEnvioparaPago:
        this.inversionesServicios.pblnControl = 5;
        break;
    }

    this.eventoCliente.emit({ registro: this.inversionesServicios.pComentarios });
    this.displayLov = false;
  }

  private cancelaComentario() {
    this.encerarMensajes();
    this.inversionesServicios.pComentarios = null;
    this.inversionesServicios.pblnControl = 0;
    this.displayLov = false;
  }
}
