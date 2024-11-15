import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';
import {LovPersonasComponent} from '../../../personas/lov/personas/componentes/lov.personas.component';
import {CatalogoDetalleComponent} from '../../../generales/catalogos/componentes/_catalogoDetalle.component';
import {TipoVinculacionFamiliarComponent} from '../../tipovinculacionfamiliar/componentes/tipoVinculacionFamiliar.component';

import {PersonaNaturalComponent} from '../../creacionnaturales/submodulos/infgeneral/componentes/_personaNatural.component';
import {PersonaDetalleComponent} from '../../creacionnaturales/submodulos/infgeneral/componentes/_personaDetalle.component';
import {InformacionGeneralComponent} from '../../creacionnaturales/submodulos/infgeneral/componentes/_informacionGeneral.component';
import {PersonaDireccionComponent} from '../../creacionnaturales/submodulos/direccion/componentes/_personaDireccion.component';



@Component({
  selector: 'app-creacion-rapida-naturales',
  templateUrl: 'creacionRapidaNaturales.html'
})
export class CreacionRapidaNaturalesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(PersonaNaturalComponent)
  personaNaturalComponent: PersonaNaturalComponent;

  @ViewChild(PersonaDetalleComponent)
  personaDetalleComponent: PersonaDetalleComponent;

  @ViewChild(InformacionGeneralComponent)
  informacionGeneralComponent: InformacionGeneralComponent;

  @ViewChild(PersonaDireccionComponent)
  personaDireccionComponent: PersonaDireccionComponent;



  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  private catalogoDetalle: CatalogoDetalleComponent;

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
    const conPersonaNatural = this.personaNaturalComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.personaNaturalComponent.alias, conPersonaNatural);

    const conPersonaDetalle = this.personaDetalleComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.personaDetalleComponent.alias, conPersonaDetalle);

    const conPersonaDireccion = this.personaDireccionComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.personaDireccionComponent.alias, conPersonaDireccion);



  }

  private fijarFiltrosConsulta() {
    this.personaNaturalComponent.fijarFiltrosConsulta();
    this.personaDetalleComponent.fijarFiltrosConsulta();
    this.personaDireccionComponent.fijarFiltrosConsulta();

  }

  validaFiltrosConsulta(): boolean {
    return this.personaNaturalComponent.validaFiltrosRequeridos() && this.personaDetalleComponent.validaFiltrosRequeridos()
      && this.personaDireccionComponent.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.personaNaturalComponent.postQuery(resp);
    this.personaDetalleComponent.postQuery(resp);
    this.personaDireccionComponent.postQuery(resp);

  }

  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.personaDetalleComponent.registro.csocio = 0;
     this.personaNaturalComponent.selectRegistro(this.personaNaturalComponent.registro);
    this.personaDetalleComponent.selectRegistro(this.personaDetalleComponent.registro);
    this.personaNaturalComponent.actualizar();
    this.personaDetalleComponent.actualizar();
    super.addMantenimientoPorAlias(this.personaNaturalComponent.alias, this.personaNaturalComponent.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.personaDetalleComponent.alias, this.personaDetalleComponent.getMantenimiento(2));
    super.addMantenimientoPorAlias(this.personaDireccionComponent.alias, this.personaDireccionComponent.getMantenimiento(3));


    this.rqMantenimiento.c_pk_cpersona = this.personaDetalleComponent.registro.cpersona;
    this.rqMantenimiento.cpersona = this.personaDetalleComponent.registro.cpersona;
    // para adicionar otros entity bean super.addMantenimientoPorAlias('alias',mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  validaGrabar() {
    return this.personaNaturalComponent.validaGrabar() && this.personaDetalleComponent.validaGrabar()
      ;
  }

  public postCommit(resp: any) {
    this.personaNaturalComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.personaNaturalComponent.alias));
    this.personaDetalleComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.personaDetalleComponent.alias));
    this.personaDireccionComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.personaDireccionComponent.alias));

  }


  /**Muestra lov de personas */
  mostrarLovPersonas(): void {
    this.lovPersonas.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonasSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.npersona = reg.registro.nombre;

      this.personaNaturalComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.personaDetalleComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.personaDireccionComponent.mfiltros.cpersona = reg.registro.cpersona;

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
    const mfiltrosTipoIdent: any = {'ccatalogo': 303};
    const mfiltrosespTipoIdent: any = {'cdetalle': 'not in(\'R\')'};
    const consultaTipoIdent = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosTipoIdent, mfiltrosespTipoIdent);
    consultaTipoIdent.cantidad = 50;
    this.addConsultaPorAlias('TIPOIDENT', consultaTipoIdent);

    const mfiltrosTipoAct: any = {'ccatalogo': 15};
    const mfiltrosespTipoAct: any = {'cdetalle': null};
    const consultaTipoAct = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosTipoAct, mfiltrosespTipoAct);
    consultaTipoAct.cantidad = 50;
    this.addConsultaPorAlias('TIPACTIV', consultaTipoAct);

    const mfiltrosTipoDir: any = {'ccatalogo': 304};
    const consultaTipoDir = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosTipoDir, {});
    consultaTipoDir.cantidad = 50;
    this.addConsultaPorAlias('TIPDIRECCION', consultaTipoDir);

    const mfiltrosEstadoCivil: any = {'ccatalogo': 301};
    const consultaEstadoCivil = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosEstadoCivil, {});
    consultaEstadoCivil.cantidad = 50;
    this.addConsultaPorAlias('ESTADOCIVIL', consultaEstadoCivil);

    const mfiltrosGenero: any = {'ccatalogo': 302};
    const consultaGenero = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosGenero, {});
    consultaGenero.cantidad = 50;
    this.addConsultaPorAlias('GENERO', consultaGenero);

    const mfiltrosNivelStudios: any = {'ccatalogo': 212};
    const consultaNivelStudios = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosNivelStudios, {});
    consultaNivelStudios.cantidad = 50;
    this.addConsultaPorAlias('NIVELSTUDIOS', consultaNivelStudios);

    const mfiltrosProf: any = {'ccatalogo': 216};
    const consultaProf = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosProf, {});
    consultaProf.cantidad = 50;
    this.addConsultaPorAlias('PROFESION', consultaProf);

    const mfiltrosCargo: any = {'ccatalogo': 11};
    const consultaCargo = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosCargo, {});
    consultaCargo.cantidad = 50;
    this.addConsultaPorAlias('CARGO', consultaCargo);

    const mfiltrosTipoContrato: any = {'ccatalogo': 12};
    const consultaTipoContrato = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosTipoContrato, {});
    consultaTipoContrato.cantidad = 50;
    this.addConsultaPorAlias('TIPCONTRATO', consultaTipoContrato);


  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.personaDetalleComponent.ltipoidentificacion, resp.TIPOIDENT, 'cdetalle');
      // this.llenaListaCatalogo(this.personaDetalleComponent.ltipoactividad, resp.TIPACTIV, 'cdetalle');
      this.llenaListaCatalogo(this.personaDireccionComponent.ltipodireccion, resp.TIPDIRECCION, 'cdetalle');
      this.llenaListaCatalogo(this.personaNaturalComponent.lestadocivil, resp.ESTADOCIVIL, 'cdetalle');
      this.llenaListaCatalogo(this.personaNaturalComponent.lgenero, resp.GENERO, 'cdetalle');
      // this.llenaListaCatalogo(this.personaNaturalComponent.lnivelestudios, resp.NIVELSTUDIOS, 'cdetalle');
      // this.llenaListaCatalogo(this.personaNaturalComponent.lprofesion, resp.PROFESION, 'cdetalle');


    }
    this.lconsulta = [];
  }

}
