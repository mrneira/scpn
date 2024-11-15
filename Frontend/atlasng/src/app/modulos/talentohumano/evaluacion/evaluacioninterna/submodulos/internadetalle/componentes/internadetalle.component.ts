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


@Component({
  selector: 'app-internadetalle',
  templateUrl: 'internadetalle.html'
})

export class InternaDetalleComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(LovPaisesComponent)
  private lovPaises: LovPaisesComponent;
  comportamiento: boolean;
  public lcomportamiento: any = [];
  @Output() calcularTotales = new EventEmitter();

  public lcalificacion: SelectItem[] = [{ label: '...', value: null }];
  public latributos: SelectItem[] = [{ label: '...', value: null }];

  public latributosd: any = [];
  public lcalificaciond: any = [];
  public ponderacion: any;
  @ViewChild(LovIdiomasComponent)
  private lovIdiomas: LovIdiomasComponent;


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthinternadetalle', 'EVALINTERNADETALLE', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();

  }

  ngAfterViewInit() {
  }

  crearNuevo() {

    if (this.estaVacio(this.mcampos.cinterna)) {
      super.mostrarMensajeError("NO SE HA DEFINIDO UNA EVALUACIÓN");
      return;
    }
    super.crearNuevo();
    this.registro.cinterna = this.mcampos.cinterna;
    this.registro.calificacion = 0;
    this.registro.fingreso = this.fechaactual;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;

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
    const consulta = new Consulta(this.entityBean, 'Y', 't.cinternadetalle', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tthatributo', 'descripcion', 'natributo', 'i.catributo = t.catributo');
    consulta.addSubquery('tthparametroscalificacion', 'ponderacion', 'nponderacion', 'i.cparametro = t.cparametro');
    this.addConsulta(consulta);
    return consulta;
  }

  validarRegistros(): string {
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        if (this.estaVacio(reg.catributo)) {
          return 'NO SE HA DEFINIDO EL ATRIBUTO EN EL REGISTRO ' + (Number(i) + 1);
        }
        if (this.estaVacio(reg.cparametro)) {
          return 'NO SE HA DEFINIDO LA CALIFICACIÓN ' + (Number(i) + 1);
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
  actualizarPonderacion(index: any, reg: any) {
    if (this.estaVacio(reg.cparametro)) {
      return;
    }
    let i = index;
    this.lregistros[index].mdatos.nponderacion = this.buscarCalificacion(reg.cparametro);
  }
  actualizarAtributo(index: any, reg: any) {
    if (this.estaVacio(reg.catributo)) {
      return;
    }
    let i = index;
    this.lregistros[index].mdatos.natributo = this.buscarAtributo(reg.catributo);
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }
  agregarlinea() {

    if (this.estaVacio(this.mcampos.cinterna)) {
      super.mostrarMensajeError("NO SE HA DEFINIDO UNA EVALUACIÓN");
      return;
    }
    super.crearnuevoRegistro();
    this.registro.cinterna = this.mcampos.cinterna;
    this.registro.calificacion = 0;
    this.registro.fingreso = this.fechaactual;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    this.actualizarTotal();
    this.actualizar();
  }

  buscarCalificacion(valor: string): number {

    for (const i in this.lcalificaciond) {
      if (this.lcalificaciond.hasOwnProperty(i)) {
        const reg = this.lcalificaciond[i];
        if (reg.cparametro === valor) {
          return reg.ponderacion;
        }

      }
    }
  }
  

  buscarAtributo(valor: number): string {

    for (const i in this.latributosd) {
      if (this.latributosd.hasOwnProperty(i)) {
        const reg = this.latributosd[i];
        if (reg.catributo === valor) {
          return reg.descripcion;
        }

      }
    }
  }
  buscarPromedio() {
    this.ponderacion = this.lcalificaciond[0].ponderacion;
    for (const i in this.lcalificaciond) {
      if (this.lcalificaciond.hasOwnProperty(i)) {
        const reg = this.lcalificaciond[i];
        if (reg.ponderacion > this.ponderacion) {
          this.ponderacion = reg.ponderacion;
        }

      }
    }
  }
  actualizarTotal() {
    let totalcomTecni = 0;
    let valor = 0;
    let cont = 0;
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        cont += 1;
        const reg = this.lregistros[i];
        if (!this.estaVacio(reg.mdatos.nponderacion)) {
            totalcomTecni += reg.mdatos.nponderacion;
        }else{
          totalcomTecni += 0;
        }
      }
    }
    let total = totalcomTecni / (this.ponderacion*cont);
    this.mcampos.total =this.redondear(total*100,2);
    this.mcampos.cont = cont;
    this.calcularTotales.emit();
  }
}
