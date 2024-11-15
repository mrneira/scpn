import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovTipoVinculacionComponent } from '../../../lov/tipovinculacion/componentes/lov.tipovinculacion.component';

@Component({
    selector: 'app-tal-plantillavinculacion',
    templateUrl: 'plantillavinculacion.html'
})

export class PlantillaVinculacionComponent extends BaseComponent implements OnInit, AfterViewInit {

    @ViewChild('formFiltros') formFiltros: NgForm;
    @ViewChild(LovTipoVinculacionComponent) private LovTipoVinculacion: LovTipoVinculacionComponent;

    constructor(router: Router, dtoServicios: DtoServicios) {
        super(router, dtoServicios, 'tthplantilladocvinculacion', 'PlantillaVinculacion', false);
        this.componentehijo = this;
    }

    ngOnInit() {
        super.init(this.formFiltros);
    }

    ngAfterViewInit() {
    }

    public selectRegistro(registro: any) {
        super.selectRegistro(registro);
    }

    crearNuevo() {
        if (!this.validaFiltrosRequeridos()) {
            return;
        }

        super.crearNuevo();
        this.registro.ctipovinculacion = this.mfiltros.ctipovinculacion;
        this.registro.mdatos.ntipovinculacion = this.mcampos.ntipovinculacion
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
        if (!this.validaFiltrosRequeridos()) {
            return;
        }

        this.crearDtoConsulta();
        super.consultar();
    }

    public crearDtoConsulta() {
        this.fijarFiltrosConsulta();
        const consulta = new Consulta(this.entityBean, 'Y', 't.cplantilladocvinculacion', this.mfiltros, this.mfiltrosesp);
        this.addConsulta(consulta);
        return consulta;
    }

    private fijarFiltrosConsulta() {
    }

    validaFiltrosConsulta(): boolean {
        return true;
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


    /**Muestra lov de proceso */
    mostrarLovTipoVinculacion(): void {
        this.LovTipoVinculacion.consultar();
        this.LovTipoVinculacion.showDialog();
    }

    /**Retorno de lov de proceso. */
    fijarLovTipoVinculacion(reg: any): void {
        if (reg.registro !== undefined) {
            this.mfiltros.ctipovinculacion = reg.registro.ctipovinculacion;
            this.mcampos.ntipovinculacion = reg.registro.nombre;
            this.consultar();
        }
    }
}