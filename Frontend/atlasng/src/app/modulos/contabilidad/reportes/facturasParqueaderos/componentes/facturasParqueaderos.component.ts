import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';

import {JasperComponent} from '../../../../../util/componentes/jasper/componentes/jasper.component';
@Component({
  selector: 'app-facturasParqueaderos-reporte',
  templateUrl: 'facturasParqueaderos.html'
})
export class FacturasParqueaderosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'REPORTEFACTURA', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    let finicio = new Date(this.anioactual, this.fechaactual.getMonth(), 1 );
    this.mcampos.fIngreso =  finicio;
    this.mcampos.fFinIngreso = this.fechaactual; 
  }

  ngAfterViewInit() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  descargarReporte(): void {
    this.jasper.nombreArchivo = 'ReporteFacturasParqueadero';

    if ((this.mcampos.fIngreso != null && this.mcampos.fFinIngreso == null) || (this.mcampos.fIngreso == null && this.mcampos.fFinIngreso != null) || (this.mcampos.fIngreso > this.mcampos.fFinIngreso)) {
      this.mostrarMensajeError("EL CAMPO DE FECHAS SON INCORRECTAS.");
    } else {

      if (this.mcampos.fIngreso === undefined || this.mcampos.fIngreso === null) {
        this.mcampos.fIngreso = null
      }

      if (this.mcampos.fFinIngreso === undefined || this.mcampos.fFinIngreso === null) {
        this.mcampos.fFinIngreso = null
      }
      
      // Agregar parametros


      this.jasper.parametros['@i_finicial'] = this.mcampos.fIngreso;
      this.jasper.parametros['@i_ffinal'] = this.mcampos.fFinIngreso;
      this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptConFacturasParqueadero';

      this.jasper.generaReporteCore();
    }
  }

  
}
