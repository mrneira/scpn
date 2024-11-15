import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-horasextras-det',
  templateUrl: 'horasextras.html'
})
export class HorasExtrasComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;


  public ltipo: SelectItem[] = [{label: '...', value: null}];
  public lregimen: SelectItem[] = [{label: '...', value: null}];
  

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tnomhoras', 'THORASEXTRAS', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
   
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    
    super.crearNuevo();
    this.registro.anio= this.mcampos.anio;
    this.registro.tipoccatalogo= 1140;
    this.registro.regimenccatalogo= 1114;
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
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'ntipo', ' t.tipoccatalogo=i.ccatalogo and t.tipocdetalle=i.cdetalle');
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'nregimen', ' t.regimenccatalogo=i.ccatalogo and t.regimencdetalle=i.cdetalle');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
    this.mfiltros.cinstruccion = this.mcampos.cinstruccion;
      
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
 
  validarPorcentaje(){
    if(Number(this.registro.porcentaje)<=0 || Number(this.registro.porcentaje)>100){
      this.registro.porcentaje=null;
    }
    
  }

  public formatoHora($event: any,num: number): void {
    var temp = new Date($event);
    var hours  = ("0" + temp.getHours()).slice(-2);
    var minutes = ("0" + temp.getMinutes()).slice(-2);
    var res= [hours, minutes].join(":");
    switch(num) {
        case 1: {
          this.registro.hinicio = res;
          break;
        }
        case 2: {
          this.registro.hfin = res;
          break;
        }  
    }
  }
}
