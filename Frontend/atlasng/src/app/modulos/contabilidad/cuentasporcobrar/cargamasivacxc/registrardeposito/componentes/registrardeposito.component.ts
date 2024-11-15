import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovCuentasContablesComponent } from '../../../../lov/cuentascontables/componentes/lov.cuentasContables.component';
import { JasperComponent } from '../../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
    selector: 'app-registrar-deposito',
    templateUrl: 'registrardeposito.html'
})

export class RegistrarDepositoComponent extends BaseComponent implements OnInit, AfterViewInit {

    @ViewChild('formFiltros') formFiltros: NgForm;
    @ViewChild(LovCuentasContablesComponent)
    @ViewChild(JasperComponent)
    public jasper: JasperComponent;
    private lovcuentascontables: LovCuentasContablesComponent;

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
        this.rqConsulta.mdatos.ffactura = this.mfiltros.ffactura === undefined ? "" : this.calendarToFechaString(this.mfiltros.ffactura);
        this.rqConsulta.mdatos.tipofactura = "D";
        this.rqConsulta.mdatos.estado = "CONTAB";
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

    // Inicia MANTENIMIENTO *********************
    grabar(): void {
        if (this.flagGrab) {
            super.mostrarMensajeError('YA HA CONTABILIZADO UN BLOQUE, REFRESQUE EL FORMULARIO SI DESEA CONTINUAR.');
            return;
        }

        if (this.flagCont) {
            this.lmantenimiento = []; // Encerar Mantenimiento
            for (const i in this.lregistros) {
                this.lregistros[i].actualizar = true;
                this.lregistros[i].estadocdetalle = "REGDEP";
                this.lregistros[i].cusuariomod = this.dtoServicios.mradicacion.cusuario;
                this.lregistros[i].fmodificacion = this.fechaactual;
            }
            const mantenimiento = super.getMantenimiento(1);
            super.addMantenimientoPorAlias(this.alias, mantenimiento);
            this.rqMantenimiento.mdatos.ffactura = this.calendarToFechaString(this.mfiltros.ffactura);
            this.rqMantenimiento.mdatos.valor = this.suma_total[2];
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
            this.lregistros =[];
        }

    }

    onChangeFecha() {
        this.flagCont = false;
        this.consultar();
    }

          /**Muestra lov de cuentas contables */
  mostrarlovcuentascontables(): void {
    this.lovcuentascontables.mfiltros.activa = true;
    this.lovcuentascontables.mfiltros.padre = '110101';
    this.lovcuentascontables.mfiltros.movimiento = true;
    this.lovcuentascontables.consultar();
    this.lovcuentascontables.showDialog(true);
  }

  /**Retorno de lov de cuentas contables. */
  fijarLovCuentasContablesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.cctacajaparqueadero = reg.registro.ccuenta;
      this.rqMantenimiento.mdatos.cctacajaparqueadero = reg.registro.ccuenta;
      this.mcampos.ncuenta = reg.registro.nombre;
      this.lregistros = [];
      this.consultar();
    }
  }

  descargarReporte(): void {
    this.jasper.nombreArchivo = "Comprobante de Ingreso por registro de depósito de facturas diarias de parqueadero";
    // Agregar parametros
    let tipoComprobante = 'Ingreso';
    this.jasper.parametros['@i_ccomprobante'] = this.mcampos.ccomprobante ;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/ComprobanteContable' + tipoComprobante;
    this.jasper.generaReporteCore();
  }
}