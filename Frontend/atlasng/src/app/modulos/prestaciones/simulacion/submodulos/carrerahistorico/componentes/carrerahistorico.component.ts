import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { LovPersonasComponent } from '../../../../../personas/lov/personas/componentes/lov.personas.component';

@Component({
  selector: 'app-carrera-historico',
  templateUrl: 'carrerahistorico.html'
})
export class CarrerahistoricoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  lovPersonas: LovPersonasComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tsoccesantiahistorico', 'HISTORICOCARRERA', false, true);
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
    super.eliminar();
  }

  cancelar() {
    super.cancelar();
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (!this.validaFiltrosConsulta()) {
      return;
    }
    this.crearDtoConsulta();
    super.consultar();

  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.secuencia asc', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tsocestadosocio','nombre','nestado','i.cestadosocio = t.cestadosocio');
    consulta.addSubquery('TsocTipoGrado', 'abreviatura', 'ngrado', ' i.cgrado = t.cgradoactual');
    consulta.addSubqueryPorSentencia('select tcd.nombre from tsoctipogrado g inner join tgencatalogodetalle tcd on tcd.ccatalogo = g.ccatalogojerarquia and tcd.cdetalle = g.cdetallejerarquia where t.cgradoactual = g.cgrado', 'njerarquia');
    consulta.addSubquery('tsoctipobaja', 'nombre', 'ntipobaja', 'i.ctipobaja = t.csubestado');

    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.mfiltros.verreg = 0;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  public limpiar() {
    this.lregistros = [];
  }
  // Fin CONSULTA *********************



}
