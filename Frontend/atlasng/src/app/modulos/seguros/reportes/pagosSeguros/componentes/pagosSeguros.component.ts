import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-reporte-pagos-seguros',
  templateUrl: 'PagosSeguros.html'
})
export class PagosSegurosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public laseguradora: SelectItem[] = [{ label: '...', value: null }];
  public lpagos: SelectItem[] = [{ label: '...', value: null }];
  public lpagostotal: any = [];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'PAGOSSEGUROS', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  imprimir(): void {
    this.jasper.nombreArchivo = 'ReportePagosSeguros';
    this.jasper.parametros['@i_aseguradora'] = this.mcampos.caseguradora;
    this.jasper.parametros['@i_pago'] = this.mfiltros.cpago;
    this.jasper.formatoexportar = 'xls';
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Seguros/rptSgsPago';

    this.jasper.generaReporteCore();
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    const mfiltrosAseguradora: any = { 'activo': true };
    const consultaAseguradora = new Consulta('TsgsAseguradora', 'Y', 't.nombre', mfiltrosAseguradora, {});
    consultaAseguradora.cantidad = 50000;
    this.addConsultaCatalogos('ASEGURADORAS', consultaAseguradora, this.laseguradora, super.llenaListaCatalogo, 'caseguradora');

    const consultaPagos = new Consulta('TsgsPago', 'Y', 't.freal', {}, {});
    consultaPagos.cantidad = 50000;
    this.addConsultaCatalogos('PAGOS', consultaPagos, this.lpagostotal, this.llenarPagos, '', this.componentehijo);

    this.ejecutarConsultaCatalogos();
  }

  public llenarPagos(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null): any {
    this.componentehijo.lpagostotal = pListaResp;
  }

  cambiarAseguradora(event: any): any {
    if (this.estaVacio(this.mcampos.caseguradora)) {
      this.lpagos = [];
      this.lpagos.push({ label: '...', value: null });
      return;
    }
    this.fijarListaPagos(Number(event.value));
  }

  fijarListaPagos(caseguradora: any) {
    this.lpagos = [];
    this.lpagos.push({ label: '...', value: null });
    this.registro.ctipoproducto = null;

    for (const i in this.lpagostotal) {
      if (this.lpagostotal.hasOwnProperty(i)) {
        const reg: any = this.lpagostotal[i];
        if (reg !== undefined && reg.value !== null && reg.caseguradora === Number(caseguradora)) {
          this.lpagos.push({ label: ' ' + reg.cpago + ' - [' + this.calendarToFechaString(new Date(reg.freal)) + ']', value: reg.cpago });
        }
      }
    }
  }

  cambiarPago(event: any): any {
    if (this.estaVacio(this.mfiltros.cpago)) {
      return;
    }
    this.consultar();
  }
}
