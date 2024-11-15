import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';
import {LovPersonasComponent} from '../../../personas/lov/personas/componentes/lov.personas.component';
import {PersonaNaturalComponent} from '../submodulos/infgeneral/componentes/_personaNatural.component';
import {PersonaDetalleComponent} from '../submodulos/infgeneral/componentes/_personaDetalle.component';
import {InformacionGeneralComponent} from '../submodulos/infgeneral/componentes/_informacionGeneral.component';
import {PersonaDireccionComponent} from '../submodulos/direccion/componentes/_personaDireccion.component';
import {PersonaRefBancariaComponent} from '../submodulos/refbancaria/componentes/_personaRefBancaria.component';
import {SocioCesantiaComponent} from '../submodulos/sociocesantia/componentes/sociocesantia.component';

@Component({
  selector: "app-creacion-naturales",
  templateUrl: "creacionNaturales.html"
})
export class CreacionNaturalesComponent extends BaseComponent
  implements OnInit, AfterViewInit {
  @ViewChild("formFiltros") formFiltros: NgForm;

  @ViewChild(PersonaNaturalComponent)
  personaNaturalComponent: PersonaNaturalComponent;

  @ViewChild(PersonaDetalleComponent)
  personaDetalleComponent: PersonaDetalleComponent;

  @ViewChild(InformacionGeneralComponent)
  informacionGeneralComponent: InformacionGeneralComponent;

  @ViewChild(PersonaDireccionComponent)
  personaDireccionComponent: PersonaDireccionComponent;

  @ViewChild(PersonaRefBancariaComponent)
  personaRefBancariaComponent: PersonaRefBancariaComponent;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  @ViewChild(SocioCesantiaComponent)
  socioCesantiaComponent: SocioCesantiaComponent;

  essociocesantia = true;

  public habilitarTipoPersona: boolean;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, "ABSTRACT", "CREANATURALES", false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.habilitarTipoPersona = false;
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
    // this.personaNaturalComponent.habilitarProfesion = true;
    this.socioCesantiaComponent.formvalidado = false;
    //this.personaDireccionComponent.mfiltros.cpersona = 0;
    //this.personaRefBancariaComponent.mfiltros.cpersona = 0;
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
    const conPersonaNatural = this.personaNaturalComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.personaNaturalComponent.alias, conPersonaNatural);

    const conPersonaDetalle = this.personaDetalleComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.personaDetalleComponent.alias, conPersonaDetalle);

    const conPersonaDireccion = this.personaDireccionComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.personaDireccionComponent.alias, conPersonaDireccion);

    const conPersonaRefBancaria = this.personaRefBancariaComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.personaRefBancariaComponent.alias, conPersonaRefBancaria);

    const conSocioCesantia = this.socioCesantiaComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.socioCesantiaComponent.alias, conSocioCesantia);
  }

  private fijarFiltrosConsulta() {
    this.personaNaturalComponent.fijarFiltrosConsulta();
    this.personaDetalleComponent.fijarFiltrosConsulta();
    this.personaDireccionComponent.fijarFiltrosConsulta();
    this.personaRefBancariaComponent.fijarFiltrosConsulta();
    this.socioCesantiaComponent.fijarFiltrosConsulta();
  }

  validaFiltrosConsulta(): boolean {
    return (
      this.personaNaturalComponent.validaFiltrosRequeridos() &&
      this.personaDetalleComponent.validaFiltrosRequeridos() &&
      this.personaDireccionComponent.validaFiltrosRequeridos() &&
      this.personaRefBancariaComponent.validaFiltrosRequeridos() &&
      this.socioCesantiaComponent.validaFiltrosRequeridos());
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.personaNaturalComponent.postQuery(resp);
    this.personaDetalleComponent.postQuery(resp);
    this.personaDireccionComponent.postQuery(resp);
    this.personaRefBancariaComponent.postQuery(resp);
    this.socioCesantiaComponent.postQuery(resp);
  }

  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.marcarSocio();
    //this.personaNaturalComponent.registro.esnuevo = true;
    //this.personaDetalleComponent.registro.esnuevo = true;
    this.personaNaturalComponent.selectRegistro(this.personaNaturalComponent.registro);
    this.personaDetalleComponent.selectRegistro(this.personaDetalleComponent.registro);
    this.personaNaturalComponent.actualizar();
    this.personaDetalleComponent.actualizar();
    super.addMantenimientoPorAlias(this.personaNaturalComponent.alias, this.personaNaturalComponent.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.personaDetalleComponent.alias, this.personaDetalleComponent.getMantenimiento(2));
    super.addMantenimientoPorAlias(this.personaDireccionComponent.alias, this.personaDireccionComponent.getMantenimiento(3));
    super.addMantenimientoPorAlias(this.personaRefBancariaComponent.alias, this.personaRefBancariaComponent.getMantenimiento(4));
    super.addMantenimientoPorAlias(this.socioCesantiaComponent.alias, this.socioCesantiaComponent.getMantenimiento(5));

    this.rqMantenimiento.c_pk_cpersona = this.personaDetalleComponent.registro.cpersona;
    //this.rqMantenimiento.cpersona = this.personaDetalleComponent.registro.cpersona;
    this.registro.mdatos.cgradoactual = this.socioCesantiaComponent.mcampos.cgradoactual;
    this.registro.mdatos.cestadosocio = this.socioCesantiaComponent.registro.mdatos.cestadosocio;
    this.registro.mdatos.ordengen = this.socioCesantiaComponent.registro.mdatos.ordengen;
    this.registro.mdatos.fordengen = this.socioCesantiaComponent.registro.mdatos.fordengen;
    this.registro.mdatos.fproceso = this.socioCesantiaComponent.registro.mdatos.fproceso;
    // para adicionar otros entity bean super.addMantenimientoPorAlias('alias',mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  private marcarSocio() {
    if (this.personaDetalleComponent.registro.csocio !== undefined && this.personaDetalleComponent.registro.csocio === 1) {
      return;
    }
    if (this.socioCesantiaComponent.lregistros.length > 0) {
      this.personaDetalleComponent.registro.csocio = 1;
    }
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  validaGrabar() {
    return (
      this.personaNaturalComponent.validaGrabar() &&
      this.personaDetalleComponent.validaGrabar() &&
      this.personaDireccionComponent.validaGrabar() &&
      this.personaRefBancariaComponent.validaGrabar() &&
      this.socioCesantiaComponent.validaGrabar()
    );
  }

  public postCommit(resp: any) {
    this.personaNaturalComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.personaNaturalComponent.alias));
    this.personaDetalleComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.personaDetalleComponent.alias));
    this.personaDireccionComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.personaDireccionComponent.alias));
    this.personaRefBancariaComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.personaRefBancariaComponent.alias));
    //    this.personaRefBancariaComponent.enproceso = false;
    //    this.personaRefBancariaComponent.consultar();
    this.socioCesantiaComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.socioCesantiaComponent.alias));
  }

  /**Muestra lov de personas */
  mostrarLovPersonas(): void {
    this.lovPersonas.mfiltros.tipodepersona = "N";
    this.lovPersonas.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonasSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.npersona = reg.registro.nombre;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.personaNaturalComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.personaDetalleComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.personaDireccionComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.socioCesantiaComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.personaRefBancariaComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.consultar();
    }
  }

  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios
      .ejecutarConsultaRest(this.getRequestConsulta("C")).subscribe(
      resp => {
        this.encerarMensajes();
        this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
        this.manejaRespuestaCatalogos(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      }
      );
  }

  llenarConsultaCatalogos(): void {
    const mfiltroEstadoCivil: any = {ccatalogo: 301};
    const consultaEstadoCivil = new Consulta("tgencatalogodetalle", "Y", "t.nombre", mfiltroEstadoCivil, {});
    consultaEstadoCivil.cantidad = 100;
    this.addConsultaPorAlias("ESTADOCIVIL", consultaEstadoCivil);

    const mfiltroGenero: any = {ccatalogo: 302};
    const consultaGenero = new Consulta("tgencatalogodetalle", "Y", "t.nombre", mfiltroGenero, {});
    consultaGenero.cantidad = 100;
    this.addConsultaPorAlias("GENERO", consultaGenero);

    const mfiltroInsFin: any = {ccatalogo: 305,'activo': true};
    const consultaInsFin = new Consulta("tgencatalogodetalle", "Y", "t.nombre", mfiltroInsFin, {});
    consultaInsFin.cantidad = 500;
    this.addConsultaPorAlias("INSFIN", consultaInsFin);

    const mfiltroTipoCuenta: any = {ccatalogo: 306};
    const consultaTipoCuenta = new Consulta("tgencatalogodetalle", "Y", "t.nombre", mfiltroTipoCuenta, {});
    consultaTipoCuenta.cantidad = 20;
    this.addConsultaPorAlias("TIPCUENTA", consultaTipoCuenta);

    const mfiltroCargo: any = {ccatalogo: 11};
    const consultaCargos = new Consulta("tgencatalogodetalle", "Y", "t.nombre", mfiltroCargo, {});
    consultaCargos.cantidad = 100;
    this.addConsultaPorAlias("CARGO", consultaCargos);

    const consultaEstadoPolicia = new Consulta("tsocestadosocio", "Y", "t.nombre", {}, {});
    consultaEstadoPolicia.addSubquery('tgencatalogodetalle', 'nombre', 'nnombre', 'i.ccatalogo = 2703 and i.cdetalle = t.cdetalleestatus');
    consultaEstadoPolicia.cantidad = 100;
    this.addConsultaPorAlias("ESTADOPOLICIA", consultaEstadoPolicia);

    const mfiltroJerarquia: any = {ccatalogo: 2701};
    const consultaJerarquia = new Consulta("tgencatalogodetalle", "Y", "t.nombre", mfiltroJerarquia, {});
    consultaJerarquia.cantidad = 100;
    this.addConsultaPorAlias("TGENJERARQUIAS", consultaJerarquia);

    const mfilitrosTipogrado: any = {estado: true};
    const consultaGrado = new Consulta("TsocTipoGrado", "Y", "t.cgrado", mfilitrosTipogrado, {});
    consultaGrado.cantidad = 50;
    this.addConsultaPorAlias("TIPOGRADO", consultaGrado);

    const mfiltroCargoSoc: any = {ccatalogo: 2702};
    const consultaCargoSoc = new Consulta("tgencatalogodetalle", "Y", "t.nombre", mfiltroCargoSoc, {});
    consultaCargoSoc.cantidad = 100;
    this.addConsultaPorAlias("CARGOSOC", consultaCargoSoc);

    // const consultaVincFam = new Consulta("TperTipoVinculacion", "Y", "t.nombre", {}, {});
    // consultaVincFam.cantidad = 30;
    // this.addConsultaPorAlias("VINFAMILIAR", consultaVincFam);

    const mfilitrosTipoBaja: any = {estado: true};
    const consultaTipoBaja = new Consulta("TsocTipoBaja", "Y", "t.nombre", mfilitrosTipoBaja, {});
    consultaTipoBaja.cantidad = 50;
    this.addConsultaPorAlias("TIPOBAJA", consultaTipoBaja);

    const mfilitrosTipoPolicia: any = {estado: true};
    const consultaTipoPolicia = new Consulta("TsocTipoPolicia", "Y", "t.nombre", mfilitrosTipoPolicia, {});
    consultaTipoPolicia.cantidad = 50;
    this.addConsultaPorAlias("TIPOPOLICIA", consultaTipoPolicia);

    const consultaUbicacion = new Consulta("TsocUbicacion", "Y", "t.cubicacion", {}, {});
    consultaUbicacion.cantidad = 300;

    const mfiltrosTipoDir: any = {ccatalogo: 304};
    const consultaTipoDir = new Consulta("tgencatalogodetalle", "Y", "t.nombre", mfiltrosTipoDir, {});
    consultaTipoDir.cantidad = 50;
    this.addConsultaPorAlias("TIPDIRECCION", consultaTipoDir);

  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    if (resp.cod === "OK") {
      this.personaNaturalComponent.registro.profesioncdetalle = "F";
      // this.llenaListaCatalogo(this.personaNaturalComponent.lprofesion, resp.PROFESION, "cdetalle");
      this.llenaListaCatalogo(this.personaNaturalComponent.lestadocivil, resp.ESTADOCIVIL, "cdetalle");
      this.llenaListaCatalogo(this.personaNaturalComponent.lgenero, resp.GENERO, "cdetalle");

      this.llenaListaCatalogo(this.personaRefBancariaComponent.linstfinanciera, resp.INSFIN, "cdetalle");
      this.llenaListaCatalogo(this.personaRefBancariaComponent.ltipocuenta, resp.TIPCUENTA, "cdetalle");
      this.llenaListaCatalogo(this.socioCesantiaComponent.lcargo, resp.CARGOSOC, "cdetalle");
      this.llenaListaCatalogo(this.socioCesantiaComponent.ltipobaja, resp.TIPOBAJA, "ctipobaja");
      this.llenaListaCatalogo(this.socioCesantiaComponent.ltipopolicia, resp.TIPOPOLICIA, "ctipopolicia");
      this.llenaListaCatalogo(this.socioCesantiaComponent.lubicacion, resp.UBICACION, "cubicacion");
      this.llenaListaCatalogo(this.personaDireccionComponent.ltipodireccion, resp.TIPDIRECCION, "cdetalle");
      this.llenaListaCatalogo(this.socioCesantiaComponent.lgrado, resp.TIPOGRADO, "cgrado");

      this.socioCesantiaComponent.lgradototal = resp.TIPOGRADO;
      this.socioCesantiaComponent.ljerarquiatotal = resp.TGENJERARQUIAS;
      this.socioCesantiaComponent.lestadototal = resp.ESTADOPOLICIA;
      this.socioCesantiaComponent.llenarEstado();

    }
    this.lconsulta = [];
  }
}
