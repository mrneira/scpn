import { Radicacion } from './../../../../../util/servicios/dto.servicios';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovFuncionariosComponent } from '../../../lov/funcionarios/componentes/lov.funcionarios.component';
import { InstitucionFormalComponent } from '../submodulos/institucionformal/componentes/_institucionformal.component';
import { CapacitacionComponent } from '../submodulos/capacitacion/componentes/_capacitacion.component';
import { IdiomasComponent } from '../submodulos/idiomas/componentes/_idiomas.component';
@Component({
  selector: 'app-informacionAcademica',
  templateUrl: 'informacionacademica.html'
})
export class InformacionAcademicaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovFuncionariosComponent)
  private lovFuncionarios: LovFuncionariosComponent;
  @ViewChild(CapacitacionComponent)
  tablaCapacitacionComponent: CapacitacionComponent;

  @ViewChild(InstitucionFormalComponent)
  tablaInstitucionFormalComponent: InstitucionFormalComponent;
  @ViewChild(IdiomasComponent)
  tablaIdiomasComponent: IdiomasComponent;
  private csolicitud = 0;
  private cfuncionario = 0;



  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'INFORMACIONACADEMICA', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
    this.mcampos.cfuncionario = 0;
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
    if (this.estaVacio(this.mcampos.cfuncionario)) {
      this.mostrarMensajeError("SELECCIONE UN FUNCIONARIO PARA INGRESAR DATOS");
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    // Consulta datos.


    const conInsFormal = this.tablaInstitucionFormalComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaInstitucionFormalComponent.alias, conInsFormal);
    // consultar Tabla amortizacion
    this.tablaInstitucionFormalComponent.mcampos.cfuncionario = this.mcampos.cfuncionario;

    this.tablaCapacitacionComponent.mcampos.cfuncionario = this.mcampos.cfuncionario;
    const conPerCapacitacion = this.tablaCapacitacionComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaCapacitacionComponent.alias, conPerCapacitacion);

    this.tablaIdiomasComponent.mcampos.cfuncionario = this.mcampos.cfuncionario;
    const conIdiomas = this.tablaIdiomasComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaIdiomasComponent.alias, conIdiomas);

    this.tablaCapacitacionComponent.consultar();
    this.tablaIdiomasComponent.consultar();
    this.tablaInstitucionFormalComponent.consultar();

  }

  private fijarFiltrosConsulta() {


    this.tablaInstitucionFormalComponent.mfiltros.cfuncionario = this.mcampos.cfuncionario;
    this.tablaInstitucionFormalComponent.fijarFiltrosConsulta();


    this.tablaIdiomasComponent.mfiltros.cfuncionario = this.mcampos.cfuncionario;
    this.tablaIdiomasComponent.fijarFiltrosConsulta();

    this.tablaCapacitacionComponent.mfiltros.cfuncionario = this.mcampos.cfuncionario;
    this.tablaCapacitacionComponent.fijarFiltrosConsulta();

  }
  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.tablaInstitucionFormalComponent.postQuery(resp);

    this.tablaCapacitacionComponent.postQuery(resp);
    this.tablaIdiomasComponent.postQuery(resp);

    if (this.registro.cfuncionario !== 0) {
      this.editable = false;
    }

  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    if (this.estaVacio(this.mcampos.cfuncionario)){
      this.mostrarMensajeError("SELECCIONE UN FUNCIONARIO PARA MANTENIMIENTO");    
      return;
    }
    this.lmantenimiento = []; // Encerar Mantenimiento
    //this.rqMantenimiento.cfuncionario = this.cfuncionario;
    super.addMantenimientoPorAlias(this.tablaCapacitacionComponent.alias, this.tablaCapacitacionComponent.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.tablaIdiomasComponent.alias, this.tablaIdiomasComponent.getMantenimiento(2));
    super.addMantenimientoPorAlias(this.tablaInstitucionFormalComponent.alias, this.tablaInstitucionFormalComponent.getMantenimiento(3));

    super.grabar();
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  public postCommit(resp: any) {
    if (resp.cod === 'OK') {
      this.cfuncionario = resp.cfuncionario;
      this.tablaInstitucionFormalComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaInstitucionFormalComponent.alias));
      this.tablaIdiomasComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaIdiomasComponent.alias));
      this.tablaCapacitacionComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaCapacitacionComponent.alias));
     
    }

  }

  /**Muestra lov de personas */
  mostrarLovFuncionario(): void {
    this.lovFuncionarios.showDialog();

  }
  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta("C")).subscribe(
      resp => {
        this.manejaRespuestaCatalogos(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      }
    );
  }

  llenarConsultaCatalogos(): void {
    const mfiltrosTipoAct: any = { 'ccatalogo': 1101 };
    const mfiltrosespTipoAct: any = { 'cdetalle': null };
    const consultaTipoAct = new Consulta('tgencatalogodetalle', 'Y', 't.cdetalle', mfiltrosTipoAct, mfiltrosespTipoAct);
    consultaTipoAct.cantidad = 50;
    this.addConsultaPorAlias('ESTABLECIMIENTO', consultaTipoAct);

    const mfiltrosTipoNivel: any = { 'ccatalogo': 1106 };
    const mfiltrosespTipoNivel: any = { 'cdetalle': null };
    const consultaTipoNivel = new Consulta('tgencatalogodetalle', 'Y', 't.cdetalle', mfiltrosTipoNivel, mfiltrosespTipoNivel);
    consultaTipoNivel.cantidad = 50;
    this.addConsultaPorAlias('NIVEL', consultaTipoNivel);

    //tipo capacitacion
    const mfiltrosTipo: any = { 'ccatalogo': 1103 };
    const mfiltrosespTipo: any = { 'cdetalle': null };
    const consultaTipo = new Consulta('tgencatalogodetalle', 'Y', 't.cdetalle', mfiltrosTipo, mfiltrosespTipo);
    consultaTipo.cantidad = 50;
    this.addConsultaPorAlias('TIPO', consultaTipo);

    //modalidad
    const mfiltrosModalidad: any = { 'ccatalogo': 1118 };
    const mfiltrosespModalidad: any = { 'cdetalle': null };
    const consultaModalidad = new Consulta('tgencatalogodetalle', 'Y', 't.cdetalle', mfiltrosModalidad, mfiltrosespModalidad);
    consultaTipo.cantidad = 50;
    this.addConsultaPorAlias('MODALIDAD', consultaModalidad);
    //especialidad
    const mfiltrosEspecialidad: any = { 'ccatalogo': 1119 };
    const mfiltrosespEspecialidad: any = { 'cdetalle': null };
    const consultaEspecialidad = new Consulta('tgencatalogodetalle', 'Y', 't.cdetalle', mfiltrosEspecialidad, mfiltrosespEspecialidad);
    consultaTipo.cantidad = 50;
    this.addConsultaPorAlias('ESPECIALIDAD', consultaEspecialidad);


  }
  validaFiltrosConsulta(): boolean {
    return (
      this.tablaCapacitacionComponent.validaFiltrosRequeridos() &&
      this.tablaIdiomasComponent.validaFiltrosRequeridos() &&
      this.tablaInstitucionFormalComponent.validaFiltrosRequeridos());
  }
  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.tablaInstitucionFormalComponent.ltipoEstablecimiento, resp.ESTABLECIMIENTO, 'cdetalle');
      this.llenaListaCatalogo(this.tablaInstitucionFormalComponent.ltipoNivelAcademico, resp.NIVEL, 'cdetalle');
      this.llenaListaCatalogo(this.tablaIdiomasComponent.ltipoEstablecimiento, resp.ESTABLECIMIENTO, 'cdetalle');
      this.llenaListaCatalogo(this.tablaCapacitacionComponent.ltipo, resp.TIPO, 'cdetalle');
      this.llenaListaCatalogo(this.tablaCapacitacionComponent.lmodalidad, resp.MODALIDAD, 'cdetalle');
      this.llenaListaCatalogo(this.tablaInstitucionFormalComponent.lespecialidad, resp.ESPECIALIDAD, 'cdetalle');
    }
    this.lconsulta = [];
  }


  /**Retorno de lov de personas. */
  fijarLovFuncionarioSelec(reg: any): void {
    if (reg.registro !== undefined) {

      this.registro.cfuncionario = reg.registro.cfuncionario;
      this.mcampos.cfuncionario = reg.registro.cfuncionario;
      this.mcampos.nombre = reg.registro.mdatos.nombre;
      this.mfiltros.cfuncionario = reg.registro.cfuncionario;
      this.tablaCapacitacionComponent.mcampos.cfuncionario = this.registro.cfuncionario;
      this.tablaIdiomasComponent.mcampos.cfuncionario = this.registro.cfuncionario;
      this.tablaInstitucionFormalComponent.mcampos.cfuncionario = this.registro.cfuncionario;
      this.consultar();
    }
  }
}
