import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../../util/shared/componentes/base.component';
import { AccionesReporteComponent } from '../../../../../../../../util/shared/componentes/accionesReporte.component';
import { SelectItem } from 'primeng/primeng';


enum RELEVANCIA {ALTA= 1, MEDIA= 2,BAJA=3}
@Component({
  selector: 'app-trabajoequipo',
  templateUrl: 'trabajoequipo.html'
})
export class TrabajoequipoComponent extends BaseComponent implements OnInit, AfterViewInit {


  @Output() calcularTotalesTrabEquipoEvent = new EventEmitter();
  public ldetreza: SelectItem[] = [{ label: '...', value: null }];
  public lfrecuencia: SelectItem[] = [{ label: '...', value: null }];
  public lrelevancia: SelectItem[] = [{ label: '...', value: null }];
  public ldetrezatotal: any = [];
  public lcomportamiento:any=[]
  comportamiento:boolean;
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthevaluaciontrabajoequipo', 'TRABEQUIPO', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.comportamiento=false;
    this.lcomportamiento.push({'alta': null, 'media': null, 'baja': null});
  }

  ngAfterViewInit() {
  }

  crearNuevo() {

    if (this.estaVacio(this.mcampos.cevaluacion)) {
      super.mostrarMensajeError("NO SE HA DEFINIDO UNA EVALUACIÓN");
      return;
    }
    if (this.lregistros.lenght === 3) {
      return;
    }
    super.crearNuevo();

    this.registro.cevaluacion = this.mcampos.cevaluacion;
    this.registro.ccatalogorelevancia = 1121;
    this.registro.ccatalogofrecuencia = 1124;


  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
    this.actualizarTotal();
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.secuencia', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tthevaluaciondestreza', 'nombre', 'ndestreza', 'i.cdestreza = t.cdestreza');
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {

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
  actualizarComportamiento(index: number, reg: any) {
    if (Number(reg.cdetallerelevancia) === RELEVANCIA.ALTA) {
      this.lregistros[index].comportamiento = this.buscarDestreza(Number(this.lregistros[index].cdestreza), Number(reg.cdetallerelevancia));
    }
    if (Number(reg.cdetallerelevancia) === RELEVANCIA.MEDIA) {
      this.lregistros[index].comportamiento = this.buscarDestreza(Number(this.lregistros[index].cdestreza), Number(reg.cdetallerelevancia));
    }
    if (Number(reg.cdetallerelevancia) == RELEVANCIA.BAJA) {
      this.lregistros[index].comportamiento = this.buscarDestreza(Number(this.lregistros[index].cdestreza), Number(reg.cdetallerelevancia));
    }
  }
  validarRegistros(): string{
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        if (reg.cdetallerelevancia === undefined || reg.cdetallerelevancia === null) {
          return 'NO SE HA DEFINIDO LA RELEVANCIA EN EL REGISTRO '+(Number(i)+1)+' DEL TRABAJO EN EQUIPO, INICIATIVA Y LIDERAZGO ';
        }
        if (reg.cdetallefrecuencia === undefined || reg.cdetallefrecuencia === null) {
          return 'NO SE HA DEFINIDO LA FRECUENCIA DE APLICACIÓN EN EL REGISTRO '+(Number(i)+1)+' DEL TRABAJO EN EQUIPO, INICIATIVA Y LIDERAZGO';
        }
      }
    }
    return "";
  }
  buscarDestreza(cdestreza: number, relevancia: Number): string {
    for (const i in this.ldetrezatotal) {
      if (this.ldetrezatotal.hasOwnProperty(i)) {
        const reg = this.ldetrezatotal[i];
        if (reg.cdestreza === cdestreza) {
          if (relevancia === RELEVANCIA.ALTA)
            return reg.alta;
          if (relevancia === RELEVANCIA.MEDIA)
            return reg.media;
          if (relevancia === RELEVANCIA.BAJA)
            return reg.baja;

        }
      }
     
    }
    return null;
  }
  actualizarTotal() {
    let totalTrabEquipo = 0;
    let valor = 0;
    let cont = 0;
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        cont += 1;
        if (reg.cdetallefrecuencia == "1")
          valor = 8;
        if (reg.cdetallefrecuencia == "2")
          valor = 6;
        if (reg.cdetallefrecuencia == "3")
          valor = 4;
        if (reg.cdetallefrecuencia == "4")
          valor = 2;
        if (reg.cdetallefrecuencia == "5")
          valor = 1;
        totalTrabEquipo += valor;
      }
    }
    let total = totalTrabEquipo / cont;
    total = total * 2;//porcentaje == 16%
    this.mcampos.total = total;
    this.mcampos.cont = cont;
    this.calcularTotalesTrabEquipoEvent.emit();
  }
  consultaComportamiento(registro:any){
    let encontrado = false;
    this.lcomportamiento.pop();
    for (let i in this.ldetrezatotal) {
      if (!encontrado){
      if (this.ldetrezatotal.hasOwnProperty(i)) {
        const reg = this.ldetrezatotal[i];  
        if(reg.cdestreza=== registro.cdestreza){
          this.lcomportamiento.push({'alta': reg.alta, 'media': reg.media, 'baja': reg.baja});
          this.comportamiento=true;
          encontrado=true;
        }
      }
    }
  }
  }
}
