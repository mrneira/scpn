import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CabeceraComponent } from '../submodulos/cabecera/componentes/_cabecera.component';
import { DetalleComponent } from '../submodulos/detalle/componentes/_detalle.component';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { textChangeRangeIsUnchanged } from 'typescript';
import { AccordionModule } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { LovFuncionariosComponent } from '../../../../talentohumano/lov/funcionarios/componentes/lov.funcionarios.component';

import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-devolucion-empleado',
  templateUrl: 'devolucionempleado.html'
})
export class DevolucionEmpleadoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  selectedRegistros: any;

  @ViewChild(CabeceraComponent)
  cabeceraComponent: CabeceraComponent;

  @ViewChild(DetalleComponent)
  detalleComponent: DetalleComponent;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovFuncionariosComponent)
  private lovfuncionarios: LovFuncionariosComponent;

  private catalogoDetalle: CatalogoDetalleComponent;

  cusuarioasignado = '';
  public nuevo = true;
  public eliminado = false;
  public tienekardex = false;


 constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CREARDEVOLUCION', false);
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
    super.selectRegistro(registro);
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
    const conCabecera = this.cabeceraComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.cabeceraComponent.alias, conCabecera); 
    const conDetalle = this.detalleComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.detalleComponent.alias, conDetalle);

  }

  private fijarFiltrosConsulta() {    
    this.cabeceraComponent.fijarFiltrosConsulta();
    this.detalleComponent.fijarFiltrosConsulta();
   }
 
  validaFiltrosConsulta(): boolean {
        return true;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.cabeceraComponent.postQuery(resp);
    this.detalleComponent.postQuery(resp);
    this.nuevo = false;
    this.tienekardex = this.cabeceraComponent.registro.tienekardex;
  }

  // Fin CONSULTA *********************

  guardarCambios(): void {
    if (this.cabeceraComponent.registro.comentario === undefined) {
      this.cabeceraComponent.registro.comentario = "";
    }   
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
      this.cabeceraComponent.selectRegistro(this.cabeceraComponent.registro);
      this.cabeceraComponent.actualizar();
      this.cabeceraComponent.registro.cusuarioing = '';
    } else {
      this.cabeceraComponent.registro.cusuariomod = 'user';
      this.cabeceraComponent.registro.fmodificacion = this.fechaactual;
    }
    this.cabeceraComponent.registro.tienekardex = true;
    this.rqMantenimiento.mdatos.memoautorizacion = this.mcampos.memoautorizacion;
    this.rqMantenimiento.mdatos.cusuariodevolucion = this.cabeceraComponent.mcampos.cusuarioasignado;
    this.rqMantenimiento.mdatos.subtotal = this.detalleComponent.lregistros[0].vunitario;
    this.rqMantenimiento.mdatos.total = this.detalleComponent.lregistros[0].vunitario;
    
    
    super.addMantenimientoPorAlias(this.cabeceraComponent.alias, this.cabeceraComponent.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.detalleComponent.alias, this.detalleComponent.getMantenimiento(2));
    super.grabar();
  }

  validarGrabar(): string {
    let mensaje: string = '';
    if (this.mcampos.memoautorizacion === null || this.mcampos.memoautorizacion === undefined) {
      return  'INGRESE MEMO DE AUTORIZACION';
    }
    
    let contadorRegistros =0;
    let contadorNoIngresados = 0;
    for (const i in this.detalleComponent.lregistros) {
      const reg = this.detalleComponent.lregistros[i];
      contadorRegistros ++;
      if (reg.mdatos.seleccionado === undefined || reg.mdatos.seleccionado===false ) 
      {
        contadorNoIngresados ++;
      }
    }
    if (contadorNoIngresados === contadorRegistros )
    {
      return 'No ha seleccionado registros a devolver';
    }
    else{return '';}
  }

 
  
  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  public postCommit(resp: any) {
    if (resp.cod === 'OK') {
      this.cabeceraComponent.postCommit(resp, this.getDtoMantenimiento(this.cabeceraComponent.alias));
      this.detalleComponent.postCommit(resp);
      this.cabeceraComponent.registro.cingreso = resp.cingreso;
      this.cabeceraComponent.mfiltros.cingreso = resp.cingreso;
      this.detalleComponent.mfiltros.cingreso = resp.cingreso;
      this.msgs = [];
      this.grabo = true;
      this.nuevo = false;
      this.tienekardex = this.cabeceraComponent.registro.tienekardex;
      this.enproceso = false;    
    }
  
  }

  mostrarLovFuncionario(): void {
    this.lovfuncionarios.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovFuncionario(reg: any): void {
    if (reg.registro !== undefined) {

      this.mcampos.nfuncionarioasignado = reg.registro.primernombre +" "+reg.registro.primerapellido; 
      this.mcampos.cusuarioasignado = reg.registro.cpersona;

      this.cabeceraComponent.mcampos.cusuarioasignado = reg.registro.cpersona;
      this.detalleComponent.mcampos.cusuarioasignado = reg.registro.cpersona;

      this.msgs = [];
      this.consultar();

    }
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
    this.ejecutarConsultaCatalogos();
  }
}
