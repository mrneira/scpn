import {Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../../../util/shared/componentes/base.component';
import {AccionesReporteComponent} from '../../../../../../../util/shared/componentes/accionesReporte.component';
import { SelectItem } from 'primeng/primeng';


import { LovPeriodoComponent } from '../../../../../lov/periodo/componentes/lov.periodo.component';
import { LovFuncionariosComponent } from '../../../../../lov/funcionarios/componentes/lov.funcionarios.component';

@Component({
  selector: 'app-cabecera',
  templateUrl: 'cabecera.html'
})
export class CabeceraComponent extends BaseComponent implements OnInit, AfterViewInit {

  
  @ViewChild(LovPeriodoComponent)
  private lovPeriodo: LovPeriodoComponent;
  @ViewChild(LovFuncionariosComponent)
  private lovFuncionariosEval: LovFuncionariosComponent;
  public lparametro:any = [];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthplantillaevaluacionmrl', 'EVALPLANTILLA', true, true);
    this.componentehijo = this;
  }

  public nuevo = true;
  ngOnInit() {
    super.init();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.fingreso= this.fechaactual;
    this.registro.cusuarioing= this.dtoServicios.mradicacion.cusuario;
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
  //  if (!this.validaFiltrosRequeridos()) {
  //    return;
  //  }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cplantilla', this.mfiltros, this.mfiltrosesp);
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
  //  this.mfiltros.cfuncionario= this.mcampos.cfuncionario;
  }

  //validaFiltrosConsulta(): boolean {
 //   return super.validaFiltrosRequeridos();
 // }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************
 
  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.actualizar();
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
  
validaGrabar() {
  return super.validaGrabar('NO HA REALIZADADO LA VALIDACIÓN DEL FORMULARIO[DATOS PLANTILLA]');
}
 
}
