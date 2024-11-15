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

@Component({
  selector: 'app-devolucionComprasCodificados',
  templateUrl: 'devolucionComprasCodificados.html'
})
export class DevolucionComprasCodificadosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  selectedRegistros: any;

  @ViewChild(CabeceraComponent)
  cabeceraComponent: CabeceraComponent;

  @ViewChild(DetalleComponent)
  detalleComponent: DetalleComponent;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovIngresosComponent)
  private lovingresos: LovIngresosComponent;

  private catalogoDetalle: CatalogoDetalleComponent;


  public nuevo = true;
  public tienekardex = false;


 constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'DEVOLUCIONCOMPRAS', false);
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
    conCabecera.addSubquery('tperproveedor', 'nombre', 'npersonaproveedor', 'i.cpersona = t.cpersonaproveedor');
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
    this.rqMantenimiento.mdatos.kardex = true;
    this.rqMantenimiento.mdatos.cingreso = this.cabeceraComponent.mcampos.cingreso;
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
    super.addMantenimientoPorAlias(this.cabeceraComponent.alias, this.cabeceraComponent.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.detalleComponent.alias, this.detalleComponent.getMantenimiento(2));
    super.grabar();
  }
  
  validarGrabar(): string {
    let mensaje: string = '';

    if (this.detalleComponent.lregistros.length === 0) {
      mensaje += 'NO HA INGRESADO DETALLE DE PRODUCTOS <br />';
    }
    return mensaje;
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
/**Muestra lov de Ingresos */
mostrarlovingresos(): void {
  this.lovingresos.mfiltros.tipoingresocdetalle = 'COMPRA';
  this.lovingresos.mfiltros.estadoingresocdetalle = 'CODIFI';
  this.lovingresos.showDialog(true);
}


/**Retorno de lov de Ingresos */
fijarLovIngresosSelec(reg: any): void {
  if (reg.registro !== undefined) {
    this.cabeceraComponent.mcampos.cingreso = reg.registro.cingreso;
    this.detalleComponent.mcampos.cingreso = reg.registro.cingreso;   
    this.mcampos.cingreso = reg.registro.cingreso; 
    this.msgs = [];
    this.consultar();
  }
}

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
    this.ejecutarConsultaCatalogos();
  }

  //#region Reporte
  descargarReporte(): void {
    if (this.cabeceraComponent.mfiltros.cingreso === undefined) {
      super.mostrarMensajeError('Por favor seleccione un ingreso');
      return;
    }

    // Agregar parametros
    this.jasper.parametros['@i_cingreso'] = this.cabeceraComponent.mfiltros.cingreso;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/ActivosFijos/rptAcfComprobanteDevolucionBodega';
    this.jasper.generaReporteCore();
   }
  //#endregion
}
