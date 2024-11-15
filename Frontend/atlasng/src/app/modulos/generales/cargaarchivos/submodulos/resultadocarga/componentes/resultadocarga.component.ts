import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../../util/shared/componentes/base.component';


@Component({
  selector: 'app-resultado-carga',
  templateUrl: 'resultadocarga.html'
})
export class ResultadoCargaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TgenCargaControlErrores', 'RESULTADOCARGA', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.optlock = 0;
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
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    //this.mfiltros.idproceso=
    const consulta = new Consulta(this.entityBean, 'Y', ' t.idproceso desc,t.numerolinea asc', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgencargacontrol', 'nombre', 'nombre', 't.cmodulo = i.cmodulo and i.idproceso = t.idproceso and i.ctipoarchivo = t.ctipoarchivo');
    consulta.addSubquery('tgencargaarchivo', 'nombre', 'nctipoarchivo', 't.cmodulo = i.cmodulo and i.ctipoarchivo = t.ctipoarchivo')
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.cmodulo = sessionStorage.getItem('m');
    this.mfiltros.cresultado = 'E'
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
    //this.consultar();
  }
}
