import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-reporte-saldos-seguros',
  templateUrl: 'saldosSeguros.html'
})
export class SaldosSegurosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public ltiposeguro: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'SALDOSSEGUROS', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.finicio = new Date();
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  imprimir(): void {
    this.jasper.nombreArchivo = 'ReporteSaldosSeguros-' + this.dtoServicios.mradicacion.fcontable;
    this.jasper.parametros['@i_ctiposeguro'] = this.mcampos.ctiposeguro;
    this.jasper.formatoexportar = 'xls';
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Seguros/rptSgsSaldos';

    this.jasper.generaReporteCore();
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    const mfiltrosTipoSeguro: any = { verreg: 0 };
    const conTipoSeguro = new Consulta('TsgsTipoSeguroDetalle', 'Y', 't.nombre', mfiltrosTipoSeguro, {});
    conTipoSeguro.cantidad = 100;
    this.addConsultaCatalogos('TIPOSEGURO', conTipoSeguro, this.ltiposeguro, super.llenaListaCatalogo, 'ctiposeguro');

    this.ejecutarConsultaCatalogos();
  }

}
