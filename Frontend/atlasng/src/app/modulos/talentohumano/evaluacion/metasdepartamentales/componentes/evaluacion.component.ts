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
import { MetaDetalleComponent } from '../submodulos/metadetalle/componentes/metadetalle.component';

//Lov
import { LovEvaluacionMetaComponent } from '../../../lov/evaluacionmeta/componentes/lov.evaluacionmeta.component'

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

  @ViewChild(LovEvaluacionMetaComponent)
  private lovMeta: LovEvaluacionMetaComponent;

  @ViewChild(MetaDetalleComponent)
  tablaMetaDetalle: MetaDetalleComponent;
  public indextab: number;

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
        this.tablaMetaDetalle.agregarlinea();



    }
   
  }


  ngOnInit() {
    this.indextab = 0;
    this.componentehijo = this;
    super.init(this.formFiltros);
    // this.consultarCatalogos();


  }

  ngAfterViewInit() {
  }
  calcularTotal() {
    let n = 0;
    let snumero = 0;
    for (const i in this.tablaMetaDetalle.lregistros) {
      if (this.tablaMetaDetalle.lregistros.hasOwnProperty(i)) {
        const reg = this.tablaMetaDetalle.lregistros[i];
        if (!this.estaVacio(reg.cumplimiento)) {
          snumero = snumero + reg.cumplimiento;
          n++;
        }
      }
    }
    let total = snumero / n;
    this.tablaEvaluacion.registro.promedio = this.redondear(total, 2);
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

    if (this.estaVacio(this.mcampos.cmeta)) {
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

    const evaluacion = this.tablaEvaluacion.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaEvaluacion.alias, evaluacion);

    const consParamg = this.tablaMetaDetalle.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaMetaDetalle.alias, consParamg);

  }

  private fijarFiltrosConsulta() {

    this.tablaEvaluacion.mfiltros.cmeta = this.mcampos.cmeta;
    this.tablaMetaDetalle.mfiltros.cmeta = this.mcampos.cmeta;

  }

  validaFiltrosConsulta(): boolean {
    return (
      this.tablaEvaluacion.validaFiltrosRequeridos() &&
      this.tablaMetaDetalle.validaFiltrosRequeridos()
    );
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.tablaMetaDetalle.postQuery(resp);
    this.tablaEvaluacion.postQuery(resp);


    this.nuevo = false;
    this.tablaEvaluacion.nuevo = false;
    this.finalizada = this.tablaEvaluacion.registro.finalizada;
    this.aprobada = this.tablaEvaluacion.registro.aprobada;
    //actualizacion calificaciones

  }
  // Fin CONSULTA *********************
  guardarCambios(): void {

    this.grabar();
  }
  finalizarIngreso(): void {
    let mensaje = this.validarGrabar();
    if (mensaje !== '') {
      super.mostrarMensajeError(mensaje);
      return;
    }

    this.tablaEvaluacion.registro.finalizada = true;
    this.tablaEvaluacion.registro.promedioreal = this.tablaEvaluacion.registro.promedio;
    this.rqMantenimiento.mdatos.finalizar = true;
    this.rqMantenimiento.mdatos.registro= this.tablaEvaluacion.registro;
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
      this.tablaEvaluacion.registro.detalle = this.mcampos.detalle;
      this.tablaEvaluacion.selectRegistro(this.tablaEvaluacion.registro);
      this.tablaEvaluacion.actualizar();
      this.tablaEvaluacion.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    } else {
      this.tablaEvaluacion.registro.actualizar = true;
      this.tablaEvaluacion.registro.detalle = this.mcampos.detalle;
      this.tablaEvaluacion.registro.cusuariomod = this.dtoServicios.mradicacion.cusuario;
      this.tablaEvaluacion.registro.fmodificacion = this.fechaactual;
    }
    super.addMantenimientoPorAlias(this.tablaEvaluacion.alias, this.tablaEvaluacion.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.tablaMetaDetalle.alias, this.tablaMetaDetalle.getMantenimiento(2));
    super.grabar();
  }

  validarGrabar(): string {
    let mensaje: string = '';

    if (this.estaVacio(this.tablaEvaluacion.registro.cfuncionario)) {
      mensaje = 'SELECCIONE SU META DEPARTAMENTAL ASIGNADA <br/>';
    }

    //VALIDACIONES EN SUBMODULOS
    if (this.tablaMetaDetalle.validarRegistros().length != 0) {
      mensaje += this.tablaMetaDetalle.validarRegistros() + ' <br/>';
    }

    return mensaje;
  }
  public crearDtoMantenimiento() {
    // No existe para el padre
  }


  public postCommit(resp: any) {
    //variable para no consultar si se elige una plantilla
    this.mcampos.validaConsulta = true;
    delete 
    this.rqMantenimiento.mdatos.finalizada;
    if (resp.cod === 'OK') {
      this.grabo = true;
      this.tablaEvaluacion.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaEvaluacion.alias));
      this.tablaMetaDetalle.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaMetaDetalle.alias));
     

      if (!this.estaVacio(resp.FINALIZADA)) {
        this.finalizada = resp.FINALIZADA;
        this.recargar();
      }
      if (this.mcampos.validaConsulta)
        this.consultar();

    }
  }



  /**Muestra lov de evaluación */
  mostrarLovEvaluacion(): void {
    this.lovMeta.showDialog();
  }

  /**Retorno de lov de evaluación. */
  fijarLovEvaluacionSelec(reg: any): void {
    if (reg.registro !== undefined) {
      //actualización datos en Padre
      this.mcampos.cevaluacion = reg.registro.cevaluacion;
      this.mcampos.nevaluacion = reg.registro.mdatos.nnombre + " " + reg.registro.mdatos.napellido + " - " + reg.registro.mdatos.nperiodo;
      this.mcampos.cfuncionario = reg.registro.cfuncionario;
      this.mcampos.cperiodo = reg.registro.cperiodo;
      this.tablaMetaDetalle.mcampos.cmeta = reg.registro.cmeta;
      this.tablaEvaluacion.mcampos.cfuncionario = reg.registro.cfuncionario;
      this.tablaEvaluacion.registro.calificacion = reg.registro.calificacion;

      this.consultar();

    }
  }


  selectab(e) {
    this.indextab = e.index;
  }


  //MÉTODO PARA REDONDEAR EL VALOR SEGUN LA ESPECIFICACIÓN DE LA EVALUACIÓN
  public round(value, precision): number {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  fijarLovMetaEvalSelec(reg: any): void {
    if (reg.registro !== undefined) {

      //ASIGNACIÓN DE DATOS AL FORMULARIO
      this.mcampos.nfuncionario = reg.registro.mdatos.nfuncionario;
      this.mcampos.cmeta = reg.registro.cmeta;

      this.tablaEvaluacion.registro.cfuncionario = reg.registro.cfuncionario;
      this.tablaEvaluacion.registro.cfuncionario = reg.registro.cfuncionario;
      this.tablaEvaluacion.registro.cperiodo = reg.registro.cperiodo;
      this.tablaEvaluacion.mfiltros.cmeta = reg.registro.cmeta;
      this.tablaMetaDetalle.mcampos.cmeta = reg.registro.cmeta;
      this.mcampos.nperiodo = reg.registro.mdatos.nperiodo;
      this.mcampos.ndepartamento = reg.registro.mdatos.ndepartamento;
      this.mcampos.detalle = reg.registro.detalle;
      this.mcampos.nempresa = reg.registro.mdatos.nempresa;

      this.consultar();


    }
  }
  mostrarLovMetaEval(): void {
     this.lovMeta.mfiltrosesp.cfuncionario = "=" + sessionStorage.getItem("cfuncionario") + " ";
   this.lovMeta.mfiltros.finalizada = false;
    this.lovMeta.showDialog();
  }
}
