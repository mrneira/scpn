import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-resumenvarinternacional',
  templateUrl: 'resumenvarinternacional.html'
})
export class ResumenvarInternacionalComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'RESUMENBANCOS', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.camposfecha.finicio = new Date();
  }

  ngAfterViewInit() {
  }


  descargarReporte(): void {
    this.jasper.nombreArchivo = 'rptInvResumenRentaVariableInternacional';
 
    // Agregar parametros
    this.jasper.parametros['@i_fhasta'] = this.fechaToInteger(this.mcampos.finicio);
    this.jasper.parametros['@i_usuario'] = this.dtoServicios.mradicacion.np;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvResumenRentaVariableInternacional';
    this.jasper.generaReporteCore();
  }
  
}
