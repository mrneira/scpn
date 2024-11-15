import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { GarantiasPersonalesComponent } from './_garantiasPersonales.component';

@Component({
  selector: 'app-garantias-operacion',
  templateUrl: '_garantiasOperacion.html'
})
export class GarantiasOperacionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(GarantiasPersonalesComponent)
  public garantiasPersonalesComponent: GarantiasPersonalesComponent;

  public habilitaNuevo = true;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarOperacionGarantias', 'GARANTIASOPERACION', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {}

  crearNuevo() {}

  actualizar() {}

  eliminar() {}

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  consultar() {
    if (!this.validaFiltrosRequeridos()) {
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    const consulta = new Consulta(this.entityBean, 'Y', '', this.mfiltros, this.mfiltrosesp);
    consulta.addSubqueryPorSentencia('select i.nombre from TgarClasificacion i where i.cclasificacion=(select go.cclasificacion from TgarOperacion go where go.coperacion=t.coperaciongarantia)', 'nclasificacion');
    consulta.addSubqueryPorSentencia('select i.nombre from TgarTipoGarantia i where i.ctipogarantia=(select go.ctipogarantia from TgarOperacion go where go.coperacion=t.coperaciongarantia)', 'ntipogar');
    consulta.addSubqueryPorSentencia('select i.nombre from TgarTipoBien i where (i.ctipogarantia +\'-\'+ i.ctipobien)=(select (gop.ctipogarantia +\'-\'+ gop.ctipobien) from TgarOperacion gop where gop.coperacion=t.coperaciongarantia)', 'ntipobien');
    consulta.addSubqueryPorSentencia('select i.nombre from TgarEstatus i where i.cestatus=(select go.cestatus from TgarOperacion go where go.coperacion=t.coperaciongarantia)', 'nestado');
    consulta.addSubquery('TgarOperacionAvaluo', 'valoravaluo', 'montoavaluo', 'i.coperacion = t.coperaciongarantia and i.verreg=0');
    consulta.addSubquery('TgarOperacionAvaluo', 'valorcomercial', 'monto', 'i.coperacion = t.coperaciongarantia and i.verreg=0');
    this.addConsulta(consulta);
    return consulta;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  
  grabar(): void {}

  public postCommit(resp: any) {}
}