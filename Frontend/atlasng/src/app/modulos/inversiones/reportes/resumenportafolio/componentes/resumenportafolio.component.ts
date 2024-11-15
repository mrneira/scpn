
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem, SpinnerModule, FieldsetModule } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-resumenportafolio',
  templateUrl: 'resumenportafolio.html'
})
export class ResumenPortafolioComponent extends BaseComponent implements OnInit, AfterViewInit {

  public lEmisor: SelectItem[] = [{ label: '...', value: null }];

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, '', 'resumenportafolio', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.fcorte = new Date();
    
  }

  ngAfterViewInit() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  validarCabecera(): string {

    let lmensaje: string = "";

    
      if (this.estaVacio(this.mcampos.fhasta)) {
        lmensaje = "LA FECHA DE CORTE ES OBLIGATORIA";
      }  

      return lmensaje;
  }

  descargarReporte(): void {
    let lfhasta: number = (this.mcampos.fhasta.getFullYear() * 10000) + ((this.mcampos.fhasta.getMonth() + 1) * 100) + this.mcampos.fhasta.getDate();

    this.jasper.nombreArchivo = 'ReporteResumenPortafolio';
 
    // Agregar parametros
    this.jasper.parametros['@i_fvaloracion'] = lfhasta;
    //this.jasper.parametros['@i_usuario'] = this.dtoServicios.mradicacion.np;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvResumenPortafolio';
    this.jasper.generaReporteCore();
  }
  
}
