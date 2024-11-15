import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { NgForm } from '@angular/forms';
import { LovFuncionariosComponent } from '../../funcionarios/componentes/lov.funcionarios.component';
import { BaseLovComponent } from '../../../../../util/shared/componentes/baseLov.component';

@Component({
  selector: 'app-lov-tth-designaciones',
  templateUrl: 'lov.designaciones.html'
})
export class LovDesignacionesComponent extends BaseLovComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoCliente = new EventEmitter();
  displayLov = false;
  @ViewChild(LovFuncionariosComponent) private lovFuncionarios: LovFuncionariosComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TthContratoDetalle', 'LOVCDESIGNACIONES', false, false);
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
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.mfiltros.verreg = 0;
    const consulta = new Consulta(this.entityBean, 'Y', 'ccontrato', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tthcargo', 'nombre', 'ncargo', 'i.ccargo = t.ccargo');
    consulta.addSubquery('tthgrupoocupacional', 'nombre', 'ngrupo', 'i.cgrupo = t.cgrupo');
    consulta.addSubquery('tthtiporelacionlaboral', 'nombre', 'ntiporelacionlaboral', 'i.ctiporelacionlaboral = t.ctiporelacionlaboral');
     consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nregion', 'i.cdetalle = t.regioncdetalle and t.regionccatalogo = i.ccatalogo');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nestado', 't.estadocontratocdetalle = i.cdetalle and t.estadocontratoccatalogo = i.ccatalogo');
    consulta.addSubqueryPorSentencia("select concat(o.primerapellido, ' ', o.primernombre) from " + this.obtenerBean("tthfuncionariodetalle") + " o where o.cfuncionario=t.cfuncionario and o.verreg=0 and t.verreg=0", "nfuncionario");
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
    evento.data.mdatos.ndesignacion =
      evento.data.mdatos.nfuncionario + " " +
      evento.data.mdatos.ncargo + " " +
     
      evento.data.mdatos.ntiporelacionlaboral + " " +
      evento.data.mdatos.nestado;

    this.eventoCliente.emit({ registro: evento.data });
    // para oculatar el dialogo.
    this.displayLov = false;
  }

  showDialog() {
    this.displayLov = true;
  }

  mostrarLovFuncionario() {
    this.lovFuncionarios.showDialog();
  }

  fijarLovFuncionario(reg: any): void {
    this.mfiltros.cfuncionario = reg.registro.cfuncionario;
    this.mcampos.nfuncionario = reg.registro.mdatos.nombre;
    this.consultar();
  }

}
