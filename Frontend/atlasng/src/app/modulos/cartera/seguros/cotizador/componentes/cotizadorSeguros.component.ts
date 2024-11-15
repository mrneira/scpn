import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { DatePipe } from '@angular/common';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';

import { DatosGeneralesComponent } from './_datosGenerales.component';
import { TipoSeguroComponent } from '../../../../seguros/parametros/tipoSeguro/componentes/tipoSeguro.component';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component'

@Component({
  selector: 'app-cotizador-seguros',
  templateUrl: 'cotizadorSeguros.html'
})
export class CotizadorSegurosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public reporte: JasperComponent;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  @ViewChild(DatosGeneralesComponent)
  datosGeneralesComponent: DatosGeneralesComponent;

  private print = false;
  private modulocartera = 7;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CREASOLICITUDINGRESO', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    this.consultarCatalogos();
    super.init(this.formFiltros);
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
  }

  private fijarFiltrosConsulta() {
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.postQuery(resp);
  }

  // Inicia MANTENIMIENTO *********************
  grabar() {
    // No existe para el padre
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  public postCommit(resp: any) {
    if (resp.cod === 'OK') {
      this.print = true;
    }
  }

  /**Muestra lov de personas */
  mostrarLovPersona(): void {
    this.lovPersonas.showDialog();
    this.lovPersonas.mfiltros.csocio = 1;
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.nombre = reg.registro.nombre;

      this.datosGeneralesComponent.habilitarEdicion();
    }
  }

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosSegProd: any = { 'cmodulo': this.modulocartera, 'activo': true };
    const consultaSegProd = new Consulta('TsgsTipoSeguroProducto', 'Y', 't.cproducto', mfiltrosSegProd, {});
    consultaSegProd.addSubquery('TgenProducto', 'nombre', 'nproducto', 'i.cmodulo = t.cmodulo and i.cproducto = t.cproducto');
    consultaSegProd.addSubquery('TgenTipoProducto', 'nombre', 'ntipoproducto', 'i.cmodulo = t.cmodulo and i.cproducto = t.cproducto and i.ctipoproducto = t.ctipoproducto');
    consultaSegProd.addSubquery('TsgsTipoSeguroDetalle', 'nombre', 'ntiposeguro', 'i.ctiposeguro = t.ctiposeguro and i.verreg = 0');
    consultaSegProd.cantidad = 100;
    this.addConsultaCatalogos('PRODUCTOSEGURO', consultaSegProd, this.datosGeneralesComponent.lproductoseguro, this.datosGeneralesComponent.llenarSeguroProducto, 'cproducto', this.componentehijo);

    const mfiltrosTipoSeguro: any = { verreg: 0 };
    const conTipoSeguro = new Consulta('TsgsTipoSeguroDetalle', 'Y', 't.nombre', mfiltrosTipoSeguro, {});
    conTipoSeguro.cantidad = 100;
    this.addConsultaCatalogos('TIPOSEGURO', conTipoSeguro, this.datosGeneralesComponent.ltiposegurodetalle, this.datosGeneralesComponent.llenarTipoSeguroDetalle, 'ctiposeguro', this.componentehijo);

    const mfiltrosRub: any = { activo: true };
    const conRubSeguro = new Consulta('TsgsTipoSeguroRubros', 'Y', 't.orden', mfiltrosRub, {});
    conRubSeguro.cantidad = 100;
    this.addConsultaCatalogos('RUBROSSEGURO', conRubSeguro, this.datosGeneralesComponent.lrubrostotal, this.datosGeneralesComponent.llenarRubrosSeguro, 'secuencia', this.componentehijo);

    const mfiltrosParam: any = { codigo: 'IVA-SEGUROS' };
    const conParam = new Consulta('TcarParametros', 'N', 't.codigo', mfiltrosParam, {});
    conParam.cantidad = 100;
    this.addConsultaCatalogos('IVASEGUROS', conParam, this.datosGeneralesComponent.ivaporcentaje, this.datosGeneralesComponent.llenarPorcentajeIva, 'numero', this.componentehijo);

    this.ejecutarConsultaCatalogos();
  }

  limpiarSimulacion() {
    super.encerarMensajes();
    this.print = false;
  }

  recargarSimulacion() {
    this.limpiarSimulacion();
  }
}
