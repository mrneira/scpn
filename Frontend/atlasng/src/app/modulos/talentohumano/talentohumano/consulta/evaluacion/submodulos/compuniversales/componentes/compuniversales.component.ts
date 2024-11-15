import {Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../../../../util/shared/componentes/base.component';
import {AccionesReporteComponent} from '../../../../../../../../util/shared/componentes/accionesReporte.component';
import { SelectItem } from 'primeng/primeng';

enum RELEVANCIA {ALTA= 1, MEDIA= 2,BAJA=3}

@Component({
  selector: 'app-compuniversales',
  templateUrl: 'compuniversales.html'
})
export class CompuniversalesComponent extends BaseComponent implements OnInit, AfterViewInit {


  public ldetreza: SelectItem[] = [{label: '...', value: null}];
  public lfrecuencia: SelectItem[] = [{label: '...', value: null}];
  public lrelevancia: SelectItem[] = [{label: '...', value: null}];
  comportamiento:boolean;
    
  @Output() calcularTotalesCompUniverEvent = new EventEmitter();
  public lcomportamiento:any=[];
  public ldetrezatotal: any = [];
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthevaluacioncompuniversal', 'COMPUNIVER', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.comportamiento=false;
    const comp:comportamiento = new comportamiento();
      this.lcomportamiento.push({'alta': null, 'media': null, 'baja': null});
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
    this.registro.ccatalogorelevancia=1121;
    this.registro.ccatalogofrecuencia=1124;

  }

  actualizar() {
    super.actualizar();
    this.registro.ccatalogorelevancia=1121;
    this.registro.ccatalogofrecuencia=1124;

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
validarRegistros(): string{
  for (const i in this.lregistros) {
    if (this.lregistros.hasOwnProperty(i)) {
      const reg = this.lregistros[i];
      if (reg.cdetallerelevancia === undefined || reg.cdetallerelevancia === null) {
        return 'NO SE HA DEFINIDO LA RELEVANCIA EN EL REGISTRO '+(Number(i)+1)+' DE LAS COMPETENCIAS UNIVERSALES'
      }
      if (reg.cdetallefrecuencia === undefined || reg.cdetallefrecuencia === null) {
        return 'NO SE HA DEFINIDO LA FRECUENCIA DE APLICACIÓN EN EL REGISTRO '+(Number(i)+1)+' DE LAS COMPETENCIAS UNIVERSALES'
      }
    }
  }
  return "";
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
  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
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
  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }
  actualizarTotal() {
    let totalcomUniver = 0;
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
          totalcomUniver += valor;
      }
    }
    let total = totalcomUniver / cont;
    this.mcampos.total = total;
    this.mcampos.cont = cont;
    this.calcularTotalesCompUniverEvent.emit();
  }

}
class comportamiento{
  public  alta:string;
  public  media:string;
  public  baja:string;
  
}