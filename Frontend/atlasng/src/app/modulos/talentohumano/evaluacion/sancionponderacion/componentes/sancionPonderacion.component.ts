import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-sancionPonderacion',
  templateUrl: 'sancionPonderacion.html'
})
export class SancionPonderacionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public ltipoccatalogo: SelectItem[] = [{label: '...', value: null}];


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthsancionponderacion', 'SANCIONPONDERACION', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);    
    this.consultar();  // para ejecutar consultas automaticas.
    this.consultarCatalogos();
}

  ngAfterViewInit() {
  }

  crearNuevo() {
  
    super.crearNuevo();
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    this.registro.tipoccatalogo = 1112;
    this.registro.tipocdetalle = this.registro.mdatos.nnombre;
    this.registro.optlock = 0;
    this.registro.fingreso = this.fechaactual;
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
    consulta.addSubquery('tgencatalogodetalle','nombre','nnombre','i.ccatalogo = t.tipoccatalogo and i.cdetalle = t.tipocdetalle');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  consultarCatalogos(): void{

    this.encerarConsultaCatalogos();
    const consulta= new Consulta('tgencatalogodetalle', 'Y', 't.nombre',{}, {});
    consulta.addFiltroCondicion('ccatalogo',1112,'=');
    consulta.cantidad = 50;
    this.addConsultaCatalogos('SANCION', consulta, this.ltipoccatalogo, this.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
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


}
