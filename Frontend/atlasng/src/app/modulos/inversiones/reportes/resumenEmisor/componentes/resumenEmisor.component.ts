import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component';
import {ChangeDetectorRef} from '@angular/core';

@Component({
    selector: 'app-resumenEmisor',
    templateUrl: 'resumenEmisor.html', 
    styles: ['host /deep/ .newRow { background-color: gold!important; }']
})
export class ResumenEmisorComponent extends BaseComponent implements OnInit, AfterViewInit {

    @ViewChild('formFiltros') formFiltros: NgForm;

    @ViewChild(JasperComponent)
    public jasper: JasperComponent;

    public totalPorcenEjecucion: Number = 0;
    public totalPorcenParticipacion: Number = 0;
    public totalSaldoPorPagar: Number = 0;
    public totalSaldoPorDevengar: Number = 0;
    public totalSaldoPorComprometer: Number = 0;
    public totalSaldoPorCertificar: Number = 0;
    public totalPagado: Number = 0;
    public totalDevengado: Number = 0;
    public totalComprometido: Number = 0;
    public totalCodificado: Number = 0;
    public totalCertificado: Number = 0;
    public totalReforma: Number = 0;
    public totalAsignacionInicial: Number = 0;

    public regconsulta: any = [];
    public infoadicional = false;

    public lemisores: SelectItem[] = [{ label: '...', value: null }];

    constructor(router: Router, dtoServicios: DtoServicios, private changeDetectorRef: ChangeDetectorRef) {
        super(router, dtoServicios, 'tpptpartidagasto', 'CEDULAPRESUPUESTARIA', false);
        this.componentehijo = this;
    }

    ngOnInit() {
        super.init(this.formFiltros);
        this.consultar();
    }

    ngAfterViewInit() {
    }

    /**Se llama automaticamente luego de ejecutar una consulta. */
    public postQuery(resp: any) {
        super.postQueryEntityBean(resp);

    }

    validaFiltrosConsulta(): boolean {
        return super.validaFiltrosConsulta();
    }

    consultarEmisores() {
        this.rqConsulta.CODIGOCONSULTA = 'INV_EMISORESAFECHA';
        this.rqConsulta.storeprocedure = "sp_InvRptEmisorAFecha";
        this.msgs = [];
        this.rqConsulta.parametro_fvaloracion = this.fechaToInteger(this.mcampos.finicio);
        this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
            .subscribe(
                resp => {
                    this.manejarRespuestaEmisores(resp);
                },
                error => {
                    this.dtoServicios.manejoError(error);
                });
    }

    private manejarRespuestaEmisores(resp: any) {
        for (let i in resp.INV_EMISORESAFECHA) {
            let reg = resp.INV_EMISORESAFECHA[i];
            this.lemisores.push({ label: reg.nombre, value: reg.cdetalle });
          }
    }

    private fijarFiltrosConsulta() {
    }

    descargarReporte(): void {
        this.jasper.nombreArchivo = 'ResumenEmisor';
     
        // Agregar parametros
        this.jasper.parametros['@i_fvaloracion'] = this.fechaToInteger(this.mcampos.finicio);
        this.jasper.parametros['@i_cemisor'] = this.mcampos.emisor;
        this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Inversiones/rptInvResumenEmisor';
        this.jasper.generaReporteCore();
      }
}
