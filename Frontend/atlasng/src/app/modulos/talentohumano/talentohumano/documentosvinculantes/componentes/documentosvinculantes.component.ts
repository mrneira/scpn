import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

import { LovDesignacionesComponent } from '../../../../talentohumano/lov/designaciones/componentes/lov.designaciones.component';
import { LovFuncionariosComponent } from '../../../lov/funcionarios/componentes/lov.funcionarios.component';

import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component'

@Component({
    selector: 'app-tal-documentosvinculantes',
    templateUrl: 'documentosvinculantes.html'
})

export class DocumentosVinculantesComponent extends BaseComponent implements OnInit, AfterViewInit {

    @ViewChild('formFiltros') formFiltros: NgForm;
    @ViewChild(LovDesignacionesComponent) private lovDesignaciones: LovDesignacionesComponent;
    @ViewChild(LovFuncionariosComponent) private lovFuncionarios: LovFuncionariosComponent;
    @ViewChild(JasperComponent)
    public reporte: JasperComponent;
    public imprimir:boolean=false;
    constructor(router: Router, dtoServicios: DtoServicios) {
        super(router, dtoServicios, 'tthdocvinccontrato', 'DOCUMENTOSVINCULANTES', false);
        this.componentehijo = this;
    }
    descargarReporte() {
        var cont=0;
        var tem=this.lregistros;
        for(let i in tem){
            let reg = tem[i];  
            if(reg.secuencia!==undefined){
              cont=cont+1;
            }
          } 
          if(cont>0){
        this.reporte.nombreArchivo = 'ReporteEvaluacion';
        // Agregar parametros
        this.reporte.parametros['@i_ccontrato'] = this.mcampos.ccontrato;
        this.reporte.parametros['archivoReporteUrl'] = '/CesantiaReportes/TalentoHumano/rptTthContratoServiciosOcasionales';
        this.reporte.generaReporteCore();}
        else{
            super.mostrarMensajeError("EL CONTRATO SELECCIONADO NO TIENE DOCUMENTOS HABILITANTES");
        }
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
        this.registro.ccontrato = this.mcampos.ccontrato;
        this.registro.cfuncionario = this.mcampos.cfuncionario;
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
        this.fijarFiltrosConsulta();
        const consulta = new Consulta(this.entityBean, 'Y', 't.secuencia', this.mfiltros, this.mfiltrosesp);
        consulta.addSubquery('tthplantilladocvinculacion', 'documento', 'ndocumento', 'i.cplantilladocvinculacion = t.cplantilladocvinculacion');
        consulta.addSubqueryPorSentencia("select concat(o.primerapellido, ' ', o.primernombre) from " + this.obtenerBean("tthfuncionariodetalle") + " o where o.cfuncionario=t.responsablecfuncionario and o.verreg=0", "nresponsable");
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
        this.consultarCatalogos();
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
            this.mcampos.cfuncionario = reg.registro.cfuncionario;
            this.mcampos.ctipovinculacion = reg.registro.ctipovinculacion;
            this.mcampos.ccontrato = reg.registro.ccontrato;
            this.mcampos.ndesignacion = reg.registro.mdatos.ndesignacion;
            this.consultar();
        } 
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
        const mfiltroPLANTDOCS: any = { 'ctipovinculacion': this.mcampos.ctipovinculacion };
        const consultaPLANTDOCS = new Consulta('tthplantilladocvinculacion', 'Y', 't.cplantilladocvinculacion', mfiltroPLANTDOCS, {});
        consultaPLANTDOCS.cantidad = 500;
        this.addConsultaPorAlias('PLANTDOCS', consultaPLANTDOCS);
    }

    /**Manejo respuesta de consulta de catalogos. */
    private manejaRespuestaCatalogos(resp: any) {
        var arrTemp = this.lregistros;
        this.lregistros = [];
        const msgs = [];
        if (resp.cod === 'OK') {
            for (var i = 0, leni = arrTemp.length; i < leni; i++) {
                for (var j = resp.PLANTDOCS.length, lenj = 0; j > lenj; j--) {
                    if (arrTemp[i].cplantilladocvinculacion == resp.PLANTDOCS[j - 1].cplantilladocvinculacion) {
                        resp.PLANTDOCS.splice(j - 1, 1);
                        break;
                    }
                }
            }
            this.lregistros = arrTemp;
            resp.PLANTDOCS.forEach(element => {
                this.crearNuevo();
                this.registro.cplantilladocvinculacion = element.cplantilladocvinculacion;
                this.registro.mdatos.ndocumento = element.documento;
                this.actualizar();
            });
        }
        this.lconsulta = [];
    }

    /**Muestra lov de funcionarios */
    mostrarLovFuncionarios(): void {
        this.lovFuncionarios.showDialog();
    }

    /**Retorno de lov de funcionarios. */
    fijarLovFuncionarios(reg: any): void {
        if (reg.registro !== undefined) {
            this.registro.responsablecfuncionario = reg.registro.cfuncionario;
            this.registro.mdatos.nresponsable = reg.registro.mdatos.nombre;
        }
    }
}