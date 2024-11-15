import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { BaseComponent } from 'app/util/shared/componentes/base.component';
import { DtoServicios } from 'app/util/servicios/dto.servicios';
import { Consulta } from 'app/util/dto/dto.component';
import { LovCuentasContablesComponent } from 'app/modulos/contabilidad/lov/cuentascontables/componentes/lov.cuentasContables.component';
import { LovCategoriasComponent } from 'app/modulos/facturacion/lov/categorias/componentes/lov.categorias.component';
import { LovImpuestoComponent } from 'app/modulos/facturacion/lov/impuesto/componentes/lov.impuesto.component';

@Component({
    selector: 'app-productos',
    templateUrl: 'productos.html'
})
export class ProductosComponent extends BaseComponent implements OnInit, AfterViewInit {

    @ViewChild('formFiltros') formFiltros: NgForm;

    @ViewChild(LovCuentasContablesComponent)
    private lovcuentasContables: LovCuentasContablesComponent;

    @ViewChild(LovCategoriasComponent)
    private lovCategorias: LovCategoriasComponent;

    @ViewChild('iva')
    private lovIva: LovImpuestoComponent;

    @ViewChild('ice')
    private lovice: LovImpuestoComponent;

    @ViewChild('irbpnr')
    private lovirbpnr: LovImpuestoComponent;

    constructor(router: Router, dtoServicios: DtoServicios) {
        super(router, dtoServicios, 'TfacProducto', 'TFACPRODUCTO', false, false);
        this.componentehijo = this;
    }

    ngOnInit() {
        super.init(this.formFiltros);
    }

    ngAfterViewInit() {
    }

    crearNuevo() {
        super.crearNuevo();
        this.registro.porcentajedescuento = 0;
        this.registro.modificable = false;
        this.registro.activo = true;
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
        const consulta = new Consulta(this.entityBean, 'Y', 't.cproducto', this.mfiltros, this.mfiltrosesp, this.mfiltrosigual);
        consulta.addSubquery('TfacCategoria', 'nombre', 'ncategoria', 'i.ccategoria=t.ccategoria');
        consulta.addSubquery('TfacImpuesto', 'nombre', 'niva', 'i.cimpuesto=t.cimpuestoiva');
        consulta.addSubquery('TfacImpuesto', 'nombre', 'nicc', 'i.cimpuesto=t.cimpuestoice');
        consulta.addSubquery('TconCatalogo', 'nombre', 'ncuenta', 'i.ccuenta=t.codigocontable');
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
        this.lmantenimiento = []; // Encerar Mantenimiento
        this.crearDtoMantenimiento();
        // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
        super.grabar();
    }

    public crearDtoMantenimiento() {
        const mantenimiento = super.getMantenimiento(1);
        super.addMantenimientoPorAlias(this.alias, mantenimiento);
    }

    public postCommit(resp: any) {
        super.postCommitEntityBean(resp);
    }

    mostrarlovcuentasContables(esCrear = false): void {
        this.lovcuentasContables.showDialog(true);
    }

    fijarLovCuentasContablesSelec(reg: any): void {
        if (reg.registro !== undefined) {
            this.registro.mdatos.ncuenta = reg.registro.nombre;
            this.registro.codigocontable = reg.registro.ccuenta;
        }
    }

    mostrarLovCategoria(): void {
        this.lovCategorias.consultar();
        this.lovCategorias.showDialog();
    }

    fijarLovCategoria(reg: any): void {
        this.registro.ccategoria = reg.registro.ccategoria;
        this.registro.mdatos.ncategoria = reg.registro.nombre;
    }

    mostrarLovIva(): void {
        this.lovIva.consultar();
        this.lovIva.showDialog();
    }

    fijarLovIva(reg: any): void {
        this.registro.cimpuestoiva = reg.registro.cimpuesto;
        this.registro.mdatos.niva = reg.registro.nombre;
    }

    mostrarLovIce(): void {
        this.lovice.consultar();
        this.lovice.showDialog();
    }

    fijarLovIce(reg: any): void {
        this.registro.cimpuestoice = reg.registro.cimpuesto;
        this.registro.mdatos.nice = reg.registro.nombre;
    }

    mostrarLovIrbpnr(): void {
        this.lovirbpnr.consultar();
        this.lovirbpnr.showDialog();
    }

    fijarLovIrbpnr(reg: any): void {
        this.registro.cimpuestoirbpnr = reg.registro.cimpuesto;
        this.registro.mdatos.nirbpnr = reg.registro.nombre;
    }
}
