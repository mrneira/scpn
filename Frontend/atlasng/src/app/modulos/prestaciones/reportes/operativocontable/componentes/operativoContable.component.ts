import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-operativo-contable',
  templateUrl: 'operativoContable.html'
})
export class OperativoContableComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'SALDOSCONTABLESACTIVOS', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
  }

  ngAfterViewInit() {

  }

  // Inicia CONSULTA *********************
  consultar() {

  }

  imprimir(resp: any): void {
    if (!this.estaVacio(this.mcampos.FechaInicio) &&
      !this.estaVacio(this.mcampos.FechaFin)){
      this.jasper.nombreArchivo = 'RptOperConPrestaciones';

      this.jasper.parametros['@i_usuario'] = this.dtoServicios.mradicacion.np;
      this.jasper.parametros['@i_finicio'] = this.mcampos.FechaInicio;
      this.jasper.parametros['@i_ffin'] = this.mcampos.FechaFin;
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestaciones/rptPreOperativoContable';

      this.jasper.formatoexportar = resp;
      this.jasper.generaReporteCore();
    } else {
      super.mostrarMensajeError("NO SE HAN DEFINIDO LOS FILTROS DE BUSQUEDA");
    }

  }

  // Fin CONSULTA *********************
}
