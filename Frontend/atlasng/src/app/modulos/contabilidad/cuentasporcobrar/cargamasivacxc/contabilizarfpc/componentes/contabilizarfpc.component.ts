import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { JasperComponent } from '../../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
    selector: 'app-cxc-contabilizarfpc',
    templateUrl: 'contabilizarfpc.html'
})

export class ContabilizarFPCComponent extends BaseComponent implements OnInit, AfterViewInit {

    @ViewChild('formFiltros') formFiltros: NgForm;
    @ViewChild(JasperComponent)
    public jasper: JasperComponent;
    public flagCont: boolean = false;
    public flagGrab: boolean = false;
    public suma_total: any = [];

    constructor(router: Router, dtoServicios: DtoServicios) {
        super(router, dtoServicios, 'TconFacturaParqueadero', 'FACTURASPARQUEADERO', false);
        this.componentehijo = this;
    }

    ngOnInit() {
        super.init(this.formFiltros);
        this.mfiltros.ffactura = this.fechaactual;
    }

    ngAfterViewInit() {
    }

    selectRegistro(registro: any) {
        // No existe para el padre
    }

    actualizar() {
        super.actualizar();
    }

    eliminar() {
        super.eliminar();
    }

    cancelar() {
        super.cancelar();
    }

    // Inicia CONSULTA *********************
    consultar() {
        if (this.mfiltros.fingreso == undefined && this.mfiltros.ffactura == undefined) {
            super.mostrarMensajeError('ELIJA ALMENOS UNO DE LOS PARAMETROS DE BUSQUEDA');
            return;
        }
        this.consultarFacturas();
    }

    consultarFacturas() {
        this.rqConsulta.mdatos.ffactura = this.mfiltros.ffactura === undefined ? "" : this.calendarToFechaString(this.mfiltros.ffactura)
        this.rqConsulta.mdatos.tipofactura = "C";
        this.rqConsulta.mdatos.estado = "INGRES";
        this.msgs = [];
        this.rqConsulta.CODIGOCONSULTA = 'CONTAB_FAC_PARQ';
        this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
            .subscribe(
                resp => {
                    this.lregistros = [];
                    this.mcampos = [];
                    this.flagCont = true;

                    if (resp.cod === 'OK') {
                        this.lregistros = resp.CONTAB_FAC_PARQ;
                        if (resp.suma_total != undefined)
                            this.suma_total = resp.suma_total;
                    }
                },
                error => {
                    this.dtoServicios.manejoError(error);
                });
    }

    /**Se llama automaticamente luego de ejecutar una consulta. */
    public postQuery(resp: any) {
        super.postQueryEntityBean(resp);
    }
    // Fin CONSULTA *********************

    // Inicia MANTENIMIENTO *********************
    grabar(): void {
        if (this.flagGrab) {
            super.mostrarMensajeError('YA HA CONTABILIZADO UN BLOQUE, REFRESQUE EL FORMULARIO SI DESEA CONTINUAR.');
            return;
        }
        if (this.mcampos.comentario === undefined || this.mcampos.comentario === '') {
            super.mostrarMensajeError('INGRESE COMENTARIO PARA CONTINUAR');
            return;
        }

        if (this.flagCont) {
            this.lmantenimiento = []; // Encerar Mantenimiento
            this.crearDtoMantenimiento();
            this.rqMantenimiento.mdatos.ffactura = this.calendarToFechaString(this.mfiltros.ffactura);
            this.rqMantenimiento.mdatos.tipofactura = "C";
            this.rqMantenimiento.mdatos.estado = "INGRES";
            this.rqMantenimiento.mdatos.comentario = this.mcampos.comentario;
            this.rqMantenimiento.mdatos.actualizarsaldosenlinea = true;
            super.grabar();
        }
        else {
            super.mostrarMensajeError('LOS PARAMETROS DE BUSQUEDA NO COINCIDEN CON LOS DATOS MOSTRADOS, REFRESQUE LA CONSULTA E INTENTE DE NUEVO.');
        }
    }

    contabilizar(): void {
        this.grabar();
    }

    public crearDtoMantenimiento() {
        const mantenimiento = super.getMantenimiento(1);
        super.addMantenimientoPorAlias(this.alias, mantenimiento);
    }

    public postCommit(resp: any) {
        super.postCommitEntityBean(resp);
        if (resp.ccompcontable != undefined) {
            this.mcampos.ccompcontable = resp.ccompcontable;
            this.mcampos.numerocomprobantecesantia = resp.numerocomprobantecesantia;
            this.descargarReporte();
            this.flagGrab = true;
        }
    }

    onChangeFecha() {
        this.flagCont = false;
        this.consultar();
    }

    descargarReporte(): void {
        this.jasper.nombreArchivo = "Diario general por registro de facturas por contrato - parqueadero";
        // Agregar parametros
        let tipoComprobante = 'Diario';
        this.jasper.parametros['@i_ccomprobante'] = this.mcampos.ccompcontable;
        this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/ComprobanteContable' + tipoComprobante;
        this.jasper.generaReporteCore();
    }
}