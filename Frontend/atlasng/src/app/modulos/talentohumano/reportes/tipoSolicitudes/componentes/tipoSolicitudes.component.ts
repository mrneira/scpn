import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../util/shared/componentes/base.component';
import {CatalogoDetalleComponent}from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import {SelectItem} from 'primeng/primeng';

import {JasperComponent} from '../../../../../util/componentes/jasper/componentes/jasper.component';


@Component({
  selector: 'app-reporte-tipoSolicitudes',
  templateUrl: 'tipoSolicitudes.html'
})
export class TipoSolicitudesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  
  @ViewChild(JasperComponent)
  public jasper: JasperComponent;


 
  public ltipo: SelectItem[] = [{ label: '...', value: null }];
  private catalogoDetalle: CatalogoDetalleComponent;
  
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'NOMSOLICITUD', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);  
    this.consultarCatalogos();

  }

  ngAfterViewInit() {
  }



  consultarCatalogos(): void {
    this.encerarConsultaCatalogos();

    this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1139;
    const consTipo = this.catalogoDetalle.crearDtoConsulta();
    consTipo.cantidad = 100;
    this.addConsultaCatalogos('TIPO', consTipo, this.ltipo, super.llenaListaCatalogo, 'cdetalle');
    this.ejecutarConsultaCatalogos();
  }


  consultar(): any {
    }

  descargarReporte(): void {

    this.jasper.nombreArchivo = 'ReportetipoSolicitudes';

    if(this.mfiltros.ltipo === undefined ||this.mfiltros.ltipo === null) 
    {
      this.mfiltros.ltipo = -1;
    }
    
    // Agregar parametros
    this.jasper.parametros['@i_tipo'] = this.mfiltros.ltipo;
    this.jasper.parametros['@i_finicio'] = this.mfiltros.finicio;
    this.jasper.parametros['@i_ffin'] = this.mfiltros.ffin;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/TalentoHumano/rptTthTipoSolicitud';
    this.jasper.generaReporteCore();
  }
  validarFecha() {
    if (!this.estaVacio(this.mfiltros.finicio)) {
      this.mfiltros.fmin = new Date(this.mfiltros.finicio);
    }
    this.mfiltros.ffin=null;
  }


}
