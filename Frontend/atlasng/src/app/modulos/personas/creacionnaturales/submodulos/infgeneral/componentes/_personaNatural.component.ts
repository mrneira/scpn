import {EstadoResultadosReporteComponent} from './../../../../../contabilidad/reportes/estadoResultados/componentes/estadoResultadosReporte.component';
import {Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';
import {LovNacionalidadesComponent} from '../../../../../generales/lov/nacionalidades/componentes/lov.nacionalidades.component';


@Component({
  selector: "app-persona-natural",
  template:
  "<app-lov-nacionalidades (eventoCliente)=fijarLovNacionalidadesSelec($event)></app-lov-nacionalidades>"
})
export class PersonaNaturalComponent extends BaseComponent
  implements OnInit, AfterViewInit {
  @ViewChild(LovNacionalidadesComponent)
  private lovNacionalidades: LovNacionalidadesComponent;

  public lestadocivil: SelectItem[] = [{label: "...", value: null}];
  public lgenero: SelectItem[] = [{label: "...", value: null}];
 
  @Output() estadoCivil: EventEmitter<any> = new EventEmitter<any>();

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, "TperNatural", "NATURAL", true);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init();
  }

  ngAfterViewInit() {}

  crearNuevo() {
    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.verreg = 0;
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.registro.estadocivilccatalogo = 301;
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
    const consulta = new Consulta(this.entityBean, "N", "t.cpersona", this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery("TgenNacionalidad", "nombre", "nnacionalidad", "i.cnacionalidad = t.cnacionalidad");
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.mfiltros.verreg = 0;
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
    //this.actualizar();
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();

  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  validaGrabar() {
    return super.validaGrabar();
  }

  public postCommit(resp: any, dtoext = null) {
    super.postCommitEntityBean(resp, dtoext);
  }

  /**Muestra lov de nacionalidades */
  mostrarLovNacionalidades(): void {
    this.lovNacionalidades.showDialog();
    if (this.estaVacio(this.registro.cnacionalidad)) {
      this.lovNacionalidades.mcampos.cnacionalidad = 'EC';
    } else {
      this.lovNacionalidades.mcampos.cnacionalidad = this.registro.cnacionalidad;
    }
    this.lovNacionalidades.consultar();
  }

  /**Retorno de lov de nacionalidades. */
  fijarLovNacionalidadesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cnacionalidad = reg.registro.cnacionalidad;
      this.registro.mdatos.nnacionalidad = reg.registro.nombre;
    }
  }

}
