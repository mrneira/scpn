import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-recepcion-seguros',
  templateUrl: 'recepcionSeguros.html'
})
export class RecepcionSegurosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'RECEPCIONSEGUROS', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
  }

  ngAfterViewInit() {
  }

  imprimir(): void {

      if ((this.mcampos.finicio != null && this.mcampos.ffin == null) || (this.mcampos.finicio == undefined && this.mcampos.ffin == undefined) || (this.mcampos.finicio == null && this.mcampos.ffin != null) || (this.mcampos.finicio > this.mcampos.ffin)) {
        this.mostrarMensajeError("EL CAMPO DE FECHAS SON INCORRECTAS.");
        return;
      }
  


    this.jasper.nombreArchivo = 'ReporteRecepcionSeguros-' + this.dtoServicios.mradicacion.fcontable;
    this.jasper.parametros['@i_finicio']	= this.fechaToInteger( this.mcampos.finicio);
    this.jasper.parametros['@i_ffin']	= this.fechaToInteger(this.mcampos.ffin);
    this.jasper.formatoexportar = 'xls';
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Seguros/rptSgsRecepcion';

    this.jasper.generaReporteCore();
  }

  consultarCatalogos(): void {

  }

}

