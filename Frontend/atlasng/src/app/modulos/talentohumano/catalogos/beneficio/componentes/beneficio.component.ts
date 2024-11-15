import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-beneficio',
  templateUrl: 'beneficio.html'
})
export class BeneficioComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;


  public ltipo: SelectItem[] = [{label: '...', value: null}];
  
  public lingreso: SelectItem[] = [{label: '...', value: null}];

  public lmeses: SelectItem[] = [{label: '...', value: null}];
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tnombeneficio', 'BENEFICIO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
   
    this.consultarCatalogos();
    this.consultar();  // para ejecutar consultas automaticas.
  }

  ngAfterViewInit() {
  }
  validaFiltrosConsulta(): boolean {
    return true;
  }
  crearNuevo() {
    super.crearNuevo();
    this.registro.tipoccatalogo=1144;
    this.registro.mesccatalogo=4;
    this.registro.cusuarioing= this.dtoServicios.mradicacion.cusuario;
    this.registro.fingreso= this.fechaactual;
    this.registro.aportepatrono= true;
    this.registro.ingreso= false;
    this.registro.asignacion= false;
    this.registro.porcentual=false;
    this.registro.ingresoccatalogo=1145;
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.cbeneficio', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'nmes', 'i.ccatalogo=t.mesccatalogo and i.cdetalle=t.mescdetalle');
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'ntipo', 'i.ccatalogo=t.tipoccatalogo and i.cdetalle=t.tipocdetalle');
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'ningreso', 'i.ccatalogo=t.ingresoccatalogo and i.cdetalle=t.ingresocdetalle');
   
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
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

    const mfiltrosMes: any = {'ccatalogo': 4};
    const consultaMes = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosMes, {});
    consultaMes.cantidad = 50;
    this.addConsultaCatalogos('MESES', consultaMes, this.lmeses, super.llenaListaCatalogo, 'cdetalle');
    
    const mfiltrosTipo: any = {'ccatalogo': 1144};
    const consultaTipo = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosTipo, {});
    consultaTipo.cantidad = 50;
    this.addConsultaCatalogos('TIPOBENEFICIO', consultaTipo, this.ltipo, super.llenaListaCatalogo, 'cdetalle');
    
    const mfiltrosEstado: any = {'ccatalogo': 1145,'clegal':1};
    const consultaEstado = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosEstado, {});
    consultaEstado.cantidad = 50;
    this.addConsultaCatalogos('TIPOINGRESO', consultaEstado, this.lingreso, super.llenaListaCatalogo, 'cdetalle');
    
    this.ejecutarConsultaCatalogos();
  }

}
