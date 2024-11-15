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
  selector: 'app-reporte-rolPagos',
  templateUrl: 'rolPagos.html'
})
export class RolPagosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild('rep1')
  public jasper: JasperComponent;

  @ViewChild('rep2')
  public jasper2: JasperComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'rolPagos', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mfiltros.anio = new Date().getFullYear();
    
    this.consultarCatalogos();
    this.mfiltros.mescdetalle = null;
  }

  ngAfterViewInit() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }
  
  // Inicia CONSULTA *********************
  consultar() {
    
    if (this.estaVacio(this.mfiltros.anio)) {
      this.mcampos.anio = -1;
    } else {
      this.mcampos.anio = this.mfiltros.anio;
    }

    if (this.estaVacio(this.mfiltros.mescdetalle)) {
      this.mcampos.mes = 'X';
    } else {
      this.mcampos.mes = this.mfiltros.mescdetalle;
    }
    
      this.consultarRol();
  }
  
  consultarRol() {

    this.rqConsulta.CODIGOCONSULTA = 'TH_ROLPAGOS';
    this.rqConsulta.storeprocedure = "sp_TthRptListadoRolDePagos";
    this.rqConsulta.parametro_cfuncionario = sessionStorage.getItem("cfuncionario");
    this.rqConsulta.parametro_anio = this.mcampos.anio;
    this.rqConsulta.parametro_mes = this.mcampos.mes;
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.manejaRespuestaRol(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  private manejaRespuestaRol(resp: any) {
    this.lregistros = [];
    if (resp.cod === 'OK') {
      this.lregistros = resp.TH_ROLPAGOS;
    }
  }

  descargarReporte(reg: any): void {

    this.jasper.formatoexportar=reg;
    this.jasper.nombreArchivo = 'RolDePagos';

    

    this.jasper.parametros['@i_cfuncionario'] = sessionStorage.getItem("cfuncionario");
    this.jasper.parametros['@i_anio'] = this.mcampos.anio;
    this.jasper.parametros['@i_mes'] = this.mcampos.mes;

    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/TalentoHumano/rptTthListadoRolPagos';
    this.jasper.generaReporteCore();
  }
  descargar(reg: any): void {

    this.jasper2.formatoexportar='pdf';
    this.jasper2.nombreArchivo = 'Rol De Pagos';
    this.jasper2.parametros['@i_crol'] = reg.crol;
    this.jasper2.parametros['archivoReporteUrl'] = '/CesantiaReportes/TalentoHumano/rptTthRolPagos';
    this.jasper2.generaReporteCore();
  }

    /**Se llama automaticamente luego de ejecutar una consulta. */
    public postQuery(resp: any) {
      super.postQueryEntityBean(resp);
    }

    consultarCatalogos(): any {
      this.encerarConsultaCatalogos();
  
      const mfiltrosMes: any = { 'ccatalogo': 4 };
      const consultaMes = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosMes, {});
      consultaMes.cantidad = 50;
      this.addConsultaCatalogos('MESES', consultaMes, this.lmeses, super.llenaListaCatalogo, 'cdetalle');
  
      this.ejecutarConsultaCatalogos();
    }


}
