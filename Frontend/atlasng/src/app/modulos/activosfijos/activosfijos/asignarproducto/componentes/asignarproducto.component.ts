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
import { LovEgresosComponent } from '../../../lov/egresos/componentes/lov.egresos.component';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { CabeceraRoutingModule } from 'app/modulos/activosfijos/activosfijos/consultaegreso/submodulos/cabecera/cabecera.routing';
import { LovFuncionariosComponent } from '../../../../talentohumano/lov/funcionarios/componentes/lov.funcionarios.component';


@Component({
  selector: 'app-asignar-producto',
  templateUrl: 'asignarproducto.html'
})
export class AsignarProductoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(CabeceraComponent)
  cabeceraComponent: CabeceraComponent;

  @ViewChild(DetalleComponent)
  detalleComponent: DetalleComponent;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovEgresosComponent)
  private lovegresos: LovEgresosComponent;

  @ViewChild(LovFuncionariosComponent)
  private lovFuncionario: LovFuncionariosComponent;

  private catalogoDetalle: CatalogoDetalleComponent;

  public ltipoegresocdetalle: SelectItem[] = [{ label: '...', value: null }];
  public lestadocdetalle: SelectItem[] = [{ label: '...', value: null }];


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'ASIGNARPRODUCTO', false);
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
    conComprobante.addSubquery('tthfuncionariodetalle','primernombre + \' \' + primerapellido','nfuncionario','i.cpersona= t.cusuariorecibe and i.verreg = 0' );
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
    let mensaje = this.validarEgreso();
    if ( mensaje !== ''){
      super.mostrarMensajeError(mensaje);
      return;
    }
    this.rqMantenimiento.mdatos.tipomovimiento =this.cabeceraComponent.registro.tipoegresocdetalle;
    this.rqMantenimiento.mdatos.kardexproductocodificado=true;
    this.rqMantenimiento.mdatos.cusuarioasignado = this.cabeceraComponent.registro.cusuariorecibe;
    this.rqMantenimiento.mdatos.infoadicional = this.detalleComponent.lregistros;
    this.lmantenimiento = []; // Encerar Mantenimiento
    super.addMantenimientoPorAlias(this.cabeceraComponent.alias, this.cabeceraComponent.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.detalleComponent.alias, this.detalleComponent.getMantenimiento(2));
    // para adicionar otros entity bean super.addMantenimientoPorAlias('alias',mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  public postCommit(resp: any) {
    // LLamar de esta manera al post commit para que actualice el
    if (resp.cod === 'OK'){
      this.grabo = true;
    }
    this.cabeceraComponent.postCommit(resp, this.getDtoMantenimiento(this.cabeceraComponent.alias));
    this.detalleComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.detalleComponent.alias));
  }


  /**Muestra lov de egresos */
  mostrarlovegresos(): void {
    this.lovegresos.mfiltros.tienekardex = true;
    this.lovegresos.mfiltros.estadocdetalle = "EGRESA";
    this.lovegresos.mfiltros.movimiento = 'A';
    this.lovegresos.showDialog(true);
  }


  /**Retorno de lov de Egresos. */
  fijarLovEgresosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.cabeceraComponent.mfiltros.cegreso = reg.registro.cegreso;
      this.detalleComponent.mfiltros.cegreso = reg.registro.cegreso;
      this.msgs = [];
      this.consultar();
    }
  }

  mostrarLovFuncionario(): void {
    this.lovFuncionario.showDialog();
  }

  /**Retorno de lov de funcionarios. */
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
    this.catalogoDetalle.mfiltros.ccatalogo = 1305;
    const conTipoEgreso = this.catalogoDetalle.crearDtoConsulta();
    conTipoEgreso.cantidad = 20;
    this.addConsultaCatalogos('TIPOEGRESO', conTipoEgreso, this.ltipoegresocdetalle, super.llenaListaCatalogo, 'cdetalle');

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1306;
    const conEstadoEgreso = this.catalogoDetalle.crearDtoConsulta();
    conEstadoEgreso.cantidad = 20;
    this.addConsultaCatalogos('ESTADOEGRESO', conEstadoEgreso, this.lestadocdetalle, super.llenaListaCatalogo, 'cdetalle');
 
    this.ejecutarConsultaCatalogos();
  }

  
  validarEgreso(): string{
    let contadorRegistros = 0;
    let contadorNoIngresados = 0;

    for (const i in this.detalleComponent.lregistros) {
      const reg = this.detalleComponent.lregistros[i];
      contadorRegistros ++;
      if (reg.mdatos.serial === '' || reg.mdatos.serial === undefined || reg.mdatos.cbarras === '' || reg.mdatos.cbarras === undefined){
        contadorNoIngresados ++;
      }
    }
    if (contadorNoIngresados > 0){
      return 'Existen ' + contadorNoIngresados.toString() + ' productos que no tienen número de serie y/o código de barras';
    }else{return '';}
    
  }
  //#region Reporte
  descargarReporte(): void {
    if (this.cabeceraComponent.registro.cegreso === undefined) {
      super.mostrarMensajeError('Por favor seleccione un ingreso');
      return;
    }

    this.jasper.nombreArchivo = this.cabeceraComponent.registro.cegreso;
    if (this.mcampos.nombre === undefined) {
      this.mcampos.nombre = '';
    }

    if (this.mcampos.rol === undefined || this.mcampos.rol === '') {
      this.mcampos.rol = -1
    }

    // Agregar parametros
    this.jasper.parametros['@i_cegreso'] = this.cabeceraComponent.registro.cegreso;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/ActivosFijos/rptAcfComprobanteEgresoDeBodega';
    this.jasper.generaReporteCore();
  }
  //#endregion
}
