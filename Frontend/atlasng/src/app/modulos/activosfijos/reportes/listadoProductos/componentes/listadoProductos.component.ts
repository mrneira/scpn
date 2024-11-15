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
  selector: 'app-listadoProductos',
  templateUrl: 'listadoProductos.html'
})
export class ListadoProductosComponent extends BaseComponent implements OnInit, AfterViewInit {

  public ltipoproducto: SelectItem[] = [{ label: '...', value: null }];


  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

 
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tacfproducto', 'TACFPRODUCTO', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();    
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
      const conTipoProducto = new Consulta('tacftipoproducto', 'Y', 't.nombre',{}, this.mfiltrosesp);
      conTipoProducto.cantidad = 10;
      this.addConsultaCatalogos('TIPOPRODUCTO', conTipoProducto, this.ltipoproducto, this.llenaListaCatalogo, 'ctipoproducto', null);
   
    this.ejecutarConsultaCatalogos();
  }

  imprimir(resp: any): void {
    this.jasper.nombreArchivo = 'rptAcfListadoProductos';

    this.jasper.formatoexportar = resp;

    // Agregar parametros
    if( this.mfiltros.ctipoproducto === undefined ||  this.mfiltros.ctipoproducto===null){
      this.mfiltros.ctipoproducto='';
    }
  
    this.jasper.parametros['@i_ctipo'] = this.mfiltros.ctipoproducto;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/ActivosFijos/rptAcfListadoProductos';
    this.jasper.generaReporteCore();
    
  }



  

}
