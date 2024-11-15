import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { LovPartidaIngresoComponent } from '../../../lov/partidaingreso/componentes/lov.partidaingreso.component';

@Component({
  selector: 'app-reporte-cedulaPresupuestariaIngresos',
  templateUrl: 'cedulaPresupuestariaIngresos.html'
})
export class CedulaPresupuestariaIngresosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;
  public montoTotal: Number = 0;
  public devengadoTotal: Number = 0;
  public total: Number = 0;
  totalporcenparticipacion = 0;
  totalporcenejecucion = 0;

  public codigoDetalle: String = "";

  @ViewChild(LovPartidaIngresoComponent)
  public lovpartidasingreso: LovPartidaIngresoComponent;
  public regconsulta: any = [];
  public infoadicional = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tpptpartidaingreso', 'CEDULAPRESUPUESTARIA', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultar();
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

  // Inicia CONSULTA *********************
  consultar() {
    this.consultarComprobantes();
  }

  consultarComprobantes() {
    this.rqConsulta.CODIGOCONSULTA = 'PPT_CEDULAINGRESOS';
    this.rqConsulta.storeprocedure = "sp_PptRptCedulaPresupuestariaIngresos";
    this.rqConsulta.parametro_cpartidaingreso = this.mfiltros.cpartidaingreso;
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.manejaRespuestaComprobantes(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  private manejaRespuestaComprobantes(resp: any) {
    this.lregistros = [];
    this.montoTotal = 0;
    this.devengadoTotal = 0;
    this.total = 0;
    if (resp.cod !== 'OK') {
      super.mostrarMensajeError(resp.msgusu);
      return;
    }
    this.lregistros = resp.PPT_CEDULAINGRESOS;
    this.calcularTotales(this.lregistros);
  }

  public calcularTotales(lista: any) {
    this.montoTotal = 0;
    this.devengadoTotal = 0;
    this.total = 0;
    this.totalporcenejecucion = 0;
    this.totalporcenparticipacion = 0;
    for (const i in lista) {
      const reg = lista[i];
      if (reg.movimiento === 'Si') {
        this.montoTotal += reg.MontoTotal;
        this.devengadoTotal += reg.Devengado;
        this.total += reg.SaldoXDevengar;
        this.totalporcenejecucion += reg.porcenejecucion;
        this.totalporcenparticipacion += reg.porcenparticipacion;
      }
    }
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cclasificador', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tpptclasificador', 'codigo', 'nombre', 'i.cclasificador = t.cclasificador');

    this.addConsulta(consulta);
    return consulta;
  }
  private fijarFiltrosConsulta() {
  }
  descargarReporte(reg: any): void {

    this.jasper.formatoexportar = reg;
    this.jasper.nombreArchivo = 'rptPptCedulaPresupuestariaIngresos';
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Presupuesto/rptPptCedulaPresupuestariaIngresos';
    this.jasper.generaReporteCore();
  }

  mostrarlovpartidasingreso(): void {
    this.lovpartidasingreso.mfiltros.movimiento = true;
    this.lovpartidasingreso.showDialog();
  }

  /**Retorno de lov de productos. */
  fijarlovpartidasingresoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.npartida = reg.registro.nombre;
      this.mfiltros.cpartidaingreso = reg.registro.cpartidaingreso;
    }
  }

}
