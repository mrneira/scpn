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
  selector: 'app-reporte-reporteresumencobros',
  templateUrl: 'reporteresumencobros.html'
})
export class ReporteResumenCobrosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public lmodulos: SelectItem[] = [{ label: '...', value: null }];
  public lestados: SelectItem[] = [{ label: '...', value: null }];

  public lcestado: SelectItem[] = [
    { label: "...", value: null },
    { label: "AUTORIZADO", value: "8" },
    { label: "COBRADO", value: "12" }
  ];

  public totalRegistros = 0;
  public totalOcp: Number = 0;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ttesrecaudacion', 'REPORTECASH', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
    this.mfiltros.fcontable = this.stringToFecha(
      this.integerToFormatoFecha(this.dtoServicios.mradicacion.fcontable)
    );
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
    this.consultarResumen();
    //super.consultar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  actualizar() {
    super.actualizar();
  }

  consultarResumen() {
    this.rqConsulta.CODIGOCONSULTA = 'DETALLEOCP';
    this.rqConsulta.storeprocedure = "sp_TesConResumenOcp";
    this.rqConsulta.parametro_fcontable = this.fechaToInteger(this.mfiltros.fcontable);
    this.rqConsulta.parametro_verreg = 0;
    this.rqConsulta.parametro_tipotransaccion = "C";
    this.rqConsulta.parametro_estado = (this.mfiltros.cestado === undefined || this.mfiltros.cestado === null) ? "" : this.mfiltros.cestado;
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
      this.lregistros = resp.DETALLEOCP;
      this.calcularTotalesOcp(this.lregistros);
    }
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    const mfiltrosEstado: any = {};
    const conEstado = new Consulta('ttesestadocash', 'Y', 't.nombre', mfiltrosEstado, {});
    conEstado.cantidad = 10;
    this.addConsultaCatalogos('ESTADOCASH', conEstado, this.lestados, super.llenaListaCatalogo, 'cestado');

    this.ejecutarConsultaCatalogos();
  }

  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
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
    this.jasper.nombreArchivo = 'ReporteResumenCobros';
    this.jasper.parametros['@i_fcontable'] = this.fechaToInteger(this.mfiltros.fcontable);
    this.jasper.parametros['@i_verreg'] = 0;
    this.jasper.parametros['@i_tipotransaccion'] = "C";
    this.jasper.parametros['@i_cestado'] = (this.mfiltros.cestado === undefined || this.mfiltros.cestado === null) ? "" : this.mfiltros.cestado;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Tesoreria/rptTes_ReporteResumenCobros';
    this.jasper.formatoexportar = resp;
    this.jasper.generaReporteCore();
  }

  public calcularTotalesOcp(lista: any) {
    this.totalRegistros = 0;
    this.totalOcp = 0;
    for (const i in lista) {
      const reg = lista[i];
      this.totalOcp += reg.total;
      this.totalRegistros += reg.registros;
    }
  }
}
