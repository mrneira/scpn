import {Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';

import {DtoServicios} from '../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../util/shared/componentes/base.component';
import {AccionesReporteComponent} from '../../../../../util/shared/componentes/accionesReporte.component';
import { SelectItem } from 'primeng/primeng';
import { JasperComponent } from '../../../../../util/componentes/jasper/componentes/jasper.component'
import { MenuItem } from 'primeng/components/common/menuitem';
import { LovPeriodoComponent } from '../../../lov/periodo/componentes/lov.periodo.component';
import { LovFuncionariosEvaluadosComponent } from '../../../lov/evaluados/componentes/lov.funcionarios.component';

import { GestorDocumentalComponent } from '../../../../gestordocumental/componentes/gestordocumental.component';

@Component({
  selector: 'app-evaluacionaprob',
  templateUrl: 'evaluacionaprob.html'
})
export class AprobacionEvaluacionComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild('formFiltros') formFiltros: NgForm;
   
  
  @ViewChild(JasperComponent)
  public reporte: JasperComponent;

  @ViewChild(LovPeriodoComponent)
  private lovPeriodo: LovPeriodoComponent;
  
  @ViewChild(LovFuncionariosEvaluadosComponent)
  private lovFuncionariosEval: LovFuncionariosEvaluadosComponent;
  public lparametro:any = [];

  @ViewChild(GestorDocumentalComponent)
  private lovGestor: GestorDocumentalComponent;

  selectedRegistros;
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthasignacionresp', 'EVALUACION', false, false);
    this.componentehijo = this;
  }
  public  cerrar:boolean= false;
  public  ldatos=[];
  public aprobada:boolean=false;

  public nuevo = true;
  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {

  }


  crearNuevo() {
    super.crearNuevo();
    
    this.registro.actividadesesenciales=0;
    this.registro.conocimiento=0;
    this.registro.competenciatecnica=0;
    this.registro.competenciasuniversales=0;
    this.registro.trabajoequipo=0;
    this.registro.quejasciudadano=0;
    this.registro.calificacion=0;
    this.registro.aprobada=false;
    this.registro.adelantometas=false;
    this.registro.finalizada=false;
    this.registro.aprobadireccion=false;
    this.registro.fevaluacion=this.fechaactual;
    this.registro.fingreso= this.fechaactual;
    this.registro.cusuarioing= this.dtoServicios.mradicacion.cusuario;
    this.registro.ccatalogocalificacion=1131;    
    this.registro.diraprobado= false;
    this.registro.direstado= false;
    
    
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
  mostrarLovGestorDocumental(reg: any): void {
    this.selectRegistro(reg);
    this.mostrarDialogoGenerico = false;
    this.lovGestor.showDialog(reg.cgesarchivo);
  }
  descargarArchivo(cgesarchivo: any): void {
    this.lovGestor.consultarArchivo(cgesarchivo, true);
  }
  fijarLovGestorDocumental(reg: any): void {
    if (reg !== undefined) {
      this.registro.cgesarchivo = reg.cgesarchivo;
      this.registro.mdatos.ndocumento = reg.ndocumento;
      this.actualizar();

      this.grabar();

    }
  }
  

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.casignacion', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tthfuncionariodetalle', 'primernombre + \' \' + primerapellido', 'nfuncionario', 'i.cfuncionario= t.cfuncionario and i.verreg = 0');
    consulta.addSubquery('tthevaluacionperiodo', 'nombre', 'nperiodo', 'i.cperiodo=t.cperiodo');
   
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.direstado= false;
    this.mfiltros.diraprobado= true;
    
  }
  Descargar(reg:any){
    this.reporte.nombreArchivo = 'ReporteEvaluacion';
    // Agregar parametros
    this.reporte.parametros['@i_casignacion'] = reg.casignacion;
    if (reg.periodoprueba){
      this.reporte.parametros['archivoReporteUrl'] = '/CesantiaReportes/TalentoHumano/rptTthEvaluacionAsignacionResponsabilidadesPeriodoPrueba';
   
    }else{
      this.reporte.parametros['archivoReporteUrl'] = '/CesantiaReportes/TalentoHumano/rptTthEvaluacionAsignacionResponsabilidades';
   
    }
    this.reporte.generaReporteCore();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************
 
  // Inicia MANTENIMIENTO *********************
  grabar(): void {    
    this.lmantenimiento = []; // Encerar Mantenimiento
   
    this.rqMantenimiento.mdatos.cerrar=this.cerrar;
    this.rqMantenimiento.mdatos.ldatos=this.ldatos;
    this.rqMantenimiento.mdatos.aprobada=this.aprobada;
    this.crearDtoMantenimiento();
    
    
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
    this.recargar();
  }

  aprobar(){
    if(this.aprobarSolicitud()){
      this.grabar();
 
    }
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
  rechazar(){
    if(this.negarSolicitud()){
      this.grabar();
    }

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

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if(resp.cod==='OK'){
      this.recargar();
    }
  }
  /**Muestra lov de periodos */
  mostrarLovPeriodo(): void {
    this.lovPeriodo.showDialog();
  }
  /**Retorno de lov de Periodo. */
  fijarLovPeriodoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cperiodo = reg.registro.cperiodo;
      this.registro.cperiodo = reg.registro.cperiodo;
      this.mcampos.nperiodo = reg.registro.nombre;
      this.mcampos.fdesde=reg.registro.fdesde;
      this.mcampos.fhasta=reg.registro.fhasta;
    }
  }
  
  /**Muestra lov de funcionarios evaluados */

  /**Retorno de lov de funcionarios. */

  
  
}
