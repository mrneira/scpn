import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta, Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-gestionpuesto',
  templateUrl: 'paramgestionpuesto.html'
})
export class ParamgestionpuestoComponent extends BaseComponent implements OnInit, AfterViewInit {



  public lcalidad: SelectItem[] = [{ label: '...', value: null }];
  public loportunidad: SelectItem[] = [{ label: '...', value: null }];

  public lcalidadd: any = [];
  public loportunidadd: any = [];
  public periodoprueba = false;
  //VARIABLES PARA OBTENER EL MAXIMO PUNTAJE DE CALIDAD Y OPORTUNIDAD PARA DETERMINAR UN PROMEDIO POR REGISTRO
  public maxpcalidad: Number;
  public maxpoportunidad: Number;
  
  @Output() calcularTotalesEvent = new EventEmitter();

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthasignacionpintermedio', 'ASIGPINTERMEDIO', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();

  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.estaVacio(this.mcampos.casignacion)) {
      super.mostrarMensajeError("NO SE HA DEFINIDO UNA EVALUACIÓN");
      return;
    }
    super.crearNuevo();
    this.registro.casignacion = this.mcampos.casignacion;
    this.registro.mindividual = 0;
    this.registro.mindividualcumplida = 0;
    this.registro.promedio = 0;

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
    if (this.estaVacio(this.mcampos.casignacion)) {
      super.mostrarMensajeError("NO SE HA DEFINIDO UNA EVALUACIÓN");
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    // this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cpintermedio', this.mfiltros, this.mfiltrosesp);
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

  validarRegistros(): string {
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        if (this.estaVacio(reg.mindividual) && this.periodoprueba) {
          return 'NO SE HA DEFINIDO LA META EN EL REGISTRO ' + (Number(i) + 1) + ' DE LA ASIGNACIÓN DE RESPONSABILIDADES';
        }
        if (this.estaVacio(reg.mindividualcumplida) && this.periodoprueba) {
          return 'NO SE HA DEFINIDO LA META CUMPLIDA EN EL REGISTRO ' + (Number(i) + 1) + ' DE LA ASIGNACIÓN DE RESPONSABILIDADES';
        }
        if (this.estaVacio(reg.pintermedio)) {
          return 'NO SE HA DEFINIDO EL PRODUCTO INTERMEDIO EN EL REGISTRO ' + (Number(i) + 1) + ' DE LA ASIGNACIÓN DE RESPONSABILIDADES';
        }
        if (this.estaVacio(reg.calidadcparametro)) {
          return 'NO SE HA DEFINIDO LA CALIDAD EN EL REGISTRO ' + (Number(i) + 1) + ' DE LA ASIGNACIÓN DE RESPONSABILIDADES';
        }
        if (this.estaVacio(reg.oportunidadcparametro)) {
          return 'NO SE HA DEFINIDO LA OPORTUNIDAD EN EL REGISTRO ' + (Number(i) + 1) + ' DE LA ASIGNACIÓN DE RESPONSABILIDADES';
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
    if (this.estaVacio(this.mcampos.casignacion)) {
      super.mostrarMensajeError("NO SE HA DEFINIDO UNA EVALUACIÓN");
      return;
    }
    super.crearnuevoRegistro();
    this.registro.casignacion = this.mcampos.casignacion;
    this.registro.mindividual = null;
    this.registro.mindividualcumplida = null;
    this.registro.promedio = 0;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    this.registro.fingreso = this.fechaactual;
    this.actualizar();
    for (var _i = 0; _i < this.lregistros.length; _i++) {
      this.actualizarPorcentaje(_i);
    }
  }
  buscarParametro(cparametro: Number, lista: any): Number {
    for (let i in lista) {
      let reg = lista[i];
      if (reg.cparametro === cparametro) {
        return reg.ponderacion;
      }
    }
    return 0;
  }
  actualizarPorcentajeCumplimiento(index:number){
    if (this.estaVacio(this.lregistros[index].mindividual) || this.estaVacio(this.lregistros[index].mindividualcumplida)) {
      return;
    }
    let porcentaje = 0;
    if (this.periodoprueba) {

      if (Number(this.lregistros[index].mindividual) < (Number(this.lregistros[index].mindividualcumplida))) {
        porcentaje = 100;
      }
      else {
        if(this.lregistros[index].mindividualcumplida===0){
          porcentaje=0;
        }else{
        porcentaje = ((Number(this.lregistros[index].mindividualcumplida) )) / (Number(this.lregistros[index].mindividual));
      porcentaje=porcentaje*100;  
      }
      }
    }
    let calificacion = 0;
    if (!this.estaVacio(this.lregistros[index].oportunidadcparametro)) {
      const calidad = this.buscarParametro(this.lregistros[index].calidadcparametro, this.lcalidadd)
      const oportunidad = this.buscarParametro(this.lregistros[index].oportunidadcparametro, this.loportunidadd)
    
      if (oportunidad != 0) {
        calificacion = Number(calidad) + Number(oportunidad);
      }
    }
    let totalregistros = this.lregistros.length;
    let total =calificacion/totalregistros;
    let totalponderado=total/(Number(this.maxpcalidad)+ Number(this.maxpoportunidad));
  
    let totalpromedio =(porcentaje)/totalregistros;
    this.lregistros[index].promedio =this.redondear(totalpromedio,2) ;
    this.lregistros[index].calificacion = total;
   
    this.lregistros[index].mdatos.calificacion = this.redondear(total,2);
    this.lregistros[index].mdatos.porcentaje = this.redondear(totalpromedio,2);
    this.lregistros[index].mdatos.calificacionp = this.redondear(totalponderado*100,2);
  
    this.calcularTotalesEvent.emit();
  }
  actualizarPorcentaje(index: number): void {
    if (this.estaVacio(this.lregistros[index].mindividual) || this.estaVacio(this.lregistros[index].mindividualcumplida)) {
      this.lregistros[index].mindividual=0;
      this.lregistros[index].mindividualcumplida=0;
    }
    let porcentaje = 0;
    if (this.periodoprueba) {

      if (Number(this.lregistros[index].mindividual) < (Number(this.lregistros[index].mindividualcumplida))) {
        porcentaje = 100;
      }
      else {
        if(this.lregistros[index].mindividualcumplida===0){
          porcentaje=0;
        }else{
        porcentaje = ((Number(this.lregistros[index].mindividualcumplida) )) / (Number(this.lregistros[index].mindividual));
      porcentaje=porcentaje*100;  
      }
      }
    }
    let calificacion = 0;
    if (!this.estaVacio(this.lregistros[index].oportunidadcparametro)) {
      const calidad = this.buscarParametro(this.lregistros[index].calidadcparametro, this.lcalidadd)
      const oportunidad = this.buscarParametro(this.lregistros[index].oportunidadcparametro, this.loportunidadd)
    
      if (oportunidad != 0) {
        calificacion = Number(calidad) + Number(oportunidad);
      }
    }
    let totalregistros = this.lregistros.length;
    let total =calificacion/totalregistros;
    let totalponderado=total/(Number(this.maxpcalidad)+ Number(this.maxpoportunidad));
  
    let totalpromedio =(porcentaje)/totalregistros;
    this.lregistros[index].promedio =this.redondear(totalpromedio,2) ;
    this.lregistros[index].calificacion = total;
   
    this.lregistros[index].mdatos.calificacion = this.redondear(total,2);
    this.lregistros[index].mdatos.porcentaje = this.redondear(totalpromedio,2);
    this.lregistros[index].mdatos.calificacionp = this.redondear(totalponderado*100,2);
  
    this.calcularTotalesEvent.emit();
  }
}
