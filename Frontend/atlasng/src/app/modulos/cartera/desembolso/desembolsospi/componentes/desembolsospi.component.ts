import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovPersonasComponent } from 'app/modulos/personas/lov/personas/componentes/lov.personas.component';
import { LovOperacionCarteraComponent } from 'app/modulos/cartera/lov/operacion/componentes/lov.operacionCartera.component';

@Component({
  selector: 'app-desembolso-spi',
  templateUrl: 'desembolsospi.html'
})
export class DesembolsoSpiComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  selectedRegistros;
  mostrarGrabar = true;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  @ViewChild(LovOperacionCarteraComponent)
  private lovOperacion: LovOperacionCarteraComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarOperaciondesembolso', 'TRANSFERENCIA', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.coperacion', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'ninstitucion', 'i.ccatalogo = t.tipoinstitucionccatalogo and i.cdetalle=t.tipoinstitucioncdetalle');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'ntipocuenta', 'i.ccatalogo = t.tipocuentaccatalogo and i.cdetalle=t.tipocuentacdetalle');
    consulta.addSubquery('tcaroperacion', 'cusuarioapertura', 'ncusuarioapertura', 'i.coperacion = t.coperacion');
    this.addConsulta(consulta);
    return consulta;
  }
  private fijarFiltrosConsulta() {
    this.mfiltros.pagado = false;
    this.mfiltros.coperacion = this.mcampos.coperacion;
  }
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    if (this.estaVacio(this.selectedRegistros)) {
      super.mostrarMensajeError("REGISTROS SELECCIONADOS SON REQUERIDOS");
      return;
    }
    this.validaRegistros();
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.coperacion = this.mcampos.coperacion;
    this.crearDtoMantenimiento();
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod === "OK") {
      this.mostrarGrabar = false;
      this.recargar();
    }
  }
  // Fin MANTENIMIENTO *********************

  validaRegistros() {
    for (const i in this.selectedRegistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg: any = this.selectedRegistros[i];
        const regn: any = this.lregistros.find(x => x.secuencia == reg.secuencia && x.coperacion == reg.coperacion);
        if (!this.estaVacio(regn)) {
          regn.transferencia = true;
          this.selectRegistro(regn);
          this.actualizar();
        }

      }
    }
  }

  /**Muestra lov de personas */
  mostrarLovPersona(): void {
    this.lovPersonas.mfiltros.csocio = 1;
    this.lovPersonas.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.mcampos.nombre = reg.registro.nombre;
      this.lovOperacion.mfiltros.cestatus = 'VIG';
      this.lovOperacion.mfiltros.cpersona = this.mcampos.cpersona;
      this.lovOperacion.consultar();
     
      this.lovOperacion.showDialog();
    }
  }

  /**Muestra lov de operaciones de cartera. */
  mostrarLovOperacion(): void {
    if (this.estaVacio(this.mcampos.cpersona)) {
      this.mostrarMensajeInfo('SELECCIONE UN CLIENTE');
      return;
    }
    this.lovOperacion.mfiltros.cpersona = this.mcampos.cpersona;
    this.lovOperacion.mfiltros.cestatus = 'VIG';
    this.lovOperacion.showDialog();
  }

  /**Retorno de lov de operacion. */
  fijarLovOperacionSelec(reg: any): void {
    this.mcampos.coperacion = reg.registro.coperacion;
    this.mcampos.ntipoprod = reg.registro.mdatos.nproducto + ' - ' + reg.registro.mdatos.ntipoproducto;
    this.mcampos.montooriginal = reg.registro.montooriginal;
    this.mcampos.fapertura = reg.registro.fapertura;
    this.consultar();
  }


}
