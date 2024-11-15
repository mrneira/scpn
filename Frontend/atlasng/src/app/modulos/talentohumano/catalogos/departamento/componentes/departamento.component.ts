import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovProcesoComponent } from '../../../lov/proceso/componentes/lov.proceso.component';
import { LovFuncionariosComponent } from '../../../lov/funcionarios/componentes/lov.funcionarios.component';

@Component({
    selector: 'app-tal-departamento',
    templateUrl: 'departamento.html'
})

export class DepartamentoComponent extends BaseComponent implements OnInit, AfterViewInit {

    @ViewChild('formFiltros') formFiltros: NgForm;

    @ViewChild(LovProcesoComponent) private LovProceso: LovProcesoComponent;

    @ViewChild(LovFuncionariosComponent)
    lovFuncionarios: LovFuncionariosComponent;

    constructor(router: Router, dtoServicios: DtoServicios) {
        super(router, dtoServicios, 'tthdepartamento', 'PRUEBA', false);
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
        if(this.estaVacio(this.mfiltros.cproceso)){
            this.mostrarMensajeError("NO SE HA SELECIONADO UN PROCESO");
            return;
        }
        super.crearNuevo();
        this.registro.cproceso = this.mfiltros.cproceso;
        this.registro.mdatos.nproceso = this.mcampos.nproceso
        this.registro.mdatos.nfuncionario = this.mcampos.nfuncionario;
        this.registro.fingreso= this.fechaactual;
        this.registro.cusuarioing= this.dtoServicios.mradicacion.cusuario;
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
        if(this.estaVacio(this.mfiltros.cproceso)){
            this.mostrarMensajeError("NO SE HA SELECIONADO UN PROCESO");
            return;
        }
        this.crearDtoConsulta();
        super.consultar();
    }

    public crearDtoConsulta() {
        this.fijarFiltrosConsulta();
        const consulta = new Consulta(this.entityBean, 'Y', 't.cdepartamento', this.mfiltros, this.mfiltrosesp);
        consulta.addSubquery('TthProceso', 'nombre', 'nproceso', 'i.cproceso = t.cproceso');
        consulta.addSubquery('tthfuncionariodetalle','primernombre + \' \' + primerapellido','nfuncionario','i.cfuncionario = t.cfuncionario and verreg=0');
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
    mostrarLovProceso(): void {
        this.LovProceso.consultar();
        this.LovProceso.showDialog();
    }

    /**Retorno de lov de proceso. */
    fijarLovProceso(reg: any): void {
        if (reg.registro !== undefined) {
            this.mfiltros.cproceso = reg.registro.cproceso;
            this.mcampos.nproceso = reg.registro.nombre;
            this.consultar();
        }
    }

 /**Muestra lov de funcionarios */
 mostrarLovFuncionarios(): void {
    this.lovFuncionarios.showDialog();
  }

  /**Retorno de lov de funcionarios. */
  fijarLovFuncionariosSelect(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.nfuncionario = reg.registro.mdatos.nombre;      
      this.mfiltros.cfuncionario = reg.registro.cfuncionario;
      this.registro.cfuncionario = reg.registro.cfuncionario;
      this.registro.mdatos.nfuncionario = reg.registro.mdatos.nombre;
    
    }
  }


}