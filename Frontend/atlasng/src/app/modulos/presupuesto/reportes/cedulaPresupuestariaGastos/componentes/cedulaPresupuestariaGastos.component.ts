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
    selector: 'app-reporte-cedulaPresupuestariaGastos',
    templateUrl: 'cedulaPresupuestariaGastos.html', 
    styles: ['host /deep/ .newRow { background-color: gold!important; }']
})
export class CedulaPresupuestariaGastosComponent extends BaseComponent implements OnInit, AfterViewInit {

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

    // Inicia CONSULTA *********************
    consultar() {
        this.consultarComprobantes();
    }

    consultarComprobantes() {
        this.rqConsulta.CODIGOCONSULTA = 'PPT_CEDULAGASTOS';
        this.rqConsulta.storeprocedure = "sp_PptRptCedulaPresupuestariaGastos";
        this.msgs = [];
        this.rqConsulta.parametro_usuariolog = this.dtoServicios.mradicacion.np;
        this.rqConsulta.parametro_movimiento = 1;

        this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
            .subscribe(
                resp => {
                    this.manejaRespuestaComprobantes(resp);
                },
                error => {
                    this.dtoServicios.manejoError(error);
                });
    }

    private manejaRespuestaComprobantes(resp: any) {
        this.lregistros = resp.PPT_CEDULAGASTOS;
        this.calcularTotales(this.lregistros);
    }

    public crearDtoConsulta() {
        this.fijarFiltrosConsulta();
        const consulta = new Consulta(this.entityBean, 'Y', 't.ccompromiso', this.mfiltros, this.mfiltrosesp);
        consulta.addSubquery('tpptcompromiso', 'ccompromiso', 'compromiso', 'i.ccompromiso = t.ccompromiso');

        this.addConsulta(consulta);
        return consulta;
    }
    private fijarFiltrosConsulta() {
    }

    public calcularTotales(lista: any) {
        this.totalPorcenEjecucion = 0;
        this.totalPorcenParticipacion = 0;
        this.totalSaldoPorPagar = 0
        this.totalSaldoPorDevengar = 0;
        this.totalSaldoPorComprometer = 0;
        this.totalSaldoPorCertificar = 0;
        this.totalPagado = 0;
        this.totalDevengado = 0;
        this.totalComprometido = 0;
        this.totalCodificado = 0;
        this.totalCertificado = 0;
        this.totalReforma = 0;
        this.totalAsignacionInicial = 0;
        for (const i in lista) {
            const reg = lista[i];
            if (reg.movimiento === 'Si') {
                this.totalPorcenEjecucion += reg.porcenejecucion;
                this.totalPorcenParticipacion += reg.porcenparticipacion;
                this.totalSaldoPorPagar += reg.vsaldoporpagar;
                this.totalSaldoPorDevengar += reg.vsaldopordevengar;
                this.totalSaldoPorCertificar += reg.vsaldoporcertificar;
                this.totalSaldoPorComprometer += reg.vsaldoporcomprometer;
                this.totalPagado += reg.vpagado;
                this.totalDevengado += reg.vdevengado;
                this.totalComprometido += reg.vcomprometido;
                this.totalCodificado += reg.vcodificado;
                this.totalCertificado += reg.vcertificado;
                this.totalReforma += reg.vmodificado;
                this.totalAsignacionInicial += reg.vasignacioninicial;
            }
        }
    }

    filaEstilo(rowData, rowIndex) {
      return ('newRow');
        // if (rowData.movimiento === 'No') {
        //     return ('font-weight: bold');
        // }
        // if (!this.changeDetectorRef['destroyed']) {
        //   this.changeDetectorRef.detectChanges();
        // }
    }

    descargarReporte(reg: any): void {

        var vacio = '';
        this.jasper.formatoexportar = reg;
        this.jasper.nombreArchivo = 'rptPptCedulaPresupuestariaGastos';

        // Agregar parametros
        this.jasper.parametros['@i_usuariolog'] = this.dtoServicios.mradicacion.cusuario;
        this.jasper.parametros['@i_movimiento'] = vacio;

        this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Presupuesto/rptPptCedulaPresupuestariaGastos';
        this.jasper.generaReporteCore();
    }
}
