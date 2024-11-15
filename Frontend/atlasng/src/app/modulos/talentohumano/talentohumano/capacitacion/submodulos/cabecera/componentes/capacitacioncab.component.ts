import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovEstablecimientoComponent } from '../../../../../lov/establecimiento/componentes/lov.establecimiento.component';


@Component({
  selector: 'app-capacitacion-cab',
  templateUrl: 'capacitacioncab.html'
})
export class CapacitacionEventoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  @ViewChild(LovEstablecimientoComponent)
  private lovEstablecimiento: LovEstablecimientoComponent;

  public ltipo: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthinstruccioncesantia', 'CAPCABECERA', true, true);
    this.componentehijo = this;
  }
  fechaactual = new Date();
  fmin= new Date();
  factiva= false;
  
  ngOnInit() {
   super.init();
    
  }
  validarFecha() {
    if (!this.estaVacio(this.registro.finicio)) {
      this.fmin = new Date(this.registro.finicio);
      this.fmin.setDate(this.fmin.getDate()+1);
      this.factiva= true;
    }
    this.registro.ffin=null;
  }
  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.costo=0;
    this.registro.horas=0;
    this.registro.tiempodevengacion=0;
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.cinstruccion', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tthinstitucioneducativa', 'nombre', 'ninstitucion', 'i.cinstitucion = t.cinstitucion');
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

  mostrarLovEstablecimiento(): void {
    this.lovEstablecimiento.mfiltros.cursos = true;
    this.lovEstablecimiento.showDialog();
  }

  /**Retorno de lov de establecimientos. */
  fijarLovEstablecimientoSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.cinstitucion = reg.registro.cinstitucion;
      this.registro.mdatos.ninstitucion = reg.registro.nombre;
    }
  }


  validaGrabar() {
    return super.validaGrabar('NO HA REALIZADADO LA VALIDACIÓN DEL FORMULARIO[DATOS CAPACITACIÓN]');
  }

}
