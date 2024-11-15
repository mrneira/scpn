import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovFuncionariosComponent } from '../../../lov/funcionarios/componentes/lov.funcionarios.component';

@Component({
    selector: 'app-tth-aprobacionotrosegresos',
    templateUrl: 'aprobacionotrosegresos.html'
})

export class AprobacionOtrosEgresosComponent extends BaseComponent implements OnInit, AfterViewInit {

    @ViewChild('formFiltros') formFiltros: NgForm;

    @ViewChild('lov1') private lovFuncionarioFiltro: LovFuncionariosComponent;
    @ViewChild('lov2') private lovFuncionarios: LovFuncionariosComponent;

    constructor(router: Router, dtoServicios: DtoServicios) {
        super(router, dtoServicios, 'tnomotroegreso', 'OTROSEGRESOS', false);
        this.componentehijo = this;
    }

    ngOnInit() {
        super.init(this.formFiltros);
    }

    ngAfterViewInit() {
    }

    public selectRegistro(registro: any) {
        super.selectRegistro(registro);
        this.registro.mdatos.faplica = new Date(this.registro.anio + '-' + ("00" + this.registro.mesaplica).slice(-2) + '-01');
    }

    crearNuevo() {
        super.crearNuevo();
        if (this.mfiltros.cfuncionario != undefined) {
            this.registro.cfuncionario = this.mfiltros.cfuncionario;
            this.registro.mdatos.nfuncionario = this.mcampos.nfuncionario;
        }
        this.registro.estado = false;
    }

    actualizar() {
        this.registro.mesaplica = this.registro.mdatos.faplica.getMonth() + 1;
        this.registro.anio = this.registro.mdatos.faplica.getFullYear();
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
        const consulta = new Consulta(this.entityBean, 'Y', 't.cegreso', this.mfiltros, this.mfiltrosesp);
        consulta.addSubqueryPorSentencia("select concat(o.primerapellido, ' ', o.primernombre) from " + this.obtenerBean("tthfuncionariodetalle") + " o where o.cfuncionario=t.cfuncionario and o.verreg=0", "nfuncionario");
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

    mostrarLovFuncionarioFiltro() {
        this.lovFuncionarioFiltro.showDialog();
    }

    fijarLovFuncionarioFiltro(reg: any): void {
        this.mfiltros.cfuncionario = reg.registro.cfuncionario;
        this.mcampos.nfuncionario = reg.registro.mdatos.nombre;
        this.consultar();
    }

    mostrarLovFuncionario() {
        this.lovFuncionarios.showDialog();
    }

    fijarLovFuncionario(reg: any): void {
        this.registro.cfuncionario = reg.registro.cfuncionario;
        this.registro.mdatos.nfuncionario = reg.registro.mdatos.nombre;
    }

    rowSelected(event: any): void {

    }
    checkAll(event: any): void {
        for (var i = 0, len = this.lregistros.length; i < len; i++) {
            this.lregistros[i].aprobado = event;
        }
    }
    checked(regevent: any): void {

    }

}