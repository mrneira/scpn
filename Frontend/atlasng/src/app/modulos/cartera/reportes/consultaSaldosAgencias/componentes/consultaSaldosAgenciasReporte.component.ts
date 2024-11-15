import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { ProductosComponent } from "../../../productos/productoingreso/submodulos/productos/componentes/_productos.component";
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-usuario-reportesaldoAgencias',
  templateUrl: 'consultaSaldosAgenciasReporte.html'
})
export class ConsultaSaldosAgenciasReporteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(ProductosComponent)
  productosComponent: ProductosComponent;

   constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'REPORTECONSULTASOLICITUD', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.fecha = new Date();
  }

  ngAfterViewInit() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  imprimir(): void {
    this.jasper.formatoexportar = 'pdf';

    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestamos/rptCarMoraAgencias';
    this.jasper.generaReporteCore();
  }


  public postQuery(resp: any) {
    
  }

}
