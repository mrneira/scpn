import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovFuncionariosComponent } from '../../../lov/funcionarios/componentes/lov.funcionarios.component';
import { GestorDocumentalComponent } from '../../../../gestordocumental/componentes/gestordocumental.component';

@Component({
    selector: 'app-tth-otrosegresos',
    templateUrl: 'otrosegresos.html'
})

export class OtrosEgresosComponent extends BaseComponent implements OnInit, AfterViewInit {

    @ViewChild('formFiltros') formFiltros: NgForm;
    @ViewChild(LovFuncionariosComponent) private lovFuncionarios: LovFuncionariosComponent;
    @ViewChild(GestorDocumentalComponent) private lovGestor: GestorDocumentalComponent;

    constructor(router: Router, dtoServicios: DtoServicios) {
        super(router, dtoServicios, 'tnomotroegreso', 'OTROSEGRESOS', false);
        this.componentehijo = this;
    }

    ngOnInit() {
        super.init(this.formFiltros);
        if (sessionStorage.getItem('cfuncionario') != "-1") {
            this.mfiltros.cfuncionario = sessionStorage.getItem('cfuncionario');
            this.mcampos.nfuncionario = this.dtoServicios.mradicacion.np;
        }
    }

    ngAfterViewInit() {
    }

    public selectRegistro(registro: any) {
        super.selectRegistro(registro);
        this.registro.mdatos.faplica = new Date(this.registro.anio+'-'+("00"+this.registro.mesaplica).slice(-2)+'-01');        
    }

    crearNuevo() {
        if (!this.validaFiltrosRequeridos()) {
            return;
        }
        super.crearNuevo();
        this.registro.cfuncionario = this.mfiltros.cfuncionario;
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
        if (!this.validaFiltrosRequeridos()) {
            return;
        }        
        this.crearDtoConsulta();
        super.consultar();
    }

    public crearDtoConsulta() {
        this.fijarFiltrosConsulta();
        const consulta = new Consulta(this.entityBean, 'Y', 't.cegreso', this.mfiltros, this.mfiltrosesp);
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

    mostrarLovFuncionario() {
        this.lovFuncionarios.showDialog();
    }

    fijarLovFuncionario(reg: any): void {
        this.mfiltros.cfuncionario = reg.registro.cfuncionario;
        this.mcampos.nfuncionario = reg.registro.mdatos.nombre;
        this.consultar();
    }

    /**Despliega el lov de Gestión Documental. */
    mostrarLovGestorDocumental(reg: any): void {
        this.selectRegistro(reg);
        this.mostrarDialogoGenerico = false;
        this.lovGestor.showDialog(reg.cgesarchivo);
    }
    /**Retorno de lov de Gestión Documental. */
    fijarLovGestorDocumental(reg: any): void {
        if (reg !== undefined) {
            this.registro.cgesarchivo = reg.cgesarchivo;
            this.registro.mdatos.ndocumento = reg.ndocumento;
            this.actualizar();
            this.grabar();
        }
    }
    /**Realiza la descarga desde el lov de Gestión Documental. */
    descargarArchivo(cgesarchivo: any): void {
        this.lovGestor.consultarArchivo(cgesarchivo, true);
    }
}