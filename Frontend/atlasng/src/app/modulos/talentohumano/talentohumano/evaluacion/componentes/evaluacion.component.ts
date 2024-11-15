import { Radicacion } from './../../../../../util/servicios/dto.servicios';
import { Component, OnInit, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';

import { SelectItem } from 'primeng/primeng';
import { ConfirmationService } from 'primeng/primeng';

//submodulos

import { CabeceraComponent } from "../submodulos/cabecera/componentes/cabecera.component"
import { ParamgestionpuestoComponent } from "../submodulos/paramgestionpuesto/componentes/paramgestionpuesto.component"
import { ConocimientoComponent } from '../submodulos/conocimiento/conocimiento/conocimiento.component';
import { ComptecnicasComponent } from '../submodulos/comptecnicas/componentes/comptecnicas.component';
import { CompuniversalesComponent } from '../submodulos/compuniversales/componentes/compuniversales.component';


//Lov
import { LovPeriodoComponent } from '../../../lov/periodo/componentes/lov.periodo.component';
import { LovEvaluacionComponent } from '../../../lov/evaluacion/componentes/lov.evaluacion.component';
import { LovFuncionariosComponent } from '../../../lov/funcionarios/componentes/lov.funcionarios.component';
import { LovPlantillaEvaluacionMrlComponent } from '../../../lov/plantillaevaluacionmrl/componentes/lov.plantillaevaluacionmrl.component';


import { LovFuncionariosEvaluadosComponent } from '../../../lov/evaluados/componentes/lov.funcionarios.component';

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

  @ViewChild(ComptecnicasComponent)
  tablaComptecnicasComponent: ComptecnicasComponent;
  @ViewChild(CompuniversalesComponent)
  tablaCompuniversalesComponent: CompuniversalesComponent;


  //lov
  @ViewChild(LovEvaluacionComponent)
  private lovEvaluacion: LovEvaluacionComponent;

  public confirmacion = false;

  public lcalificaciones: any[] = [{ label: '...', value: null, ponderacion: null }];
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
      if (this.indextab === 3)
        this.tablaCompuniversalesComponent.agregarlinea();
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

    if (this.estaVacio(this.mcampos.casignacion)) {
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



    const evaluacion = this.tablaEvaluacion.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaEvaluacion.alias, evaluacion);
  }

  private fijarFiltrosConsulta() {

    this.tablaEvaluacion.mfiltros.casignacion = this.mcampos.casignacion;
    this.tablaParamgestionpuestoComponent.mfiltros.casignacion = this.mcampos.casignacion;
    this.tablaComptecnicasComponent.mfiltros.casignacion = this.mcampos.casignacion;
    this.tablaConocimientoComponent.mfiltros.casignacion = this.mcampos.casignacion;
    this.tablaCompuniversalesComponent.mfiltros.casignacion = this.mcampos.casignacion;

  }

  validaFiltrosConsulta(): boolean {
    return (
      this.tablaEvaluacion.validaFiltrosRequeridos() &&
      this.tablaConocimientoComponent.validaFiltrosRequeridos() &&
      this.tablaComptecnicasComponent.validaFiltrosRequeridos() &&
      this.tablaParamgestionpuestoComponent.validaFiltrosRequeridos() &&
      this.tablaCompuniversalesComponent.validaFiltrosRequeridos()
    );
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {

    this.tablaParamgestionpuestoComponent.postQuery(resp);
    this.tablaConocimientoComponent.postQuery(resp);
    this.tablaComptecnicasComponent.postQuery(resp);
    this.tablaCompuniversalesComponent.postQuery(resp);

    this.tablaEvaluacion.postQuery(resp);
    this.consultarDatosfuncionario();

    this.nuevo = false;
    this.tablaEvaluacion.nuevo = false;
    this.finalizada = this.tablaEvaluacion.registro.finalizada;
    this.aprobada = this.tablaEvaluacion.registro.aprobada;
    //actualizacion calificaciones
    if (this.tablaEvaluacion.registro.periodoprueba) {
      this.lcalificaciones[0].value = this.tablaEvaluacion.registro.caperiodoprueba;
      this.lcalificaciones[0].ponderacion = this.tablaEvaluacion.registro.pcaperiodoprueba;

    }

    this.lcalificaciones[Number(this.validarPeriodo()) + 0].value = this.tablaEvaluacion.registro.calidadoportunidad;
    this.lcalificaciones[Number(this.validarPeriodo()) + 1].value = this.tablaEvaluacion.registro.conocimientoespecifico;
    this.lcalificaciones[Number(this.validarPeriodo()) + 2].value = this.tablaEvaluacion.registro.competenciatecnica;
    this.lcalificaciones[Number(this.validarPeriodo()) + 3].value = this.tablaEvaluacion.registro.competenciaconductual;
    
    this.lcalificaciones[Number(this.validarPeriodo()) + 0].ponderacion = this.tablaEvaluacion.registro.pcalidadoportunidad;
    this.lcalificaciones[Number(this.validarPeriodo()) + 1].ponderacion = this.tablaEvaluacion.registro.pconocimientoespecifico;
    this.lcalificaciones[Number(this.validarPeriodo()) + 2].ponderacion = this.tablaEvaluacion.registro.pcompetenciatecnica;
    this.lcalificaciones[Number(this.validarPeriodo()) + 3].ponderacion = this.tablaEvaluacion.registro.pcompetenciaconductual;

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
    this.rqMantenimiento.mdatos.cevaluacion = this.mcampos.cevaluacion;
    this.rqMantenimiento.mdatos.casignacion = this.mcampos.casignacion;
    this.rqMantenimiento.mdatos.total = this.tablaEvaluacion.registro.calificacion;

    this.rqMantenimiento.mdatos.estado = true;
    this.tablaEvaluacion.registro.finalizada = true;
    this.tablaEvaluacion.registro.direstado = true;
    this.rqMantenimiento.mdatos.finalizadageneral = true;

    this.grabar();
  }
  eliminarIngreso(): void {
    this.rqMantenimiento.mdatos.eliminar = true;
    this.grabar();
  }
  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    if (this.estaVacio(this.mcampos.cevaluacion)) {
      super.mostrarMensajeError("NO SE HA DEFINIDO UNA ASIGNACIÓN DE EVALUACIÓN");
      return;
    }
    this.lmantenimiento = []; // Encerar Mantenimiento
    let mensaje = this.validarGrabar();
    if (mensaje !== '') {
      super.mostrarMensajeError(mensaje);
      return;
    }
    if (this.nuevo) {
      this.tablaEvaluacion.crearNuevoRegistro();
      this.tablaEvaluacion.registro.comentario = this.registro.comentario;
      this.tablaEvaluacion.selectRegistro(this.tablaEvaluacion.registro);
      this.tablaEvaluacion.actualizar();
      this.tablaEvaluacion.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    } else {
      this.tablaEvaluacion.registro.actualizar = true;
      this.tablaEvaluacion.registro.comentario = this.registro.comentario;
      this.tablaEvaluacion.registro.cusuariomod = this.dtoServicios.mradicacion.cusuario;
      this.tablaEvaluacion.registro.fmodificacion = this.fechaactual;
    }
    super.addMantenimientoPorAlias(this.tablaEvaluacion.alias, this.tablaEvaluacion.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.tablaConocimientoComponent.alias, this.tablaConocimientoComponent.getMantenimiento(2));
    super.addMantenimientoPorAlias(this.tablaComptecnicasComponent.alias, this.tablaComptecnicasComponent.getMantenimiento(3));
    super.addMantenimientoPorAlias(this.tablaParamgestionpuestoComponent.alias, this.tablaParamgestionpuestoComponent.getMantenimiento(4));
    super.addMantenimientoPorAlias(this.tablaCompuniversalesComponent.alias, this.tablaCompuniversalesComponent.getMantenimiento(5));
    super.grabar();
  }

  validarGrabar(): string {
    let mensaje: string = '';

    if (this.estaVacio(this.tablaEvaluacion.registro.cfuncionario)) {
      mensaje = 'SELECCIONE UN FUNCIONARIO A EVALUAR <br/>';
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
      this.mcampos.nevaluacion = this.tablaEvaluacion.mcampos.nfuncionario + " - " + this.tablaEvaluacion.mcampos.nperiodo;

      if (!this.estaVacio(resp.EVALUACION)) {
        this.mcampos.casignacion = resp.EVALUACION[0].casignacion;
        this.mcampos.nevaluacion = this.tablaEvaluacion.mcampos.nfuncionario + " - " + this.tablaEvaluacion.mcampos.nperiodo;
        this.tablaEvaluacion.registro.actualizar = true;
        this.nuevo = false;
        this.tablaEvaluacion.nuevo = false;
        this.aprobada = this.tablaEvaluacion.registro.aprobada;
        this.tablaConocimientoComponent.mcampos.casignacion = this.mcampos.casignacion;
        this.tablaComptecnicasComponent.mcampos.casignacion = this.mcampos.casignacion;
        this.tablaParamgestionpuestoComponent.mcampos.casignacion = this.mcampos.casignacion;
        this.tablaCompuniversalesComponent.mcampos.casignacion = this.mcampos.casignacion;
        this.mcampos.validaConsulta = false;
        // this.consultarPlantilla();
      }
      if (!this.estaVacio(resp.FINALIZADA)) {
        this.finalizada = resp.FINALIZADA;
        this.recargar();
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


    const mfiltrosparam = { 'codigo': 'TACTIVACIONEVALMRL' };
    const consultarParametro = new Consulta('tthparametros', 'Y', 't.codigo', mfiltrosparam, null);
    consultarParametro.cantidad = 100;
    this.addConsultaCatalogos('TABL', consultarParametro, this.lparametro, super.llenaListaCatalogo, 'numero');

    const mfiltrosparam2 = { 'codigo': 'CODIGOEMPRESA' };
    const consultarParametro2 = new Consulta('tthparametros', 'Y', 't.codigo', mfiltrosparam2, null);
    consultarParametro2.cantidad = 1;
    this.addConsultaCatalogos('TABL2', consultarParametro2, this.tablaEvaluacion.cinfoempresa, super.llenaListaCatalogo, 'numero', false, false);

    const mfiltrosparam3 = { 'codigo': 'CODIGOVERSIONEVALFUN' };
    const consultarParametro3 = new Consulta('tthparametros', 'Y', 't.codigo', mfiltrosparam3, null);
    consultarParametro3.cantidad = 1;
    this.addConsultaCatalogos('TABL3', consultarParametro3, this.tablaEvaluacion.cversion, super.llenaListaCatalogo, 'numero', false, false);


    const mfiltrosparamcalif = { 'tipocdetalle': 'AS-CAL' };
    const consultaParametrosCalificacion = new Consulta('tthparametroscalificacion', 'Y', 't.cparametro', mfiltrosparamcalif, {});
    consultaParametrosCalificacion.cantidad = 500;
    this.addConsultaCatalogos('CALIF-CALIDAD', consultaParametrosCalificacion, this.tablaParamgestionpuestoComponent.lcalidad, this.llenarCalidad, '', this.componentehijo, false);

    const mfiltrosparamoport = { 'tipocdetalle': 'AS-OPT' };
    const consultaParametrosOportunidad = new Consulta('tthparametroscalificacion', 'Y', 't.cparametro', mfiltrosparamoport, {});
    consultaParametrosOportunidad.cantidad = 500;
    this.addConsultaCatalogos('CALIF-OPORT', consultaParametrosOportunidad, this.tablaParamgestionpuestoComponent.lcalidad, this.llenarOportunidad, '', this.componentehijo, false);

    const mfiltrosparamperfil = { 'tipocdetalle': 'PRF-PU' };
    const consultaParametrosPerfil = new Consulta('tthparametroscalificacion', 'Y', 't.cparametro', mfiltrosparamperfil, {});
    consultaParametrosPerfil.cantidad = 500;
    this.addConsultaCatalogos('CALIF-PERFIL', consultaParametrosPerfil, this.tablaConocimientoComponent.lpuntaje, this.llenarPerfil, '', this.componentehijo, false);

    const mfiltrosparamcomtec = { 'tipocdetalle': 'CMP-TE' };
    const consultaParametroscomtec = new Consulta('tthparametroscalificacion', 'Y', 't.cparametro', mfiltrosparamcomtec, {});
    consultaParametroscomtec.cantidad = 500;
    this.addConsultaCatalogos('CALIF-COMP-TEC', consultaParametroscomtec, this.tablaComptecnicasComponent.lpuntaje, this.llenarPuntajecomtec, '', this.componentehijo, false);

    const mfiltrosparamcomcon = { 'tipocdetalle': 'CMP-CO' };
    const consultaParametroscomcon = new Consulta('tthparametroscalificacion', 'Y', 't.cparametro', mfiltrosparamcomcon, {});
    consultaParametroscomcon.cantidad = 500;
    this.addConsultaCatalogos('CALIF-COMP-CON', consultaParametroscomcon, this.tablaCompuniversalesComponent.lpuntaje, this.llenarPuntajecomcon, '', this.componentehijo, false);

    //CONSULTA COMPETENCIAS TÉCNICAS Y CONDUCTUALES
    const consultaCompetencia = new Consulta('tthcompetencia', 'Y', 't.ccompetencia', {}, {});
    consultaCompetencia.cantidad = 500;
    this.addConsultaCatalogos('DESTREZACOMPETENCIA', consultaCompetencia, this.tablaComptecnicasComponent.ldetrezatotal, this.llenarCompetencia, '', this.componentehijo);

    const consultaCompetenciaDetalle = new Consulta('tthcompetenciadetalle', 'Y', 't.ccompetenciadetalle', {}, {});
    consultaCompetenciaDetalle.cantidad = 500;
    this.addConsultaCatalogos('DESTREZACOMPETENCIADETALLE', consultaCompetenciaDetalle, this.tablaComptecnicasComponent.ldetrezatotal, this.llenarCompetenciaDetalle, '', this.componentehijo);
    consultaCompetenciaDetalle.addSubquery('tthcompetencia', 'tipocdetalle', 'ntipo', 'i.ccompetencia = t.ccompetencia');
    consultaCompetenciaDetalle.addSubquery('TgencatalogoDetalle', 'nombre', 'nnivel', 'i.ccatalogo=nivelccatalogo and i.cdetalle=nivelcdetalle');


    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1121;
    const consultaRelevancia = this.catalogoDetalle.crearDtoConsulta();
    consultaRelevancia.cantidad = 20;
    this.addConsultaCatalogos('NIVEL', consultaRelevancia, this.tablaComptecnicasComponent.lnivel, this.llenarNivel, '', this.componentehijo);

    this.ejecutarConsultaCatalogos();
  }
  public llenarNivel(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    for (let i in pListaResp) {
      let reg = pListaResp[i];
      this.componentehijo.tablaComptecnicasComponent.lnivel.push({ label: reg.nombre, value: reg.cdetalle });
      this.componentehijo.tablaCompuniversalesComponent.lnivel.push({ label: reg.nombre, value: reg.cdetalle });
    }

  }


  public llenarCalidad(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    this.componentehijo.tablaParamgestionpuestoComponent.lcalidadd = pListaResp;
    let max = 0;
    for (let i in pListaResp) {
      let reg = pListaResp[i];
      this.componentehijo.tablaParamgestionpuestoComponent.lcalidad.push({ label: reg.nombre, value: reg.cparametro });
      if (reg.ponderacion > max) {
        max = reg.ponderacion;
      }
    }
    this.componentehijo.tablaParamgestionpuestoComponent.maxpcalidad = max;

  }
  public llenarCompetencia(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {

    for (let i in pListaResp) {
      let reg = pListaResp[i];
      if (reg.tipocdetalle === 'CP-TEC') {
        this.componentehijo.tablaComptecnicasComponent.ldetreza.push({ label: reg.nombre, value: reg.ccompetencia });

      } else if (reg.tipocdetalle === 'CP-CON') {
        this.componentehijo.tablaCompuniversalesComponent.ldetreza.push({ label: reg.nombre, value: reg.ccompetencia });

      }

    }
  }

  public llenarCompetenciaDetalle(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    for (let i in pListaResp) {
      let reg = pListaResp[i];
      if (reg.mdatos.ntipo === 'CP-TEC') {
        this.componentehijo.tablaComptecnicasComponent.ldetrezatotal.push(reg);

      } else if (reg.mdatos.ntipo === 'CP-CON') {
        this.componentehijo.tablaCompuniversalesComponent.ldetrezatotal.push(reg);
      }
    }
  }
  public llenarPuntajecomtec(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    this.componentehijo.tablaComptecnicasComponent.lpuntajed = pListaResp;
    let max = 0;
    for (let i in pListaResp) {
      let reg = pListaResp[i];
      this.componentehijo.tablaComptecnicasComponent.lpuntaje.push({ label: reg.nombre, value: reg.cparametro });
      if (reg.ponderacion > max) {
        max = reg.ponderacion;
      }
    }
    this.componentehijo.tablaComptecnicasComponent.maxpuntaje = max;
  }

  public llenarPuntajecomcon(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    this.componentehijo.tablaCompuniversalesComponent.lpuntajed = pListaResp;
    let max = 0;
    for (let i in pListaResp) {
      let reg = pListaResp[i];
      this.componentehijo.tablaCompuniversalesComponent.lpuntaje.push({ label: reg.nombre, value: reg.cparametro });
      if (reg.ponderacion > max) {
        max = reg.ponderacion;
      }
    }
    this.componentehijo.tablaCompuniversalesComponent.maxpuntaje = max;
  }
  public llenarPerfil(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    this.componentehijo.tablaConocimientoComponent.lpuntajed = pListaResp;
    let max = 0;
    for (let i in pListaResp) {
      let reg = pListaResp[i];
      this.componentehijo.tablaConocimientoComponent.lpuntaje.push({ label: reg.nombre, value: reg.cparametro });
      if (reg.ponderacion > max) {
        max = reg.ponderacion;
      }
    }
    this.componentehijo.tablaConocimientoComponent.maxpuntaje = max;
  }
  public llenarOportunidad(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    this.componentehijo.tablaParamgestionpuestoComponent.loportunidadd = pListaResp;
    let max = 0;
    for (let i in pListaResp) {
      let reg = pListaResp[i];
      this.componentehijo.tablaParamgestionpuestoComponent.loportunidad.push({ label: reg.nombre, value: reg.cparametro });
      if (reg.ponderacion > max) {
        max = reg.ponderacion;
      }
    }
    this.componentehijo.tablaParamgestionpuestoComponent.maxpoportunidad = max;
  }


  /**Muestra lov de evaluación */
  mostrarLovEvaluacion(): void {
    this.lovEvaluacion.showDialog();
  }

  /**Retorno de lov de evaluación. */
  fijarLovEvaluacionSelec(reg: any): void {
    if (reg.registro !== undefined) {
      //actualización datos en Padre
      this.mcampos.cevaluacion = reg.registro.casignacion;
      this.mcampos.nevaluacion = reg.registro.mdatos.nnombre + " " + reg.registro.mdatos.napellido + " - " + reg.registro.mdatos.nperiodo;
      this.mcampos.cfuncionario = reg.registro.cfuncionario;
      this.mcampos.cperiodo = reg.registro.cperiodo;

      this.tablaParamgestionpuestoComponent.periodoprueba = reg.registro.periodoprueba;
      this.tablaConocimientoComponent.mcampos.casignacion = this.mcampos.casignacion;
      this.tablaComptecnicasComponent.mcampos.casignacion = this.mcampos.casignacion;
      this.tablaParamgestionpuestoComponent.mcampos.casignacion = this.mcampos.casignacion;
      this.tablaCompuniversalesComponent.mcampos.casignacion = this.mcampos.casignacion;

      this.tablaEvaluacion.mcampos.cfuncionario = reg.registro.cfuncionario;
      this.tablaEvaluacion.registro.calificacion = reg.registro.calificacion;
      this.consultarDatosfuncionario();
      this.consultar();

    }
  }






  actualizarTotal() {
    let total = 0;
    let totalponderacion = 0;
    for (const i in this.lcalificaciones) {
      if (this.lcalificaciones.hasOwnProperty(i)) {
        const reg = this.lcalificaciones[i];
        if (reg.value !== undefined && reg.value !== null) {
          total += Number(reg.value);
        }
        if (reg.ponderacion !== undefined && reg.ponderacion !== null) {
          totalponderacion += Number(reg.ponderacion);
        }
      }
    }
    this.tablaEvaluacion.registro.calificacion = total;
    this.tablaEvaluacion.registro.promedio = totalponderacion;
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
  aplicaAdelanto() {
    this.tablaParamgestionpuestoComponent.periodoprueba = this.mcampos.periodoprueba;
  }



  calcularTotalGestionPuesto() {
    let total = 0;
    let totalpp = 0;
    let totalppon = 0;
    let aplicaAdelanto = 0;
    for (const i in this.tablaParamgestionpuestoComponent.lregistros) {
      if (this.tablaParamgestionpuestoComponent.lregistros.hasOwnProperty(i)) {
        const reg = this.tablaParamgestionpuestoComponent.lregistros[i];
        if (reg.calificacion !== undefined && reg.calificacion !== null) {
          total += Number(reg.calificacion);

        }
        if (reg.promedio !== undefined && reg.promedio !== null) {
          totalpp += Number(reg.promedio);

        }
        if (reg.mdatos.calificacionp !== undefined && reg.mdatos.calificacionp !== null) {
          totalppon += Number(reg.mdatos.calificacionp);

        }
      }
    }
    if (this.tablaEvaluacion.registro.periodoprueba) {
      this.tablaEvaluacion.registro.caperiodoprueba = totalpp;
      this.lcalificaciones[0].value = totalpp;
      this.lcalificaciones[0].ponderacion = this.redondear((totalpp * 0.40), 2);
      this.tablaEvaluacion.registro.pcaperiodoprueba = this.lcalificaciones[0].ponderacion;
    }
    const index = Number(this.validarPeriodo()) + 0;
    this.tablaEvaluacion.registro.calidadoportunidad = this.round((total), 2);
    this.lcalificaciones[index].value = this.tablaEvaluacion.registro.calidadoportunidad;
    this.lcalificaciones[index].ponderacion = this.redondear((this.round((totalppon), 2) * 0.50), 2);
    this.tablaEvaluacion.registro.pcalidadoportunidad = this.lcalificaciones[index].ponderacion;
    this.actualizarTotal();
  }
  validarPeriodo(): Number {
    return (this.tablaEvaluacion.registro.periodoprueba) ? 1 : 0;
  }
  calcularTotalConocimiento(): void {

    let total = 0;
    let totalp = 0;

    for (const i in this.tablaConocimientoComponent.lregistros) {
      if (this.tablaConocimientoComponent.lregistros.hasOwnProperty(i)) {
        const reg = this.tablaConocimientoComponent.lregistros[i];
        if (reg.promedio !== undefined && reg.promedio !== null) {
          total += Number(reg.promedio);

        }
        if (reg.calificacion !== undefined && reg.calificacion !== null) {
          totalp += Number(reg.calificacion);

        }
      }
    }

    this.tablaEvaluacion.registro.conocimientoespecifico = this.round((totalp), 2);
    this.lcalificaciones[Number(this.validarPeriodo()) + 1].value = this.tablaEvaluacion.registro.conocimientoespecifico;
    this.lcalificaciones[Number(this.validarPeriodo()) + 1].ponderacion = this.redondear((this.round((total), 2) * 0.30), 2);
    this.tablaEvaluacion.registro.pconocimientoespecifico = this.lcalificaciones[Number(this.validarPeriodo()) + 1].ponderacion;

    this.actualizarTotal();
  }
  calcularTotalCompTecnicas(): void {
    let total = 0;
    let totalp = 0;

    for (const i in this.tablaComptecnicasComponent.lregistros) {
      if (this.tablaComptecnicasComponent.lregistros.hasOwnProperty(i)) {
        const reg = this.tablaComptecnicasComponent.lregistros[i];
        if (reg.promedio !== undefined && reg.promedio !== null) {
          total += Number(reg.promedio);

        }
        if (reg.calificacion !== undefined && reg.calificacion !== null) {
          totalp += Number(reg.calificacion);

        }
      }
    }
    this.tablaEvaluacion.registro.competenciatecnica = this.round((totalp), 2);
    this.lcalificaciones[Number(this.validarPeriodo()) + 2].value = this.tablaEvaluacion.registro.competenciatecnica;
    this.lcalificaciones[Number(this.validarPeriodo()) + 2].ponderacion = this.redondear((this.round((total), 2) * 0.10), 2);

    this.tablaEvaluacion.registro.pcompetenciatecnica = this.lcalificaciones[Number(this.validarPeriodo()) + 2].ponderacion;
    this.actualizarTotal();

  }
  calcularTotalCompUniversal(): void {
    let total = 0;
    let totalp = 0;

    for (const i in this.tablaCompuniversalesComponent.lregistros) {
      if (this.tablaCompuniversalesComponent.lregistros.hasOwnProperty(i)) {
        const reg = this.tablaCompuniversalesComponent.lregistros[i];
        if (reg.promedio !== undefined && reg.promedio !== null) {
          total += Number(reg.promedio);

        }
        if (reg.calificacion !== undefined && reg.calificacion !== null) {
          totalp += Number(reg.calificacion);

        }
      }
    }
    this.tablaEvaluacion.registro.competenciaconductual = this.round((totalp), 2);
    this.lcalificaciones[Number(this.validarPeriodo()) + 3].value = this.tablaEvaluacion.registro.competenciaconductual;
    this.lcalificaciones[Number(this.validarPeriodo()) + 3].ponderacion = this.redondear((this.round((total), 2) * 0.10), 2);
    this.tablaEvaluacion.registro.pcompetenciaconductual = this.lcalificaciones[Number(this.validarPeriodo()) + 3].ponderacion;
    this.actualizarTotal();

  }


  actualizarcalificaciones(): void {

    let lcalificacionestemp: any[] = [{ label: '...', value: null, promedio: null }];


    if (this.tablaEvaluacion.registro.periodoprueba) {
      lcalificacionestemp.push({ label: 'CUMPLIMIENTO DE METAS INDIVIDUALES', value: this.tablaEvaluacion.registro.caperiodoprueba,ponderacion:this.tablaEvaluacion.registro.pcaperiodoprueba });
    }
    lcalificacionestemp.push({ label: 'CALIDAD Y OPORTUNIDAD DE LOS PRODUCTOS/SERVICIOS ENTREGADOS', value: this.tablaEvaluacion.registro.actividadesesenciales,ponderacion:this.tablaEvaluacion.registro.pcalidadoportunidad });
    lcalificacionestemp.push({ label: 'CONOCIMIENTOS ESPECÍFICOS', value: this.tablaEvaluacion.registro.conocimiento,ponderacion:this.tablaEvaluacion.registro.pconocimientoespecifico });
    lcalificacionestemp.push({ label: 'COMPETENCIAS TÉCNICAS', value: this.tablaEvaluacion.registro.competenciatecnica,ponderacion:this.tablaEvaluacion.registro.competenciatecnica });
    lcalificacionestemp.push({ label: 'COMPETENCIAS CONDUCTUALES', value: this.tablaEvaluacion.registro.competenciasuniversales,ponderacion:this.tablaEvaluacion.registro.pcompetenciaconductual });
    lcalificacionestemp.shift();
    this.lcalificaciones = lcalificacionestemp;
  }
  selectab(e) {
    this.indextab = e.index;
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

  //MÉTODO PARA REDONDEAR EL VALOR SEGUN LA ESPECIFICACIÓN DE LA EVALUACIÓN
  public round(value, precision): number {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
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

  fijarLovFuncionariosEvalSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cfuncionario = reg.registro.cfuncionario;
      this.tablaEvaluacion.registro.cfuncionario = reg.registro.cfuncionario;
      this.tablaEvaluacion.registro.cperiodo = reg.registro.cperiodo;
      this.tablaEvaluacion.registro.cevaluacion = reg.registro.cevaluacion;
      this.tablaEvaluacion.registro.jefecfuncionario = reg.registro.jefecfuncionario;
      this.tablaEvaluacion.registro.ccargo = reg.registro.mdatos.ccargo;
      this.tablaEvaluacion.registro.cgrupo = reg.registro.mdatos.cgrupo;
      this.tablaEvaluacion.registro.cdepartamento = reg.registro.mdatos.cdepartamento;
      this.tablaEvaluacion.registro.periodoprueba = reg.registro.periodoprueba;
      this.mcampos.periodoprueba = reg.registro.periodoprueba;


      this.mcampos.nfuncionario = reg.registro.nfuncionario;
      this.mcampos.nperiodo = reg.registro.mdatos.nperiodo;
      this.mcampos.fdesde = reg.registro.mdatos.fdesde;
      this.mcampos.fhasta = reg.registro.mdatos.fhasta;
      this.mcampos.cevaluacion = reg.registro.cevaluacion;

      this.mcampos.cplantilla = reg.registro.cplantilla;
      this.mcampos.casignacion = reg.registro.casignacion;
      this.mcampos.jefecfuncionario = reg.registro.jefecfuncionario;

      this.tablaEvaluacion.mcampos.nperiodo = reg.registro.mdatos.nperiodo;
      this.tablaEvaluacion.mcampos.fdesde = reg.registro.mdatos.fdesde;
      this.tablaEvaluacion.mcampos.fhasta = reg.registro.mdatos.fhasta;
      this.tablaEvaluacion.periodoprueba = reg.registro.periodoprueba;
      this.tablaParamgestionpuestoComponent.periodoprueba = reg.registro.periodoprueba;
      this.tablaConocimientoComponent.registro.periodoprueba = reg.registro.periodoprueba;
      this.actualizarcalificaciones();
      this.mcampos.casignacion = reg.registro.mdatos.cevaluacions;

      if (!this.estaVacio(this.mcampos.casignacion)) {
        this.tablaConocimientoComponent.mcampos.casignacion = this.mcampos.casignacion;
        this.tablaComptecnicasComponent.mcampos.casignacion = this.mcampos.casignacion;
        this.tablaParamgestionpuestoComponent.mcampos.casignacion = this.mcampos.casignacion;
        this.tablaCompuniversalesComponent.mcampos.casignacion = this.mcampos.casignacion;

        this.consultar();
      } else {
        this.confirmationService.confirm({
          message: 'Está seguro de iniciar la evaluación?',
          header: 'Evaluación',
          icon: 'fa fa-question-circle',
          accept: () => {
           
            this.grabar();
          },
          reject: () => {
          }
        });
       

      }

    }
  }
  mostrarLovFuncionariosEval(): void {
    if (this.estaVacio(sessionStorage.getItem("cfuncionario")) || sessionStorage.getItem("cfuncionario") === '0') {
      super.mostrarMensajeError("NO ESTA AUTORIZADO PARA REALIZAR ESTA EVALUACIÓN");
      return;
    }
    this.lovFuncionariosEval.mfiltrosesp.jefecfuncionario = "=" + sessionStorage.getItem("cfuncionario") + " ";
    this.lovFuncionariosEval.mfiltros.estado = true;
    this.lovFuncionariosEval.mfiltros.finalizada = false;
    this.lovFuncionariosEval.showDialog();
  }
}
