import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem, EditorModule } from 'primeng/primeng';
import { LovDepartamentosComponent } from '../../../lov/departamentos/componentes/lov.departamentos.component';

@Component({
    selector: 'app-tal-cargos',
    templateUrl: 'cargos.html'
})

export class CargosComponent extends BaseComponent implements OnInit, AfterViewInit {

    @ViewChild('formFiltros') formFiltros: NgForm;
    @ViewChild(LovDepartamentosComponent) private lovDepartamentos: LovDepartamentosComponent;

    public lrol: SelectItem[] = [{ label: '...', value: null }];

    constructor(router: Router, dtoServicios: DtoServicios) {
        super(router, dtoServicios, 'tthcargo', 'CARGOS', false);
        this.componentehijo = this;
    }

    ngOnInit() {
        super.init(this.formFiltros);
        this.consultarCatalogos();
    }

    ngAfterViewInit() {
    }

    public selectRegistro(registro: any) {
        super.selectRegistro(registro);
    }

    crearNuevo() {
        if(!this.validaFiltrosRequeridos()){
            return;
        }
        super.crearNuevo();
        this.registro.cdepartamento = this.mfiltros.cdepartamento;
        this.registro.mdatos.ndepartamento = this.mcampos.ndepartamento
       
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
        if(!this.validaFiltrosRequeridos()){
            return;
        }        
        this.crearDtoConsulta();
        super.consultar();
    }

    public crearDtoConsulta() {
        this.fijarFiltrosConsulta();
        const consulta = new Consulta(this.entityBean, 'Y', 't.ccargo', this.mfiltros, this.mfiltrosesp);
        consulta.addSubquery('tthdepartamento', 'nombre', 'ndepartamento', 'i.cdepartamento = t.cdepartamento');
        consulta.addSubquery('TgencatalogoDetalle', 'nombre', 'nrol', 'i.ccatalogo=rolccatalogo and i.cdetalle=rolcdetalle');
   
        this.addConsulta(consulta);
        return consulta;
    }

    private fijarFiltrosConsulta() {
        //  this.mfiltros.activo = 0;        
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
                this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
                this.manejaRespuestaCatalogos(resp);
            },
            error => {
                this.dtoServicios.manejoError(error);
            });
    }

    llenarConsultaCatalogos(): void {
        const mfiltroNIVEL: any = { 'ccatalogo': 1158 };
        const consultaNIVEL = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroNIVEL, {});
        consultaNIVEL.cantidad = 500;
        this.addConsultaPorAlias('NIVEL', consultaNIVEL);
    }

    /**Manejo respuesta de consulta de catalogos. */
    private manejaRespuestaCatalogos(resp: any) {
        const msgs = [];
        if (resp.cod === 'OK') {
            this.llenaListaCatalogo(this.lrol, resp.NIVEL, 'cdetalle');
        }
        this.lconsulta = [];
    }
    mostrarLovDepartamentos(): void {
        this.lovDepartamentos.showDialog();
    }

    /**Retorno de lov de personas. */
    fijarLovDepartamentos(reg: any): void {
        if (reg.registro !== undefined) {
            this.mfiltros.cdepartamento = reg.registro.cdepartamento;
            this.mcampos.ndepartamento = reg.registro.nombre;
            this.consultar();
        }
    }
}