import { Component, OnInit, AfterViewInit, ViewChild, HostListener } from '@angular/core';
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
import { LovAjustesComponent } from '../../../lov/ajustes/componentes/lov.ajustes.component';
import { forEach } from '@angular/router/src/utils/collection';
import { ok } from 'assert';

export enum KEY_CODE {
  FLECHA_ABAJO = 40
}

@Component({
  selector: 'app-ajuste',
  templateUrl: 'ajuste.html'
})
export class AjusteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(CabeceraComponent)
  cabeceraComponent: CabeceraComponent;

  @ViewChild(DetalleComponent)
  detalleComponent: DetalleComponent;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

   @ViewChild(LovAjustesComponent)
   private lovajustes: LovAjustesComponent;

   @ViewChild('lov1')
   private lovFuncionarioAvala: LovFuncionariosComponent;
   @ViewChild('lov2')
   private lovFuncionarioAutoriza: LovFuncionariosComponent;

  public nuevo = true;
  public eliminado = false;
  public tienekardex = false;


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CREARAJUSTE', false);
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
   

    if (event.keyCode === KEY_CODE.FLECHA_ABAJO && event.ctrlKey) {
      this.detalleComponent.agregarProducto();
    }

  }
  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
    this.cabeceraComponent.registro.fechaingreso = this.fechaactual;

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
    const conCabecera = this.cabeceraComponent.crearDtoConsulta();
    conCabecera.addSubquery('tthfuncionariodetalle','primernombre + \' \' + primerapellido','nfuncionarioavala','i.cpersona= cast(t.cusuarioavala as int) and i.verreg = 0' );
    conCabecera.addSubquery('tthfuncionariodetalle','primernombre + \' \' + primerapellido','nfuncionarioautoriza','i.cpersona= t.cusuarioautoriza and i.verreg = 0');
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
    this.calcularTotales();
    this.nuevo = false;
    this.tienekardex = this.cabeceraComponent.registro.tienekardex;  
        
  }
  // Fin CONSULTA *********************

  guardarCambios(): void {
    if (this.cabeceraComponent.registro.comentario === undefined){
      this.cabeceraComponent.registro.comentario = "";
    }    
    this.grabar();
  }

  finalizarAjuste(): void {
      this.rqMantenimiento.mdatos.kardex = true;
      this.cabeceraComponent.registro.tienekardex = true;
      this.grabar();
  }

  eliminarAjuste(): void{    
    this.cabeceraComponent.registro.comentario = this.cabeceraComponent.registro.comentario + "-- Ajuste eliminado"
    this.rqMantenimiento.mdatos.eliminar = true;
    this.grabar();
  }
  // Inicia MANTENIMIENTO *********************
  grabar(): void {

    this.lmantenimiento = []; // Encerar Mantenimiento
    let mensaje = this.validarGrabar();
    if (mensaje !== ''){
      super.mostrarMensajeError(mensaje);
      return;
    }
    if (!this.validarRegistrosDetalle()){
      super.mostrarMensajeError('DETALLE DE AJUSTE TIENE PRODUCTOS SIN CODIGO');
      return;
    }


    if (this.nuevo) {
      this.cabeceraComponent.selectRegistro(this.cabeceraComponent.registro);
      this.cabeceraComponent.actualizar();
      this.cabeceraComponent.registro.cusuarioing = '';
    }else{
      this.cabeceraComponent.registro.cusuariomod = 'user';
      this.cabeceraComponent.registro.fmodificacion = this.fechaactual;
    }
    this.cabeceraComponent.registro.optlock = 0;
    this.cabeceraComponent.registro.movimiento = 'S';
  
    super.addMantenimientoPorAlias(this.cabeceraComponent.alias, this.cabeceraComponent.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.detalleComponent.alias, this.detalleComponent.getMantenimiento(2));
    // para adicionar otros entity bean super.addMantenimientoPorAlias('alias',mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  validarRegistrosDetalle() : boolean{
    for (const i in this.detalleComponent.lregistros) {
      const reg = this.detalleComponent.lregistros[i];
      if (reg.mdatos.codigo === undefined){
        return false;
      }
    }  
    return true;
  }

  validarGrabar(): string{
    let mensaje: string = '';
   
    if (this.detalleComponent.lregistros.length === 0) {
      mensaje += 'NO HA INGRESADO DETALLE DE PRODUCTOS <br />';
    }
    if (this.cabeceraComponent.registro.cusuarioavala === null || this.cabeceraComponent.registro.cusuarioavala === undefined) {
      mensaje =  'SELECCIONE USUARIO QUE AVALA  <br />';
    }
    if (this.cabeceraComponent.registro.cusuarioautoriza === null || this.cabeceraComponent.registro.cusuarioautoriza === undefined) {
      mensaje =  'SELECCIONE USUARIO QUE AUTORIZA  <br />';
    }
        return mensaje;
  }
  
  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  public postCommit(resp: any) {
    // LLmar de esta manera al post commit para que actualice el ajuste
    if (resp.cod === 'OK') {
      this.cabeceraComponent.postCommit(resp, this.getDtoMantenimiento(this.cabeceraComponent.alias));
      this.detalleComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.detalleComponent.alias));
      this.cabeceraComponent.registro.cajuste = resp.cajuste;
      this.cabeceraComponent.mfiltros.cajuste = resp.cajuste;
      this.detalleComponent.mfiltros.cajuste = resp.cajuste;
      this.msgs = [];
      this.grabo = true;
      this.nuevo = false;
      this.tienekardex = this.cabeceraComponent.registro.tienekardex;
      this.enproceso = false;
      this.consultar(); 
    }   
  }

  /**Muestra lov de Ajuste Bodega */
  mostrarlovajustes(): void {  
    this.lovajustes.mfiltros.movimiento = 'S';    
    this.lovajustes.showDialog(true);
    this.lovajustes.consultar();
    
  }


  /**Retorno de lov de ajuste bodega. */
  fijarLovAjustesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.cabeceraComponent.mfiltros.cajuste = reg.registro.cajuste;
      this.detalleComponent.mfiltros.cajuste = reg.registro.cajuste;
      this.msgs = [];
      this.consultar();
    }
  }

  mostrarLovFuncionarioAvala(): void {
    this.lovFuncionarioAvala.showDialog();
   
  }

  /**Retorno de lov de personas. */
  fijarLovFuncionarioAvala(reg: any): void {

    if (reg.registro !== undefined) {
      this.cabeceraComponent.registro.cusuarioavala = reg.registro.cpersona;
    //  this.cabeceraComponent.registro.nfuncionarioavala = reg.registro.primernombre+ " "+ reg.registro.primerapellido;  
      this.cabeceraComponent.registro.mdatos.nfuncionarioavala = reg.registro.primernombre +" "+reg.registro.primerapellido; 
    }
  }
  mostrarLovFuncionarioAutoriza(): void {
    this.lovFuncionarioAutoriza.showDialog();
    
  }

  /**Retorno de lov de personas. */
  fijarLovFuncionarioAutoriza(reg: any): void {
    if (reg.registro !== undefined) {
      this.cabeceraComponent.registro.cusuarioautoriza = reg.registro.cpersona;
     // this.cabeceraComponent.registro.nfuncionarioautoriza = reg.registro.primernombre+ " "+ reg.registro.primerapellido; 
      this.cabeceraComponent.registro.mdatos.nfuncionarioautoriza = reg.registro.primernombre+ " "+ reg.registro.primerapellido;
    }
  }


  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
    this.ejecutarConsultaCatalogos();
  }

  validarInventarioCongelado(){

    const consulta = new Consulta('tacfinventariocongelado', 'Y', '', {'congelasuministros':false }, {});
    this.addConsultaPorAlias('CONGELAINVENTARIO', consulta);

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuesta(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  private manejaRespuesta(resp: any) {
    if (resp.CONGELAINVENTARIO !== undefined && resp.CONGELAINVENTARIO !== null) {
      if (resp.CONGELAINVENTARIO.length > 0 ){        
        super.mostrarMensajeError('DEBE CONGELAR EL INVENTARIO PARA REALIZAR AJUSTES');
        return;
      }
    }
  }

  calcularTotales(): void {
    let sumatoriobaseiva = 0;
    let sumatoriosubtotal = 0;
    for (const i in this.detalleComponent.lregistros) {
      const reg = this.detalleComponent.lregistros[i];

      sumatoriosubtotal += this.detalleComponent.registro.vunitario * this.detalleComponent.registro.fisico;

    }
    this.cabeceraComponent.registro.subtotal = sumatoriosubtotal;
    this.cabeceraComponent.registro.impuestos = 0;
    this.cabeceraComponent.registro.total = sumatoriosubtotal + this.cabeceraComponent.registro.impuestos;

  }
  //#region Reporte
  descargarReporte(): void {
    if (this.cabeceraComponent.registro.cajuste === undefined) {
      super.mostrarMensajeError('Por favor seleccione un ingreso');
      return;
    }

    this.jasper.nombreArchivo = this.cabeceraComponent.registro.cajuste;
    if (this.mcampos.nombre === undefined) {
      this.mcampos.nombre = '';
    }

    if (this.mcampos.rol === undefined || this.mcampos.rol === '') {
      this.mcampos.rol = -1
    }

    // Agregar parametros
    this.jasper.parametros['@i_cajuste'] = this.cabeceraComponent.registro.cajuste;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/ActivosFijos/rptAcfComprobanteAjusteDeBodega';
    this.jasper.generaReporteCore();
  }
  //#endregion
}
