import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-consulta-liquidacion-mora',
  templateUrl: 'consultaLiquidacionMora.html'
})
export class ConsultaLiquidacionMoraComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public ldevoluciones: SelectItem[] = [{ label: "...", value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'REPORTEGENERICO', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.fproceso = this.integerToDate(this.dtoServicios.mradicacion.fcontable);
    this.mcampos.fproceso.setDate(this.mcampos.fproceso.getDate() - 1);
    this.mcampos.fcontable = this.fechaToInteger(this.mcampos.fproceso);
  }

  ngAfterViewInit() {
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.fijarFiltrosConsulta();
    super.consultar();
  }

  private fijarFiltrosConsulta() {
    super.encerarConsulta();
    this.rqConsulta = { 'mdatos': {} };
    this.rqConsulta.mdatos.CODIGOCONSULTA = 'REPORTEGENERICO';
    this.rqConsulta.storeprocedure = "sp_CarRptConsultaLiquidacionMora";
    this.rqConsulta.parametro_fcontable = this.mcampos.fcontable;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    this.calcularTotales();
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = [];
    const cmoduloorg = sessionStorage.getItem('m');
    const ctransaccionorg = sessionStorage.getItem('t');
    this.rqMantenimiento['CODMODULOORIGEN'] = cmoduloorg;
    this.rqMantenimiento['CODTRANSACCIONORIGEN'] = ctransaccionorg;
    this.rqMantenimiento['cmodulo'] = 28;
    this.rqMantenimiento['ctransaccion'] = 46;
    super.grabar();
  }
  // Fin MANTENIMIENTO *********************

  /**Calcula totales de registros. */
  calcularTotales(): void {
    this.mcampos.totalsaldooperacion = 0;
    this.mcampos.totaltotalaportes = 0;
    this.mcampos.totalvalorpago = 0;
    this.mcampos.totalsaldoaportes = 0;

    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        this.mcampos.totalsaldooperacion += reg.saldo;
        this.mcampos.totaltotalaportes += reg.totalaportes;
        this.mcampos.totalvalorpago += reg.valorpago;
        this.mcampos.totalsaldoaportes += reg.saldoaportes;
      }
    }
  }

  /**Imprimir. */
  public imprimir(): void {
    this.jasper.nombreArchivo = 'LIQUIDACIONES_' + this.mcampos.fcontable;

    // Agregar parametros
    this.jasper.parametros['@fcontable'] = this.mcampos.fcontable;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestamos/rptCarConsultaLiquidacionMora';
    this.jasper.formatoexportar = 'xls';
    this.jasper.generaReporteCore();
  }

}
