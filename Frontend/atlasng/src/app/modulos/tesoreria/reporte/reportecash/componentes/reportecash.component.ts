import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { last } from 'rxjs/operator/last';

@Component({
  selector: 'app-reporte-reportecash',
  templateUrl: 'reportecash.html'
})
export class ReporteCashComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public lmodulos: SelectItem[] = [{ label: '...', value: null }];
  public lestados: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ttesrecaudacion', 'REPORTECASH', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  consultar(): void {
    if (!this.validaFiltrosConsulta()) {
      return;

    }
    this.consultarPagos();
    //super.consultar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  actualizar() {
    super.actualizar();
  }

  consultarPagos() {
    this.rqConsulta.CODIGOCONSULTA = 'CASH_REPORTE';
    this.rqConsulta.storeprocedure = "sp_TesConReporteCash";
    this.rqConsulta.parametro_modulo = (this.mfiltros.cmodulo === undefined || this.mfiltros.cmodulo === null) ? '-1' : this.mfiltros.cmodulo;
    this.rqConsulta.parametro_estado = (this.mfiltros.cestado === undefined || this.mfiltros.cestado === null) ? "" : this.mfiltros.cestado;
    this.rqConsulta.parametro_fechageneracion = this.mcampos.fingreso;
    this.rqConsulta.parametro_identificacion = (this.mfiltros.identificacion === undefined || this.mfiltros.identificacion === null) ? "" : this.mfiltros.identificacion;
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.manejaRespuestaDocumentos(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  private manejaRespuestaDocumentos(resp: any) {
    this.lregistros = [];
    if (resp.cod === 'OK') {
      this.lregistros = resp.CASH_REPORTE;
    }
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();
    const mfiltrosMod: any = { activo: true, negocio: true };
    const conModulo = new Consulta('tgenmodulo', 'Y', 't.nombre', mfiltrosMod, {});
    conModulo.cantidad = 100;
    this.addConsultaCatalogos('MODULOS', conModulo, this.lmodulos, super.llenaListaCatalogo, 'cmodulo');

    const mfiltrosEstado: any = {};
    const conEstado = new Consulta('ttesestadocash', 'Y', 't.nombre', mfiltrosEstado, {});
    conEstado.cantidad = 10;
    this.addConsultaCatalogos('ESTADOCASH', conEstado, this.lestados, super.llenaListaCatalogo, 'cestado');

    this.ejecutarConsultaCatalogos();
  }

  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    //this.rqMantenimiento.mdatos["INFORMACIONEMPRESA"] = this.lempresa;
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    this.crearDtoMantenimiento();
    super.grabar();
  }

  public crearDtoMantenimiento() {
    super.addMantenimientoPorAlias(this.alias, this.getMantenimiento(1));
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.cod === "OK") {
      this.enproceso = false;
      this.consultar();
    }
  }

  public imprimir(resp: any): void {
    this.jasper.nombreArchivo = 'ReporteCash';
    this.jasper.parametros['@i_modulo'] = (this.mfiltros.cmodulo === undefined || this.mfiltros.cmodulo === null) ? '-1' : this.mfiltros.cmodulo;
    this.jasper.parametros['@i_estado'] = (this.mfiltros.cestado === undefined || this.mfiltros.cestado === null) ? "" : this.mfiltros.cestado;
    this.jasper.parametros['@i_fechageneracion'] = this.mcampos.fingreso;
    this.jasper.parametros['@i_identificacion'] = (this.mfiltros.identificacion === undefined || this.mfiltros.identificacion === null) ? "" : this.mfiltros.identificacion;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Tesoreria/rptTes_ReporteCash';
    this.jasper.formatoexportar = resp;
    this.jasper.generaReporteCore();
  }
}
