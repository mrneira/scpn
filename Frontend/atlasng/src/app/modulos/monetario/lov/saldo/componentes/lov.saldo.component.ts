import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { ClaseComponent } from '../../../../monetario/clase/componentes/clase.component';


@Component({
  selector: 'app-lov-saldo',
  templateUrl: 'lov.saldo.html'
})
export class LovSaldoComponent extends BaseComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoCliente = new EventEmitter();
  displayLov = false;

  public lclase: SelectItem[] = [{ label: '...', value: null }];
  public ltiposaldo: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TmonSaldo', 'LOVSALDO', false, false);
  }

  ngOnInit() {
    this.formFiltrosBase = this.formFiltros;
    this.componentehijo = this;
    this.consultarCatalogos();
    // En los lov va 0 para no grabar log de transaccion.
    this.rqConsulta.grabarlog = '0';
  }

  consultar() {
    this.crearDtoConsulta();
    const consulta: Consulta = this.getConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    const consulta = new Consulta(this.entityBean, 'Y', 't.nombre', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TmonTipoSaldo', 'nombre', 'nnombre', 'i.ctiposaldo = t.ctiposaldo');
    consulta.addSubquery('TgenModulo', 'nombre', 'nmodulo', 'i.cmodulo = t.cmodulo');
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

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    const claseComponent = new ClaseComponent(this.router, this.dtoServicios);
    const conModClase = claseComponent.crearDtoConsulta();
    this.addConsultaCatalogos(claseComponent.alias, conModClase, this.lclase, super.llenaListaCatalogo);

    const conTipoSaldo = new Consulta('TmonTipoSaldo', 'Y', 't.nombre', {}, {});
    conTipoSaldo.cantidad = 100;
    this.addConsultaCatalogos('TIPOSALDO', conTipoSaldo, this.ltiposaldo, super.llenaListaCatalogo ,'ctiposaldo');

    this.ejecutarConsultaCatalogos();

  }
}
