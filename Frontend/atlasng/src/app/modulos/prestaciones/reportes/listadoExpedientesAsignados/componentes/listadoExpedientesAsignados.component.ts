import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
    selector: 'app-listado-expedientes-asignados',
    templateUrl: 'listadoExpedientesAsignados.html'
})

export class ListadoExpedientesAsignadosComponent extends BaseComponent implements OnInit, AfterViewInit {

    @ViewChild('formFiltros') formFiltros: NgForm;

    @ViewChild(JasperComponent)
    public jasper: JasperComponent;

    constructor(router: Router, dtoServicios: DtoServicios) {
        super(router, dtoServicios, '', '', false, false);
        this.componentehijo = this;
    }

    ngOnInit() {
        super.init();
        this.mcampos.anio = this.anioactual;
    }

    ngAfterViewInit() { }

    public postQuery(resp: any) { }

    descargarReporte(tipo = null) {
        if (!this.mcampos.finicio) {
            this.mostrarMensajeError("DEBE INGRESAR UNA FECHA DESDE DONDE DECEA GENERAR EL REPORTE.");
            return;
        }
        if (!this.mcampos.ffin) {
            this.mostrarMensajeError("DEBE INGRESAR UNA FECHA HASTA DONDE DECEA GENERAR EL REPORTE.");
            return;
        }
        if(new Date(this.mcampos.finicio).getTime() > new Date(this.mcampos.ffin).getTime()){
            this.mostrarMensajeError("LA FECHA DESDE NO DEBE SER MAYOR A LA FECHA HASTA.");
            return;
        }
        if (tipo == "PDF") {
            this.jasper.formatoexportar = 'pdf';
        } else {
            this.jasper.formatoexportar = 'xls';
        }
        this.jasper.nombreArchivo = 'listadoAsignacionExpediente';
        this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestaciones/rptPreConsultaListadoExpedientesAsig';
        this.jasper.parametros['@i_fInicio'] = this.mcampos.finicio;
        this.jasper.parametros['@i_fFin'] = this.mcampos.ffin;
        this.jasper.parametros['@w_usuario'] = this.dtoServicios.mradicacion["np"];
        this.jasper.parametros['@w_ambiente'] = this.dtoServicios.mradicacion["nambiente"];
        console.log(this.jasper);
        this.jasper.generaReporteCore();
    }
}