import { Component, OnInit, AfterViewInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { BaseComponent } from 'app/util/shared/componentes/base.component';
import { DtoServicios } from 'app/util/servicios/dto.servicios';
import { Consulta } from 'app/util/dto/dto.component';

@Component({
    selector: 'app-lov-productos',
    templateUrl: 'lov.productos.html'
})
export class LovProductosComponent extends BaseComponent implements OnInit, AfterViewInit {

    @ViewChild('formFiltros') formFiltros: NgForm;

    @Output()
    eventoLov = new EventEmitter();

    displayLov = false;

    constructor(router: Router, dtoServicios: DtoServicios) {
        super(router, dtoServicios, 'TfacProducto', 'LOVPRODUCTO', false, true);
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
        const consulta = new Consulta(this.entityBean, 'Y', 't.nombre', this.mfiltros, this.mfiltrosesp, this.mfiltrosigual);
        consulta.addSubquery('TfacCategoria', 'nombre', 'ncategoria', 'i.ccategoria=t.ccategoria');
        consulta.addSubquery('TfacImpuesto', 'porcentaje', 'porciva', 'i.cimpuesto=t.cimpuestoiva');
        consulta.addSubquery('TfacImpuesto', 'porcentaje', 'porcicc', 'i.cimpuesto=t.cimpuestoice');

        consulta.addSubquery('TfacImpuesto', 'nombre', 'niva', 'i.cimpuesto=t.cimpuestoiva');
        consulta.addSubquery('TfacImpuesto', 'nombre', 'nicc', 'i.cimpuesto=t.cimpuestoice');
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
