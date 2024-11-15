import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { AccionesReporteComponent } from '../../../../../../../util/shared/componentes/accionesReporte.component';
import { LovPaisesComponent } from '../../../../../../generales/lov/paises/componentes/lov.paises.component';
import { LovIdiomasComponent } from '../../../../../../generales/lov/idiomas/componentes/lov.idiomas.component';
import { SelectItem } from 'primeng/primeng';
import { ucs2 } from 'punycode';
import { OverlayPanel } from 'primeng/primeng';

@Component({
  selector: 'app-dcompetecnicas',
  templateUrl: 'comptecnicas.html'
})

export class ComptecnicasComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(LovPaisesComponent)
  private lovPaises: LovPaisesComponent;
  comportamiento: boolean;
  public lcomportamiento: any = [];
  @Output() calcularTotalesCompTecnicasEvent = new EventEmitter();

  public ldetreza: SelectItem[] = [{ label: '...', value: null }];
  public lpuntaje: SelectItem[] = [{ label: '...', value: null }]
  public lnivel: SelectItem[] = [{ label: '...', value: null }];

  public ldetrezatotal: any = [];
  public lpuntajed: any = [];
  public maxpuntaje: Number;
  @ViewChild(LovIdiomasComponent)
  private lovIdiomas: LovIdiomasComponent;
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthasignacionctecnicas', 'EVALGESPUESTO', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.lcomportamiento.push({ 'nivel': null, 'descripcion': null });
   
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

  }
  actualizar() {
    super.actualizar();

  }

  eliminar() {
    super.eliminar();
    for (const i in this.lregistros) {
      this.actualizarCalificacion(Number(i));
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

  buscarNivel(registro :any){
    let lniveltemp: any[] = [{ label: '...', value: null }];
    let lcomportamientoTemp: any[] = [{ nivel: '...', value: null }];

    

    for (let i in this.ldetrezatotal) {
  
        if (this.ldetrezatotal.hasOwnProperty(i)) {
          const reg = this.ldetrezatotal[i];
          if (reg.ccompetencia === registro.ccompetencia) {
            lniveltemp.push({ label: reg.mdatos.nnivel, value: reg.nivelcdetalle });
            lcomportamientoTemp.push({nivel: reg.mdatos.nnivel, value: reg.descripcion});
          }
        }
    }
    this.lnivel= lniveltemp;
    this.lcomportamiento=lcomportamientoTemp;

  }
  consultaComportamiento(registro: any) {

    let encontrado = false;
    this.lcomportamiento.pop();
    for (let i in this.ldetrezatotal) {
      if (!encontrado) {
        if (this.ldetrezatotal.hasOwnProperty(i)) {
          const reg = this.ldetrezatotal[i];
          if (reg.cdestreza === registro.cdestreza) {

            this.lcomportamiento.push({ 'alta': reg.alta, 'media': reg.media, 'baja': reg.baja });
            this.comportamiento = true;
            encontrado = true;
          }
        }
      }
    }
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.casignacionctecnicas', this.mfiltros, this.mfiltrosesp);
    //  consulta.addSubquery('tthevaluaciondestreza', 'nombre', 'ndestreza', 'i.cdestreza = t.cdestreza');
    this.addConsulta(consulta);
    return consulta;
  }

  validarRegistros(): string {
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        if (this.estaVacio(reg.ccompetencia)) {
          return 'NO SE HA DEFINIDO LA RELEVANCIA EN EL REGISTRO ' + (Number(i) + 1) + ' DE LAS COMPETENCIAS TÉCNICAS DEL PUESTO';
        }
        if (this.estaVacio(reg.nivelcdetalle)) {
          return 'NO SE HA DEFINIDO EL NIVEL EN EL REGISTRO ' + (Number(i) + 1) + ' DE LAS COMPETENCIAS TÉCNICAS DEL PUESTO';
        }
        if (this.estaVacio(reg.ccompetenciadetalle)) {
          return 'NO SE HA DEFINIDO EL NIVEL DE DESARROLLO EN EL REGISTRO ' + (Number(i) + 1) + ' DE LAS COMPETENCIAS TÉCNICAS DEL PUESTO';
        }

        if (this.estaVacio(reg.puntajecparametro)) {
          return 'NO SE HA DEFINIDO EL PUNTAJE EN EL REGISTRO ' + (Number(i) + 1) + ' DE LAS COMPETENCIAS TÉCNICAS DEL PUESTO';
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

    if (this.estaVacio(this.mcampos.casignacion)) {
      super.mostrarMensajeError("NO SE HA DEFINIDO UNA EVALUACIÓN");
      return;
    }
    super.crearnuevoRegistro();
    this.registro.casignacion = this.mcampos.casignacion;
    this.registro.nivelccatalogo = 1121;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    this.registro.fingreso = this.fechaactual;
   
    this.actualizar();
    for (const i in this.lregistros) {
      this.actualizarCalificacion(Number(i));
    }
  }
  consultarComportamiento(event, registro: any, overlaypanel: OverlayPanel) {
  
    let lcomportamientoTemp: any[] = [{ nivel: '...', descripcion: null }];
    let datos =0;

    for (let i in this.ldetrezatotal) {

      if (this.ldetrezatotal.hasOwnProperty(i)) {
        const reg = this.ldetrezatotal[i];
        if (reg.ccompetencia === registro.ccompetencia) {

          lcomportamientoTemp.push({ nivel: reg.mdatos.nnivel, descripcion: reg.descripcion });
          datos++;
        }
      }
    }
    if(datos>0){
      lcomportamientoTemp.shift();
    }
    this.lcomportamiento = lcomportamientoTemp;
    //lcomportamiento
    overlaypanel.toggle(event);
  }
  actualizarComportamiento(index: number, nivelcdetalle: any) {
    this.lregistros[index].mdatos.ndestrezadetalle = this.buscarDestreza(Number(this.lregistros[index].ccompetencia), nivelcdetalle);
    this.lregistros[index].ccompetenciadetalle= this.buscarDestrezaDetalle(Number(this.lregistros[index].ccompetencia), nivelcdetalle);
   
  }
  buscarDestreza(ccompetencia: number, nivelcdetalle: String): string {

    for (const i in this.ldetrezatotal) {
      if (this.ldetrezatotal.hasOwnProperty(i)) {
        const reg = this.ldetrezatotal[i];
        if (reg.ccompetencia === ccompetencia && reg.nivelcdetalle == nivelcdetalle) {
          return reg.descripcion;
        }
      }
    }
    return null;
  }
  buscarDestrezaDetalle(ccompetencia: number, nivelcdetalle: String): string {

    for (const i in this.ldetrezatotal) {
      if (this.ldetrezatotal.hasOwnProperty(i)) {
        const reg = this.ldetrezatotal[i];
        if (reg.ccompetencia === ccompetencia && reg.nivelcdetalle == nivelcdetalle) {
          return reg.ccompetenciadetalle;
        }
      }
    }
    return null;
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
  actualizarCalificacion(index:number) {

    if (this.estaVacio(this.lregistros[index].puntajecparametro)) {
      return;
    }

    const puntaje = this.buscarParametro(this.lregistros[index].puntajecparametro, this.lpuntajed)
    this.lregistros[index].calificacion = puntaje;
    this.lregistros[index].promedio = puntaje;

    let totalregistros = this.lregistros.length;
    let total=Number(puntaje) / totalregistros;
    this.lregistros[index].mdatos.calificacion =total;
    this.lregistros[index].promedio = total/Number(this.maxpuntaje)*100;
    this.lregistros[index].calificacion =total
 
    this.calcularTotalesCompTecnicasEvent.emit();
  }
}
