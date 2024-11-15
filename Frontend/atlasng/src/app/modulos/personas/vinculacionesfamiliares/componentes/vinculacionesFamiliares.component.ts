import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../util/shared/componentes/base.component';
import {LovPersonasComponent} from '../../../personas/lov/personas/componentes/lov.personas.component';
import {SelectItem} from 'primeng/primeng';

@Component({
  selector: 'app-vin-familiares',
  templateUrl: 'vinculacionesFamiliares.html'
})
export class VinculacionesFamiliaresComponent extends BaseComponent implements OnInit, AfterViewInit {

  //@ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild('lovpersona')
  private lovPersonas: LovPersonasComponent;

  @ViewChild('lovpersonavinculada')
  private lovPersonasVinculada: LovPersonasComponent;

  public tipovinculacion: SelectItem[];
  public lgenero: SelectItem[] = [{label: "...", value: null}];

  public banbtndesvincular = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tperreferenciapersonales', 'REFERENCIAPERSONAL', true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.tipovinculacion = [];
    this.tipovinculacion.push({label: 'Cónyuge Policía', value: true});
    this.tipovinculacion.push({label: 'Cónyuge Civil', value: false});
    this.mcampos.tipovinculacion = true;
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.registro.verreg = 0;
    this.registro.ctipovinculacion = 5; // tipo vinculación (5) conyuge

  }

  habilitarEdicion() {
    if (!super.validaFiltrosRequeridos()) {
      return;
    }
    if (!this.estaVacio(this.mfiltros.cpersona)) {
      this.registro.cpersona = this.mfiltros.cpersona;
    }
    super.habilitarEdicion();
  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    super.cancelar();
    this.lovPersonasVinculada.displayLov = false;
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.cpersona', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TperPersonaDetalle', 'nombre', 'npersonavinculada', 'i.cpersona = t.cpersonaconyugue and i.verreg=0');
    consulta.addSubquery('TperPersonaDetalle', 'identificacion', 'cidentificacion', 'i.cpersona = t.cpersonaconyugue and i.verreg=0');
    consulta.addSubquery('TperTipoVinculacion', 'nombre', 'ntipovinculacion', 'i.ctipovinculacion = t.ctipovinculacion');
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.verreg = 0;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    this.mostrarMensajeSuccess('TRANSACCIÓN REALIZADA EXITOSAMENTE');

    if (resp.REFERENCIAPERSONAL.length === 0) {
      this.mcampos.identificacion = '';
      this.mcampos.nombre = '';
      this.mcampos.tipovinculaciongeneral = '';
      this.banbtndesvincular = false;
      return;
    }
    this.banbtndesvincular = true;
    this.mcampos.identificacion = resp.REFERENCIAPERSONAL[0].identificacion;
    this.mcampos.nombre = resp.REFERENCIAPERSONAL[0].nombre;
    this.mcampos.tipovinculaciongeneral = 'CÓNYUGE CIVIL';
    if (this.estaVacio(resp.REFERENCIAPERSONAL[0].identificacion)) {
      this.mcampos.nombre = resp.REFERENCIAPERSONAL[0].mdatos.npersonavinculada;
      this.mcampos.identificacion = resp.REFERENCIAPERSONAL[0].mdatos.cidentificacion;
      this.mcampos.tipovinculaciongeneral = 'CÓNYUGE POLICÍA';
    }

    if (this.estaVacio(this.mcampos.identificacion) && this.estaVacio(this.mcampos.nombre)) {
      this.mcampos.tipovinculaciongeneral = '';
    }

  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    //this.rqMantenimiento = [];

    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    this.rqMantenimiento.desvincular = false;
    this.rqMantenimiento.c_pk_cpersona = this.mfiltros.cpersona;
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes

    super.grabar();
  }

  desvincuar(): void {
    // this.rqMantenimiento = [];
 
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    this.rqMantenimiento.desvincular = true;
    this.rqMantenimiento.cpersona = this.mfiltros.cpersona;
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes

    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod !== "OK") {
      return;
    }
    this.enproceso = false;
    this.mcampos.cpersonaconyugue = '';
    this.mcampos.npersonavinculada = '';

    this.consultar();
  }

  /**Muestra lov de personas */
  mostrarLovPersona(): void {
    this.lovPersonas.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.cpersona = reg.registro.cpersona;
      this.mcampos.npersona = reg.registro.nombre;
      this.mcampos.identificacionp = reg.registro.identificacion;
      this.consultar();
    }
  }

  /**Muestra lov de personas vinculadas */
  mostrarLovPersonaVinculada(): void {
    this.lovPersonasVinculada.showDialog();
  }

  /**Retorno de lov de personas vinculadas */
  fijarLovPersonaVinculadaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cpersonaconyugue = reg.registro.cpersona;
      this.registro.mdatos.npersonavinculada = reg.registro.nombre;
      this.mfiltros.cpersona = reg.registro.cpersona;
      this.mcampos.identificacionc = reg.registro.identificacion;
      this.mcampos.cpersonaconyugue = reg.registro.cpersona;
      this.mcampos.npersonavinculada = reg.registro.nombre;
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
    const mfiltroGenero: any = {ccatalogo: 302};
    const consultaGenero = new Consulta("tgencatalogodetalle", "Y", "t.nombre", mfiltroGenero, {});
    consultaGenero.cantidad = 100;
    this.addConsultaPorAlias("GENERO", consultaGenero);
  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    if (resp.cod === "OK") {
      this.llenaListaCatalogo(this.lgenero, resp.GENERO, "cdetalle");
    }
    this.lconsulta = [];
  }

  limpiar(): void {
    if (this.mcampos.tipovinculacion) {
      this.registro.identificacion = '';
      this.registro.nombre = '';
      this.registro.genero = null
    } else {
      this.registro.cpersonaconyugue = null;
      this.mcampos.cpersonaconyugue = '';
      this.mcampos.npersonavinculada = '';
    }
  }
}
