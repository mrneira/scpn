import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-evaluacionCalificacion',
  templateUrl: 'evaluacionCalificacion.html'
})
export class EvaluacionCalificacionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public ltipoccatalogo: SelectItem[] = [{label: '...', value: null}];


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthparametroscalificacion', 'EVALUACIONCALIFICACION', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
    //this.consultar();  // para ejecutar consultas automaticas.
}

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.estaVacio(this.mfiltros.tipocdetalle)) {
      this.mostrarMensajeInfo("ELIJA PRIMERO UN TIPO DE PONDERACIÓN");
      return;
    }
    super.crearNuevo();
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    this.registro.tipoccatalogo = 1159;
    this.registro.tipocdetalle = this.mfiltros.tipocdetalle;

    this.registro.fingreso = this.fechaactual;
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

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (this.estaVacio(this.mfiltros.tipocdetalle)) {
      this.mostrarMensajeInfo("ELIJA PRIMERO UN TIPO DE EVALUACIÓN");
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cparametro', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgencatalogodetalle','nombre','nnombre','t.tipocdetalle = i.cdetalle and i.ccatalogo=t.tipoccatalogo');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  consultarCatalogos(): void{

    this.encerarConsultaCatalogos();
    const consultaDepartamento = new Consulta('tgencatalogodetalle', 'Y', 't.nombre',{}, {});
    consultaDepartamento.addFiltroCondicion('ccatalogo',1159,'=');
    consultaDepartamento.cantidad = 50;
    this.addConsultaCatalogos('EVALUACIONES', consultaDepartamento, this.ltipoccatalogo, this.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }
  private fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }


}
