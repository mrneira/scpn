import { Component, OnInit, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { BaseComponent } from 'app/util/shared/componentes/base.component';
import { DtoServicios } from 'app/util/servicios/dto.servicios';
import { Consulta } from 'app/util/dto/dto.component';
import { SelectItem } from 'primeng/primeng';

@Component({
    selector: 'app-lov-cliente',
    templateUrl: 'lov.cliente.html'
})
export class LovClienteComponent extends BaseComponent implements OnInit, AfterViewInit {

    @ViewChild('formFiltros') formFiltros: NgForm;

    @Output()
    eventoLov = new EventEmitter();

    displayLov = false;

    public ltipoidentificacion: SelectItem[] = [{ label: '...', value: null }];

    constructor(router: Router, dtoServicios: DtoServicios) {
        super(router, dtoServicios, 'TfacCliente', 'LOVCLIENTE', false, true);
    }

    ngOnInit() {
        this.formFiltrosBase = this.formFiltros;
        this.componentehijo = this;
        // En los lov va 0 para no grabar log de transaccion.
        this.rqConsulta.grabarlog = '0';

        this.consultarCatalogos();
    }

    ngAfterViewInit() {
    }

    consultar() {
        this.crearDtoConsulta();
        super.consultar();
    }

    public crearDtoConsulta(): Consulta {
        this.fijarFiltrosConsulta();
        const consulta = new Consulta(this.entityBean, 'Y', 't.razonsocial', this.mfiltros, this.mfiltrosesp, this.mfiltrosigual);
        consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'ntipoidentificacion', 'i.ccatalogo = t.tipoidentificaccatalogo and i.cdetalle = t.tipoidentificacdetalle');

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

    consultarCatalogos(): any {
        this.encerarConsultaCatalogos();

        const mfiltroOrIng: any = { 'ccatalogo': 9372 };
        const mfiltroEsp: any = { 'cdetalle': 'not in(\'PL\')' };
        const consultaOrgIng = new Consulta('TgenCatalogoDetalle', 'Y', 't.clegal', null, mfiltroEsp, mfiltroOrIng);
        consultaOrgIng.cantidad = 100;
        this.addConsultaCatalogos('TIPOIDENT', consultaOrgIng, this.ltipoidentificacion, super.llenaListaCatalogo, 'cdetalle', null, false);

        this.ejecutarConsultaCatalogos();
    }
}
