import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { NgForm } from '@angular/forms';
import { BaseLovComponent } from '../../../../../util/shared/componentes/baseLov.component';

@Component({
  selector: 'app-lov-personas',
  templateUrl: 'lov.personas.html'
})
export class LovPersonasComponent extends BaseLovComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoCliente = new EventEmitter();
  // displayLov = false;

  public res;
  public validaRegimen = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tperpersonadetalle', 'LOVPERSONADETALLE', false);
  }

  ngOnInit() {
    this.formFiltrosBase = this.formFiltros;
    this.componentehijo = this;
    // En los lov va 0 para no grabar log de transaccion.
    this.rqConsulta.grabarlog = '0';
  }

  consultar() {
    if (this.mcampos.nombre === undefined || this.mcampos.nombre === '') {
      this.mfiltros.nombre = '';
    }
    else {
      const res = this.mcampos.nombre.replace(/ /g, "%");
      this.mfiltros.nombre = res;
    }
    if (this.mcampos.identificacion === undefined || this.mcampos.identificacion === '') {
      this.mfiltros.identificacion = '';
    }
    else {
      this.mfiltros.identificacion = this.mcampos.identificacion;
    }

    this.mfiltrosesp.cpersona = '';

    if (!this.estaVacio(this.mcampos.pnombre)) {
      this.mfiltrosesp.cpersona = `in (select cpersona from tpernatural ` +
        `where primernombre like '%` + this.mcampos.pnombre + `%')`
    }

    if (!this.estaVacio(this.mcampos.apellidopaterno)) {
      this.mfiltrosesp.cpersona = `in (select cpersona from tpernatural ` +
        `where apellidopaterno like '%` + this.mcampos.apellidopaterno + `%')`
    }

    if (!this.estaVacio(this.mcampos.pnombre) && !this.estaVacio(this.mcampos.apellidopaterno)) {
      this.mfiltrosesp.cpersona = `in (select cpersona from tpernatural ` +
        `where primernombre like '%` + this.mcampos.pnombre + `%' and apellidopaterno like '%` + this.mcampos.apellidopaterno + `%')`
    }

    this.mfiltros.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.mfiltros.verreg = 0;
    this.crearDtoConsulta();
    const consulta: Consulta = this.getConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    const consulta = new Consulta(this.entityBean, 'Y', 't.nombre', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TperNatural', 'profesioncdetalle', 'nprofesion', 'i.cpersona = t.cpersona and i.verreg = t.verreg and i.ccompania = t.ccompania');
    consulta.addSubquery('TperNatural', 'estadocivilcdetalle', 'estadocivil', 'i.cpersona = t.cpersona and i.verreg = t.verreg and i.ccompania = t.ccompania');
    consulta.addSubquery('TperNatural', 'fnacimiento', 'fnacimiento', 'i.cpersona = t.cpersona and i.verreg = t.verreg and i.ccompania = t.ccompania');

    consulta.addSubquery('tsegusuariodetalle', 'cusuario', 'cusuario', 'i.cpersona = t.cpersona and i.verreg = t.verreg and i.ccompania = t.ccompania');
    consulta.addSubquery('tsoccesantia', 'ccdetalletipoestado', 'tipoestado', 'i.cpersona = t.cpersona and i.verreg = t.verreg and i.ccompania = t.ccompania');
    consulta.addSubqueryPorSentencia('select nombre from tsoctipogrado '
      + 'where cgrado = ((select cgradoactual from tsoccesantiahistorico h '
      + 'where h.secuencia = (select secuenciahistorico from tsoccesantia s '
      + 'where s.verreg = t.verreg '
      + 'and s.ccompania = t.ccompania '
      + 'and s.cpersona = t.cpersona) '
      + 'and h.verreg = t.verreg '
      + 'and h.ccompania = t.ccompania '
      + 'and h.cpersona = t.cpersona))', 'ngrado');
    consulta.addSubqueryPorSentencia('select g.cdetallejerarquia '
      + 'from tsoccesantia c, tsoccesantiahistorico h, tsoctipogrado g '
      + 'where c.cpersona = h.cpersona '
      + 'and c.secuenciahistorico = h.secuencia '
      + 'and c.verreg = h.verreg '
      + 'and h.cgradoactual = g.cgrado '
      + 'and c.verreg = 0 '
      + 'and c.cpersona = t.cpersona', 'cjerarquia');
    consulta.addSubqueryPorSentencia('select h.cestadosocio '
      + 'from tsoccesantia c, tsoccesantiahistorico h '
      + 'where c.cpersona = h.cpersona '
      + 'and c.secuenciahistorico = h.secuencia '
      + 'and c.verreg = h.verreg '
      + 'and c.verreg = 0 '
      + 'and c.cpersona = t.cpersona', 'cestadosocio');
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

  seleccionaRegistro(evento: any) {
    if (this.validaRegimen && !this.estaVacio(evento.data.regimen) && evento.data.regimen) {
      this.mostrarMensajeError('SOCIO SE ENCUENTRA EN REGIMEN');
      return;
    }

    this.eventoCliente.emit({ registro: evento.data });
    // para oculatar el dialogo.
    this.displayLov = false;
  }

  showDialog() {
    this.displayLov = true;
  }

  limpiar() {
    this.mcampos.identificacion = undefined;
    this.mcampos.apellidopaterno = undefined;
    this.mcampos.pnombre = undefined;
    this.mcampos.nombre = undefined;
    this.lregistros = [];
  }

}
