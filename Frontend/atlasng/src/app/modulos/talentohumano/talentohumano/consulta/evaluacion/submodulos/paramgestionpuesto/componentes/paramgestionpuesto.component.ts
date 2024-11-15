import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../../util/servicios/dto.servicios';
import { Consulta, Mantenimiento } from '../../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-gestionpuesto',
  templateUrl: 'paramgestionpuesto.html'
})
export class ParamgestionpuestoComponent extends BaseComponent implements OnInit, AfterViewInit {


  public lactividad: SelectItem[] = [{ label: '...', value: null }];
  public lindicador: SelectItem[] = [{ label: '...', value: null }];
  public lindicadortotal: SelectItem[] = [{ label: '...', value: null }];


  @Output() calcularTotalesEvent = new EventEmitter();

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthevalgestionpuesto', 'GESTIONPUESTO', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.adelantometas = false;
  }

  ngAfterViewInit() {
  }
  
  crearNuevo() {
    if(this.estaVacio(this.mcampos.cevaluacion)){
      super.mostrarMensajeError("NO SE HA DEFINIDO UNA EVALUACIÓN");
      return;
    }
    super.crearNuevo();
    this.registro.cevaluacion= this.mcampos.cevaluacion;
  }

  actualizar() {
    super.actualizar();

  }
  

  eliminar() {
    super.eliminar();
    for (var _i = 0; _i < this.lregistros.length; _i++) {
      this.actualizarPorcentaje(_i);
  }
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.secuencia', this.mfiltros, this.mfiltrosesp);
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
   }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    for (var _i = 0; _i < this.lregistros.length; _i++) {
      this.actualizarPorcentaje(_i);
  }
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  validarRegistros(): string{
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        if (reg.actividad === undefined || reg.actividad === null || reg.actividad.length===0) {
          return 'NO SE HA DEFINIDO LA ACTIVIDAD EN EL REGISTRO '+(Number(i)+1)+' DE LOS INDICADORES DE GESTIÓN DEL PUESTO';
        }
        if (reg.indicador === undefined || reg.indicador === null || reg.indicador.length===0) {
          return 'NO SE HA DEFINIDO EL INDICADOR EN EL REGISTRO '+(Number(i)+1)+' DE LOS INDICADORES DE GESTIÓN DEL PUESTO';
        }
        if (reg.metaperiodo === undefined || reg.metaperiodo === null || Number(reg.metaperiodo)===0) {
          return 'NO SE HA DEFINIDO LA META DEL PERÍODO EN EL REGISTRO '+(Number(i)+1)+' DE LOS INDICADORES DE GESTIÓN DEL PUESTO';
        }
        if (reg.cumplido === undefined || reg.cumplido === null || Number(reg.cumplido)===0) {
          return 'NO SE HA DEFINIDO EL CUMPLIMIENTO EN EL REGISTRO '+(Number(i)+1)+' DE LOS INDICADORES DE GESTIÓN DEL PUESTO';
        }
      }
    }
    return "";
  }
  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  agregarlinea() {
    if(this.estaVacio(this.mcampos.cevaluacion)){
      super.mostrarMensajeError("NO SE HA DEFINIDO UNA EVALUACIÓN");
      return;
    }
    super.crearnuevoRegistro();
    this.registro.cevaluacion= this.mcampos.cevaluacion;
    this.actualizar();
  }
  aplicaAdelanto() {
    this.calcularTotalesEvent.emit();
  }

  actualizarPorcentaje(index: number): void {
    let a = 50;
    if (this.estaVacio(this.lregistros[index].metaperiodo)) {
      return;
    }
     let porcentaje = 0;
    if (Number(this.lregistros[index].metaperiodo) < (Number(this.lregistros[index].cumplido))) {
      porcentaje = 100;
    }
    else {
      porcentaje = ((Number(this.lregistros[index].cumplido) * 100)) / (Number(this.lregistros[index].metaperiodo));
    }

    this.lregistros[index].porcentaje = porcentaje;
    let cumplimiento;
    let valorFactor;
   
   
    if (porcentaje >= 90.5) {
      cumplimiento = 5;
      valorFactor = 60;
    }
    else if (porcentaje >= 80.5 && porcentaje < 90.5) {
      cumplimiento = 4;
      valorFactor = 45;
    }
    else if (porcentaje >= 70.5 && porcentaje <= 80.4) {
      cumplimiento = 3;
      valorFactor = 30;
    }
    else if (porcentaje >= 60.5 && porcentaje <= 70.4) {
      cumplimiento = 2;
      valorFactor = 15;
    }
    else if (porcentaje <= 60.4) {
      cumplimiento = 1;
      valorFactor = 0;
    }
    let totalregistros = this.lregistros.length;
    this.lregistros[index].nivelcumplimiento = cumplimiento;
    this.lregistros[index].mdatos.total = valorFactor / totalregistros;
    this.calcularTotalesEvent.emit();
  }
    
}
