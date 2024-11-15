import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-sancionponderacion',
  templateUrl: 'sancionponderacion.html'
})
export class SancionponderacionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;


  public ltipo: SelectItem[] = [{label: '...', value: null}];
  
  public legreso: SelectItem[] = [{label: '...', value: null}];

  public lmeses: SelectItem[] = [{label: '...', value: null}];
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthsancionponderacion', 'SANCIONPONDERACIÓN', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
    this.enproceso=false;
    this.consultar();
    
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.tipoccatalogo=1120;
   this.registro.fingreso = this.fechaactual;
   this.registro.cusuarioing= this.dtoServicios.mradicacion.cusuario;
    
    
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.csancion', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'ntipo', 'i.ccatalogo=t.tipoccatalogo and i.cdetalle=t.tipocdetalle');
   
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
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }
 
  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    
    const mfiltrosTipo: any = {'ccatalogo': 1144};
    const consultaTipo = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosTipo, {});
    consultaTipo.cantidad = 50;
    this.addConsultaCatalogos('TIPOSANCION', consultaTipo, this.ltipo, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }

}
