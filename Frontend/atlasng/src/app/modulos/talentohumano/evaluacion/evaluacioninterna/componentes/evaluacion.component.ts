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

import { CabeceraComponent } from "../submodulos/cabecera/componentes/cabecera.component";
import { InternaDetalleComponent } from '../submodulos/internadetalle/componentes/internadetalle.component';

//Lov
import { LovMatrizCorrelacionDComponent } from '../../../lov/matrizcorrelaciondetalle/componentes/lov.matrizcorrelaciondetalle.component';
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

  @ViewChild(LovMatrizCorrelacionDComponent)
  private lovFuncionariosEval: LovMatrizCorrelacionDComponent;

  @ViewChild(InternaDetalleComponent)
  tablaInternaDetalle: InternaDetalleComponent;

  public confirmacion = false;

  public lcalificaciones: SelectItem[] = [{ label: '...', value: null }];

  public latributos: any = [];
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
        this.tablaInternaDetalle.agregarlinea();


    }

  }

  ngOnInit() {
    this.indextab = 0;
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

    if (this.estaVacio(this.mcampos.cinterna)) {
      this.mostrarMensajeError("NO SE HA DEFINIDO UNA EVALUACIÓN INTERNA");
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    //FIJAR FILTROS EN CONSULTA
    this.fijarFiltrosConsulta();

    // DATOS CONSULTA
    const consInternaDetalle = this.tablaInternaDetalle.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaInternaDetalle.alias, consInternaDetalle);


    const evaluacion = this.tablaEvaluacion.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaEvaluacion.alias, evaluacion);
  }

  private fijarFiltrosConsulta() {

    this.tablaEvaluacion.mfiltros.cinterna = this.mcampos.cinterna;
    this.tablaInternaDetalle.mfiltros.cinterna = this.mcampos.cinterna;
  }

  validaFiltrosConsulta(): boolean {
    return (
      this.tablaEvaluacion.validaFiltrosRequeridos() &&
      this.tablaInternaDetalle.validaFiltrosRequeridos());
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {

    this.tablaEvaluacion.postQuery(resp);
    this.tablaInternaDetalle.postQuery(resp);
    this.nuevo = false;
    this.tablaEvaluacion.nuevo = false;
    this.finalizada = this.tablaEvaluacion.registro.finalizada;

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
    this.tablaEvaluacion.registro.finalizada = true;

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
      this.tablaEvaluacion.registro.comentario = this.registro.comentario;
      this.tablaEvaluacion.selectRegistro(this.tablaEvaluacion.registro);
      this.tablaEvaluacion.actualizar();
      this.tablaEvaluacion.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    } else {
      this.tablaEvaluacion.registro.actualizar = true;
      this.tablaEvaluacion.registro.cusuariomod = this.dtoServicios.mradicacion.cusuario;
      this.tablaEvaluacion.registro.fmodificacion = this.fechaactual;
    }
    super.addMantenimientoPorAlias(this.tablaEvaluacion.alias, this.tablaEvaluacion.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.tablaInternaDetalle.alias, this.tablaInternaDetalle.getMantenimiento(2));
    super.grabar();
  }

  validarGrabar(): string {
    let mensaje: string = '';

    if (this.estaVacio(this.tablaEvaluacion.registro.cfuncionario)) {
      mensaje = 'SELECCIONE UN PROCESO A EVALUAR <br/>';
    }
    if ((Number(this.tablaEvaluacion.registro.promedio) === 0 || this.tablaEvaluacion.registro.promedio == undefined || this.tablaEvaluacion.registro.promedio == null) && this.nuevo == false) {
      mensaje += 'EL VALOR TOTAL NO ES VÁLIDO <br/>';
    }
    //VALIDACIONES EN SUBMODULOS
    if (this.tablaInternaDetalle.validarRegistros().length != 0) {
      mensaje += this.tablaInternaDetalle.validarRegistros() + ' <br/>';
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
      this.tablaInternaDetalle.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaInternaDetalle.alias));

      if (!this.estaVacio(resp.EVALUACION)) {
        this.mcampos.cinterna = resp.EVALUACION[0].cinterna;
        this.tablaEvaluacion.registro.actualizar = true;
        this.nuevo = false;
        this.tablaEvaluacion.nuevo = false;

        this.tablaInternaDetalle.mcampos.cinterna = this.mcampos.cinterna;

        this.mcampos.validaConsulta = false;

        // this.consultarPlantilla();
        this.AgregarNuevo(this.tablaInternaDetalle.latributos);
      }
      if (!this.estaVacio(resp.FINALIZADA)) {
        this.finalizada = resp.FINALIZADA;
        this.recargar();
      }
      if (this.mcampos.validaConsulta)
        this.consultar();

    }
  }
  calcularTotalGestionPuesto() {

  }

  consultarCatalogos(): void {


    this.encerarConsultaCatalogos();
    //CONSULTA DE ATRIBUTOS
    const mfiltrosAtributos = { 'activo': true, 'tipocdetalle': 'EV-INT' };
    const consultaAtributos = new Consulta('tthatributo', 'Y', 't.catributo', mfiltrosAtributos, {});
    consultaAtributos.cantidad = 500;
    this.addConsultaCatalogos('ATRIBUTOS', consultaAtributos, this.tablaInternaDetalle.latributos, this.llenarAtributos, '', this.componentehijo, false);

    //CONSULTA DE PARAMETROS DE CALIFICACIÓN 
    const mfiltrosparamcalif = { 'tipocdetalle': 'INT-EV' };
    const consultaParametrosCalificacion = new Consulta('tthparametroscalificacion', 'Y', 't.cparametro', mfiltrosparamcalif, {});
    consultaParametrosCalificacion.cantidad = 500;
    this.addConsultaCatalogos('CALIFICACION', consultaParametrosCalificacion, this.tablaInternaDetalle.lcalificacion, this.llenarCalificacion, '', this.componentehijo, false);

    //VALOR PARA CÓDIGO DE EVALUACION INTERNA
    const mfiltrosparam = { 'codigo': 'CVERSIONINTERNA' };
    const consultarParametro = new Consulta('tthparametros', 'Y', 't.codigo', mfiltrosparam, null);
    consultarParametro.cantidad = 100;
    this.addConsultaCatalogos('CVERSIONINTERNA', consultarParametro, this.lparametro, super.llenaListaCatalogo, 'numero');
    this.ejecutarConsultaCatalogos();
  }

  public llenarAtributos(pLista: any, pListaResp, campopk, agregaRegistroVacio = false, componentehijo = null): any {
    this.componentehijo.tablaInternaDetalle.latributosd = pListaResp;
    this.componentehijo.latributos = pListaResp;
    let cont;
    for (let i in pListaResp) {
      let reg = pListaResp[i];
      this.componentehijo.tablaInternaDetalle.latributos.push({ label: reg.nombre, value: reg.catributo });
      cont++

    }
    if (cont == 0) {
      super.mostrarMensajeError("NO SE HAN PARAMETRIZADO LOS ATRIBUTOS PARA LA EVALUACIÓN")
      return;
    }

  }
  public llenarCalificacion(pLista: any, pListaResp, campopk, agregaRegistroVacio = false, componentehijo = null): any {
    for (let i in pListaResp) {
      let reg = pListaResp[i];
      this.componentehijo.tablaInternaDetalle.lcalificacion.push({ label: reg.nombre, value: reg.cparametro });

      ///BUSCA MAYOR RANGO PARA EVALUAR PONDERACIÓN
      this.componentehijo.tablaInternaDetalle.ponderacion = pListaResp[0].ponderacion;
      for (const i in pListaResp) {
        if (pListaResp.hasOwnProperty(i)) {
          const reg = pListaResp[i];
          if (reg.ponderacion > this.componentehijo.tablaInternaDetalle.ponderacion) {
            this.componentehijo.tablaInternaDetalle.ponderacion = reg.ponderacion;
          }

        }
      }





    }
    this.componentehijo.tablaInternaDetalle.lcalificaciond = pListaResp;
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
  buscarAtributo(catributo: any): String {

    for (const i in this.latributos) {
      if (this.latributos.hasOwnProperty(i)) {
        const reg = this.latributos[i];
        if (reg.catributo === catributo) {

          return reg.descripcion;
        }

      }
    }
  }
  calcularTotalesInterna() {

    if (!this.estaVacio(this.tablaInternaDetalle.mcampos.total)) {
      this.tablaEvaluacion.registro.promedio = this.tablaInternaDetalle.mcampos.total;
    } else {
      this.tablaEvaluacion.registro.promedio = 0;
    }
    this.mcampos.promedio = this.tablaEvaluacion.registro.promedio;

  }

  //MÉTODO QUE AGREGA EL NUEVO REGISTRO A LREGISTROS , ARGUMENTOS TABLA HEREDADA DE BASECOMPONENTS Y LA LISTA A AGREGAR
  private AgregarNuevo(lista: any[]) {
    if (lista.length > 0) {
      for (const i in lista) {
        if (lista.hasOwnProperty(i)) {


          const reg = lista[i];
          if (!this.estaVacio(reg.value)) {
            this.tablaInternaDetalle.crearNuevo();
            this.tablaInternaDetalle.registro.catributo = reg.value;
            this.tablaInternaDetalle.registro.cinterna = this.mcampos.cinterna;
            this.tablaInternaDetalle.registro.mdatos.natributo = this.buscarAtributo(reg.value);
            this.tablaInternaDetalle.selectRegistro(this.tablaInternaDetalle.registro);
            this.tablaInternaDetalle.actualizar();
          }
        }
      }
    }
  }
  private manejaRespuestaPlantilla(resp: any) {
    this.lregistros = [];
    if (resp.cod === 'OK') {
      //METODO PARA AGREGAR REGISTROS NUEVOS DE LA PLANTILLA A LAS TABLAS
      this.AgregarNuevo(resp.ATRIBUTOS);

    }




  }
  //MÉTODO PARA REDONDEAR EL VALOR SEGUN LA ESPECIFICACIÓN DE LA EVALUACIÓN
  public round(value, precision): number {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  fijarLovFuncionariosEvalSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cfuncionario = reg.registro.cfuncionario;
      this.tablaEvaluacion.registro.cfuncionario = reg.registro.cfuncionario;
      this.tablaEvaluacion.registro.cmatrizdetalle = reg.registro.cmatrizdetalle;
      this.mcampos.nfuncionario = reg.registro.mdatos.nfuncionario;
      this.mcampos.nperiodo = reg.registro.mdatos.nperiodo;
      this.mcampos.nempresa = reg.registro.mdatos.nempresa;
      this.mcampos.nproducto = reg.registro.mdatos.nproducto;

      this.mcampos.ndepartamento = reg.registro.mdatos.ndepartamento;
      this.mcampos.ndepartamentoevaluado = reg.registro.mdatos.ndepartamentoevaluado;
      this.tablaEvaluacion.mcampos.nfuncionario = reg.registro.mdatos.nfuncionario;
      this.mcampos.documento = reg.registro.mdatos.documento;
      this.mcampos.cinterna = reg.registro.mdatos.cinterna;
      if (!this.estaVacio(this.mcampos.cinterna)) {
        this.tablaInternaDetalle.mcampos.cinterna = this.mcampos.cinterna;
        this.tablaEvaluacion.mcampos.cinterna = this.mcampos.cinterna;

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
    this.lovFuncionariosEval.mfiltrosesp.cfuncionario = "=" + sessionStorage.getItem("cfuncionario") + " ";

    this.lovFuncionariosEval.showDialog();
  }
}
