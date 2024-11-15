import { Component, OnInit, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { BaseComponent } from 'app/util/shared/componentes/base.component';
import { DtoServicios } from 'app/util/servicios/dto.servicios';
import { Consulta } from 'app/util/dto/dto.component';

@Component({
    selector: 'app-lov-fpago',
    templateUrl: 'lov.formaPago.html'
})
export class LovFormaPagoComponent extends BaseComponent implements OnInit, AfterViewInit {

    @ViewChild('formFiltros') formFiltros: NgForm;

    @Output()
    eventoLov = new EventEmitter();

    displayLov = false;

    constructor(router: Router, dtoServicios: DtoServicios) {
        super(router, dtoServicios, 'TfacFormaPago', 'LOVFORMAPAGO', false, true);
    }

    ngOnInit() {
        this.formFiltrosBase = this.formFiltros;
        this.componentehijo = this;
        // En los lov va 0 para no grabar log de transaccion.
        this.rqConsulta.grabarlog = '0';
    }

    ngAfterViewInit() {
    }

    consultar() {
        this.crearDtoConsulta();
        super.consultar();
    }

    public crearDtoConsulta(): Consulta {
        this.fijarFiltrosConsulta();
        const consulta = new Consulta(this.entityBean, 'Y', 't.cformapago', this.mfiltros, this.mfiltrosesp, this.mfiltrosigual);

        consulta.setCantidad(15);
        this.addConsulta(consulta);
        return consulta;
    }

    public getConsulta(): Consulta {
        const consulta = super.getConsulta(this.alias);
        return consulta;
    }

    public postQuery(resp: any) {
        super.postQueryEntityBean(resp);
    }

    private fijarFiltrosConsulta() {
    }

    seleccionaRegistro(evento: any) {
        this.eventoLov.emit({ registro: evento.data });
        this.displayLov = false;
    }

    showDialog() {
        this.displayLov = true;
    }
}
