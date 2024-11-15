import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovPersonasComponent } from '../../../personas/lov/personas/componentes/lov.personas.component';
import { TipoVinculacionFamiliarComponent } from '../../tipovinculacionfamiliar/componentes/tipoVinculacionFamiliar.component';

import { PersonaJuridicaComponent } from './_personaJuridica.component';
import { PersonaDetalleComponent } from './_personaDetalle.component';
import { InformacionGeneralComponent } from './_informacionGeneral.component';
import { PersonaDireccionComponent } from '../../creacionnaturales/submodulos/direccion/componentes/_personaDireccion.component';
import { PersonaSucursalComponent } from './_personaSucursal.component';
import { PersonaFirmanteComponent } from './_personaFirmante.component';
import { InformacionFinancieraComponent } from './_informacionFinanciera.component';
import { PersonaRefComercialComponent } from '../../creacionnaturales/submodulos/refcomercial/componentes/_personaRefComercial.component';

@Component({
  selector: 'app-creacion-juridicas',
  templateUrl: 'creacionJuridicas.html'
})
export class CreacionJuridicasComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(PersonaJuridicaComponent)
  personaJuridicaComponent: PersonaJuridicaComponent;

  @ViewChild(PersonaDetalleComponent)
  personaDetalleComponent: PersonaDetalleComponent;

  @ViewChild(InformacionGeneralComponent)
  informacionGeneralComponent: InformacionGeneralComponent;

  @ViewChild(PersonaDireccionComponent)
  personaDireccionComponent: PersonaDireccionComponent;

  @ViewChild(PersonaSucursalComponent)
  personaSucursalComponent: PersonaSucursalComponent;

  @ViewChild(PersonaFirmanteComponent)
  personaFirmanteComponent: PersonaFirmanteComponent;

  @ViewChild(InformacionFinancieraComponent)
  informacionFinancieraComponent: InformacionFinancieraComponent;

  @ViewChild(PersonaRefComercialComponent)
  personaRefComercialComponent: PersonaRefComercialComponent;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  private tipoVinculacionFamiliar: TipoVinculacionFamiliarComponent;


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CREANATURALES', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);

    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  selectRegistro(registro: any) {
    // No existe para el padre
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

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    // Consulta datos.
    const conPersonaJuridica = this.personaJuridicaComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.personaJuridicaComponent.alias, conPersonaJuridica);

    const conPersonaDetalle = this.personaDetalleComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.personaDetalleComponent.alias, conPersonaDetalle);

    const conPersonaDireccion = this.personaDireccionComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.personaDireccionComponent.alias, conPersonaDireccion);

    const conPersonaRefComercial = this.personaRefComercialComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.personaRefComercialComponent.alias, conPersonaRefComercial);

    const conPersonaSucursal = this.personaSucursalComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.personaSucursalComponent.alias, conPersonaSucursal);

    const conPersonaFirmante = this.personaFirmanteComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.personaFirmanteComponent.alias, conPersonaFirmante);

    const conInfFinanciera = this.informacionFinancieraComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.informacionFinancieraComponent.alias, conInfFinanciera);


  }

  private fijarFiltrosConsulta() {
    this.personaJuridicaComponent.fijarFiltrosConsulta();
    this.personaDetalleComponent.fijarFiltrosConsulta();
    this.personaDireccionComponent.fijarFiltrosConsulta();
    this.personaRefComercialComponent.fijarFiltrosConsulta();
    this.personaSucursalComponent.fijarFiltrosConsulta();
    this.personaFirmanteComponent.fijarFiltrosConsulta();
    this.informacionFinancieraComponent.fijarFiltrosConsulta();
  }

  validaFiltrosConsulta(): boolean {
    return this.personaJuridicaComponent.validaFiltrosRequeridos() && this.personaDetalleComponent.validaFiltrosRequeridos()
      && this.personaDireccionComponent.validaFiltrosRequeridos() && this.personaRefComercialComponent.validaFiltrosRequeridos()
      && this.personaSucursalComponent.validaFiltrosRequeridos() && this.personaFirmanteComponent.validaFiltrosRequeridos()
      && this.informacionFinancieraComponent.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.personaJuridicaComponent.postQuery(resp);
    this.personaDetalleComponent.postQuery(resp);
    this.personaDireccionComponent.postQuery(resp);
    this.personaRefComercialComponent.postQuery(resp);
    this.personaSucursalComponent.postQuery(resp);
    this.personaFirmanteComponent.postQuery(resp);
    this.informacionFinancieraComponent.postQuery(resp);
  }

  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    super.addMantenimientoPorAlias(this.personaJuridicaComponent.alias, this.personaJuridicaComponent.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.personaDetalleComponent.alias, this.personaDetalleComponent.getMantenimiento(2));
    super.addMantenimientoPorAlias(this.personaDireccionComponent.alias, this.personaDireccionComponent.getMantenimiento(3));
    super.addMantenimientoPorAlias(this.personaRefComercialComponent.alias, this.personaRefComercialComponent.getMantenimiento(4));
    super.addMantenimientoPorAlias(this.personaSucursalComponent.alias, this.personaSucursalComponent.getMantenimiento(5));
    super.addMantenimientoPorAlias(this.personaFirmanteComponent.alias, this.personaFirmanteComponent.getMantenimiento(6));
    super.addMantenimientoPorAlias(this.informacionFinancieraComponent.alias, this.informacionFinancieraComponent.getMantenimiento(7));

    this.rqMantenimiento.c_cpersona = this.personaDetalleComponent.registro.cpersona;
    this.rqMantenimiento.c_pk_cpersona = this.personaDetalleComponent.registro.cpersona;


    // para adicionar otros entity bean super.addMantenimientoPorAlias('alias',mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  validaGrabar() {
    return this.personaJuridicaComponent.validaGrabar() && this.personaDetalleComponent.validaGrabar() &&
      this.personaDireccionComponent.validaGrabar() && this.personaFirmanteComponent.validaGrabar() &&
      this.personaRefComercialComponent.validaGrabar() && this.personaSucursalComponent.validaGrabar() &&
      this.informacionFinancieraComponent.validaGrabar();
  }

  public postCommit(resp: any) {
    this.personaJuridicaComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.personaJuridicaComponent.alias));
    this.personaDetalleComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.personaDetalleComponent.alias));
    this.personaDireccionComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.personaDireccionComponent.alias));
    this.personaRefComercialComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.personaRefComercialComponent.alias));
    this.personaSucursalComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.personaSucursalComponent.alias));
    this.personaFirmanteComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.personaFirmanteComponent.alias));
    this.informacionFinancieraComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.informacionFinancieraComponent.alias));
  }


  /**Muestra lov de personas */
  mostrarLovPersonas(): void {
    this.lovPersonas.mfiltros.tipodepersona = 'J';
    this.lovPersonas.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonasSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.npersona = reg.registro.nombre;

      this.personaJuridicaComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.personaDetalleComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.personaDireccionComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.personaRefComercialComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.personaSucursalComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.personaFirmanteComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.informacionFinancieraComponent.mfiltros.cpersona = reg.registro.cpersona;

      this.consultar();
    }
  }

  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuestaCatalogos(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  llenarConsultaCatalogos(): void {
    const mfiltrosTipoIdent: any = { 'ccatalogo': 303 };
    const mfiltrosespTipoIdent: any = { 'cdetalle': 'in(\'R\')' };
    const consultaTipoIdent = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosTipoIdent, mfiltrosespTipoIdent);
    consultaTipoIdent.cantidad = 50;
    this.addConsultaPorAlias('TIPOIDENT', consultaTipoIdent);

    const mfiltrosTipoIdentFirm: any = { 'ccatalogo': 303 };
    const mfiltrosespTipoIdentFirm: any = { 'cdetalle': 'not in(\'R\')' };
    const consultaTipoIdentFirm = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosTipoIdentFirm, mfiltrosespTipoIdentFirm);
    consultaTipoIdentFirm.cantidad = 50;
    this.addConsultaPorAlias('TIPOIDENTFIRM', consultaTipoIdentFirm);

    const mfiltrosTipoDirec: any = { 'ccatalogo': 304 };
    const mfiltrosespTipoDirec: any = { 'cdetalle': null };
    const consultaTipoDirec = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosTipoDirec, mfiltrosespTipoDirec);
    consultaTipoDirec.cantidad = 50;
    this.addConsultaPorAlias('TIPDIRECCION', consultaTipoDirec);

  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.personaDetalleComponent.ltipoidentificacion, resp.TIPOIDENT, 'cdetalle');
      this.llenaListaCatalogo(this.personaFirmanteComponent.ltipoidentificacion, resp.TIPOIDENTFIRM, 'cdetalle');
      this.llenaListaCatalogo(this.personaDireccionComponent.ltipodireccion, resp.TIPDIRECCION, 'cdetalle');


    }
    this.lconsulta = [];
  }

}
