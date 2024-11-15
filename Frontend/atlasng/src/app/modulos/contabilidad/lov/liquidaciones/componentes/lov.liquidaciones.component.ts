import { Component, OnInit, Output, Input, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { BaseLovComponent } from '../../../../../util/shared/componentes/baseLov.component';


@Component({
  selector: 'app-lov-liquidaciones',
  templateUrl: 'lov.liquidaciones.html'
})
export class LovLiquidacionesComponent extends BaseLovComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoCliente = new EventEmitter();

  public lmodulo: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tconliquidaciongastos', 'LOVLIQUIDACION', false, true);
  }

  ngOnInit() {
    this.formFiltrosBase = this.formFiltros;
    this.componentehijo = this;
    // En los lov va 0 para no grabar log de transaccion.
    this.rqConsulta.grabarlog = '0';
    //this.consultar();
  }

  consultar() {
    this.crearDtoConsulta();
    const consulta: Consulta = this.getConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    //this.mfiltrosesp.estadocxpcdetalle  = " <> " + "'ELIMIN'";
    //this.comprobanteComponent.mfiltrosesp.cctaporpagar = " = " + reg.registro.cctaporpagar;
    if (!(this.estaVacio(this.mcampos.fliquidacionini) && this.estaVacio(this.mcampos.fliquidacionfin))) {
      this.mfiltrosesp.fliquidacion = " between '" + this.calendarToFechaString(this.mcampos.fliquidacionini) 
      + "' and '" + this.calendarToFechaString(this.mcampos.fliquidacionfin) + "'";
    }
    this.mfiltrosesp.estadocdetalle = " <> 'ELIMIN'";
    const consulta = new Consulta(this.entityBean, 'Y', 't.cliquidaciongastos DESC', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tperpersonadetalle','nombre','nbeneficiario','t.cpersona = i.cpersona and i.verreg = 0')
    consulta.cantidad = 50;
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
    this.mfiltros.movimiento = 0;
  }

  seleccionaRegistro(evento: any) {
    this.eventoCliente.emit({ registro: evento.data });
    // para oculatar el dialogo.
    this.displayLov = false;
  }

  showDialog() {
    this.displayLov = true;
  }

  fijarLovCuentasporpagar(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.mcampos.nombre = reg.registro.nombre;
    }
  }
}
