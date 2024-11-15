import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { BaseComponent } from 'app/util/shared/componentes/base.component';
import { DtoServicios } from 'app/util/servicios/dto.servicios';
import { Consulta } from 'app/util/dto/dto.component';
import { LovCuentasContablesComponent } from 'app/modulos/contabilidad/lov/cuentascontables/componentes/lov.cuentasContables.component';

@Component({
    selector: 'app-forma-pago',
    templateUrl: 'formaPago.html'
})
export class FormaPagoComponent extends BaseComponent implements OnInit, AfterViewInit {

    @ViewChild('formFiltros') formFiltros: NgForm;

    @ViewChild(LovCuentasContablesComponent)
    private lovcuentasContables: LovCuentasContablesComponent;

    constructor(router: Router, dtoServicios: DtoServicios) {
        super(router, dtoServicios, 'TfacFormaPago', 'TFACFORMAPAGO', false, false);
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
        const consulta = new Consulta(this.entityBean, 'Y', 't.cformapago', this.mfiltros, this.mfiltrosesp, this.mfiltrosigual);
        consulta.addSubquery('TconCatalogo', 'nombre', 'ncuenta', 'i.ccuenta=t.codigocontable');
        consulta.cantidad = 80;
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
}
