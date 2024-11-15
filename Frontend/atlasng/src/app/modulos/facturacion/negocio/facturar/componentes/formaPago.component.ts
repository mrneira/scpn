import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { BaseComponent } from 'app/util/shared/componentes/base.component';
import { DtoServicios } from 'app/util/servicios/dto.servicios';
import { Consulta } from 'app/util/dto/dto.component';
import { LovFormaPagoComponent } from 'app/modulos/facturacion/lov/formapago/componentes/lov.formaPago.component';
import { SelectItem } from 'primeng/primeng';

@Component({
    selector: 'app-fact-fpago',
    template: '<app-lov-fpago (eventoLov)="fijarLovFormaPago($event)"></app-lov-fpago>'
})
export class FacturaFormaPagoComponent extends BaseComponent implements OnInit, AfterViewInit {

    @ViewChild('formFiltros') formFiltros: NgForm;

    @ViewChild(LovFormaPagoComponent)
    private lovFormaPago: LovFormaPagoComponent;

    public lunidadmedida: SelectItem[] = [{ label: '...', value: null }];

    constructor(router: Router, dtoServicios: DtoServicios) {
        super(router, dtoServicios, 'TfacFacturaFormaPago', 'TFACFACTURAFORMAPAGO', false, true);
        this.componentehijo = this;
    }

    ngOnInit() {
        super.init(this.formFiltros);
    }

    ngAfterViewInit() {
    }

    crearNuevo() {
        super.crearNuevo();
        this.registro.cmedida = 7;
        this.registro.valormedida = 0;
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


    mostrarLovFormaPago(): void {
        if (this.estaVacio(this.componenteprincipal.registro.ccliente)) {
            this.mostrarMensajeError('CLIENTE REQUERIDO');
            return;
        }
        this.lovFormaPago.consultar();
        this.lovFormaPago.showDialog();
    }

    fijarLovFormaPago(reg: any): void {
        this.crearNuevo();
        this.registro.cformapago = reg.registro.cformapago;
        this.registro.mdatos.nformapago = reg.registro.nombre;
        this.registro.monto = this.componenteprincipal.detalle.total;
    }
}
