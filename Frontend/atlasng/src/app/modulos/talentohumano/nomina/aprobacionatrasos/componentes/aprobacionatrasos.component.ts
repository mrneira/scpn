import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import {LovFuncionariosComponent} from '../../../lov/funcionarios/componentes/lov.funcionarios.component';

import { MenuItem } from 'primeng/components/common/menuitem';
@Component({
  selector: 'app-aprobacionatrasos',
  templateUrl: 'aprobacionatrasos.html'
})
export class AprobacionAtrasosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovFuncionariosComponent)
  private lovFuncionarios: LovFuncionariosComponent;
 
  public ltipo: SelectItem[] = [{label: '...', value: null}];

  public lmeses: SelectItem[] = [{label: '...', value: null}];
  public ldatos: any = [];
  public cerrar: boolean=false;
  public aprobada: boolean=false;
  selectedRegistros;
  public itemsEtapa: MenuItem[] = [{ label: 'No Aplica', icon: 'ui-icon-circle-arrow-e', command: () => { this.aprobarEtapa(); } },
  { label: 'Aplica', icon: 'ui-icon-circle-arrow-w', command: () => { this.rechazarEtapa(); } }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tnomfalta', 'TFALTA', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultar();  // para ejecutar consultas automaticas.
  
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.justificada=false;
    this.registro.fingreso = this.fechaactual;
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

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);

  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cfalta', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tthfuncionariodetalle', 'primernombre + \' \' + primerapellido', 'nfuncionario', 'i.cfuncionario= t.cfuncionario and i.verreg = 0');
    consulta.orderby = 'cfalta desc';
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltrosesp.cfuncionariojust= ' is null';
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************
  aprobarEtapa(){
    if(this.aprobarSolicitud()){
      this.grabar();
 
    }
  }
  rechazarEtapa(){
    if(this.negarSolicitud()){
      this.grabar();
    }

  }
  // Inicia MANTENIMIENTO *********************
  grabar(): void {    
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.mdatos={};
    this.rqMantenimiento.mdatos.ldatos=this.ldatos;
    this.rqMantenimiento.mdatos.aprobada=this.aprobada;
    this.rqMantenimiento.mdatos.cfuncionariojust =sessionStorage.getItem("cfuncionario");
 
    this.crearDtoMantenimiento();
    
    
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }



  negarSolicitud(): boolean {
   // let mensaje: string = '';
   this.cerrar= false;
    this.ldatos=[];
    this.aprobada=false;
    for (const i in this.selectedRegistros) {
      if (this.selectedRegistros.hasOwnProperty(i)) {
        const reg: any = this.selectedRegistros[i];
        
        this.ldatos.push(reg);
        this.cerrar= true;
      }
    }
    if (this.selectedRegistros != null && this.selectedRegistros.length == 0) {
     this.cerrar=false;
      return false;
     
    }
    return true;
  }
  aprobarSolicitud() {
    // let mensaje: string = '';
    this.cerrar= false;
     this.ldatos=[];
     this.aprobada=true;
     for (const i in this.selectedRegistros) {
       if (this.selectedRegistros.hasOwnProperty(i)) {
         const reg: any = this.selectedRegistros[i];
         reg.j
         this.ldatos.push(reg);
         this.cerrar= true;
       }
     }
     if (this.selectedRegistros != null && this.selectedRegistros.length == 0) {
      this.cerrar=false;
       return false;
      
     }
     return true;
   }
  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
   if(resp.cod!='OK'){
     super.mostrarMensajeError(resp.msgusu);
   }
   if(resp.VALIDADO){
     this.recargar();
   }

  }
 
  
  mostrarLovFuncionarios(): void {
    this.lovFuncionarios.showDialog();
  }

  /**Retorno de lov de funcionarios. */
  fijarLovFuncionariosSelect(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.nfuncionario = reg.registro.mdatos.nombre;
      this.registro.cfuncionario = reg.registro.cfuncionario;
    }
  }

}
