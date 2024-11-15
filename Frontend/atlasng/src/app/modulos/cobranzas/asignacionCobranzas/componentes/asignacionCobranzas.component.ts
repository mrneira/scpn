import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { LovUsuariosComponent } from '../../../seguridad/lov/usuarios/componentes/lov.usuarios.component';

@Component({
  selector: 'app-asignacion-cobranzas',
  templateUrl: 'asignacionCobranzas.html'
})
export class AsignacionCobranzasComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  selectedRegistros: any;

  @ViewChild(LovUsuariosComponent)
  private lovusuariosregistro: LovUsuariosComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcobCobranza', 'ASIGNACION', false, false);
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
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.ccobranza', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tperpersonadetalle', 'nombre', 'npersona', 'i.cpersona = t.cpersona and i.verreg = 0');
    consulta.addSubquery('TgenSucursal', 'nombre', 'nsucursal', 'i.csucursal = t.csucursal');
    consulta.addSubquery('TgenAgencia', 'nombre', 'nagencia', 'i.cagencia = t.cagencia and i.csucursal = t.csucursal');
    consulta.addSubqueryPorSentencia(`SELECT tp.nombre FROM tcaroperacion o, tcarproducto p ,tgentipoproducto tp ` +
      `WHERE o.coperacion = t.coperacion AND p.ctipoproducto = o.ctipoproducto ` +
      `AND p.cproducto = o.cproducto ` +
      `AND p.verreg = 0 ` +
      `AND tp.ctipoproducto = o.ctipoproducto ` +
      `AND tp.cproducto = o.cproducto AND p.cmodulo = 7 AND tp.cmodulo = 7 `, 'nproducto');
    consulta.cantidad = 280;//NCH 20220810
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.cestatus = 'ING';
    if (!this.estaVacio(this.mcampos.finicio) && !this.estaVacio(this.mcampos.ffin)) {
      this.mfiltrosesp.fingreso = 'between ' + super.fechaToInteger(this.mcampos.finicio) + ' and ' + super.fechaToInteger(this.mcampos.ffin) + '';
    }

    if (!this.estaVacio(this.mcampos.diasinicio) && !this.estaVacio(this.mcampos.diasfin)) {
      this.mfiltrosesp.diasvencidos = 'between ' + this.mcampos.diasinicio + ' and ' + this.mcampos.diasfin;
    }
  }

  validaFiltrosConsulta(): boolean {
    if ((this.mcampos.finicio != null && this.mcampos.ffin == null) || (this.mcampos.finicio == null && this.mcampos.ffin != null) || (this.mcampos.finicio > this.mcampos.ffin)) {
      this.mostrarMensajeError("EL CAMPO DE FECHAS SON INCORRECTAS");
      return;
    }

    if ((this.mcampos.diasinicio != null && this.mcampos.diasfin == null) || (this.mcampos.diasinicio == null && this.mcampos.diasfin != null) || (this.mcampos.diasinicio > this.mcampos.diasfin)) {
      this.mostrarMensajeError("EL CAMPO DE DIAS VENCIDOS SON INCORRECTOS");
      return;
    }
    return super.validaFiltrosConsulta();
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento

    if (!this.estaVacio(this.mcampos.cusuario)) {
      const graba = this.validaRegistros();
      if (graba) {
        this.crearDtoMantenimiento();
        super.grabar();
      }
    } else {
      this.mostrarMensajeError("SELECCIONE USUARIO y/o OPERACIONES");
      return;
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

  fijarLovUsuariosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cusuario = reg.registro.mdatos.cusuario;
      this.mcampos.npersona = reg.registro.mdatos.npersona;
      this.mcampos.identificacion = reg.registro.mdatos.identificacion;//NCH 20220810
    }
  }

  mostrarLovUsuarios(): void {
    this.lovusuariosregistro.showDialog();
  }

  validaRegistros() {
    for (const i in this.selectedRegistros) {
      if (this.selectedRegistros.hasOwnProperty(i)) {
        const reg: any = this.selectedRegistros[i];
        reg.cestatus = 'ASI';
        reg.fasignacion = super.fechaToInteger(this.fechaactual);
        reg.cusuarioasignado = this.mcampos.cusuario;
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
