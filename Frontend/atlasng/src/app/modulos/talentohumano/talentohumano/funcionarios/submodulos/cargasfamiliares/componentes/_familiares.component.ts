import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta, Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-tth-familiares',
  templateUrl: '_familiares.html'
})
export class FamiliaresComponent extends BaseComponent implements OnInit, AfterViewInit {

  public lparentezco: SelectItem[] = [{label: '...', value: null}];
  public ltipodiscapacidad: SelectItem[] = [{label: '...', value: null}];
  
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TthFamiliar', 'CARGASFAMILIARES', false);
    this.componentehijo = this;
  }
  
  ngOnInit() {
    super.init();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.parentezcoccatalogo = 1126; 
    this.registro.tipodiscapacidadccatalogo = 1127;
    this.registro.trabaja=false;
    this.registro.migrante=false;
    this.registro.porcentajediscapacidad=0;

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
    const consulta = new Consulta(this.entityBean, 'Y', 't.secuencia', this.mfiltros, this.mfiltrosesp);
      consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nparentezco', 't.parentezcocdetalle = i.cdetalle and t.parentezcoccatalogo = i.ccatalogo');
    
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

  public discapacidad(evento: any) {
    if(!evento){
      this.registro.carnetconadis = "";
      delete this.registro.tipodiscapacidadcdetalle;
      this.registro.porcentajediscapacidad = "";
    }
  }
}
