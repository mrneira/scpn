import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DtoServicios } from 'app/util/servicios/dto.servicios';
import { BaseComponent } from 'app/util/shared/componentes/base.component';
import { LovPersonasComponent } from 'app/modulos/personas/lov/personas/componentes/lov.personas.component';
import { Consulta } from 'app/util/dto/dto.component';
import { SelectItem } from 'primeng/primeng';
import { ConocimientoComponent } from 'app/modulos/talentohumano/catalogos/conocimiento/componentes/conocimiento.component';

@Component({
  selector: 'app-registrar-cita',
  templateUrl: 'registrarCita.html'
})
export class RegistrarCitaComponent extends BaseComponent implements OnInit {
  @ViewChild('formFiltros') formFiltros: NgForm;
  @ViewChild(LovPersonasComponent) lovPersonas: LovPersonasComponent;

  mfiltrosCitas: any = {};
  mfiltrosespCitas: any = {};
  lcitas: any[] = [];
  fechaCita: Date = new Date();
  fechaIntegerCita: number;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcanAgendamiento', 'TCANAGENDAMIENTO', true);

    this.componentehijo = this;
  }

  ngOnInit(): void {
    super.init(this.formFiltros);
    this.consultarCitas();
  }


  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta('tperpersonadetalle', 'N', 't.identificacion', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TsocCesantia', 'credencial', 'credencial', 'i.cpersona=t.cpersona and i.verreg=0');
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.cpersona = this.mcampos.cpersona;
    this.mfiltros.verreg = 0;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA

  // Inicio MANTENIMIENTO
  grabar(): void {
    if (!this.validaUsuarioRequerido()) {
      return;
    }

    this.registro.esnuevo = true;
    this.registro.mdatos.fatencion = this.fechaToInteger(this.fechaCita);

    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod === 'OK') {
      this.router.navigate([''], { skipLocationChange: true });
    }
  }

  validaUsuarioRequerido(): boolean {
    if (this.estaVacio(this.registro.cpersona)) {
      this.mostrarMensajeError('PERSONA ES REQUERIDO');
      return false;
    }

    if (this.estaVacio(this.registro.mdatos.credencial)) {
      this.mostrarMensajeError('PERSONA NO TIENE CREDENCIAL');
      return false;
    }

    if (super.estaVacio(this.registro.asignar) || this.registro.asignar === false) {
      this.mostrarMensajeError('ASIGNAR CITA ES REQUERIDO');
      return false;
    }

    if (this.lcitas.length <= 0) {
      this.mostrarMensajeError('NO EXISTE CITAS DIPONIBLES');
      return false;
    }
    return true;
  }

  //Fin MANTENIMIENTO

  /**Muestra lov de personas */
  mostrarLovPersona(): void {
    this.lovPersonas.mfiltros.csocio = 1;
    this.lovPersonas.showDialog();
  }

  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.mcampos.nombre = reg.registro.nombre;
      this.consultar();
    }
  }

  // INICIO CONSULTA CATALOGOS

  consultarCitas(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.fijarFiltrosConsultaCitas();
    this.llenarConsultaCitas();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.manejaRespuestaCitas(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  llenarConsultaCitas(): void {
    const consultaCitas = new Consulta('tcanagendamiento', 'Y', 't.cagendamiento desc', this.mfiltrosCitas, this.mfiltrosespCitas);
    consultaCitas.addSubquery('TcanHorarioAtencion', 'cagencia', 'cagencia', 'i.chorario=t.chorario');
    consultaCitas.addSubquery('TcanHorarioAtencion', 'csucursal', 'csucursal', 'i.chorario=t.chorario');
    consultaCitas.addSubquery('TcanHorarioAtencion', 'ccompania', 'ccompania', 'i.chorario=t.chorario');
    consultaCitas.addSubquery('TcanHorarioAtencion', 'fatencion', 'fatencion', 'i.chorario=t.chorario');
    consultaCitas.cantidad = 50;
    this.addConsultaPorAlias('TCANAGENDAMIENTO', consultaCitas);
  }

  private fijarFiltrosConsultaCitas() {
    this.fechaIntegerCita = this.fechaToInteger(this.fechaCita);
    const cagencia = this.dtoServicios.mradicacion.cagencia;
    const csucursal = this.dtoServicios.mradicacion.csucursal;
    const ccompania = this.dtoServicios.mradicacion.ccompania;

    this.mfiltrosCitas.agendado = false;
    this.mfiltrosespCitas.chorario = ` IN (SELECT t2.chorario from tcanhorarioatencion t2 where t2.cagencia = ${cagencia} and t2.csucursal = ${csucursal} and t2.ccompania = ${ccompania} and t2.fatencion = ${this.fechaIntegerCita})`;
  }

  private manejaRespuestaCitas(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.lcitas = resp.TCANAGENDAMIENTO;
    }
    this.lconsulta = [];
  }
  // FIN CONSULTA CATALOGOS

}