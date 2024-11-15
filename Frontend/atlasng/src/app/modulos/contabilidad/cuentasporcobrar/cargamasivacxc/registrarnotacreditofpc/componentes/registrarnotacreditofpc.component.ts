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
    selector: 'app-registrar-notacreditofpc',
    templateUrl: 'registrarnotacreditofpc.html'
})

export class RegistrarNotaCreditoFPCComponent extends BaseComponent implements OnInit, AfterViewInit {

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
        super(router, dtoServicios, 'TconFacturaParqueadero', 'FACTURASPARQUEADERO', true);
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
    }

    consultarFacturas() {
        const conFacturas = this.crearDtoConsulta();
        this.addConsultaPorAlias('FACTURASPARQUEADERO', conFacturas);

        this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
          .subscribe(
          resp => {
            this.manejaRespuesta(resp);
          },
          error => {
            this.dtoServicios.manejoError(error);
          });        
    }

    public crearDtoConsulta() {
     // this.mfiltrosesp.estadocdetalle = ` in ('CONTAB','PAGADO') `;
        this.mfiltrosesp.estadocdetalle = ` in ('CONTAB') `;
        this.mfiltrosesp.tipofactura = `not in ('NC')`;
        this.mfiltrosesp.cfacturaparqueadero = ` NOT IN (SELECT cfpnotacredito FROM tconfacturaparqueadero WHERE cfpnotacredito IS not null AND identificacion = t.identificacion)`;
        const consulta = new Consulta(this.entityBean, 'Y', 't.cfacturaparqueadero', this.mfiltros, this.mfiltrosesp);
        this.addConsulta(consulta);
        return consulta;
    }

    private manejaRespuesta(resp: any) {
        super.postQueryEntityBean(resp);
      }

    /**Se llama automaticamente luego de ejecutar una consulta. */
    public postQuery(resp: any) {
        super.postQueryEntityBean(resp);
    }

    grabar(): void {
        
        if (this.estaVacio(this.selectedRegistros)){
            super.mostrarMensajeError('SELECCIONE FACTURA PARA REGISTRAR NOTA DE CREDITO');
            return;
        }
        if (this.estaVacio(this.mcampos.comentario)) {
            super.mostrarMensajeError('INGRESE COMENTARIO');
            return;
        }
        if (this.estaVacio(this.mcampos.numdocumentosustento)) {
            super.mostrarMensajeError('INGRESE NUMERO DE NOTA DE CREDITO');
            return;
        }
        if (this.estaVacio(this.mcampos.fnotacredito)) {
            super.mostrarMensajeError('INGRESE FECHA DE NOTA DE CREDITO');
            return;
        }
        this.rqMantenimiento.mdatos.cfacturaparqueadero = this.selectedRegistros.cfacturaparqueadero;
        this.rqMantenimiento.mdatos.fnotacredito = this.mcampos.fnotacredito;
        this.rqMantenimiento.mdatos.comentario = this.mcampos.comentario;
        this.rqMantenimiento.mdatos.numdocumentosustento = this.mcampos.numdocumentosustento;
        this.rqMantenimiento.mdatos.identificacion = this.mfiltros.identificacion;
        this.rqMantenimiento.mdatos.actualizarsaldosenlinea = true;
        this.rqMantenimiento.mdatos.generarcomprobante = true;
        super.grabar();
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

    /**Muestra lov de Clientes */
    mostrarLovClientes(): void {
        this.lovClientes.showDialog();
    }

    fijarLovClientes(reg: any): void {
        if (reg.registro !== undefined) {
            this.mcampos.cpersona = reg.registro.cpersona;
            this.mfiltros.identificacion = reg.registro.identificacion;
            this.mcampos.ncliente = reg.registro.nombre;
            this.consultarFacturas();
        }
    }

    descargarReporte(): void {
        this.jasper.nombreArchivo = "Diario notas crédito - parqueadero";
        // Agregar parametros
        let tipoComprobante = 'Diario';
        this.jasper.parametros['@i_ccomprobante'] = this.mcampos.ccomprobante;
        this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/ComprobanteContable' + tipoComprobante;
        this.jasper.generaReporteCore();
    }
}