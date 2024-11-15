import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovClientesComponent } from '../../../../lov/clientes/componentes/lov.clientes.component';
import { JasperComponent } from '../../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
    selector: 'app-registrar-depositofpc',
    templateUrl: 'registrardepositofpc.html'
})

export class RegistrarDepositoFPCComponent extends BaseComponent implements OnInit, AfterViewInit {

    @ViewChild('formFiltros') formFiltros: NgForm;
    @ViewChild(LovClientesComponent)

    private lovClientes: LovClientesComponent;
    public flagCont: boolean = false;
    public flagGrab: boolean = false;
    public suma_total: any = [];
    selectedRegistros: any = [];
    sumatorioFacturasPagadas = 0;
    @ViewChild(JasperComponent)
    public jasper: JasperComponent;
    constructor(router: Router, dtoServicios: DtoServicios) {
        super(router, dtoServicios, 'TconFacturaParqueadero', 'FACTURASPARQUEADERO', false);
        this.componentehijo = this;
    }

    ngOnInit() {
        super.init(this.formFiltros);
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
        this.rqConsulta.mdatos.ffactura = this.mfiltros.ffactura === undefined ? "" : this.calendarToFechaString(this.mfiltros.ffactura);
        this.rqConsulta.mdatos.tipofactura = "C";
        this.rqConsulta.mdatos.estado = "CONTAB";
        this.rqConsulta.mdatos.identificacion = this.mcampos.identificacion;
        this.msgs = [];
        this.rqConsulta.CODIGOCONSULTA = 'CONTAB_FAC_PARQ';
        this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
            .subscribe(
                resp => {
                    this.lregistros = [];
                    this.flagCont = true;

                    if (resp.cod === 'OK') {
                        resp.FACTURASPARQUEADERO = resp.CONTAB_FAC_PARQ;
                        super.postQueryEntityBean(resp);
                        for (const i in this.lregistros) {
                            this.lregistrosOriginales.push(this.lregistros[i]);
                        }
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
    checked(reg, event) {

        if (this.mcampos.valor === 0 || this.mcampos.valor === undefined) {
            super.mostrarMensajeError("INGRESE EL VALOR DEL DEPOSITO");
            event.currentTarget.checked = false;
            return;

        }

        if (event.currentTarget.checked === true) {
            this.selectedRegistros.push(reg);
            this.sumatorioFacturasPagadas += reg.total;
            this.mcampos.diferencia = this.mcampos.valor - this.redondear(this.sumatorioFacturasPagadas,2)
            ;
        } else {
            this.selectedRegistros.pop(reg);
            this.sumatorioFacturasPagadas -= reg.total;
            this.mcampos.diferencia = this.mcampos.valor - this.redondear(this.sumatorioFacturasPagadas,2);
        }
    }

    valorChange() {
        this.mcampos.diferencia = this.mcampos.valor - this.sumatorioFacturasPagadas;
    }
    // Inicia MANTENIMIENTO *********************
    grabar(): void {
        if (this.flagGrab) {
            super.mostrarMensajeError('YA HA CONTABILIZADO UN BLOQUE, REFRESQUE EL FORMULARIO SI DESEA CONTINUAR.');
            return;
        }

        if (this.mcampos.diferencia < 0) {
            super.mostrarMensajeError("EL SUMATORIO DE FACTURAS SUPERA AL VALOR REGISTRADO, POR FAVOR REVISE LOS DOCUMENTOS SELECCIONADOS");
            return;
        }

        if (this.mcampos.diferencia === this.mcampos.valor || this.mcampos.diferencia === undefined) {
            super.mostrarMensajeError("NO HA SELECCIONADO DOCUMENTOS PARA REGISTRAR DEPOSITO, POR FAVOR REVISE LOS DOCUMENTOS SELECCIONADOS");
            return;
        }

        if (this.flagCont) {
            this.lmantenimiento = []; // Encerar Mantenimiento
            this.lregistros = [];

            for (const i in this.selectedRegistros) {
                const reg = this.selectedRegistros[i];
                reg.actualizar = true;
                reg.estadocdetalle = "REGDEP";
                this.lregistros.push(reg);
            }
            const mantenimiento = super.getMantenimiento(1);
            super.addMantenimientoPorAlias(this.alias, mantenimiento);
            this.rqMantenimiento.mdatos.cpersonarecibido = this.mcampos.cpersona;
            this.rqMantenimiento.mdatos.ffactura = this.calendarToFechaString(this.mfiltros.ffactura);
            this.rqMantenimiento.mdatos.valor = this.mcampos.valor;
            this.rqMantenimiento.mdatos.comentario = this.mcampos.comentario;
            this.rqMantenimiento.mdatos.numerodocumentobancario = this.mcampos.numerodocumentobancario;
            this.rqMantenimiento.mdatos.actualizarsaldosenlinea = true;
            this.rqMantenimiento.mdatos.generarcomprobante = true;
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
        if (resp.ccomprobante != undefined) {
            this.mcampos.ccomprobante = resp.ccomprobante;
            this.mcampos.numerocomprobantecesantia = resp.numerocomprobantecesantia;
            this.descargarReporte();
            this.flagGrab = true;
            this.lregistros = [];
        }

    }

    onChangeFecha() {
        this.flagCont = false;
        this.consultar();
    }

    /**Muestra lov de Clientes */
    mostrarLovClientes(): void {
        this.lovClientes.showDialog();
    }

    /**Retorno de lov de Clientes. */
    fijarLovClientes(reg: any): void {
        if (reg.registro !== undefined) {
            this.mcampos.cpersona = reg.registro.cpersona;
            this.mcampos.identificacion = reg.registro.identificacion;
            this.mcampos.ncliente = reg.registro.nombre;
            this.consultarFacturas();
        }
    }

    filaDesSeleccionada(event) {
        this.sumatorioFacturasPagadas -= event.data.total;
        this.mcampos.diferencia = this.mcampos.valor - this.sumatorioFacturasPagadas;
    }

    filaSeleccionada(event) {
        if (event.originalEvent.checked) {
            this.sumatorioFacturasPagadas += event.data.total;
            this.mcampos.diferencia = this.mcampos.valor - this.sumatorioFacturasPagadas;
            if (this.mcampos.diferencia < 0) {
                super.mostrarMensajeError("VALOR TOTAL DE PAGO SUPERA SUMATORIO DE FACTURAS SELECCIONADAS");
            }
        }
    }

    descargarReporte(): void {
        this.jasper.nombreArchivo = "Comprobante de Ingreso por registro de depósito por contratos - parqueadero";
        // Agregar parametros
        let tipoComprobante = 'Ingreso';
        this.jasper.parametros['@i_ccomprobante'] = this.mcampos.ccomprobante;
        this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/ComprobanteContable' + tipoComprobante;
        this.jasper.generaReporteCore();
    }
}