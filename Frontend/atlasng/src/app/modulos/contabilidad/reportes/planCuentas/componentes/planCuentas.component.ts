import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem, SpinnerModule, FieldsetModule } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import { CatalogoDetalleComponent } from 'app/modulos/generales/catalogos/componentes/_catalogoDetalle.component';

@Component({
  selector: 'app-planCuentas',
  templateUrl: 'planCuentas.html'
})
export class PlanCuentasComponent extends BaseComponent implements OnInit, AfterViewInit {

  public lEmisor: SelectItem[] = [{ label: '...', value: null }];
  private catalogoDetalle: CatalogoDetalleComponent;
  public ltipoplancdetalle: SelectItem[] = [{ label: '...', value: null }];
  public tipoplan = '';

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

 
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tconcatalogo', 'TCONCATALOGO', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.fcorte = new Date();
    this.consultarCatalogos();
    0
  }

  ngAfterViewInit() {
  }

   
  
   
  
    private fijarFiltrosConsulta() {
    }
  

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1001;
    const conTipoplan = this.catalogoDetalle.crearDtoConsulta();
    this.addConsultaCatalogos('TIPOPLAN', conTipoplan, this.ltipoplancdetalle, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }

  imprimir(resp: any): void {
    this.jasper.nombreArchivo = 'rptConPlanCuentas';

    this.jasper.formatoexportar = resp;

    // Agregar parametros
    if( this.mfiltros.tipoplancdetalle === undefined ||  this.mfiltros.tipoplancdetalle===null){
      this.mfiltros.tipoplancdetalle='';
    }
  
    this.jasper.parametros['@i_cdetalle'] = this.mfiltros.tipoplancdetalle;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptConPlanCuentas';
    this.jasper.generaReporteCore();
    
  }



  

}
