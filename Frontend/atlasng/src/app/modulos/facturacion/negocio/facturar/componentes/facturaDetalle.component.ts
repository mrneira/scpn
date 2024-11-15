import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { BaseComponent } from 'app/util/shared/componentes/base.component';
import { DtoServicios } from 'app/util/servicios/dto.servicios';
import { Consulta } from 'app/util/dto/dto.component';
import { LovProductosComponent } from 'app/modulos/facturacion/lov/productos/componentes/lov.productos.component';
import { FacturaFormaPagoComponent } from './formaPago.component';

@Component({
    selector: 'app-fact-det',
    templateUrl: 'facturaDetalle.html'
})
export class FacturaDetalleComponent extends BaseComponent implements OnInit, AfterViewInit {

    @ViewChild('formFiltros') formFiltros: NgForm;

    @ViewChild(LovProductosComponent)
    private lovProductos: LovProductosComponent;

    @ViewChild(FacturaFormaPagoComponent)
    public formapago: FacturaFormaPagoComponent;

    subtotal = 0;

    subtotalexento = 0;

    descuento = 0;

    total = 0;

    mimpuestos: any = {};

    constructor(router: Router, dtoServicios: DtoServicios) {
        super(router, dtoServicios, 'TfacFacturaDetalle', 'TFACFACTURADETALLE', false, false);
        this.componentehijo = this;
    }

    ngOnInit() {
        super.init(this.formFiltros);
    }

    ngAfterViewInit() {
    }

    crearNuevo() {
        super.crearNuevo();
    }

    actualizar() {
        super.actualizar();
    }

    eliminar() {
        super.eliminar();
        this.generarTotales();
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
        const consulta = new Consulta(this.entityBean, 'Y', 't.cdetalle', this.mfiltros, this.mfiltrosesp, this.mfiltrosigual);
        consulta.addSubquery('TfacProducto', 'nombre', 'nproducto', 'i.cproducto=t.cproducto');
        consulta.cantidad = 20;
        this.addConsulta(consulta);
        return consulta;
    }

    private fijarFiltrosConsulta() {
    }

    validaFiltrosConsulta(): boolean {
        return super.validaFiltrosConsulta();
    }

    public postQuery(resp: any) {
        super.postQueryEntityBean(resp);
    }

    grabar(): void {
        this.lmantenimiento = []; // Encerar Mantenimiento
        this.crearDtoMantenimiento();
        super.grabar();
    }

    public crearDtoMantenimiento() {
        const mantenimiento = super.getMantenimiento(1);
        super.addMantenimientoPorAlias(this.alias, mantenimiento);
    }

    public postCommit(resp: any, dtoext = null) {
        super.postCommitEntityBean(resp, dtoext);
    }

    totalItem(reg) {
        super.crearNuevo();
        this.selectRegistro(reg);
        if (this.estaVacio(this.registro.cantidad)) {
            this.registro.total = 0;
            this.mostrarMensajeError('PRODUCTO SIN VALOR UNITARIO');
            return false;
        }

        if (this.estaVacio(this.registro.mdatos.porciva)) {
            this.mostrarMensajeError('PORCENTAJE DE IVA NO DEFINIDO PARA EL PRODUCTO');
            return false;
        }

        const piva = Number((this.registro.mdatos.porciva / 100).toFixed(2));
        // const pice = (!this.estaVacio(this.registro.mdatos.porcice) ? this.registro.mdatos.porcice : 0) / 100;
        const pirbpnr = Number(((!this.estaVacio(this.registro.mdatos.porcirbpnr) ? this.registro.mdatos.porcirbpnr : 0) / 100).toFixed(2));

        this.registro.subtotal = this.registro.cantidad * this.registro.preciounitario;
        this.registro.descuento = (this.registro.subtotal * this.registro.mdatos.porcentajedescuento) / 100;
        this.registro.iva = (this.registro.subtotal - this.registro.descuento) * piva;
        this.registro.ice = this.registro.cantidad * this.registro.mdatos.ice;
        this.registro.irbpnr = (this.registro.subtotal - this.registro.descuento) * pirbpnr;
        this.registro.total = this.registro.subtotal - this.registro.descuento + this.registro.iva + this.registro.ice + this.registro.irbpnr;
        this.registro.preciounitario=reg.preciounitario;
        this.registro.subtotal = Number(this.registro.subtotal.toFixed(2));
        this.registro.descuento = Number(this.registro.descuento.toFixed(2));
        this.registro.iva = Number(this.registro.iva.toFixed(2));
        this.registro.ice = Number(this.registro.ice.toFixed(2));
        this.registro.irbpnr = Number(this.registro.irbpnr.toFixed(2));
        this.registro.total = Number(this.registro.total.toFixed(2));
       
        this.actualizar();
        this.generarTotales();
        return true;
    }

    generarTotales() {
        this.mimpuestos = {};
        this.total = 0;
        this.subtotal = 0;
        this.subtotalexento = 0;
		this.descuento = 0;
		this.componenteprincipal.selectRegistro(this.componenteprincipal.registro);

        this.componenteprincipal.registro.iva = 0;
        this.componenteprincipal.registro.ice = 0;
        this.componenteprincipal.registro.irbpnr = 0;

        for (const i in this.lregistros) {
            if (this.lregistros.hasOwnProperty(i)) {
                const item = this.lregistros[i];
                this.total += item.total;
                this.descuento += item.descuento;

                // IVA
                if (this.estaVacio(this.mimpuestos[item.cimpuestoiva])) {
                    this.mimpuestos[item.cimpuestoiva] = {};
                    this.mimpuestos[item.cimpuestoiva]['nombre'] = item.mdatos.niva;
                    this.mimpuestos[item.cimpuestoiva]['total'] = 0;
                }
                this.mimpuestos[item.cimpuestoiva]['total'] += item.iva;
                this.componenteprincipal.registro.iva += item.iva;

                if (item.mdatos.porciva === 0) {
                    this.subtotalexento += item.subtotal;
                } else {
                    this.subtotal += item.subtotal;
                }

                // ICE
                if (this.estaVacio(this.mimpuestos[item.cimpuestoice])) {
                    this.mimpuestos[item.cimpuestoice] = {};
                    this.mimpuestos[item.cimpuestoice]['nombre'] = !this.estaVacio(item.mdatos.nice) ? item.mdatos.nice : 'ICE';
                    this.mimpuestos[item.cimpuestoice]['total'] = 0;
                }
                this.mimpuestos[item.cimpuestoice]['total'] += item.ice;
                this.componenteprincipal.registro.ice += item.ice;

                // IRBPNR
                if (this.estaVacio(this.mimpuestos[item.cimpuestoirbpnr])) {
                    this.mimpuestos[item.cimpuestoirbpnr] = {};
                    this.mimpuestos[item.cimpuestoirbpnr]['nombre'] = item.mdatos.nirbpnr;
                    this.mimpuestos[item.cimpuestoirbpnr]['total'] = 0;
                }
                this.mimpuestos[item.cimpuestoirbpnr]['total'] += item.irbpnr;
                this.componenteprincipal.registro.irbpnr += item.irbpnr;
            }
        }

        this.componenteprincipal.registro.total = this.total;
        this.componenteprincipal.registro.subtotal = this.subtotal;
        this.componenteprincipal.registro.subtotalexento = this.subtotalexento;
        this.componenteprincipal.registro.descuento = this.descuento;
        this.componenteprincipal.registro.total = this.total;

        this.componenteprincipal.formvalidado = true;
        this.componenteprincipal.actualizar();
    }

    obtenerImpuestos() {
        const limpuestos = this.obtenerListaFromObjeto(this.mimpuestos, true, false, 'nombre');
        return limpuestos;
    }

    mostrarLovProductos(): void {
        if (this.estaVacio(this.componenteprincipal.registro.ccliente)) {
            this.mostrarMensajeError('CLIENTE REQUERIDO');
            return;
        }
        this.lovProductos.consultar();
        this.lovProductos.showDialog();
    }

    fijarLovProductos(reg: any): void {
        if (!reg.registro.activo) {
            this.mostrarMensajeError('PRODUCTO INACTIVO');
            return;
        }
        this.crearNuevo();
        this.registro.cproducto = reg.registro.cproducto;
        this.registro.mdatos.nproducto = reg.registro.nombre;
        this.registro.mdatos.ncategoria = reg.registro.mdatos.ncategoria;
        this.registro.mdatos.esservicio = reg.registro.esservicio;
        this.registro.mdatos.porcentajedescuento = reg.registro.porcentajedescuento;
        this.registro.preciounitario = reg.registro.preciounitario;
        this.registro.cantidad = 1;

        this.registro.cimpuestoiva = reg.registro.cimpuestoiva;
        this.registro.mdatos.porciva = reg.registro.mdatos.porciva;
        this.registro.mdatos.niva = reg.registro.mdatos.niva;

        this.registro.cimpuestoice = reg.registro.cimpuestoice;
        this.registro.mdatos.porcice = reg.registro.mdatos.porcice;
        this.registro.mdatos.nice = reg.registro.mdatos.nice;
        this.registro.mdatos.ice = reg.registro.ice ? reg.registro.ice : 0;

        this.registro.cimpuestoirbpnr = reg.registro.cimpuestoirbpnr;
        this.registro.mdatos.porcirbpnr = reg.registro.mdatos.porcirbpnr;
        this.registro.mdatos.nirbpnr = reg.registro.mdatos.nirbpnr;

        if (!this.totalItem(this.registro)) {
            return;
        }
    }
}
