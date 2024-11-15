import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import {JasperComponent} from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { SelectItem } from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';

@Component({
  selector: 'app-ingreso',
  templateUrl: 'ingreso.html'
})
export class IngresoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;
  public ltipoplancuentas: SelectItem[] = [{label: '...', value: null}];
  public lestadoflujo: SelectItem[] = [{ label: '...', value: null }];
  private catalogoDetalle: CatalogoDetalleComponent;
  public tipoflujoccatalogo = 1033;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'REPORTEFLUJOCAJA', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
    //this.mcampos.fcontable = this.fechaactual;
    //this.consultar();  // para ejecutar consultas automaticas.
  }

  ngAfterViewInit() {
    this.consultarCatalogos();
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.cflujocaja', this.mfiltros, this.mfiltrosesp);
    //consulta.addSubquery('tconnivel','digitos','ndigitos','t.cnivel = i.cnivel');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
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

  descargarReporte(reg: any): void {
    if (this.mfiltros.finicio === undefined || this.mfiltros.finicio === null || this.mfiltros.finicio > this.mfiltros.ffin) {
      this.mostrarMensajeError("INGRESE LA FECHA DE INICIO");
      return;
    }
    if (this.mfiltros.ffin === undefined || this.mfiltros.ffin === null || this.mfiltros.finicio > this.mfiltros.ffin) {
      this.mostrarMensajeError("INGRESE LA FECHA DE FIN");
      return;
    }
    this.jasper.formatoexportar = reg;
    this.jasper.nombreArchivo = 'FlujoCaja';
    // Agregar parametros
    this.jasper.parametros['@i_finicio'] = this.fechaToInteger(this.mfiltros.finicio);
    this.jasper.parametros['@i_ffin'] = this.fechaToInteger(this.mfiltros.ffin);
    this.jasper.parametros['@i_tipoplanccatalogo'] = 1001;
    this.jasper.parametros['@i_tipoplancdetalle'] = this.mcampos.tipoplancuenta;
    this.jasper.parametros['@i_tipoflujo'] = this.mcampos.tipoflujocdetalle;
    if(this.mcampos.tipoflujocdetalle!="REA"){
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptConFlujoCajaProyectado'; //CCA 20220627
    }else{
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptConFlujoCajaReal';
    }

    this.jasper.generaReporteCore();
  }

  consultarCatalogos(): void{

    this.encerarConsultaCatalogos();
    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1001;
    const consultaTipoPlanCuenta = this.catalogoDetalle.crearDtoConsulta();
    consultaTipoPlanCuenta.cantidad = 100;
    this.addConsultaCatalogos('TIPOPLANCUENTA', consultaTipoPlanCuenta, this.ltipoplancuentas, super.llenaListaCatalogo, 'cdetalle');

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = this.tipoflujoccatalogo;
    const consultaEstadoFlujoCaja = this.catalogoDetalle.crearDtoConsulta();
    consultaEstadoFlujoCaja.cantidad = 100;
    this.addConsultaCatalogos('ESTADOFLUJOCAJA', consultaEstadoFlujoCaja, this.lestadoflujo, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();

  }


}
