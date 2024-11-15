import { Radicacion } from './../../../../../util/servicios/dto.servicios';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { ConfirmationService } from 'primeng/primeng';

import { CabeceraComponent } from "../submodulos/cabecera/componentes/cabecera.component"
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { ParamgestionpuestoComponent } from "../submodulos/paramgestionpuesto/componentes/paramgestionpuesto.component"
import { ConocimientoComponent } from '../submodulos/conocimiento/conocimiento/conocimiento.component';
import { ComptecnicasComponent } from '../submodulos/comptecnicas/componentes/comptecnicas.component';
import { CompuniversalesComponent } from '../submodulos/compuniversales/componentes/compuniversales.component';
import { TrabajoequipoComponent } from '../submodulos/trabajoequipo/componentes/trabajoequipo.component';
import { LovPlantillaEvaluacionMrlComponent } from '../../../lov/plantillaevaluacionmrl/componentes/lov.plantillaevaluacionmrl.component';
import { LovPlantillaEvaluacion } from '../../../lov/plantilla/componentes/lov.plantillaevaluacionmrl.component';

@Component({
  selector: 'app-evaluacion',
  templateUrl: 'evaluacion.html'
})
export class EvaluacionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  private catalogoDetalle: CatalogoDetalleComponent;

  @ViewChild(LovPlantillaEvaluacionMrlComponent)
  private lovPlantillaEvaluacionMrlComponent: LovPlantillaEvaluacionMrlComponent;

  @ViewChild(LovPlantillaEvaluacion)
  private lovEvaluacionCopia: LovPlantillaEvaluacion;
  @ViewChild(ConocimientoComponent)
  tablaConocimientoComponent: ConocimientoComponent;

  @ViewChild(ParamgestionpuestoComponent)
  tablaParamgestionpuestoComponent: ParamgestionpuestoComponent;

  @ViewChild(TrabajoequipoComponent)
  tablaTrabajoequipoComponent: TrabajoequipoComponent;

  @ViewChild(CabeceraComponent)
  tablaEvaluacion: CabeceraComponent;

  @ViewChild(ComptecnicasComponent)
  tablaComptecnicasComponent: ComptecnicasComponent;

  @ViewChild(CompuniversalesComponent)
  tablaCompuniversalesComponent: CompuniversalesComponent;
  public nuevo = true;
  public copia = false;
  constructor(router: Router, dtoServicios: DtoServicios,private confirmationService: ConfirmationService) {
    super(router, dtoServicios, 'ABSTRACT', 'INFORMACIONACADEMICA', false);
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

    if (this.mcampos.cplantilla === null || this.mcampos.cplantilla === undefined) {
      this.mostrarMensajeError("ELIJA UNA PLANTILLA PARA MANTENIMIENTO");
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

    const evaluacion = this.tablaEvaluacion.crearDtoConsulta();
    this.addConsultaPorAlias(this.tablaEvaluacion.alias, evaluacion);
    //CONSULTAS

  }

  private fijarFiltrosConsulta() {

    this.tablaParamgestionpuestoComponent.mfiltros.cplantilla = this.mcampos.cplantilla;
    this.tablaComptecnicasComponent.mfiltros.cplantilla = this.mcampos.cplantilla;
    this.tablaConocimientoComponent.mfiltros.cplantilla = this.mcampos.cplantilla;
    this.tablaCompuniversalesComponent.mfiltros.cplantilla = this.mcampos.cplantilla;
    this.tablaTrabajoequipoComponent.mfiltros.cplantilla = this.mcampos.cplantilla
    this.tablaEvaluacion.mfiltros.cplantilla = this.mcampos.cplantilla;

  }
  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.nuevo = false;
    this.tablaParamgestionpuestoComponent.postQuery(resp);
    this.tablaConocimientoComponent.postQuery(resp);
    this.tablaComptecnicasComponent.postQuery(resp);
    this.tablaCompuniversalesComponent.postQuery(resp);
    this.tablaTrabajoequipoComponent.postQuery(resp);
    this.tablaEvaluacion.postQuery(resp);

  }
  // Fin CONSULTA *********************
  guardarCambios(): void {
    this.grabar();
  }
  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = [];
    if (!this.tablaEvaluacion.validaGrabar()) {
      return;
    }

    if (this.nuevo) {
      this.tablaEvaluacion.selectRegistro(this.tablaEvaluacion.registro);
      this.tablaEvaluacion.actualizar();
      this.tablaEvaluacion.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    } else {
      this.tablaEvaluacion.registro.actualizar = true;
      this.tablaEvaluacion.registro.cusuariomod = this.dtoServicios.mradicacion.cusuario;
      this.tablaEvaluacion.registro.fmodificacion = this.fechaactual;
    }
    super.addMantenimientoPorAlias(this.tablaConocimientoComponent.alias, this.tablaConocimientoComponent.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.tablaComptecnicasComponent.alias, this.tablaComptecnicasComponent.getMantenimiento(2));
    super.addMantenimientoPorAlias(this.tablaParamgestionpuestoComponent.alias, this.tablaParamgestionpuestoComponent.getMantenimiento(3));
    super.addMantenimientoPorAlias(this.tablaCompuniversalesComponent.alias, this.tablaCompuniversalesComponent.getMantenimiento(4));
    super.addMantenimientoPorAlias(this.tablaTrabajoequipoComponent.alias, this.tablaTrabajoequipoComponent.getMantenimiento(5));
    super.addMantenimientoPorAlias(this.tablaEvaluacion.alias, this.tablaEvaluacion.getMantenimiento(6));

    super.grabar();
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  public postCommit(resp: any) {
    if (resp.cod === 'OK') {
      this.tablaComptecnicasComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaComptecnicasComponent.alias));
      this.tablaCompuniversalesComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaCompuniversalesComponent.alias));
      this.tablaConocimientoComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaConocimientoComponent.alias));
      this.tablaParamgestionpuestoComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaParamgestionpuestoComponent.alias));
      this.tablaTrabajoequipoComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaTrabajoequipoComponent.alias));
      this.tablaEvaluacion.postCommitEntityBean(resp, this.getDtoMantenimiento(this.tablaEvaluacion.alias));
      if (!this.estaVacio(resp.EVALPLANTILLA)) {
        this.tablaEvaluacion.registro.actualizar = true;
        this.nuevo = false;
        this.mcampos.cplantilla = resp.EVALPLANTILLA[0].cplantilla;
        this.mcampos.nombre = this.tablaEvaluacion.registro.nombre;
        this.tablaEvaluacion.nuevo = false;
        this.tablaEvaluacion.mcampos.cplantilla = this.mcampos.cplantilla;
        this.tablaConocimientoComponent.mcampos.cplantilla = this.mcampos.cplantilla;
        this.tablaComptecnicasComponent.mcampos.cplantilla = this.mcampos.cplantilla;
        this.tablaParamgestionpuestoComponent.mcampos.cplantilla = this.mcampos.cplantilla;
        this.tablaCompuniversalesComponent.mcampos.cplantilla = this.mcampos.cplantilla;
        this.tablaTrabajoequipoComponent.mcampos.cplantilla = this.mcampos.cplantilla;
       
      }
      if (this.copia){
        this.consultarPlantilla();
        this.copia= false;
      }
    }
  }
  /**Muestra lov de personas */
  mostrarLovPlantilla(): void {
    this.lovPlantillaEvaluacionMrlComponent.showDialog();
  }
  mostrarLovEvaluacionCopia(): void {
    this.lovEvaluacionCopia.showDialog();
  }

  fijarLovEvaluacionCopia(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cplantillacopia = reg.registro.cplantilla;
      this.mcampos.nombrecopia = reg.registro.nombre;
      
      this.confirmationService.confirm({
        message: 'Desea realizar una copia de la  plantilla seleccionada?',
        header: 'Confirmación',
        accept: () => {
          this.tablaEvaluacion.registro.nombre= "COPIA - "+reg.registro.nombre;
          this.tablaEvaluacion.registro.descripcion= "COPIA - "+reg.registro.descripcion;
          this.tablaEvaluacion.formvalidado= true;
          this.grabar();
          this.copia=true;
        }
      });
      
    }
  }
  validaFiltrosConsulta(): boolean {
    return (
      this.tablaComptecnicasComponent.validaFiltrosRequeridos() &&
      this.tablaCompuniversalesComponent.validaFiltrosRequeridos() &&
      this.tablaConocimientoComponent.validaFiltrosRequeridos() &&
      this.tablaParamgestionpuestoComponent.validaFiltrosRequeridos() &&
      this.tablaTrabajoequipoComponent.validaFiltrosRequeridos());
  }
  consultarCatalogos(): void {

    this.encerarConsultaCatalogos();
    const consultaDestreza = new Consulta('tthevaluaciondestreza', 'Y', 't.cdestreza', {}, {});
    consultaDestreza.cantidad = 500;
    this.addConsultaCatalogos('DESTREZACOMPETENCIA', consultaDestreza, this.tablaComptecnicasComponent.ldetreza, this.llenarDestreza, '', this.componentehijo);

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1121;
    const consultaRelevancia = this.catalogoDetalle.crearDtoConsulta();
    consultaRelevancia.cantidad = 20;
    this.addConsultaCatalogos('RELEVANCIA', consultaRelevancia, this.tablaComptecnicasComponent.lrelevancia, this.llenarRelevancia, '', this.componentehijo);
    this.ejecutarConsultaCatalogos();
  }
  public llenarDestreza(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {

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


  /**Retorno de lov de personas. */
  fijarLovPlantillaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cplantilla = reg.registro.cplantilla;
      this.mcampos.nombre = reg.registro.nombre;
      this.tablaEvaluacion.mcampos.cplantilla = this.mcampos.cplantilla;
      this.tablaConocimientoComponent.mcampos.cplantilla = this.mcampos.cplantilla;
      this.tablaComptecnicasComponent.mcampos.cplantilla = this.mcampos.cplantilla;
      this.tablaParamgestionpuestoComponent.mcampos.cplantilla = this.mcampos.cplantilla;
      this.tablaCompuniversalesComponent.mcampos.cplantilla = this.mcampos.cplantilla;
      this.tablaTrabajoequipoComponent.mcampos.cplantilla = this.mcampos.cplantilla;
      this.tablaEvaluacion.editable = true;
      this.consultar();
    }
  }
  //MÉTODO PARA CONSULTAR DATOS DE LA PLANTILLA -- COMPONENTE DE CONSULTA
  consultarPlantilla() {
    this.rqConsulta.CODIGOCONSULTA = 'PLANTILLA';
    this.rqConsulta.mdatos.cplantilla = this.mcampos.cplantillacopia;
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
  private manejaRespuestaPlantilla(resp: any) {
    if (resp.cod === 'OK') {
     
          //METODO PARA AGREGAR REGISTROS NUEVOS DE LA PLANTILLA A LAS TABLAS
      this.AgregarNuevo(this.tablaParamgestionpuestoComponent, resp.GESTIONPUESTO);
      this.AgregarNuevo(this.tablaConocimientoComponent, resp.CONOCIMIENTO);
      this.AgregarNuevo(this.tablaComptecnicasComponent, resp.COMPTECNICAS);
      this.AgregarNuevo(this.tablaCompuniversalesComponent, resp.COMPUNIVERSALES);
      this.AgregarNuevo(this.tablaTrabajoequipoComponent, resp.TRABINCLI);
        }
        this.grabar();
    }
  
  private AgregarNuevo(tabla: BaseComponent, lista: any[]) {  
    if (lista.length > 0) {
      for (const i in lista) {
        if (lista.hasOwnProperty(i)) {
          tabla.crearNuevo();
          const reg = lista[i];
          delete reg.secuencia;
          reg.esnuevo = true;
          reg.idreg = Math.floor((Math.random() * 100000) + 1);
          reg.cplantilla = this.mcampos.cplantilla;
          tabla.selectRegistro(reg);
          tabla.actualizar();
        }
      }
    }
  }
}
