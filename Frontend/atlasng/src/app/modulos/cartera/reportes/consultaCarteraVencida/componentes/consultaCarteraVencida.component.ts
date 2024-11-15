import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-cartera-vencida',
  templateUrl: 'consultaCarteraVencida.html'
})
export class ConsultaCarteraVencidaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'REPORTECONSULTASOLICITUD', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.camposfecha.fproceso = new Date();
  }

  ngAfterViewInit() {
  }

  imprimir(resp: any): void {
    this.jasper.nombreArchivo = 'CarteraVencida_' + this.fechaToInteger(this.mcampos.camposfecha.fproceso);

    if (!this.estaVacio(this.mcampos.camposfecha.fproceso)) {
      // Agregar parametros
      this.jasper.formatoexportar = resp;
      this.jasper.parametros['@i_fproceso'] = this.fechaToInteger(this.mcampos.camposfecha.fproceso);
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestamos/rptCarConsultaCarteraVencida';
      this.jasper.generaReporteCore();
    } else {
      this.mostrarMensajeError("FECHA ES REQUERIDO");
    }
  }

}
