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
    selector: 'app-tth-otrosingresos',
    templateUrl: 'otrosingresos.html'
})

export class OtrosIngresosComponent extends BaseComponent implements OnInit, AfterViewInit {

    @ViewChild('formFiltros') formFiltros: NgForm;
    @ViewChild(LovFuncionariosComponent) private lovFuncionarios: LovFuncionariosComponent;
    @ViewChild(GestorDocumentalComponent) private lovGestor: GestorDocumentalComponent;

    public lmeses: SelectItem[] = [{ label: '...', value: null }];

    constructor(router: Router, dtoServicios: DtoServicios) {
        super(router, dtoServicios, 'tnomotroingreso', 'OTROSINGRESOS', false);
        this.componentehijo = this;
    }

    ngOnInit() {
        super.init(this.formFiltros);
        if (sessionStorage.getItem('cfuncionario') != "-1") {
            this.mfiltros.cfuncionario = sessionStorage.getItem('cfuncionario');
            this.mcampos.nfuncionario = this.dtoServicios.mradicacion.np;
        }
        this.consultarCatalogos();
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
        this.registro.cfuncionario = this.mfiltros.cfuncionario;
        this.registro.estado = false;
        this.registro.mesccatalogo = 4;
        this.registro.anio = this.anioactual;
        this.registro.mescdetalle = String("00" + this.mesactual).slice(-2);        
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
        const consulta = new Consulta(this.entityBean, 'Y', 't.cingreso', this.mfiltros, this.mfiltrosesp);
        consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nmes', 'i.cdetalle = t.mesccatalogo and t.mescdetalle = i.ccatalogo');
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

    consultarCatalogos(): any {
        this.msgs = [];
        this.lconsulta = [];
        this.llenarConsultaCatalogos();

        this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
            .subscribe(
                resp => {
                    this.encerarMensajes();
                    this.dtoServicios.llenarMensaje(resp, false); 
                    this.manejaRespuestaCatalogos(resp);
                },
                error => {
                    this.dtoServicios.manejoError(error);
                });
    }

    llenarConsultaCatalogos(): void {
        const mfiltroMESES: any = { 'ccatalogo': 4 };
        const consultaMESES = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroMESES, {});
        consultaMESES.cantidad = 500;
        this.addConsultaPorAlias('MESES', consultaMESES);
    }

    /**Manejo respuesta de consulta de catalogos. */
    private manejaRespuestaCatalogos(resp: any) {
        const msgs = [];
        if (resp.cod === 'OK') {
            this.llenaListaCatalogo(this.lmeses, resp.MESES, 'cdetalle');
        }
        this.lconsulta = [];
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