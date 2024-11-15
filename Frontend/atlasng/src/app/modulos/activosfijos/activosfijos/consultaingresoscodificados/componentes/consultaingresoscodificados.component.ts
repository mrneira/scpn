import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { LovIngresosComponent } from '../../../lov/ingresos/componentes/lov.ingresos.component';

@Component({
  selector: 'app-consultaingresoscodificados',
  templateUrl: 'consultaingresoscodificados.html'
})
export class ConsultaIngresosCodificadosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovIngresosComponent)
  private lovingresos: LovIngresosComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tacfproductocodificado', 'CONSULTAINGRESOSCODIFICADOS', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);    
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();   
  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cproductocodificado', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tacfingreso', 'facturanumero', 'facturanumero', 'i.cingreso = t.cingreso');
    consulta.addSubquery('tacfingreso', 'memocodificacion', 'memocodificacion', 'i.cingreso = t.cingreso');
    consulta.addSubquery('tacfproducto', 'nombre', 'nombre', 'i.cproducto = t.cproducto');
    consulta.addSubquery('tacfproducto', 'vunitario', 'vunitario1', 'i.cproducto = t.cproducto');
    this.addConsulta(consulta);
    return consulta;
  }

   /**Muestra lov de egresos */
   mostrarlovingresos(): void {
    this.lovingresos.mfiltros.eliminado = false;
    this.lovingresos.mfiltros.tienekardex = true;
    this.lovingresos.mfiltros.estadoingresocdetalle = "CODIFI";  
    this.lovingresos.showDialog(true);
   
  }


  /**Retorno de lov de concepto contables. */
  fijarLovIngresosSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.cingreso = reg.registro.cingreso;      
      this.msgs = [];
      this.consultar();
    }

  }
  private fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  descargarReporte() {
    if (this.registro.cingreso === undefined) {
      super.mostrarMensajeError('Por favor seleccione un ingreso');
      return;
    }
   
   
    // Agregar parametros
    this.jasper.parametros['@i_cingreso'] = this.registro.cingreso;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/ActivosFijos/rptAcfConsultaProductoCodificado';
    this.jasper.generaReporteCore();
  }
  descargarEtiquetas(){
    if (this.registro.cingreso === undefined) {
      super.mostrarMensajeError('Por favor seleccione un ingreso');
      return;
    }

    this.jasper.nombreArchivo = 'ReporteSimulacion';
    // Agregar parametros
    this.jasper.parametros['@i_cingreso'] = this.registro.cingreso;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/ActivosFijos/rptAcfImpresionCodigoQR';
    this.jasper.generaReporteCore();
  }
}
