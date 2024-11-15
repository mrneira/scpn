import { Component, OnInit, AfterViewInit, ViewChild, Input} from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-catalogo-padre',
  templateUrl: '_catalogoPadre.html'
})
export class CatalogoPadreComponent extends BaseComponent implements OnInit, AfterViewInit {

  @Input() rangomenor: any;
  @Input() rangomayor: any;
  
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TgenCatalogo', 'CATALOGO', true, false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.optlock = 0;
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
    const consulta = new Consulta(this.entityBean, 'N', 't.nombre', this.mfiltros, this.mfiltrosesp);
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    this.registro.esnuevo = true;
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.actualizar();
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
  
  public validarCatalogoPadre(){
    if(this.registro.ccatalogo == undefined){
      this.mostrarMensajeError("NO SE HA SELECCIONADO UN CÓDIGO VÁLIDO.");
      return false;
    }
    if(parseInt(this.registro.ccatalogo) >= this.rangomenor
    && parseInt(this.registro.ccatalogo) <= this.rangomayor){
      return true
    } else {
      this.mostrarMensajeError("ELIJA UN CODIGO VÁLIDO PARA SU MÓDULO, ENTRE "+this.rangomenor+" Y "+this.rangomayor+".");      
      return false;
    }
  }
}
  