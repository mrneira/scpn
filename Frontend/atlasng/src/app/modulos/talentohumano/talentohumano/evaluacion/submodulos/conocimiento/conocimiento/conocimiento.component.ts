import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta, Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovPaisesComponent } from '../../../../../../generales/lov/paises/componentes/lov.paises.component';

@Component({
  selector: 'app-dconocimiento',
  templateUrl: 'conocimiento.html'
})
export class ConocimientoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(LovPaisesComponent)
  private lovPaises: LovPaisesComponent;

  public lconocimiento: SelectItem[] = [{ label: '...', value: null }];
  public lnivel: SelectItem[] = [{ label: '...', value: null }];

  public lpuntaje: SelectItem[] = [{ label: '...', value: null }];

  public lpuntajed: any = [];
  public maxpuntaje: Number;

  @Output() calcularTotalesConocimientoEvent = new EventEmitter();

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthasignacionperfil', 'ASIGPERFIL', false);
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
    this.registro.ccatalogonivel = 1122;
   // this.actualizarConocimiento();
  }

  actualizar() {
    super.actualizar();
  }
  validarRegistros(): string {
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        if (this.estaVacio(reg.nombre)) {
          return 'NO SE HA IDENTIFICADO EL NOMBRE  EN EL REGISTRO ' + (Number(i) + 1) + ' DEL PERFIL DEL PUESTO';
        }
        if (this.estaVacio(reg.puntajecparametro)) {
          return 'NO SE HA DEFINIDO EL PUNTAJE EN EL REGISTRO ' + (Number(i) + 1) + ' DEL PERFIL DEL PUESTO';
        }
      }
    }
    return "";
  }
  eliminar() {
    super.eliminar();
    for (const i in this.lregistros) {
    this.actualizarPorcentaje(Number(i));
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.cperfil', this.mfiltros, this.mfiltrosesp);
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
  }

  agregarlinea() {

    if (this.estaVacio(this.mcampos.casignacion)) {
      super.mostrarMensajeError("NO SE HA DEFINIDO UNA EVALUACIÓN");
      return;
    }
    super.crearnuevoRegistro();
    this.registro.casignacion = this.mcampos.casignacion;
    this.registro.ccatalogonivel = 1122;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    this.registro.fingreso = this.fechaactual;
    this.actualizar();
    for (const i in this.lregistros) {
      this.actualizarPorcentaje(Number(i));
    }
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
  buscarParametro(cparametro: Number, lista: any): Number {
    for (let i in lista) {
      let reg = lista[i];
      if (reg.cparametro === cparametro) {
        return reg.ponderacion;
      }
    }
    return 0;
  }


  actualizarPorcentaje(index: number): void {
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
 

    this.calcularTotalesConocimientoEvent.emit();
  }

}
