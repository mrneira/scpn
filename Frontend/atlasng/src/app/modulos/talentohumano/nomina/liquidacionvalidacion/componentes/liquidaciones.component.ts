import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovDesignacionesComponent } from '../../../../talentohumano/lov/designaciones/componentes/lov.designaciones.component';

@Component({
    selector: 'app-tth-liquidaciones',
    templateUrl: 'liquidaciones.html'
})

export class LiquidacionesComponent extends BaseComponent implements OnInit, AfterViewInit {

    @ViewChild('formFiltros') formFiltros: NgForm;

    @ViewChild(LovDesignacionesComponent) private lovDesignaciones: LovDesignacionesComponent;

    constructor(router: Router, dtoServicios: DtoServicios) {
        super(router, dtoServicios, 'tnomotroingreso', 'OTROSINGRESOS', true, false);
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

    // Inicia CONSULTA *********************
    consultar() {
        this.crearDtoConsulta();
        super.consultar();
    }

    public crearDtoConsulta() {
        const consulta = new Consulta(this.entityBean, 'Y', 't.cliquidacion', this.mfiltros, this.mfiltrosesp);
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

    mostrarLovDesignaciones(): void {
        this.lovDesignaciones.showDialog();
    }

    /**Retorno de lov de tipos de contrato. */
    fijarLovDesignaciones(reg: any): void {
        if (reg.registro !== undefined) {
            this.mfiltros.ccontrato = reg.registro.ccontrato;
            this.mfiltros.verreg = 0;
            this.mcampos.ndesignacion = reg.registro.mdatos.ndesignacion;
            this.consultar();
        }
    }

}