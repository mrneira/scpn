import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';


@Component({
  selector: 'app-cuentasporcobrarmigradas',
  templateUrl: 'cuentasporcobrarmigradas.html'
})
export class CuentasporcobrarMigradasComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  public lestadosCxP: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CUENTASPORCOBRARMIGRADAS', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
  }

  ngAfterViewInit() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  imprimir(resp: any): void {

    this.jasper.nombreArchivo = 'CuentasPorCobrar';

      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptConCuentasPorCobrarMigradas';
      this.jasper.generaReporteCore();
  }

}
