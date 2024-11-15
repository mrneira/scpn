import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { LovUsuariosComponent } from '../../../seguridad/lov/usuarios/componentes/lov.usuarios.component';

@Component({
  selector: 'app-traspaso-masivo-juridico',
  templateUrl: 'traspasoMasivoLegalCobranza.html'
})
export class TraspasoMasivoLegalCobranzaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  selectedRegistros: any;

  @ViewChild(LovUsuariosComponent)
  private lovusuariosregistro: LovUsuariosComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcobCobranza', 'TRASPASO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultar();  // para ejecutar consultas automaticas.
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
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
    this.rqConsulta.CODIGOCONSULTA = 'TRASPASOJURIDICO';
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.diasvencidos desc,t.ccobranza', this.mfiltros, this.mfiltrosesp);
    this.rqConsulta.mdatos.cestatus = 'ASI';
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    if ((this.mcampos.finicio != null && this.mcampos.ffin == null) || (this.mcampos.finicio == null && this.mcampos.ffin != null) || (this.mcampos.finicio > this.mcampos.ffin)) {
      this.mostrarMensajeError("EL CAMPO DE FECHAS SON INCORRECTAS");
      return;
    }

    if (!this.estaVacio(this.mcampos.finicio) && !this.estaVacio(this.mcampos.ffin)) {
      this.mfiltrosesp.fingreso = 'between ' + super.fechaToInteger(this.mcampos.finicio) + ' and ' + super.fechaToInteger(this.mcampos.ffin) + '';
    }
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);

  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento

    const graba = this.validaRegistros();
    if (graba) {
      this.crearDtoMantenimiento();
      super.grabar();
    }
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod === "OK") {
      this.recargar();

    } else {
      this.mostrarMensajeError(resp.msgusu);
    }
  }

  validaRegistros() {
    for (const i in this.selectedRegistros) {
      if (this.selectedRegistros.hasOwnProperty(i)) {
        const reg: any = this.selectedRegistros[i];
        reg.cusuariotraspaso = this.dtoServicios.mradicacion.cusuario;
        reg.cestatus = 'JUD';
        reg.flegal = super.fechaToInteger(this.fechaactual);
        reg.observacion = this.registro.observacion;
        this.selectRegistro(reg);
        this.actualizar();
      }
    }
    if (this.selectedRegistros != null && this.selectedRegistros.length > 0) {
      return true;
    }
    return false;
  }

}
