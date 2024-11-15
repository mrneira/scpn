import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { LovUsuariosComponent } from '../../../seguridad/lov/usuarios/componentes/lov.usuarios.component';

@Component({
  selector: 'app-reasignacion-cobranzas',
  templateUrl: 'reasignacionCobranzas.html'
})
export class ReasignacionCobranzasComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  selectedRegistros: any;

  @ViewChild('lovusuariosregistro')
  private lovusuariosregistro: LovUsuariosComponent;

  @ViewChild('lovusuariosreasignadoregistro')
  private lovusuariosreasignadoregistro: LovUsuariosComponent;

  public persona;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcobCobranza', 'ASIGNACION', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.verreg = 0;
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.diasvencidos desc,t.ccobranza', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tperpersonadetalle', 'nombre', 'npersonacob', 'i.cpersona = t.cpersona and i.verreg = 0');
    consulta.addSubqueryPorSentencia(`SELECT tp.nombre +' - '+p.nombre FROM tcaroperacion o, tcarproducto p ,tgentipoproducto tp ` +
      `WHERE o.coperacion = t.coperacion AND p.ctipoproducto = o.ctipoproducto ` +
      `AND p.cproducto = o.cproducto ` +
      `AND p.verreg = 0 ` +
      `AND tp.ctipoproducto = o.ctipoproducto ` +
      `AND tp.cproducto = o.cproducto AND p.cmodulo = 7 AND tp.cmodulo = 7 `, 'nproducto');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.cestatus = 'ASI';
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

    if (!this.estaVacio(this.mcampos.cusuarioreasignado)) {
      const graba = this.validaRegistros();
      if (graba) {
        this.crearDtoMantenimiento();
        super.grabar();
      }
    } else {
      this.mostrarMensajeError("USUARIO A REASIGNAR ES REQUERIDO");
      return;
    }
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  fijarLovUsuariosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.cusuarioasignado = reg.registro.mdatos.cusuario;
      this.persona = reg.registro.mdatos.npersona;
    }
  }

  mostrarLovUsuarios(): void {
    this.lovusuariosregistro.showDialog();
  }

  fijarLovUsuariosReasignadosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cusuarioreasignado = reg.registro.mdatos.cusuario;
      this.mcampos.npersona = reg.registro.mdatos.npersona;
    }
  }
  mostrarLovUsuariosReasignado(): void {
    this.lovusuariosreasignadoregistro.showDialog();
  }

  validaRegistros() {
    for (const i in this.selectedRegistros) {
      if (this.selectedRegistros.hasOwnProperty(i)) {
        const reg: any = this.selectedRegistros[i];
        reg.fasignacion = super.fechaToInteger(this.fechaactual);
        reg.cusuarioasignado = this.mcampos.cusuarioreasignado;
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
