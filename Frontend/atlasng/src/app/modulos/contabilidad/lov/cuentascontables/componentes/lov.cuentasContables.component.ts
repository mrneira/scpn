import { Component, OnInit, Output, Input, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { BaseLovComponent } from '../../../../../util/shared/componentes/baseLov.component';



@Component({
  selector: 'app-lov-cuentas-contables',
  templateUrl: 'lov.cuentasContables.html'
})
export class LovCuentasContablesComponent extends BaseLovComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoCliente = new EventEmitter();

  tipoplancdetalle = '';
  cnivel = '';

  public lmodulo: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TconCatalogo', 'LOVCUECONTABLE', false, true);
  }

  ngOnInit() {
    this.formFiltrosBase = this.formFiltros;
    this.componentehijo = this;
    this.rqConsulta.grabarlog = '0';
  }

  consultar() {
    this.crearDtoConsulta();
    const consulta: Consulta = this.getConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {

    this.mfiltros.tipoplancdetalle = this.tipoplancdetalle;

    if (this.cnivel != '')
      this.mfiltrosesp.cnivel = ' <= ' + this.cnivel;

    const consulta = new Consulta(this.entityBean, 'Y', 't.ccuenta', this.mfiltros, this.mfiltrosesp);
    consulta.setCantidad(15);
    this.addConsulta(consulta);
    return consulta;
  }

  public getConsulta(): Consulta {
    const consulta = super.getConsulta(this.alias);
    return consulta;
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  private fijarFiltrosConsulta() {
  }

  seleccionaRegistro(evento: any) {
    this.eventoCliente.emit({ registro: evento.data });
    // para oculatar el dialogo.
    this.displayLov = false;
  }

  showDialog(movimiento: any) {
    if (movimiento !== null || movimiento !== undefined) {
      this.mfiltros.movimiento = movimiento;
    }
    this.displayLov = true;
  }
}
