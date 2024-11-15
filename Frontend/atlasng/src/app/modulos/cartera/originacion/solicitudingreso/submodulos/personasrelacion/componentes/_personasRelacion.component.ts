import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta, Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovPersonasComponent } from '../../../../../../personas/lov/personas/componentes/lov.personas.component';

@Component({
  selector: 'app-personas-relacion',
  templateUrl: '_personasRelacion.html'
})
export class PersonasRelacionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  public lrelacion: SelectItem[] = [{ label: '...', value: null }];
  public deudor = "";

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarSolicitudPersona', 'TCARSOLICITUDPERSONA', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (!this.validaFiltrosRequeridos()) {
      return;
    }
    super.crearNuevo();
    this.registro.csolicitud = this.mcampos.csolicitud;
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.registro.crelacion = 3; // codeudor
  }

  actualizar() {
    if (!this.validaDatosRegistro(this.registro)) {
      this.mostrarMensajeWarn("CÓNYUGE YA INGRESADO");
      return;
    }
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
    if (!this.validaFiltrosRequeridos()) {
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public consultarAnterior() {
    if (!this.validaFiltrosRequeridos()) {
      return;
    }
    super.consultarAnterior();
  }

  public consultarSiguiente() {
    if (!this.validaFiltrosRequeridos()) {
      return;
    }
    super.consultarSiguiente();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cpersona', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TcarRelacionPersona', 'nombre', 'nrelacion', 'i.crelacion = t.crelacion');
    consulta.addSubquery('tperpersonadetalle', 'identificacion', 'identificacion', 'i.cpersona = t.cpersona and verreg = 0');
    consulta.addSubquery('tperpersonadetalle', 'nombre', 'npersona', 'i.cpersona = t.cpersona and verreg = 0');
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
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

  /**Muestra lov de personas */
  mostrarLovPersona(): void {
    this.lovPersonas.mfiltrosesp.cpersona = 'not in (' + this.deudor + ')';
    this.lovPersonas.showDialog();
  }


  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cpersona = reg.registro.cpersona;
      this.registro.mdatos.identificacion = reg.registro.identificacion;
      this.registro.mdatos.npersona = reg.registro.nombre;
    }
  }

  validaDatosRegistro(reg: any): boolean {
    super.encerarMensajes();
    const existeTipoPersona = this.lregistros.find(x => x.crelacion === reg.crelacion && Number(x.idreg) !== Number(reg.idreg));

    if (!this.estaVacio(existeTipoPersona)) {
      return false;
    }
    return true;
  }

}
