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
import { LovIngresosComponent } from '../../../lov/ingresos/componentes/lov.ingresos.component';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { CabeceraRoutingModule } from 'app/modulos/activosfijos/activosfijos/consultaegreso/submodulos/cabecera/cabecera.routing';
import { LovFuncionariosComponent } from '../../../../talentohumano/lov/funcionarios/componentes/lov.funcionarios.component';


@Component({
  selector: 'app-devolucionBodega',
  templateUrl: 'devolucionBodega.html'
})
export class DevolucionBodegaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(CabeceraComponent)
  cabeceraComponent: CabeceraComponent;

  @ViewChild(DetalleComponent)
  detalleComponent: DetalleComponent;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovIngresosComponent)
  private lovingresos: LovIngresosComponent;

  @ViewChild(LovFuncionariosComponent)
  private lovFuncionario: LovFuncionariosComponent;

  private catalogoDetalle: CatalogoDetalleComponent;

  public ltipoingresocdetalle: SelectItem[] = [{ label: '...', value: null }];
  public lestadoingresocdetalle: SelectItem[] = [{ label: '...', value: null }];


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'ASIGNARCUSTODIOACTIVOS', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
    this.cabeceraComponent.mcampos.fecha = this.fechaactual;
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
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    // Consulta datos.
    const conComprobante = this.cabeceraComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.cabeceraComponent.alias, conComprobante);
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
  }

  // Fin CONSULTA *********************

  guardarCambios(): void {
    this.grabar();
  }

  finalizarIngreso(): void {
    this.grabar();
  }

  eliminarComprobante(): void{
    this.grabar();
  }
  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    
    this.cabeceraComponent.selectRegistro(this.cabeceraComponent.registro);
    this.cabeceraComponent.actualizar();
    this.rqMantenimiento.mdatos.tipomovimiento =this.cabeceraComponent.registro.tipoingresocdetalle;
    this.rqMantenimiento.mdatos.fecha = this.cabeceraComponent.registro.fecha;
    this.rqMantenimiento.mdatos.kardexproductocodificado=true;
    this.rqMantenimiento.mdatos.cingreso = this.cabeceraComponent.registro.cingreso;
    this.rqMantenimiento.mdatos.infoadicional = this.detalleComponent.lregistros; 
    this.rqMantenimiento.mdatos.fecha = this.cabeceraComponent.registro.fecha;   
    super.addMantenimientoPorAlias(this.cabeceraComponent.alias, this.cabeceraComponent.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.detalleComponent.alias, this.detalleComponent.getMantenimiento(2));
    // para adicionar otros entity bean super.addMantenimientoPorAlias('alias',mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  public postCommit(resp: any) {
    // LLmar de esta manera al post commit para que actualice el
    if (resp.cod === 'OK'){
      this.grabo = true;
    }
    this.cabeceraComponent.postCommit(resp, this.getDtoMantenimiento(this.cabeceraComponent.alias));
    this.detalleComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.detalleComponent.alias));
  }


  /**Muestra lov de ingresos */
  mostrarlovingresos(): void {
    this.lovingresos.mfiltros.tienekardex = true;
    this.lovingresos.showDialog(true);
  }


  /**Retorno de lov de ingresos. */
  fijarLovIngresosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.cabeceraComponent.mfiltros.cingreso = reg.registro.cingreso;
      this.detalleComponent.mfiltros.cingreso = reg.registro.cingreso;
      this.msgs = [];
      this.consultar();
    }
  }

  mostrarLovFuncionario(): void {
    this.lovFuncionario.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovFuncionario(reg: any): void {
    if (reg.registro !== undefined) {
      this.cabeceraComponent.registro.cusuariorecibe = reg.registro.cpersona;
      this.registro.mdatos.nfuncionario = reg.registro.primernombre+ " "+ reg.registro.primerapellido;  
      this.cabeceraComponent.registro.mdatos.nfuncionario = reg.registro.primernombre +" "+reg.registro.primerapellido; 
    }
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    const consultaFuncionarios = this.cabeceraComponent.crearDtoConsulta();
    consultaFuncionarios.addSubquery('tthfuncionariodetalle','primernombre + \' \' + primerapellido','nfuncionario','i.cpersona= t.cusuariorecibe and i.verreg = 0' );
    consultaFuncionarios.cantidad = 500;
    this.addConsultaPorAlias(this.cabeceraComponent.alias, consultaFuncionarios);

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1303;
    const conTipoIngreso = this.catalogoDetalle.crearDtoConsulta();
    conTipoIngreso.cantidad = 20;
    this.addConsultaCatalogos('TIPOINGRESO', conTipoIngreso, this.ltipoingresocdetalle, super.llenaListaCatalogo, 'cdetalle');

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1306;
    const conEstadoIngreso = this.catalogoDetalle.crearDtoConsulta();
    conEstadoIngreso.cantidad = 20;
    this.addConsultaCatalogos('ESTADOEGRESO', conEstadoIngreso, this.lestadoingresocdetalle, super.llenaListaCatalogo, 'cdetalle');
 
    this.ejecutarConsultaCatalogos();
  }

  
  //#region Reporte
  descargarReporte(): void {
    if (this.cabeceraComponent.registro.cingreso === undefined) {
      super.mostrarMensajeError('Por favor seleccione un ingreso');
      return;
    }

    this.jasper.nombreArchivo = this.cabeceraComponent.registro.cingreso;
    if (this.mcampos.nombre === undefined) {
      this.mcampos.nombre = '';
    }

    if (this.mcampos.rol === undefined || this.mcampos.rol === '') {
      this.mcampos.rol = -1
    }

    // Agregar parametros
    this.jasper.parametros['@i_cegreso'] = this.cabeceraComponent.registro.cingreso;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/ActivosFijos/rptAcfEntregaCustodioActivosFijos';
    this.jasper.generaReporteCore();
  }
  //#endregion
}
