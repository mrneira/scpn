import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-horario',
  templateUrl: 'horario.html'
})
export class HorarioComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;


  public ltipo: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthhorario', 'HORARIO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    //this.consultar();  // para ejecutar consultas automaticas.
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    //this.registro.optlock = 0;
    this.registro.tipojornadaccatalogo=1116;
  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.chorario', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'njornada', 'i.ccatalogo = t.tipojornadaccatalogo and i.cdetalle = t.tipojornadacdetalle');
    
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
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
 

  llenarConsultaCatalogos(): void {
    const mfiltrosJornada: any = { 'ccatalogo': 1116 };
    const mfiltrosespJornada: any = { 'cdetalle': null };
    const consultaJornada = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosJornada, mfiltrosespJornada);
    consultaJornada.cantidad = 50;
    this.addConsultaPorAlias('JORNADA', consultaJornada);
  }

  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
       this.llenaListaCatalogo(this.ltipo, resp.JORNADA, 'cdetalle');
      
    }
    this.lconsulta = [];
  }

  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta("C")).subscribe(
      resp => {
        this.manejaRespuestaCatalogos(resp);
      },
      error => {
        this.dtoServicios.manejoError(error);
      }
    );
  }
  public formatoHora($event: any,num: number): void {
    var temp = new Date($event);
    var hours  = ("0" + temp.getHours()).slice(-2);
    var minutes = ("0" + temp.getMinutes()).slice(-2);
    var res= [hours, minutes].join(":");
    
    switch(num) {
        case 1: {
          this.registro.iniciojornada = res;
          break;
        }
        case 2: {
          this.registro.inicioalmuerzo = res;
          break;
        }
        case 3: {
          this.registro.finalmuerzo = res;
          break;
        }
        case 4: {
          this.registro.finjornada = res;
          break;
        }  
    }
  }
}
