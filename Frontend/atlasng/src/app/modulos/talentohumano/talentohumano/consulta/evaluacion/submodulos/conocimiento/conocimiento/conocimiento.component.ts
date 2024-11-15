import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../../util/servicios/dto.servicios';
import { Consulta, Mantenimiento } from '../../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovPaisesComponent } from '../../../../../../../generales/lov/paises/componentes/lov.paises.component';

@Component({
  selector: 'app-dconocimiento',
  templateUrl: 'conocimiento.html'
})
export class ConocimientoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(LovPaisesComponent)
  private lovPaises: LovPaisesComponent;

  public lconocimiento: SelectItem[] = [{ label: '...', value: null }];
  public lnivel: SelectItem[] = [{ label: '...', value: null }];


  @Output() calcularTotalesConocimientoEvent = new EventEmitter();

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthevaluacionconocimiento', 'CONOCIMIENTO', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
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
  this.registro.ccatalogonivel=1122; 
  }

  actualizar() {
    super.actualizar();
  }
  validarRegistros(): string{
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        if (reg.conocimiento === undefined || reg.conocimiento === null || reg.conocimiento.length===0) {
          return 'NO SE HA IDENTIFICADO EL NOMBRE  EN EL REGISTRO '+(Number(i)+1)+' DE LOS CONOCIMIENTO';
        }
        if (reg.cdetallenivel === undefined || reg.cdetallenivel === null) {
          return 'NO SE HA DEFINIDO EL NIVEL EN EL REGISTRO '+(Number(i)+1)+' DE LOS CONOCIMIENTO';
        }
      }
    }
    return "";
  }
  eliminar() {
    super.eliminar();
    this.actualizarConocimiento();
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
  agregarlinea() {
    
    if(this.estaVacio(this.mcampos.cevaluacion)){
      super.mostrarMensajeError("NO SE HA DEFINIDO UNA EVALUACIÓN");
      return;
    }
    super.crearnuevoRegistro();
    this.registro.cevaluacion= this.mcampos.cevaluacion;
    this.actualizar();
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

  actualizarConocimiento() {
    let totalconocimiento = 0;
    let valor = 0;
    let cont=0;
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        if (reg.cdetallenivel !== undefined && reg.cdetallenivel !== null) {
           cont+=1;
          if (reg.cdetallenivel == "1")
            valor = 8;
          if (reg.cdetallenivel == "2")
            valor = 6;
          if (reg.cdetallenivel == "3")
            valor = 4;
          if (reg.cdetallenivel == "4")
            valor = 2;
          if (reg.cdetallenivel == "5")
            valor = 1;
          totalconocimiento += valor;
        }  
      }
    }
    let total = totalconocimiento/cont;
    this.mcampos.total = total;
    this.mcampos.cont = cont;
    this.calcularTotalesConocimientoEvent.emit();
  }

}
