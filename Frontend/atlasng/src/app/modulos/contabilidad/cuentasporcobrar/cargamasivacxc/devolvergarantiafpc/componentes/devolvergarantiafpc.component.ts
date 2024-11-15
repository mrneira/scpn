import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { LovClientesComponent } from '../../../../lov/clientes/componentes/lov.clientes.component';
import { JasperComponent } from '../../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
    selector: 'app-cxc-devolvergarantiafpc',
    templateUrl: 'devolvergarantiafpc.html'
})

export class DevolverGarantiaFPCComponent extends BaseComponent implements OnInit, AfterViewInit {

    @ViewChild(LovClientesComponent)
    private lovClientes: LovClientesComponent;
    @ViewChild(JasperComponent)
    public jasper: JasperComponent;    
    selectedRegistro: any;
    constructor(router: Router, dtoServicios: DtoServicios) {
        super(router, dtoServicios, 'tcongarantiaparqueadero', 'GARANTIAPARQUEADERO', false);
        this.componentehijo = this;
    }

    ngOnInit() {
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

  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.mfiltrosesp.ccomprobantedevolucion = 'is null';
    const consulta = new Consulta(this.entityBean, 'Y', 't.ccomprobanteregistro', this.mfiltros, this.mfiltrosesp);
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

    /**Se llama automaticamente luego de ejecutar una consulta. */
    public postQuery(resp: any) {
        super.postQueryEntityBean(resp);
    }
    // Fin CONSULTA *********************

    // Inicia MANTENIMIENTO *********************
    grabar(): void {
        this.lmantenimiento = []; // Encerar Mantenimiento
        this.rqMantenimiento.mdatos.generarcomprobante = true;
        this.rqMantenimiento.mdatos.actualizarsaldosenlinea = true;
        this.rqMantenimiento.mdatos.comentario = this.mcampos.comentario;
        this.lregistros = [];
          const reg = this.selectedRegistro;
          reg.esnuevo = true;
          this.lregistros.push(reg);

        this.crearDtoMantenimiento();
        super.grabar();
    }

    devolvergarantia(): void {
        if (this.estaVacio(this.selectedRegistro)){
            super.mostrarMensajeError("NO HA SELECCIONADO REGISTROS PARA DEVOLUCION DE GARANTIAS");
            return;
        }
        if (this.estaVacio(this.mcampos.comentario)){
            super.mostrarMensajeError("NO HA INGRESADO COMENTARIO");
            return;
        }
        this.grabar();
    }

    public crearDtoMantenimiento() {
        const mantenimiento = super.getMantenimiento(1);
        super.addMantenimientoPorAlias(this.alias, mantenimiento);
    }

    public postCommit(resp: any) {
        super.postCommitEntityBean(resp);
        if (resp.cod === 'OK') {
            this.mcampos.ccomprobantedevolucion = resp.ccomprobantedevolucion;
            this.mcampos.numerocomprobantecesantia = resp.numerocomprobantecesantia;
            this.grabo = true;
            this.descargarReporte();
        }
    }
    /**Muestra lov de Clientes */
    mostrarLovClientes(): void {
        this.lovClientes.showDialog();
    }

    /**Retorno de lov de Clientes. */
    fijarLovClientes(reg: any): void {
        if (reg.registro !== undefined) {
            this.mfiltros.cpersona = reg.registro.cpersona;
            this.mcampos.identificacion = reg.registro.identificacion;
            this.mcampos.ncliente = reg.registro.nombre;
            this.consultar();
        }
    }

        //#region Reporte
  descargarReporte(): void {

    this.jasper.nombreArchivo = "Comprobante de Diario por registro de devolución de garantías parqueadero";
    // Agregar parametros
    let tipoComprobante = 'Diario';
    this.jasper.parametros['@i_ccomprobante'] = this.mcampos.ccomprobantedevolucion ;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/ComprobanteContable' + tipoComprobante;
    this.jasper.generaReporteCore();
  }

}