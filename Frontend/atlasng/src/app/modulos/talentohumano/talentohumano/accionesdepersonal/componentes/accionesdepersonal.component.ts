import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem,EditorModule } from 'primeng/primeng';
import { LovDesignacionesComponent } from '../../../../talentohumano/lov/designaciones/componentes/lov.designaciones.component';

import { LovFuncionariosComponent } from '../../../lov/funcionarios/componentes/lov.funcionarios.component';
import { GestorDocumentalComponent } from '../../../../gestordocumental/componentes/gestordocumental.component';

import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
@Component({
  selector: 'app-tth-accionesdepersonal',
  templateUrl: 'accionesdepersonal.html'
})
export class AccionesDePersonalComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(LovDesignacionesComponent) private lovDesignaciones: LovDesignacionesComponent;
  @ViewChild('formFiltros') formFiltros: NgForm;
  @ViewChild(LovFuncionariosComponent) private lovFuncionarios: LovFuncionariosComponent;
  @ViewChild(GestorDocumentalComponent) private lovGestor: GestorDocumentalComponent;
  public ltiposacciones: SelectItem[] = [{ label: '...', value: null }];

  @ViewChild('rep2')
  public jasper2: JasperComponent;
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthacciondepersonal', 'ACCIONESDEPERSONAL', false);
    this.componentehijo = this;
  }
  public jefetth: any = [];
  
  public direjecutivo: any = [];
  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  descargar(reg: any): void {

    this.jasper2.formatoexportar='pdf';
    this.jasper2.nombreArchivo = 'Acción de Personal';
    this.jasper2.parametros['@i_secuencia'] = reg.cacciondepersonal;
    this.jasper2.parametros['archivoReporteUrl'] = '/CesantiaReportes/TalentoHumano/rptTthAccionPersonal';
    this.jasper2.generaReporteCore();
  }

  ngAfterViewInit() {
  }

  consultarCatalogos(): void {
  

    this.encerarConsultaCatalogos();
   
    const mfiltrosparam = { 'codigo': 'CFUNTALHUMANO' };
    const consultarParametro = new Consulta('tthparametros', 'Y', 't.codigo', mfiltrosparam, null);
    consultarParametro.cantidad = 100;
    this.addConsultaCatalogos('TABL', consultarParametro, this.jefetth, super.llenaListaCatalogo, 'numero');

    const mfiltrosparamdir = { 'codigo': 'CFUNDIREJECUTIVO' };
    const consultarParametrodir = new Consulta('tthparametros', 'Y', 't.codigo', mfiltrosparamdir, null);
    consultarParametrodir.cantidad = 100;
    this.addConsultaCatalogos('DIREJECUTIVO', consultarParametrodir, this.direjecutivo, super.llenaListaCatalogo, 'numero');
   
    const mfiltroTIPOSACCIONESPERSONAL: any = { 'ccatalogo': 1146 };
    const consultaTIPOSACCIONESPERSONAL = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroTIPOSACCIONESPERSONAL, {});
    consultaTIPOSACCIONESPERSONAL.cantidad = 500;
    this.addConsultaCatalogos('TIPOSACCIONESPERSONAL', consultaTIPOSACCIONESPERSONAL, this.ltiposacciones, super.llenaListaCatalogo, 'cdetalle');
  
  
    this.ejecutarConsultaCatalogos();
  }
  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  crearNuevo() {
    let dir = this.direjecutivo[1].value;
   let jefe = this.jefetth[1].value;
    if (!this.validaFiltrosRequeridos() || this.estaVacio(dir) || this.estaVacio(jefe)) {
      return;
    }
    if ( this.estaVacio(dir) || this.estaVacio(jefe)) {
      super.mostrarMensajeError("NO SE HA DEFINIDO EN LA PARAMETRIZACIÓN LOS USUARIOS FUNCIONARIO O DIRECTOR EJECTUTIVO");
    }
    super.crearNuevo();
   this.registro.ccontrato=this.mcampos.ccontrato
   this.registro.verregactual= this.mcampos.verregactual
   this.registro.verregantiguo=this.mcampos.verregantiguo;
   this.registro.cfuncionario=this.mcampos.cfuncionario;
   this.registro.accionpersonalccatalogo = 1146;
   this.registro.cfuntalhumano=jefe;
   this.registro.cfundirejecutivo=dir;
   this.registro.sactual=false;
   this.registro.spropuesta=false;
   
   
  }

  mostrarLovDesignaciones(): void {
    this.lovDesignaciones.showDialog();

  }

  /**Retorno de lov de tipos de contrato. */
  fijarLovDesignaciones(reg: any): void {
    if (reg.registro !== undefined) {
      
      this.mfiltros.cfuncionario = reg.registro.cfuncionario;
      this.mcampos.cfuncionario = reg.registro.cfuncionario;
      this.mcampos.ccontrato = reg.registro.ccontrato;
      this.mcampos.verregactual = reg.registro.verreg;
      this.mcampos.verregantiguo = reg.registro.veractual;
      this.mcampos.ndesignacion = reg.registro.mdatos.ndesignacion;
      this.consultar();
    }
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

  // Inicia CONSULTA *********************
  consultar() {
    if (!this.validaFiltrosRequeridos()) {
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cacciondepersonal', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'naccion', 'i.cdetalle = t.accionpersonalcdetalle and t.accionpersonalccatalogo = i.ccatalogo');
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
       
  }

  validaFiltrosConsulta(): boolean {
    return true;
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

 

  mostrarLovFuncionario() {
    this.lovFuncionarios.showDialog();
  }

  fijarLovFuncionario(reg: any): void {
    this.mfiltros.cfuncionario = reg.registro.cfuncionario;
    this.mcampos.nfuncionario = reg.registro.mdatos.nombre;
    if (reg.registro.veractual === null || reg.registro.veractual == 0) {
      this.mcampos.verregactual = 0;
      this.mcampos.verregantiguo = 0;
    }

    this.consultar();
  }

  /**Despliega el lov de Gestión Documental. */
  mostrarLovGestorDocumental(reg: any): void {
    this.selectRegistro(reg);
    this.mostrarDialogoGenerico = false;
    this.lovGestor.showDialog(reg.cgesarchivo);
  }

  /**Retorno de lov de Gestión Documental. */
  fijarLovGestorDocumental(reg: any): void {
    if (reg !== undefined) {
      this.registro.cgesarchivo = reg.cgesarchivo;
      this.registro.mdatos.ndocumento = reg.ndocumento;
      this.actualizar();
      this.grabar();
    }
  }

  /**Retorno de lov de Gestión Documental. */
  eliminarArchivo(reg: any): void {
    this.selectRegistro(reg);
    this.registro.cgesarchivo = null;
    this.actualizar();

    this.grabar();
    this.lovGestor.cgesarchivo = reg.cgesarchivo;
    this.lovGestor.eliminar();
  }

  /**Realiza la descarga desde el lov de Gestión Documental. */
  descargarArchivo(cgesarchivo: any): void {
    this.lovGestor.consultarArchivo(cgesarchivo, true);
  }
}