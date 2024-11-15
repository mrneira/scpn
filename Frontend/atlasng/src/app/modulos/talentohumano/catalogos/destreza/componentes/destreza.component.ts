import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CatalogoDetalleComponent } from '../../../../generales/catalogos/componentes/_catalogoDetalle.component';

@Component({
  selector: 'app-destreza',
  templateUrl: 'destreza.html'
})
export class DestrezaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  private catalogoDetalle: CatalogoDetalleComponent;
  public ltipo: SelectItem[] = [{label: '...', value: null}];
  

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthcompetencia', 'DESTREZA', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
    this.mcampos.tipocdetalle=null;
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    if(this.estaVacio(this.mcampos.tipocdetalle)){
      super.mostrarMensajeError("NO SE HA SELECIONADO UN TIPO DE EVALUACIÓN");
      return;
    }
    this.registro.tipoccatalogo=1160;
    this.registro.tipocdetalle=this.mcampos.tipocdetalle;
    this.registro.cusuarioing= this.dtoServicios.mradicacion.cusuario;
    this.registro.fingreso = this.fechaactual;
    
    //this.registro.optlock = 0;
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.ccompetencia', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgencatalogoDetalle', 'nombre', 'ntipo', 'i.ccatalogo=tipoccatalogo and i.cdetalle=tipocdetalle');
   
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  consultarCatalogos(): void {


    this.encerarConsultaCatalogos();
  this.catalogoDetalle = new CatalogoDetalleComponent(this.router, this.dtoServicios);
    this.catalogoDetalle.mfiltros.ccatalogo = 1160;
    const consultaRelevancia = this.catalogoDetalle.crearDtoConsulta();
    consultaRelevancia.cantidad = 20;
    this.addConsultaCatalogos('NIVEL', consultaRelevancia, this.ltipo, this.llenaListaCatalogo, 'cdetalle', this.componentehijo,false);

    
  
    this.ejecutarConsultaCatalogos();
  }

  private fijarFiltrosConsulta() {
    
    if(this.estaVacio(this.mcampos.tipocdetalle)){
      super.mostrarMensajeError("NO HA SELECCIONADO UN TIPO DE DESTREZA")
      return;
    }
    this.mfiltros.tipocdetalle=this.mcampos.tipocdetalle;
  }

  validaFiltrosConsulta(): boolean {
    return true;
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
