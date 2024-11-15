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
import { DetalleComponent } from '../submodulos/detalle/componentes/detalle.component';

//Lov
import { LovMatrizCorrelacionComponent } from '../../../lov/matrizcorrelacion/componentes/lov.matrizcorrelacion.component'

export enum KEY_CODE {
  FLECHA_ABAJO = 40
}

@Component({
  selector: 'app-asignacionMatrizCorrelacion',
  templateUrl: 'asignacionMatrizCorrelacion.html'
})
export class AsignacionMatrizCorrelacionComponent extends BaseComponent implements OnInit, AfterViewInit {
  public visible: boolean = false;
  private catalogoDetalle: CatalogoDetalleComponent;
  @ViewChild('formFiltros') formFiltros: NgForm;
  //Submodulos
  @ViewChild(CabeceraComponent)
  CabeceraComponent: CabeceraComponent;

  @ViewChild(LovMatrizCorrelacionComponent)
  private lovMatrizCorrelacion: LovMatrizCorrelacionComponent;

  @ViewChild(DetalleComponent)
  DetalleComponent: DetalleComponent;
  public indextab: number;

  public lparametro: any = [];
  public nuevo = true;
  public finalizada = false;
  public aprobada = false;

  constructor(router: Router, dtoServicios: DtoServicios, private confirmationService: ConfirmationService) {
    super(router, dtoServicios, 'ABSTRACT', 'CORRELACION', false);
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    

    if (event.keyCode === KEY_CODE.FLECHA_ABAJO && event.ctrlKey) {
      if (this.indextab === 0)
        this.DetalleComponent.agregarlinea();
    }


  }

  ngOnInit() {

    this.indextab = 0;
    this.componentehijo = this;
    super.init(this.formFiltros);
     this.consultarCatalogos();
  }

  consultarCatalogos(): void{

    this.encerarConsultaCatalogos();
    const consultaDepartamento = new Consulta('tthdepartamento', 'Y', 't.nombre',{}, {});
    consultaDepartamento.addFiltroCondicion('gestion',true,'=');
    consultaDepartamento.cantidad = 50;
    this.addConsultaCatalogos('DEPARTAMENTO', consultaDepartamento, this.DetalleComponent.lcdepartamento, this.llenarDepartamento, '', this.componentehijo);

    this.ejecutarConsultaCatalogos();
  }
  consultaMetas(): void{

    this.encerarConsultaCatalogos();
    const consultaMeta = new Consulta('tthmetadetalle', 'Y', 't.producto',{cmeta:this.mcampos.cmeta}, {});
   
    consultaMeta.cantidad = 50;
    this.addConsultaCatalogos('META', consultaMeta, this.DetalleComponent.lcmetadetalle, this.llenarMeta, '', this.componentehijo);

   
    this.ejecutarConsultaCatalogos();
  }
  public llenarMeta(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
  
    for (let i in pListaResp) {
      let reg = pListaResp[i];
      this.componentehijo.DetalleComponent.lcmetadetalle.push({ label: reg.producto, value: reg.cmetadetalle });
       }
  }
  public llenarDepartamento(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
  this.componentehijo.DetalleComponent.lcdepartamentod=pListaResp;
    for (let i in pListaResp) {
      let reg = pListaResp[i];
      this.componentehijo.DetalleComponent.lcdepartamento.push({ label: reg.nombre, value: reg.cdepartamento });
       }
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
    //FIJAR FILTROS EN CONSULTA
    this.fijarFiltrosConsulta();

    // DATOS CONSULTA

    const evaluacion = this.CabeceraComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.CabeceraComponent.alias, evaluacion);

    const consParamg = this.DetalleComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.DetalleComponent.alias, consParamg);

  }

  private fijarFiltrosConsulta() {
    this.DetalleComponent.mfiltros.cmatriz = this.mcampos.cmatriz;

  }

  validaFiltrosConsulta(): boolean {
    return (
      this.DetalleComponent.validaFiltrosRequeridos()
    );
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.DetalleComponent.postQuery(resp);
    this.CabeceraComponent.postQuery(resp);
    this.nuevo = false;
    this.CabeceraComponent.nuevo = false;
    this.finalizada = this.CabeceraComponent.registro.finalizada;
    this.aprobada = this.CabeceraComponent.registro.aprobada;
  //  this.consultaMetas();

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

    this.CabeceraComponent.registro.finalizada = true;
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
      this.CabeceraComponent.registro.comentario = this.mcampos.comentario;
      this.DetalleComponent.selectRegistro(this.DetalleComponent.registro);
      this.DetalleComponent.actualizar();

    } else {
      this.CabeceraComponent.registro.actualizar = true;
      this.CabeceraComponent.registro.comentario = this.mcampos.comentario;
      this.DetalleComponent.registro.cusuariomod = this.dtoServicios.mradicacion.cusuario;
      this.DetalleComponent.registro.fmodificacion = this.fechaactual;
    }
    super.addMantenimientoPorAlias(this.CabeceraComponent.alias, this.CabeceraComponent.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.DetalleComponent.alias, this.DetalleComponent.getMantenimiento(2));
    super.grabar();
  }

  validarGrabar(): string {
    let mensaje: string = '';

    //VALIDACIONES EN SUBMODULOS
    if (this.DetalleComponent.validarRegistros().length != 0) {
      mensaje += this.DetalleComponent.validarRegistros() + ' <br/>';
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
     this.CabeceraComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.CabeceraComponent.alias));
      this.DetalleComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.DetalleComponent.alias));
  

      if (!this.estaVacio(resp.FINALIZADA)) {
        this.finalizada = resp.FINALIZADA;
        this.recargar();
      }
      if (this.mcampos.validaConsulta)
        this.consultar();

    }
  }



  /**Muestra lov de evaluación */
  mostrarlovMatrizCorrelacion(): void {
    this.lovMatrizCorrelacion.showDialog();

  }

  /**Retorno de lov de evaluación. */
  fijarlovMatrizCorrelacionSelec(reg: any): void {
    if (reg.registro !== undefined) {
      //actualización datos en Padre
      this.mcampos.nfuncionario = reg.registro.mdatos.nfuncionario;
      this.mcampos.cmatriz = reg.registro.cmatriz;

      this.CabeceraComponent.registro.cfuncionario = reg.registro.cfuncionario;
      this.CabeceraComponent.registro.cfuncionario = reg.registro.cfuncionario;
      this.CabeceraComponent.registro.cperiodo = reg.registro.cperiodo;
      this.CabeceraComponent.mfiltros.cmeta = reg.registro.cmeta;
      this.CabeceraComponent.registro.comentario = reg.registro.comentario;
      this.mcampos.cmeta=reg.registro.cmeta;
      this.DetalleComponent.mcampos.cmatriz = reg.registro.cmatriz;
      this.DetalleComponent.mcampos.cdepartamento =  reg.registro.cdepartamento;
      this.DetalleComponent.mcampos.cmeta =  reg.registro.cmeta;
      this.mcampos.nperiodo = reg.registro.mdatos.nperiodo;
      this.mcampos.ndepartamento = reg.registro.mdatos.ndepartamento;
      this.mcampos.nempresa = reg.registro.mdatos.nempresa;
      this.consultaMetas();
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

 
}
