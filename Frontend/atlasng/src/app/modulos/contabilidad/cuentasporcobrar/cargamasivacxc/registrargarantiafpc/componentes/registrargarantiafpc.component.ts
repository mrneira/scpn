import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { LovClientesComponent } from '../../../../lov/clientes/componentes/lov.clientes.component';
import { LovCuentasContablesComponent } from '../../../../lov/cuentascontables/componentes/lov.cuentasContables.component';
import { JasperComponent } from '../../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
    selector: 'app-cxc-registrargarantiafpc',
    templateUrl: 'registrargarantiafpc.html'
})

export class RegistrarGarantiaFPCComponent extends BaseComponent implements OnInit, AfterViewInit {

    @ViewChild(LovClientesComponent)
    private lovClientes: LovClientesComponent;
    @ViewChild(LovCuentasContablesComponent)
    private lovcuentascontables: LovCuentasContablesComponent;
    @ViewChild(JasperComponent)
    public jasper: JasperComponent;
    constructor(router: Router, dtoServicios: DtoServicios) {
        super(router, dtoServicios, 'tcongarantiaparqueadero', 'GARANTIAPARQUEADERO', false);
        this.componentehijo = this;
    }

    ngOnInit() {
        this.consultarCodigoPlantilla();
        this.crearnuevoRegistro();
        this.registro.ccompania = 1;
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

    consultarCodigoPlantilla() {
        const conPlantilla = new Consulta('tconparametros', 'N', '', { codigo: 'PLANTILLA_CONTABLE_GAR_PARQ_CONTRATO' }, {}, {});
        this.addConsultaPorAlias('CODIGOPLANTILLA', conPlantilla);

        this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
            .subscribe(
                resp => {
                    this.manejaRespuestaConsultarCodigoPlantilla(resp);
                },
                error => {
                    this.dtoServicios.manejoError(error);
                });
    }

    private manejaRespuestaConsultarCodigoPlantilla(resp: any) {
        if (resp.cod === 'OK') {
            const reg = resp.CODIGOPLANTILLA;
            this.mcampos.cplantilla = reg.numero;
            return;
        } else {
            super.mostrarMensajeError('PLANTILLA CONTABLE PARA REGISTRO DE GARANTIAS NO EXISTE');
            return;
        }
    }
    // Inicia CONSULTA *********************
    consultar() {
    }

    /**Se llama automaticamente luego de ejecutar una consulta. */
    public postQuery(resp: any) {
    }
    // Fin CONSULTA *********************

    // Inicia MANTENIMIENTO *********************
    grabar(): void {
        this.lmantenimiento = []; // Encerar Mantenimiento
        this.rqMantenimiento.mdatos.cplantilla = this.mcampos.cplantilla;
        this.rqMantenimiento.mdatos.generarcomprobante = true;
        this.rqMantenimiento.mdatos.actualizarsaldosenlinea = true;
        this.actualizar();
        this.crearDtoMantenimiento();
        super.grabar();
    }

    registrargarantia(): void {
        this.grabar();
    }

    public crearDtoMantenimiento() {
        const mantenimiento = super.getMantenimiento(1);
        super.addMantenimientoPorAlias(this.alias, mantenimiento);
    }

    public postCommit(resp: any) {
        super.postCommitEntityBean(resp);
        if (resp.ccomprobanteregistro != undefined) {
            this.mcampos.ccomprobanteregistro = resp.ccomprobanteregistro;
            this.mcampos.numerocomprobantecesantia = resp.numerocomprobantecesantia;
            this.descargarReporte();
            //this.grabo = true;
        }
    }
    /**Muestra lov de Clientes */
    mostrarLovClientes(): void {
        this.lovClientes.showDialog();
    }

    /**Retorno de lov de Clientes. */
    fijarLovClientes(reg: any): void {
        if (reg.registro !== undefined) {
            this.registro.cpersona = reg.registro.cpersona;
            this.mcampos.identificacion = reg.registro.identificacion;
            this.mcampos.ncliente = reg.registro.nombre;
        }
    }

    mostrarlovcuentascontables(): void {
        this.lovcuentascontables.mfiltros.activa = true;
        this.lovcuentascontables.mfiltros.movimiento = true;
        this.lovcuentascontables.mfiltrosesp.ccuenta = ' in (select ccuenta from tconplantilladetalle where debito = 1 and ccompania = 1 and cplantilla = ' + this.mcampos.cplantilla + ')';
        this.lovcuentascontables.consultar();
        this.lovcuentascontables.showDialog(true);
    }

    fijarLovCuentasContablesSelec(reg: any): void {
        if (reg.registro !== undefined) {
            this.mcampos.ncuenta = reg.registro.nombre;
            this.registro.ccuenta = reg.registro.ccuenta;
        } 
    }

    //#region Reporte
  descargarReporte(): void {

    this.jasper.nombreArchivo = "Comprobante de Ingreso por registro de garantías parqueadero";
    // Agregar parametros
    let tipoComprobante = 'Ingreso';
    this.jasper.parametros['@i_ccomprobante'] = this.mcampos.ccomprobanteregistro ;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/ComprobanteContable' + tipoComprobante;
    this.jasper.generaReporteCore();
  }
  //#endregion
}