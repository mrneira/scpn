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
  selector: 'app-aprobacionHorasExtras',
  templateUrl: 'aprobacionHorasExtras.html'
})
export class AprobacionHorasExtrasComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovFuncionariosComponent)
  private lovFuncionarios: LovFuncionariosComponent;
 
  public ltipo: SelectItem[] = [{label: '...', value: null}];

  public lmeses: SelectItem[] = [{label: '...', value: null}];
  public ldatos: any = [];
  public cerrar: boolean=false;
  public aprobada: boolean=false;
  selectedRegistros;
  public itemsEtapa: MenuItem[] = [{ label: 'Aprobar Solicitud', icon: 'ui-icon-circle-arrow-e', command: () => { this.aprobarEtapa(); } },
  { label: 'Rechazar Solicitud', icon: 'ui-icon-circle-arrow-w', command: () => { this.rechazarEtapa(); } }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tnomhoraextranomina', 'THORAEXTRA', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultar();  // para ejecutar consultas automaticas.
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.mesccatalogo=4;
    this.registro.tipoccatalogo=1140;
    this.registro.aprobada=false;
    this.registro.contabilizada=false;
    this.registro.vhora=0;
    this.registro.vtotal=0;
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.choraextra', this.mfiltros, this.mfiltrosesp);
       
    //const consulta = new Consulta('tnomhoraextranomina', 'N','', {'estado': true },{});
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'nmes', 'i.ccatalogo=t.mesccatalogo and i.cdetalle=t.mescdetalle');
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'ntipo', 'i.ccatalogo=t.tipoccatalogo and i.cdetalle=t.tipocdetalle');
    consulta.addSubquery('tthfuncionariodetalle', 'primernombre + \' \' + primerapellido', 'nfuncionario', 'i.cfuncionario= t.cfuncionario and i.verreg = 0');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.estado= true;
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
    this.rqMantenimiento.mdatos.cerrar=this.cerrar;
    this.rqMantenimiento.mdatos.ldatos=this.ldatos;
    this.rqMantenimiento.mdatos.aprobada=this.aprobada;
    this.crearDtoMantenimiento();
    
    
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }



  negarSolicitud(): boolean {
   
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
    this.cerrar= false;
     this.ldatos=[];
     this.aprobada=true;
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
  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
   if(resp.cod!='OK'){
     super.mostrarMensajeError(resp.msgusu);
   }

  }
 
  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosMes: any = {'ccatalogo': 4};
    const consultaMes = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosMes, {});
    consultaMes.cantidad = 50;
    this.addConsultaCatalogos('MESES', consultaMes, this.lmeses, super.llenaListaCatalogo, 'cdetalle');
    
    const mfiltrosTipo: any = {'ccatalogo': 1140};
    const consultaTipo = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosTipo, {});
    consultaTipo.cantidad = 50;
    this.addConsultaCatalogos('TNTIPOHORA', consultaTipo, this.ltipo, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
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
