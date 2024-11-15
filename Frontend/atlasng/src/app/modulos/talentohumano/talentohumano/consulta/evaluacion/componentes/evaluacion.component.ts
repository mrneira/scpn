import { Radicacion } from '../../../../../../util/servicios/dto.servicios';
import { Component, OnInit, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { CatalogoDetalleComponent } from '../../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { JasperComponent } from '../../../../../../util/componentes/jasper/componentes/jasper.component'

import { SelectItem } from 'primeng/primeng';
import { ConfirmationService } from 'primeng/primeng';

//submodulos

import { CabeceraComponent } from "../submodulos/cabecera/componentes/cabecera.component"
import { ParamgestionpuestoComponent } from "../submodulos/paramgestionpuesto/componentes/paramgestionpuesto.component"
import { ConocimientoComponent } from '../submodulos/conocimiento/conocimiento/conocimiento.component';
import { ComptecnicasComponent } from '../submodulos/comptecnicas/componentes/comptecnicas.component';
import { CompuniversalesComponent } from '../submodulos/compuniversales/componentes/compuniversales.component';
import { TrabajoequipoComponent } from '../submodulos/trabajoequipo/componentes/trabajoequipo.component';
import { QuejasciudadanoComponent } from '../submodulos/quejasciudadano/componentes/quejasciudadano.component';

//Lov
import { LovPeriodoComponent } from '../../../../lov/periodo/componentes/lov.periodo.component';
import { LovEvaluacionComponent } from '../../../../lov/evaluacion/componentes/lov.evaluacion.component';
import { LovFuncionariosComponent } from '../../../../lov/funcionarios/componentes/lov.funcionarios.component';
import { LovPlantillaEvaluacionMrlComponent } from '../../../../lov/plantillaevaluacionmrl/componentes/lov.plantillaevaluacionmrl.component';


import { LovFuncionariosEvaluadosComponent } from '../../../../lov/evaluados/componentes/lov.funcionarios.component';

export enum KEY_CODE {
  FLECHA_ABAJO = 40
}

@Component({
  selector: 'app-evaluacion',
  templateUrl: 'evaluacion.html'
})
export class EvaluacionComponent extends BaseComponent implements OnInit, AfterViewInit {
  public visible: boolean = false;
  private catalogoDetalle: CatalogoDetalleComponent;
  @ViewChild('formFiltros') formFiltros: NgForm;
  //Submodulos
  @ViewChild(CabeceraComponent)
  tablaEvaluacion: CabeceraComponent;

  @ViewChild(LovFuncionariosEvaluadosComponent)
  private lovFuncionariosEval: LovFuncionariosEvaluadosComponent;
  @ViewChild(ConocimientoComponent)
  tablaConocimientoComponent: ConocimientoComponent;
  @ViewChild(ParamgestionpuestoComponent)
  tablaParamgestionpuestoComponent: ParamgestionpuestoComponent;
  @ViewChild(TrabajoequipoComponent)
  tablaTrabajoequipoComponent: TrabajoequipoComponent;
  @ViewChild(ComptecnicasComponent)
  tablaComptecnicasComponent: ComptecnicasComponent;
  @ViewChild(CompuniversalesComponent)
  tablaCompuniversalesComponent: CompuniversalesComponent;
  @ViewChild(QuejasciudadanoComponent)
  tablaQuejasCiudadano: QuejasciudadanoComponent;

  @ViewChild(JasperComponent)
  public reporte: JasperComponent;

  //lov
  @ViewChild(LovEvaluacionComponent)
  private lovEvaluacion: LovEvaluacionComponent;


  @ViewChild(LovPlantillaEvaluacionMrlComponent)
  private lovPlantilla: LovPlantillaEvaluacionMrlComponent;

  public lcalificaciones: SelectItem[] = [{ label: '...', value: null }];
  public indextab: number;

  public lcalificacioncualitativa: any = [];
  public lparametro: any = [];
  public nuevo = true;
  public finalizada = false;
  public aprobada = false;

  constructor(router: Router, dtoServicios: DtoServicios, private confirmationService: ConfirmationService) {
    super(router, dtoServicios, 'ABSTRACT', 'EVALUACIONMRL', false);
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {


    if (event.keyCode === KEY_CODE.FLECHA_ABAJO && event.ctrlKey) {
      if (this.indextab === 0)
        this.tablaParamgestionpuestoComponent.agregarlinea();
      if (this.indextab === 1)
        this.tablaConocimientoComponent.agregarlinea();
      if (this.indextab === 2)
        this.tablaComptecnicasComponent.agregarlinea();
      if (this.indextab === 5)
        this.tablaQuejasCiudadano.agregarlinea();

    }
  
  }

  ngOnInit() {
    this.indextab = 0;
    this.componentehijo = this;
    super.init(this.formFiltros);
    this.consultarCatalogos();
    this.actualizarcalificaciones();
    this.mcampos.califcualitativamente = "";
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

    if (this.estaVacio(this.mcampos.cevaluacion)) {
      this.mostrarMensajeError("NO SE HA DEFINIDO UNA EVALUACIÓN");
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    //FIJAR FILTROS EN CONSULTA
    this.fijarFiltrosConsulta();

    // DATOS CONSULTA
    const consParamg = this.tablaParamgestionpuestoComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaParamgestionpuestoComponent.alias, consParamg);

    const conPerConocimiento = this.tablaConocimientoComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaConocimientoComponent.alias, conPerConocimiento);

    const conCompUn = this.tablaCompuniversalesComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaCompuniversalesComponent.alias, conCompUn);

    const conCompet = this.tablaComptecnicasComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaComptecnicasComponent.alias, conCompet);

    const conTrab = this.tablaTrabajoequipoComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaTrabajoequipoComponent.alias, conTrab);

    const quejas = this.tablaQuejasCiudadano.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaQuejasCiudadano.alias, quejas);

    const evaluacion = this.tablaEvaluacion.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaEvaluacion.alias, evaluacion);
  }

  private fijarFiltrosConsulta() {

    this.tablaEvaluacion.mfiltros.cevaluacion = this.mcampos.cevaluacion;
    this.tablaParamgestionpuestoComponent.mfiltros.cevaluacion = this.mcampos.cevaluacion;
    this.tablaComptecnicasComponent.mfiltros.cevaluacion = this.mcampos.cevaluacion;
    this.tablaConocimientoComponent.mfiltros.cevaluacion = this.mcampos.cevaluacion;
    this.tablaCompuniversalesComponent.mfiltros.cevaluacion = this.mcampos.cevaluacion;
    this.tablaTrabajoequipoComponent.mfiltros.cevaluacion = this.mcampos.cevaluacion;
    this.tablaQuejasCiudadano.mfiltros.cevaluacion = this.mcampos.cevaluacion;
  }

  validaFiltrosConsulta(): boolean {
    return (
      this.tablaEvaluacion.validaFiltrosRequeridos() &&
      this.tablaConocimientoComponent.validaFiltrosRequeridos() &&
      this.tablaComptecnicasComponent.validaFiltrosRequeridos() &&
      this.tablaParamgestionpuestoComponent.validaFiltrosRequeridos() &&
      this.tablaCompuniversalesComponent.validaFiltrosRequeridos() &&
      this.tablaQuejasCiudadano.validaFiltrosRequeridos() &&
      this.tablaTrabajoequipoComponent.validaFiltrosRequeridos());
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {

    this.tablaParamgestionpuestoComponent.postQuery(resp);
    this.tablaConocimientoComponent.postQuery(resp);
    this.tablaComptecnicasComponent.postQuery(resp);
    this.tablaCompuniversalesComponent.postQuery(resp);
    this.tablaTrabajoequipoComponent.postQuery(resp);
    this.tablaEvaluacion.postQuery(resp);
    this.tablaQuejasCiudadano.postQuery(resp);
    this.consultarDatosfuncionario();
     
    this.nuevo = false;
    this.tablaEvaluacion.nuevo = false;
    this.finalizada = this.tablaEvaluacion.registro.finalizada;
    this.aprobada = this.tablaEvaluacion.registro.aprobada;
    //actualizacion calificaciones
    this.lcalificaciones[0].value = this.tablaEvaluacion.registro.actividadesesenciales;
    this.lcalificaciones[1].value = this.tablaEvaluacion.registro.conocimiento;
    this.lcalificaciones[2].value = this.tablaEvaluacion.registro.competenciatecnica;
    this.lcalificaciones[3].value = this.tablaEvaluacion.registro.competenciasuniversales;
    this.lcalificaciones[4].value = this.tablaEvaluacion.registro.trabajoequipo;
    this.lcalificaciones[5].value = this.tablaEvaluacion.registro.quejasciudadano;
    this.actualizarTotal();
  }
  // Fin CONSULTA *********************
  guardarCambios(): void {
    if (this.tablaEvaluacion.registro.comentario === undefined) {
      this.tablaEvaluacion.registro.comentario = "";
    }
    this.grabar();
  }
  finalizarIngreso(): void {
    let mensaje = this.validarGrabar();
    if (mensaje !== '') {
      super.mostrarMensajeError(mensaje);
      return;
      
    }
    this.rqMantenimiento.mdatos.cevaluacion= this.mcampos.cevaluacion;
    this.rqMantenimiento.mdatos.casignacion= this.mcampos.casignacion;
    this.rqMantenimiento.mdatos.estado= true;
    this.tablaEvaluacion.registro.finalizada= true;
    this.grabar();
  }
  eliminarIngreso(): void {
    this.rqMantenimiento.mdatos.eliminar = true;
    this.grabar();
  }
  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    let mensaje = this.validarGrabar();
    if (mensaje !== '') {
      super.mostrarMensajeError(mensaje);
      return;
    }
    if (this.nuevo) {
      this.tablaEvaluacion.registro.comentario = this.mcampos.comentario;
      this.tablaEvaluacion.selectRegistro(this.tablaEvaluacion.registro);
      this.tablaEvaluacion.actualizar();
      this.tablaEvaluacion.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    } else {
      this.tablaEvaluacion.registro.actualizar = true;
      this.tablaEvaluacion.registro.cusuariomod = this.dtoServicios.mradicacion.cusuario;
      this.tablaEvaluacion.registro.fmodificacion = this.fechaactual;
    }
    super.addMantenimientoPorAlias(this.tablaEvaluacion.alias, this.tablaEvaluacion.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.tablaConocimientoComponent.alias, this.tablaConocimientoComponent.getMantenimiento(2));
    super.addMantenimientoPorAlias(this.tablaComptecnicasComponent.alias, this.tablaComptecnicasComponent.getMantenimiento(3));
    super.addMantenimientoPorAlias(this.tablaParamgestionpuestoComponent.alias, this.tablaParamgestionpuestoComponent.getMantenimiento(4));
    super.addMantenimientoPorAlias(this.tablaCompuniversalesComponent.alias, this.tablaCompuniversalesComponent.getMantenimiento(5));
    super.addMantenimientoPorAlias(this.tablaTrabajoequipoComponent.alias, this.tablaTrabajoequipoComponent.getMantenimiento(6));
    super.addMantenimientoPorAlias(this.tablaQuejasCiudadano.alias, this.tablaQuejasCiudadano.getMantenimiento(7));
    super.grabar();
  }

  validarGrabar(): string {
    let mensaje: string = '';

    if (this.estaVacio(this.tablaEvaluacion.registro.cfuncionario)) {
      mensaje = 'SELECCIONE UN FUNCIONARIO A EVALUARNO <br/>';
    }
    if ((Number(this.tablaEvaluacion.registro.calificacion) === 0 || this.tablaEvaluacion.registro.calificacion == undefined || this.tablaEvaluacion.registro.calificacion == null) && this.nuevo == false) {
      mensaje += 'EL VALOR TOTAL NO ES VÁLIDO <br/>';
    }
    //VALIDACIONES EN SUBMODULOS
    if (this.tablaParamgestionpuestoComponent.validarRegistros().length != 0) {
      mensaje += this.tablaParamgestionpuestoComponent.validarRegistros() + ' <br/>';
    }
    if (this.tablaConocimientoComponent.validarRegistros().length != 0) {
      mensaje += this.tablaConocimientoComponent.validarRegistros() + ' <br/>';
    }
    if (this.tablaComptecnicasComponent.validarRegistros().length != 0) {
      mensaje += this.tablaComptecnicasComponent.validarRegistros() + ' <br/>';
    }
    if (this.tablaCompuniversalesComponent.validarRegistros().length != 0) {
      mensaje += this.tablaCompuniversalesComponent.validarRegistros() + ' <br/>';
    }
    if (this.tablaTrabajoequipoComponent.validarRegistros().length != 0) {
      mensaje += this.tablaTrabajoequipoComponent.validarRegistros() + ' <br/>';
    }
    
    return mensaje;
  }
  public crearDtoMantenimiento() {
    // No existe para el padre
  }


  public postCommit(resp: any) {
    //variable para no consultar si se elige una plantilla
    this.mcampos.validaConsulta = true;
    if (resp.cod === 'OK') {
      this.grabo = true;
      this.tablaEvaluacion.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaEvaluacion.alias));
      this.tablaComptecnicasComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaComptecnicasComponent.alias));
      this.tablaCompuniversalesComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaCompuniversalesComponent.alias));
      this.tablaConocimientoComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaConocimientoComponent.alias));
      this.tablaParamgestionpuestoComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaParamgestionpuestoComponent.alias));
      this.tablaQuejasCiudadano.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaQuejasCiudadano.alias));
      this.tablaTrabajoequipoComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaTrabajoequipoComponent.alias));
      this.mcampos.nevaluacion = this.tablaEvaluacion.mcampos.nfuncionario + " - " + this.tablaEvaluacion.mcampos.nperiodo;

      if (!this.estaVacio(resp.EVALUACION)) {
        this.mcampos.cevaluacion = resp.EVALUACION[0].cevaluacion;
        this.mcampos.nevaluacion = this.tablaEvaluacion.mcampos.nfuncionario + " - " + this.tablaEvaluacion.mcampos.nperiodo;
        this.tablaEvaluacion.registro.actualizar = true;
        this.nuevo = false;
        this.tablaEvaluacion.nuevo = false;
       this.aprobada = this.tablaEvaluacion.registro.aprobada;
        this.tablaConocimientoComponent.mcampos.cevaluacion = this.mcampos.cevaluacion;
        this.tablaComptecnicasComponent.mcampos.cevaluacion = this.mcampos.cevaluacion;
        this.tablaParamgestionpuestoComponent.mcampos.cevaluacion = this.mcampos.cevaluacion;
        this.tablaCompuniversalesComponent.mcampos.cevaluacion = this.mcampos.cevaluacion;
        this.tablaTrabajoequipoComponent.mcampos.cevaluacion = this.mcampos.cevaluacion;
        this.tablaQuejasCiudadano.mcampos.cevaluacion = this.mcampos.cevaluacion;
        this.mcampos.validaConsulta = false;
        this.consultarPlantilla();
      }
      if(!this.estaVacio(resp.FINALIZADA)){
        this.finalizada = resp.FINALIZADA;
      }
      if (this.mcampos.validaConsulta)
        this.consultar();

    }
  }
  valorcualitativo(): number {
    let total = this.tablaEvaluacion.registro.calificacion;
    if (total >= 90.5) {
      this.tablaEvaluacion.registro.aprobada = true;
      return 1;
    } else if (total >= 80.5 && total <= 90.4) {
      this.tablaEvaluacion.registro.aprobada = true;
      return 2;
    } else if (total >= 70.5 && total <= 80.4) {

      this.tablaEvaluacion.registro.aprobada = true;
      return 3;
    } else if (total >= 60.5 && total <= 70.4) {
      this.tablaEvaluacion.registro.aprobada = false;
      return 4;
    } else if (total > 0 && total <= 60.4) {
      this.tablaEvaluacion.registro.aprobada = false;
      return 5;
    }
    return 0;
  }
consultarCatalogos(): void {
  

    this.encerarConsultaCatalogos();
    const consultaDestreza = new Consulta('tthevaluaciondestreza', 'Y', 't.cdestreza', {}, {});
    consultaDestreza.cantidad = 500;
    this.addConsultaCatalogos('DESTREZACOMPETENCIA', consultaDestreza, this.tablaComptecnicasComponent.ldetrezatotal, this.llenarDestreza, '', this.componentehijo);

    const mfiltrosparam = { 'codigo': 'TACTIVACIONEVALMRL' };
    const consultarParametro = new Consulta('tthparametros', 'Y', 't.codigo', mfiltrosparam, null);
    consultarParametro.cantidad = 100;
    this.addConsultaCatalogos('TABL', consultarParametro, this.lparametro, super.llenaListaCatalogo, 'numero');

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1121;
    const consultaRelevancia = this.catalogoDetalle.crearDtoConsulta();
    consultaRelevancia.cantidad = 20;
    this.addConsultaCatalogos('RELEVANCIA', consultaRelevancia, this.tablaComptecnicasComponent.lrelevancia, this.llenarRelevancia, '', this.componentehijo);

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1122;
    const consultaNivel = this.catalogoDetalle.crearDtoConsulta();
    consultaNivel.cantidad = 50;
    this.addConsultaCatalogos('NIVELCONOCIMIENTO', consultaNivel, this.tablaConocimientoComponent.lnivel, super.llenaListaCatalogo, 'cdetalle');

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1123;
    const consultaNivelDesarrollo = this.catalogoDetalle.crearDtoConsulta();
    consultaNivelDesarrollo.cantidad = 50;
    this.addConsultaCatalogos('NIVELDESARROLLO', consultaNivelDesarrollo, this.tablaComptecnicasComponent.lniveldesarrollo, super.llenaListaCatalogo, 'cdetalle');

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1124;
    const consultaFrecuencia = this.catalogoDetalle.crearDtoConsulta();
    consultaFrecuencia.cantidad = 50;
    this.addConsultaCatalogos('FRECUENCIA', consultaFrecuencia, this.tablaCompuniversalesComponent.lfrecuencia, this.llenarFrecuencia, '', this.componentehijo);

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1131;
    const consultacalificacion = this.catalogoDetalle.crearDtoConsulta();
    consultacalificacion.cantidad = 50;
    this.addConsultaCatalogos('CALIFICACION', consultacalificacion, this.lcalificacioncualitativa, super.llenaListaCatalogo, 'cdetalle');
    this.ejecutarConsultaCatalogos();
  }

  public llenarDestreza(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    this.componentehijo.tablaComptecnicasComponent.ldetrezatotal = pListaResp;
    this.componentehijo.tablaCompuniversalesComponent.ldetrezatotal = pListaResp;
    this.componentehijo.tablaTrabajoequipoComponent.ldetrezatotal = pListaResp;

    for (let i in pListaResp) {
      let reg = pListaResp[i];
      this.componentehijo.tablaComptecnicasComponent.ldetreza.push({ label: reg.nombre, value: reg.cdestreza });
      this.componentehijo.tablaCompuniversalesComponent.ldetreza.push({ label: reg.nombre, value: reg.cdestreza });
      this.componentehijo.tablaTrabajoequipoComponent.ldetreza.push({ label: reg.nombre, value: reg.cdestreza });
    }
  }
  public llenarRelevancia(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    for (let i in pListaResp) {
      let reg = pListaResp[i];
      this.componentehijo.tablaComptecnicasComponent.lrelevancia.push({ label: reg.nombre, value: reg.cdetalle });
      this.componentehijo.tablaCompuniversalesComponent.lrelevancia.push({ label: reg.nombre, value: reg.cdetalle });
      this.componentehijo.tablaTrabajoequipoComponent.lrelevancia.push({ label: reg.nombre, value: reg.cdetalle });
    }
  }
  public llenarFrecuencia(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    for (let i in pListaResp) {
      let reg = pListaResp[i];
      this.componentehijo.tablaTrabajoequipoComponent.lfrecuencia.push({ label: reg.nombre, value: reg.cdetalle });
      this.componentehijo.tablaCompuniversalesComponent.lfrecuencia.push({ label: reg.nombre, value: reg.cdetalle });

    }
  }

  /**Muestra lov de evaluación */
  mostrarLovEvaluacion(): void {
    this.lovEvaluacion.showDialog();
    //this.lovPersonas.mfiltros.csocio = 1;
  }

  /**Retorno de lov de evaluación. */
  fijarLovEvaluacionSelec(reg: any): void {
    if (reg.registro !== undefined) {
      //actualización datos en Padre
      this.mcampos.cevaluacion = reg.registro.cevaluacion;
      this.mcampos.nevaluacion = reg.registro.mdatos.nombre +  " - " + reg.registro.mdatos.nperiodo;
      this.mcampos.cfuncionario = reg.registro.cfuncionario;
      this.mcampos.cperiodo = reg.registro.cperiodo;

      this.mcampos.fdesde = reg.registro.mdatos.fdesde;
      this.mcampos.fhasta = reg.registro.mdatos.fhasta;
      this.mcampos.jefecfuncionario= reg.registro.mdatos.jefecfuncionario;

      this.mcampos.nperiodo = reg.registro.mdatos.nperiodo;
      this.tablaParamgestionpuestoComponent.mcampos.adelantometas = reg.registro.mdatos.adelantometas;
      this.tablaConocimientoComponent.mcampos.cevaluacion = this.mcampos.cevaluacion;
      this.tablaComptecnicasComponent.mcampos.cevaluacion = this.mcampos.cevaluacion;
      this.tablaParamgestionpuestoComponent.mcampos.cevaluacion = this.mcampos.cevaluacion;
      this.tablaCompuniversalesComponent.mcampos.cevaluacion = this.mcampos.cevaluacion;
      this.tablaTrabajoequipoComponent.mcampos.cevaluacion = this.mcampos.cevaluacion;
      this.tablaQuejasCiudadano.mcampos.cevaluacion = this.mcampos.cevaluacion;

      this.tablaEvaluacion.mcampos.cfuncionario = reg.registro.cfuncionario;
      this.tablaEvaluacion.registro.calificacion = reg.registro.calificacion;
      this.consultar();

    }
  }


  actualizarTotal() {
    let total = 0;
    for (const i in this.lcalificaciones) {
      if (this.lcalificaciones.hasOwnProperty(i)) {
        const reg = this.lcalificaciones[i];
        if (reg.value !== undefined && reg.value !== null) {
          total += Number(reg.value);
        }
      }
    }
    this.tablaEvaluacion.registro.calificacion = total;
    let val = this.valorcualitativo();
    this.buscarCalificacion(val + "");
    this.tablaEvaluacion.registro.cdetallecalificacion = val + "";
  }
  buscarCalificacion(valor: string) {

    for (const i in this.lcalificacioncualitativa) {
      if (this.lcalificacioncualitativa.hasOwnProperty(i)) {
        const reg = this.lcalificacioncualitativa[i];
        if (reg.value === valor) {
          this.mcampos.califcualitativamente = reg.label;
          return;
        }

      }
    }
  }
  aplicaAdelanto(): number {
    let aplicaAdelanto = 0;
    let aplica = 0;
    let cont = 0;
    for (const i in this.tablaParamgestionpuestoComponent.lregistros) {
      if (this.tablaParamgestionpuestoComponent.lregistros.hasOwnProperty(i)) {
        const reg = this.tablaParamgestionpuestoComponent.lregistros[i];
        if (reg.nivelcumplimiento !== undefined && reg.nivelcumplimiento !== null) {

          if (Number(reg.cumplido) > Number(reg.metaperiodo)) {
            aplicaAdelanto = 1;
          } else {
            aplicaAdelanto = 0;
          }
          cont += 1;
          aplica += Number(aplicaAdelanto);
        }
      }
    }
    if (aplica == cont) {
      this.tablaEvaluacion.registro.adelantometas=true;
      this.tablaParamgestionpuestoComponent.mcampos.adelantometas=true;
      return 4;
    }
    this.tablaEvaluacion.registro.adelantometas=false;
    this.tablaParamgestionpuestoComponent.mcampos.adelantometas=false;
    return 0;
  }
  calcularTotalGestionPuesto() {
    let totalgestion = 0;
    let aplicaAdelanto = 0;
    for (const i in this.tablaParamgestionpuestoComponent.lregistros) {
      if (this.tablaParamgestionpuestoComponent.lregistros.hasOwnProperty(i)) {
        const reg = this.tablaParamgestionpuestoComponent.lregistros[i];
        if (reg.mdatos.total !== undefined && reg.mdatos.total !== null) {
          totalgestion += Number(reg.mdatos.total);
          aplicaAdelanto += Number(reg.mdatos.aplicaAdelanto);
        }
      }
    }

    this.tablaEvaluacion.registro.actividadesesenciales = this.round((totalgestion + this.aplicaAdelanto()), 1);
    this.lcalificaciones[0].value = this.tablaEvaluacion.registro.actividadesesenciales;
    this.actualizarTotal();
  }
  calcularTotalConocimiento(): void {
    if (this.estaVacio(this.tablaConocimientoComponent.mcampos.total)) {
      this.tablaEvaluacion.registro.conocimiento = 0;
    } else {
      this.tablaEvaluacion.registro.conocimiento = this.round(Number(this.tablaConocimientoComponent.mcampos.total), 1);
    }
    this.lcalificaciones[1].value = this.tablaEvaluacion.registro.conocimiento;
    this.actualizarTotal();

  }
  calcularTotalCompTecnicas(): void {
    if (this.estaVacio(this.tablaComptecnicasComponent.mcampos.total)) {
      this.tablaEvaluacion.registro.competenciatecnica = 0;
    } else {
      this.tablaEvaluacion.registro.competenciatecnica = this.round(Number(this.tablaComptecnicasComponent.mcampos.total), 1);
    }
    this.lcalificaciones[2].value = this.tablaEvaluacion.registro.competenciatecnica;
    this.actualizarTotal();

  }
  calcularTotalCompUniversal(): void {
    if (this.estaVacio(this.tablaCompuniversalesComponent.mcampos.total)) {
      this.tablaEvaluacion.registro.competenciasuniversales = 0;
    } else {
      this.tablaEvaluacion.registro.competenciasuniversales = this.round(Number(this.tablaCompuniversalesComponent.mcampos.total), 1);
    }
    this.lcalificaciones[3].value = this.tablaEvaluacion.registro.competenciasuniversales
    this.actualizarTotal();

  }
  calcularTotalTrabEquipo(): void {
    if (this.estaVacio(this.tablaTrabajoequipoComponent.mcampos.total)) {
      this.tablaEvaluacion.registro.trabajoequipo = 0;
    } else {
      this.tablaEvaluacion.registro.trabajoequipo = this.round(Number(this.tablaTrabajoequipoComponent.mcampos.total), 1);
    }
    this.lcalificaciones[4].value = this.tablaEvaluacion.registro.trabajoequipo
    this.actualizarTotal();
  }
  calcularTotalQuejas(): void {
    if (this.estaVacio(this.tablaQuejasCiudadano.mcampos.total)) {
      this.tablaEvaluacion.registro.quejasciudadano = 0;
    } else {
      this.tablaEvaluacion.registro.quejasciudadano = this.round(Number(this.tablaQuejasCiudadano.mcampos.total), 1);
    }
    this.lcalificaciones[5].value = this.tablaEvaluacion.registro.quejasciudadano
    this.actualizarTotal();
  }
  actualizarcalificaciones(): void {
    this.lcalificaciones.pop();
    this.lcalificaciones.push({ label: 'INDICADORES DE GESTION DE PUESTO', value: this.tablaEvaluacion.registro.actividadesesenciales });
    this.lcalificaciones.push({ label: 'CONOCIMIENTOS', value: this.tablaEvaluacion.registro.conocimiento });
    this.lcalificaciones.push({ label: 'COMPETENCIAS TÉCNICAS DELPUESTO', value: this.tablaEvaluacion.registro.competenciatecnica });
    this.lcalificaciones.push({ label: 'COMPETENCIAS UNIVERSALES', value: this.tablaEvaluacion.registro.competenciasuniversales });
    this.lcalificaciones.push({ label: 'TRABAJO EN EQUIPO, INICIATIVA Y LIDERAZGO', value: this.tablaEvaluacion.registro.trabajoequipo });
    this.lcalificaciones.push({ label: 'EVALUACIÓN DEL CIUDADANO', value: this.tablaEvaluacion.registro.quejasciudadano });
  }
  selectab(e) {
    this.indextab = e.index;
  }
  //MÉTODO PARA CONSULTAR DATOS DE LA PLANTILLA -- COMPONENTE DE CONSULTA
  consultarPlantilla() {
    this.rqConsulta.CODIGOCONSULTA = 'PLANTILLA';
    this.rqConsulta.mdatos.cplantilla = this.mcampos.cplantilla;
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuestaPlantilla(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }
  //MÉTODO QUE AGREGA EL NUEVO REGISTRO A LREGISTROS , ARGUMENTOS TABLA HEREDADA DE BASECOMPONENTS Y LA LISTA A AGREGAR
  private AgregarNuevo(tabla: BaseComponent, lista: any[]) {
    if (lista.length > 0) {
      for (const i in lista) {
        if (lista.hasOwnProperty(i)) {
          tabla.crearNuevo();
          const reg = lista[i];
          delete reg.cplantilla;
          delete reg.secuencia;
          reg.esnuevo = true;
          reg.idreg = Math.floor((Math.random() * 100000) + 1);
          reg.cevaluacion = this.mcampos.cevaluacion;
          tabla.selectRegistro(reg);
          tabla.actualizar();
        }
      }
    }
  }
  private manejaRespuestaPlantilla(resp: any) {
    this.lregistros = [];
    if (resp.cod === 'OK') {
      //METODO PARA AGREGAR REGISTROS NUEVOS DE LA PLANTILLA A LAS TABLAS
      this.AgregarNuevo(this.tablaParamgestionpuestoComponent, resp.GESTIONPUESTO);
      this.AgregarNuevo(this.tablaConocimientoComponent, resp.CONOCIMIENTO);
      this.AgregarNuevo(this.tablaComptecnicasComponent, resp.COMPTECNICAS);
      this.AgregarNuevo(this.tablaCompuniversalesComponent, resp.COMPUNIVERSALES);
      this.AgregarNuevo(this.tablaTrabajoequipoComponent, resp.TRABINCLI);

    }
  }
  //MÉTODO PARA REDONDEAR EL VALOR SEGUN LA ESPECIFICACIÓN DE LA EVALUACIÓN
  public round(value, precision): number {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }
  descargarReporte(){
    this.reporte.nombreArchivo = 'ReporteEvaluacion';
    // Agregar parametros
    this.reporte.parametros['@i_cevaluacion'] = this.mcampos.cevaluacion;
    this.reporte.parametros['archivoReporteUrl'] = '/CesantiaReportes/TalentoHumano/rptTthFormularioEvaluaciones';
    this.reporte.generaReporteCore();
  }

  consultarDatosfuncionario() {
    this.rqConsulta.CODIGOCONSULTA = 'FUNCEVALDATOS';
    this.rqConsulta.mdatos.cfuncionario = this.mcampos.cfuncionario;
    this.rqConsulta.mdatos.jefecfuncionario = this.mcampos.jefecfuncionario;
    
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuestaDatosCabecera(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }
  private manejaRespuestaDatosCabecera(resp: any) {
    this.lregistros = [];
    if (resp.cod === 'OK') {
      this.mcampos.ncargo = resp.CARGO;
      this.mcampos.ntitulo = resp.TITULO;
      this.mcampos.njefe = resp.JEFE.primernombre + " " + resp.JEFE.primerapellido;
      this.mcampos.nfuncionario = resp.FUNCIONARIO.primernombre + " " + resp.FUNCIONARIO.primerapellido;
    }
  }
  
 
}
