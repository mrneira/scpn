import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { BaseLovComponent } from '../../../../../util/shared/componentes/baseLov.component';

@Component({
  selector: 'app-lov-tth-funcionariosmutable',
  templateUrl: 'lov.funcionariosmutable.html'
})
export class LovFuncionariosMutableComponent extends BaseLovComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  @Output() eventoCliente = new EventEmitter();
  displayLov = false;
  consultado = false;
  id: number;
  tipo: string;


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthfuncionariodetalle', 'LOVFUNCIONARIOMUTABLE', false, false);
  }

  ngOnInit() {
    this.formFiltrosBase = this.formFiltros;
    this.componentehijo = this;
    // En los lov va 0 para no grabar log de transaccion.
    this.rqConsulta.grabarlog = '0';
  }

  consultar() {
    this.crearDtoConsulta();
    const consulta: Consulta = this.getConsulta();
    this.consultado = true;
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cfuncionario', this.mfiltros, this.mfiltrosesp);
    consulta.setCantidad(15);
    this.addConsulta(consulta);
    return consulta;
  }

  public getConsulta(): Consulta {
    const consulta = super.getConsulta(this.alias);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.verreg = 0;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  seleccionaRegistro(evento: any) {
    evento.data.mdatos.nombre =
      this.registro.mdatos.nombre =
      (evento.data.primernombre != undefined ? evento.data.primernombre : "") + " " +
      (evento.data.segundonombre != undefined ? evento.data.segundonombre : "") + " " +
      (evento.data.primerapellido != undefined ? evento.data.primerapellido : "") + " " +
      (evento.data.segundoapellido != undefined ? evento.data.segundoapellido : "");

    this.eventoCliente.emit({ id: this.id, tipo: this.tipo, registro: evento.data });
    // para oculatar el dialogo.
    this.displayLov = false;
  }

  showDialog(id: any, tipo: any) {
    this.id = (id != undefined) ? id : 0;
    this.tipo = (tipo != undefined) ? tipo : '';
    this.displayLov = true;
  }

  closeLov() {
    if (this.consultado && this.lregistros.length == 0) {
      this.eventoCliente.emit({ registro: undefined });
      // para oculatar el dialogo.
      this.displayLov = false;
    }
  }
}
