import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';
import { LovSolicitudesComponent } from '../../../lov/solicitudes/componentes/lov.solicitudes.component';

@Component({
  selector: 'app-consulta-solicitud',
  templateUrl: 'consultasolicitud.html'
})
export class ConsultasolicitudComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  @ViewChild(LovSolicitudesComponent)
  private lovSolicitudes: LovSolicitudesComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarSolicitudEtapa', 'CONSULTASOLICITUD', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    // No existe para el padre
  }

  actualizar() {
    // No existe para el padre
  }

  eliminar() {
    // No existe para el padre
  }

  cancelar() {
    // No existe para el padre
  }

  selectRegistro(registro: any) {
    // No existe para el padre
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cetapa', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TcarEstatusSolicitud', 'nombre', 'nestatus', 'i.cestatussolicitud = t.cestatussolicitud');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.csolicitud = this.mcampos.csolicitud;
  }

  validaFiltrosConsulta(): boolean {
    if (this.estaVacio(this.mcampos.csolicitud)) {
      super.mostrarMensajeError("SOLICITUD ES REQUERIDO");
      return false;
    } else {
      return true;
    }
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
  // Fin MANTENIMIENTO *********************

  /**Muestra lov de personas */
  mostrarLovPersona(): void {
    this.lovPersonas.showDialog();
    this.lovPersonas.mfiltros.csocio = 1;
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (!this.estaVacio(reg.registro)) {
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.mcampos.nombre = reg.registro.nombre;
      this.mostrarLovSolicitud()
    }
  }

  /**Muestra lov de Solicitudes */
  mostrarLovSolicitud(): void {
    if (this.estaVacio(this.mcampos.cpersona)) {
      this.mostrarMensajeInfo('SELECCIONE CLIENTE');
      return;
    }
    this.lovSolicitudes.rqConsulta.mdatos.cpersona = this.mcampos.cpersona;
    this.lovSolicitudes.showDialog();
    this.lovSolicitudes.consultar();
  }

  /**Retorno de lov de solicitudes. */
  fijarLovSolicitudSelec(reg: any): void {
    this.msgs = [];
    this.mcampos.csolicitud = reg.registro.mdatos.csolicitud;
    this.mcampos.nsolicitud = reg.registro.mdatos.producto + ' - ' + reg.registro.mdatos.tipo;
    this.consultar();
  }

}
