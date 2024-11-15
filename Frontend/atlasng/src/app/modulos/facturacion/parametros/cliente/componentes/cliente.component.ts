import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { BaseComponent } from 'app/util/shared/componentes/base.component';
import { DtoServicios } from 'app/util/servicios/dto.servicios';
import { Consulta } from 'app/util/dto/dto.component';
import { SelectItem } from 'primeng/primeng';

@Component({
    selector: 'app-cliente',
    templateUrl: 'cliente.html'
})
export class ClienteComponent extends BaseComponent implements OnInit, AfterViewInit {

    @ViewChild('formFiltros') formFiltros: NgForm;

    public ltipoidentificacion: SelectItem[] = [{ label: '...', value: null }];

    constructor(router: Router, dtoServicios: DtoServicios) {
        super(router, dtoServicios, 'TfacCliente', 'TFACCLIENTE', false, false);
        this.componentehijo = this;
    }

    ngOnInit() {
        super.init(this.formFiltros);
        this.consultarCatalogos();
    }

    ngAfterViewInit() {
    }

    crearNuevo() {
        super.crearNuevo();
        this.registro.tipoidentificaccatalogo = 9372;
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
        const consulta = new Consulta(this.entityBean, 'Y', 't.ccliente', this.mfiltros, this.mfiltrosesp, this.mfiltrosigual);
        consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'ntipoidentificacion', 'i.ccatalogo = t.tipoidentificaccatalogo and i.cdetalle = t.tipoidentificacdetalle');
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

    consultarCatalogos(): any {
        this.encerarConsultaCatalogos();

        const mfiltroOrIng: any = { 'ccatalogo': 9372 };
        const consultaOrgIng = new Consulta('TgenCatalogoDetalle', 'Y', 't.nombre', null, null, mfiltroOrIng);
        consultaOrgIng.cantidad = 100;
        this.addConsultaCatalogos('TIPOIDENT', consultaOrgIng, this.ltipoidentificacion, super.llenaListaCatalogo, 'cdetalle');

        this.ejecutarConsultaCatalogos();
    }
}
