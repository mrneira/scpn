import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SpinnerModule } from 'primeng/primeng';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';



@Component({
  selector: 'app-reporte-gastosPersonales',
  templateUrl: 'gastosPersonales.html'
})
export class GastosPersonalesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;



  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'gastosPersonales', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mfiltros.anio = new Date().getFullYear();
  }

  ngAfterViewInit() {
  }


  descargarReporte(): void {

    this.jasper.nombreArchivo = 'FormularioGastosPersonales';

    if (this.mfiltros.anio === undefined || this.mfiltros.anio === null || this.mfiltros.anio === '') {
      this.mostrarMensajeError("INGRESE EL AÑO");
      return;
    }

    // Agregar parametros
    this.jasper.parametros['@i_cfuncionario'] = sessionStorage.getItem("cfuncionario");
    this.jasper.parametros['@i_anio'] = this.mfiltros.anio;



    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/TalentoHumano/rptTthFormularioGastosPersonales';
    this.jasper.generaReporteCore();
  }

    /**Se llama automaticamente luego de ejecutar una consulta. */
    public postQuery(resp: any) {
      super.postQueryEntityBean(resp);
    }


}
