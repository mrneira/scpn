import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../../util/shared/componentes/base.component';
import { AccionesReporteComponent } from '../../../../../../../../util/shared/componentes/accionesReporte.component';
import { LovPaisesComponent } from '../../../../../../../generales/lov/paises/componentes/lov.paises.component';
import { LovIdiomasComponent } from '../../../../../../../generales/lov/idiomas/componentes/lov.idiomas.component';
import { SelectItem } from 'primeng/primeng';
import { ucs2 } from 'punycode';


enum RELEVANCIA {ALTA= 1, MEDIA= 2,BAJA=3}
@Component({
  selector: 'app-dcompetecnicas',
  templateUrl: 'comptecnicas.html'
})

export class ComptecnicasComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(LovPaisesComponent)
  private lovPaises: LovPaisesComponent;
  comportamiento:boolean;
  public lcomportamiento:any=[];
  @Output() calcularTotalesCompTecnicasEvent = new EventEmitter();

  public ldetreza: SelectItem[] = [{ label: '...', value: null }];
  public lrelevancia: SelectItem[] = [{ label: '...', value: null }];
  public lniveldesarrollo: SelectItem[] = [{ label: '...', value: null }];
  
  public ldetrezatotal: any = [];

  @ViewChild(LovIdiomasComponent)
  private lovIdiomas: LovIdiomasComponent;


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthevaluaciontgencompetencia', 'EVALGESPUESTO', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    
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
    this.registro.ccatalogoniveldesarrollo=1123;

  }
  actualizar() {
    super.actualizar();
    this.registro.ccatalogorelevancia=1121;
    this.registro.ccatalogoniveldesarrollo=1123;
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

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.secuencia', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tthevaluaciondestreza', 'nombre', 'ndestreza', 'i.cdestreza = t.cdestreza');
    this.addConsulta(consulta);
    return consulta;
  }

  validarRegistros(): string{
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        if (reg.cdetallerelevancia === undefined || reg.cdetallerelevancia === null) {
          return 'NO SE HA DEFINIDO LA RELEVANCIA EN EL REGISTRO '+(Number(i)+1)+' COMPETENCIAS TÉCNICAS DEL PUESTO';
        }
        if (reg.cdetalleniveldesarrollo === undefined || reg.cdetalleniveldesarrollo === null) {
          return 'NO SE HA DEFINIDO EL NIVEL DE DESARROLLO EN EL REGISTRO ' +(Number(i)+1)+' COMPETENCIAS TÉCNICAS DEL PUESTO';
        }
      }
    }
    return "";
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
  agregarlinea() {
    
    if(this.estaVacio(this.mcampos.cevaluacion)){
      super.mostrarMensajeError("NO SE HA DEFINIDO UNA EVALUACIÓN");
      return;
    }
    super.crearnuevoRegistro();
    this.registro.cevaluacion= this.mcampos.cevaluacion;
    this.registro.ccatalogorelevancia=1121;
    this.registro.ccatalogoniveldesarrollo=1123;

    this.actualizar();
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
    let totalcomTecni = 0;
    let valor = 0;
    let cont = 0;
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        cont += 1;
        if (reg.cdetalleniveldesarrollo == "1")
          valor = 8;
        if (reg.cdetalleniveldesarrollo == "2")
          valor = 6;
        if (reg.cdetalleniveldesarrollo == "3")
          valor = 4;
        if (reg.cdetalleniveldesarrollo == "4")
          valor = 2;
        if (reg.cdetalleniveldesarrollo == "5")
          valor = 1;
        totalcomTecni += valor;
      }
    }
    let total = totalcomTecni / cont;
    this.mcampos.total = total;
    this.mcampos.cont = cont;
    this.calcularTotalesCompTecnicasEvent.emit();
  }
}
 