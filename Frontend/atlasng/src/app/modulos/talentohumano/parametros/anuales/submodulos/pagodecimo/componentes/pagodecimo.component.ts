import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovCapacitacionComponent } from '../../../../../lov/capacitacion/componentes/lov.capacitacion.component';

import { LovFuncionariosComponent } from '../../../../../lov/funcionarios/componentes/lov.funcionarios.component';

@Component({
  selector: 'app-pagodecimo-det',
  templateUrl: 'pagodecimo.html'
})
export class PagodecimoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;


  fechaactual = new Date();
  fmin= new Date();
  factiva= false;

  public lmes: SelectItem[] = [{label: '...', value: null}];
  public lregion: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tnompagoregionesdecimo', 'PAGODECIMOREGIONES', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
   
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    
    super.crearNuevo();
    this.registro.anio= this.mcampos.anio;
    this.registro.regionccatalogo =1130;
    this.registro.mesccatalogo =4;
    this.registro.fingreso=this.fechaactual;
    this.registro.cusuarioing= this.dtoServicios.mradicacion.cusuario;
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.anio', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nmes', ' t.mesccatalogo=i.ccatalogo and t.mescdetalle = i.cdetalle');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nregion', ' t.regionccatalogo=i.ccatalogo and t.regioncdetalle=i.cdetalle');   
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
   
      
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

   validarFecha() {
    if (!this.estaVacio(this.registro.finicio)) {
      this.fmin = new Date(this.registro.finicio);
      this.fmin.setDate(this.fmin.getDate()+1);
      this.factiva= true;
    }
    this.registro.ffin=null;
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
 
  
  




}
