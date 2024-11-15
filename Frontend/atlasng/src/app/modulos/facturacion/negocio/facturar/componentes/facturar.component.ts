import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { BaseComponent } from 'app/util/shared/componentes/base.component';
import { DtoServicios } from 'app/util/servicios/dto.servicios';
import { Consulta } from 'app/util/dto/dto.component';
import { FacturaDetalleComponent } from './facturaDetalle.component';
import { LovClienteComponent } from 'app/modulos/facturacion/lov/cliente/componentes/lov.cliente.component';

@Component({
    selector: 'app-facturar',
    templateUrl: 'facturar.html'
})
export class FacturarComponent extends BaseComponent implements OnInit, AfterViewInit {

    @ViewChild('formFiltros') formFiltros: NgForm;

    @ViewChild(FacturaDetalleComponent)
    private detalle: FacturaDetalleComponent;

    @ViewChild(LovClienteComponent)
    private lovCliente: LovClienteComponent;

    constructor(router: Router, dtoServicios: DtoServicios) {
        super(router, dtoServicios, 'TfacFactura', 'TFACFACTURA', true);
        this.componentehijo = this;
    }

    ngOnInit() {
        super.init(this.formFiltros);
        this.detalle.componenteprincipal = this.componentehijo;
        this.detalle.formapago.componenteprincipal = this.componentehijo;

        this.consultarCatalogos();
    }

    ngAfterViewInit() {
    }

    crearNuevo() {
        super.crearNuevo();
        this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
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

    public selectRegistro(registro: any) {
        super.selectRegistro(registro);
    }

    public ejecutarCons(event) {
        this.consultar();
    }

    // Inicia CONSULTA *********************
    consultar() {
        this.crearDtoConsulta();
        super.consultar();
    }

    public crearDtoConsulta(): Consulta {
        this.fijarFiltrosConsulta();
        const consulta = new Consulta(this.entityBean, 'Y', 't.cfactura', this.mfiltros, this.mfiltrosesp, this.mfiltrosigual);
        consulta.cantidad = 20;
        this.addConsulta(consulta);
        return consulta;
    }

    private fijarFiltrosConsulta() {
    }

    validaFiltrosConsulta(): boolean {
        return super.validaFiltrosConsulta();
    }

    /**Se llama automaticamente luego de ejecutar una consulta. */
    public postQuery(resp: any) {
        super.postQueryEntityBean(resp);
    }
    // Fin CONSULTA *********************

    // Inicia MANTENIMIENTO *********************
    grabar(): void {
        this.formvalidado = true;
        this.deshabilitarEdicion();
        this.actualizar();

        this.lmantenimiento = []; // Encerar Mantenimiento
        this.crearDtoMantenimiento();
        super.addMantenimientoPorAlias(this.detalle.alias, this.detalle.getMantenimiento(2));
        super.addMantenimientoPorAlias(this.detalle.formapago.alias, this.detalle.formapago.getMantenimiento(3));

        super.grabar();
    }

    public crearDtoMantenimiento() {
        const mantenimiento = super.getMantenimiento(1);
        super.addMantenimientoPorAlias(this.alias, mantenimiento);
    }

    public postCommit(resp: any) {
        super.postCommitEntityBean(resp);
        this.detalle.postCommit(resp, this.getDtoMantenimiento(this.detalle.alias));

        if (resp.cod === 'OK' && !this.estaVacio(this.registro.cfactura)) {
            this.generarFacturaElectronica();
        }
    }

    public generarFacturaElectronica() {
        const rqMantenimiento = new Object();
        rqMantenimiento['CODMODULOORIGEN'] = this.mod;
        rqMantenimiento['CODTRANSACCIONORIGEN'] = this.tran;
        rqMantenimiento['cmodulo'] = 17;
        rqMantenimiento['ctransaccion'] = 100;
        rqMantenimiento['cfactura'] = this.registro.cfactura;

        this.dtoServicios.ejecutarRestMantenimiento(rqMantenimiento).subscribe(
            resp => {
                this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
                this.enproceso = false;
                this.grabo = true;
                if (resp.cod === 'OK') {
                    this.dtoServicios.llenarMensaje(resp, true, true);
                    this.Descargar(resp.claveacceso, resp.numdocumento);
                }
            },
            error => {
                this.dtoServicios.manejoError(error);
                this.enproceso = false;
                this.grabo = false;
            }
        );
    }

    Descargar(claveacceso, numdocumento) {
        this.rqConsulta.CODIGOCONSULTA = 'DESCARGACOMPROBANTE';
        this.rqConsulta.mdatos.numerodocumento = numdocumento;
        this.rqConsulta.mdatos.tipodocumento = 'FA';
        this.rqConsulta.mdatos.tipodescarga = 'btnpdf';
        this.rqConsulta.mdatos.clavedeacceso = claveacceso;
        this.rqConsulta.mdatos.modulo = 'PTV';
        this.msgs = [];
        this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
            .subscribe(
                resp => {
                    this.descargaAdjunto(resp);
                },
                error => {
                    this.dtoServicios.manejoError(error);
                });
    }

    descargaAdjunto(registro: any) {
        const linkElement = document.createElement('a');
        let bytes = registro.archivoDescarga;
        let base = this.arrayBufferToBase64(bytes);
        var blob = new Blob([this.base64ToArrayBuffer(bytes)], { type: registro.tipo });
        const bloburl = URL.createObjectURL(blob);
        if (registro.extension === 'pdf') {
            window.open(bloburl);
        } else {
            linkElement.href = bloburl;
            linkElement.download = registro.nombre;
            //  linkElement.click();
            const clickEvent = new MouseEvent('click', {
                'view': window,
                'bubbles': true,
                'cancelable': false
            });
            linkElement.dispatchEvent(clickEvent);
        }
        this.recargar();
    }

    arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    base64ToArrayBuffer(base64) {
        const binary_string = window.atob(base64);
        const len = binary_string.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    mostrarLovCliente(): void {
        this.lovCliente.consultar();
        this.lovCliente.showDialog();
    }

    fijarLovCliente(reg: any): void {
        this.registro.ccliente = reg.registro.ccliente;
        this.registro.mdatos.identificacion = reg.registro.identificacion;
        this.registro.mdatos.razonsocial = reg.registro.razonsocial;
        this.registro.mdatos.email = reg.registro.email;
        this.registro.mdatos.direccion = reg.registro.direccion;
    }

    consultarCatalogos(): any {
        this.encerarConsultaCatalogos();

        const mfiltroOrIng: any = { 'ctipomedida': 4 };
        const consultaOrgIng = new Consulta('TgenUnidadMedida', 'Y', 't.nombre', null, null, mfiltroOrIng);
        consultaOrgIng.cantidad = 100;
        this.addConsultaCatalogos('UNIDADMEDIDA', consultaOrgIng, this.detalle.formapago.lunidadmedida, super.llenaListaCatalogo, 'cmedida', null, false);

        this.ejecutarConsultaCatalogos();
    }
}
