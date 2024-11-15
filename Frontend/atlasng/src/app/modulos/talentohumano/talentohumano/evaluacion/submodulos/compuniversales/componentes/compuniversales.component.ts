import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { AccionesReporteComponent } from '../../../../../../../util/shared/componentes/accionesReporte.component';
import { SelectItem } from 'primeng/primeng';
import { OverlayPanel } from 'primeng/primeng';
enum RELEVANCIA { ALTA = 1, MEDIA = 2, BAJA = 3 }

@Component({
  selector: 'app-compuniversales',
  templateUrl: 'compuniversales.html'
})
export class CompuniversalesComponent extends BaseComponent implements OnInit, AfterViewInit {




  public ldetreza: SelectItem[] = [{ label: '...', value: null }];
  public lpuntaje: SelectItem[] = [{ label: '...', value: null }]
  public lnivel: SelectItem[] = [{ label: '...', value: null }];
  public comportamientod: any;

  public ldetrezatotal: any = [];
  public lpuntajed: any = [];
  public lcomportamiento: any = [];
  comportamiento: boolean;

  public maxpuntaje: Number;

  @Output() calcularTotalesCompUniverEvent = new EventEmitter();


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthasignacionconductuales', 'COMPUNIVER', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.comportamiento = false;
    const comp: comportamiento = new comportamiento();
    this.lcomportamiento.push({ 'nivel': null, 'descripcion': null });
  }

  ngAfterViewInit() {
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
  crearNuevo() {

    if (this.estaVacio(this.mcampos.casignacion)) {
      super.mostrarMensajeError("NO SE HA DEFINIDO UNA EVALUACIÓN");
      return;
    }
    super.crearNuevo();
    this.registro.cevaluacion = this.mcampos.cevaluacion;
    this.registro.nivelccatalogo = 1121;


  }

  actualizar() {
    super.actualizar();
    this.registro.nivelccatalogo = 1121;


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
  buscarNivel(registro: any) {
    let lniveltemp: any[] = [{ label: '...', value: null }];
    let lcomportamientoTemp: any[] = [{ nivel: '...', value: null }];



    for (let i in this.ldetrezatotal) {

      if (this.ldetrezatotal.hasOwnProperty(i)) {
        const reg = this.ldetrezatotal[i];
        if (reg.ccompetencia === registro.ccompetencia) {
          lniveltemp.push({ label: reg.mdatos.nnivel, value: reg.nivelcdetalle });
          lcomportamientoTemp.push({ nivel: reg.mdatos.nnivel, value: reg.descripcion });
        }
      }
    }
    this.lnivel = lniveltemp;
    this.lcomportamiento = lcomportamientoTemp;
  }

  consultarComportamiento(event, registro: any, overlaypanel: OverlayPanel) {
    this.comportamientod = registro;
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
  // Inicia CONSULTA *********************
  consultar() {
    if (this.estaVacio(this.mcampos.casignacion)) {
      super.mostrarMensajeError("NO SE HA DEFINIDO UNA EVALUACIÓN");
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }
  validarRegistros(): string {
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        if (this.estaVacio(reg.ccompetencia)) {
          return 'NO SE HA DEFINIDO LA RELEVANCIA EN EL REGISTRO ' + (Number(i) + 1) + ' DE LAS COMPETENCIAS CONDUCTUALES';
        }
        if (this.estaVacio(reg.nivelcdetalle)) {
          return 'NO SE HA DEFINIDO EL NIVEL EN EL REGISTRO ' + (Number(i) + 1) + ' DE LAS COMPETENCIAS CONDUCTUALES';
        }
        if (this.estaVacio(reg.ccompetenciadetalle)) {
          return 'NO SE HA DEFINIDO EL NIVEL DE DESARROLLO EN EL REGISTRO ' + (Number(i) + 1) + ' DE LAS COMPETENCIAS CONDUCTUALES';
        }

        if (this.estaVacio(reg.puntajecparametro)) {
          return 'NO SE HA DEFINIDO EL PUNTAJE EN EL REGISTRO ' + (Number(i) + 1) + ' DE LAS COMPETENCIAS CONDUCTUALES';
        }
      }
    }
    return "";
  }
  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.casignacionconductual', this.mfiltros, this.mfiltrosesp);
    //consulta.addSubquery('tthevaluaciondestreza', 'nombre', 'ndestreza', 'i.cdestreza = t.cdestreza');
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
  actualizarComportamiento(index: number, nivelcdetalle: any) {
    this.lregistros[index].mdatos.ndestrezadetalle = this.buscarDestreza(Number(this.lregistros[index].ccompetencia), nivelcdetalle);
    this.lregistros[index].ccompetenciadetalle = this.buscarDestrezaDetalle(Number(this.lregistros[index].ccompetencia), nivelcdetalle);

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

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }
  consultaComportamiento(registro: any) {
    let encontrado = false;
    this.lcomportamiento.pop();

    for (let i in this.ldetrezatotal) {
      if (!encontrado) {
        if (this.ldetrezatotal.hasOwnProperty(i)) {
          const reg = this.ldetrezatotal[i];
          if (reg.cdestreza === registro.cdestreza) {
            this.lcomportamiento.push({ 'nivel': reg.mdatos.nnivel, 'media': reg.media, 'baja': reg.baja });
            this.comportamiento = true;
            encontrado = true;
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
  actualizarCalificacion(index: number) {

    if (this.estaVacio(this.lregistros[index].puntajecparametro)) {
      return;
    }

    const puntaje = this.buscarParametro(this.lregistros[index].puntajecparametro, this.lpuntajed)
    this.lregistros[index].calificacion = puntaje;
    this.lregistros[index].promedio = puntaje;

    let totalregistros = this.lregistros.length;
    let total = Number(puntaje) / totalregistros;
    this.lregistros[index].mdatos.calificacion = total;
    this.lregistros[index].promedio = total / Number(this.maxpuntaje) * 100;
    this.lregistros[index].calificacion = total

    this.calcularTotalesCompUniverEvent.emit();
  }

}
class comportamiento {
  public alta: string;
  public media: string;
  public baja: string;

}