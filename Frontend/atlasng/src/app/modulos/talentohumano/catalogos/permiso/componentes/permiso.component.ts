import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import {LovFuncionariosComponent} from '../../../lov/funcionarios/componentes/lov.funcionarios.component';

@Component({
  selector: 'app-permiso',
  templateUrl: 'permiso.html'
})
export class PermisoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovFuncionariosComponent)
  private lovFuncionarios: LovFuncionariosComponent;

  public ltipo: SelectItem[] = [{label: '...', value: null}];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthpermiso', 'PERMISO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
    this.mcampos.fechaactual = new Date();
    this.mcampos.fmin= new Date();
    this.mcampos.factiva= false;
  }
  validarFecha() {
    if (!this.estaVacio(this.registro.finicio)) {
      this.mcampos.fmin = new Date(this.registro.finicio);
      this.mcampos.fmin.setDate(this.mcampos.fmin.getDate()+1);
      this.mcampos.factiva= true;
    }
    this.registro.ffin=null;
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if(this.validaFiltrosRequeridos()){
    super.crearNuevo();
    this.registro.motivopermisoccatalogo=1102;
    this.registro.nfuncionario=this.mfiltros.nfuncionario;
    this.registro.cfuncionario=this.mfiltros.cfuncionario;
  }
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.cpermiso', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'mpermiso', 'i.ccatalogo = t.motivopermisoccatalogo and i.cdetalle = t.motivopermisocdetalle');
    consulta.addSubquery('tthfuncionariodetalle', 'primernombre + \' \' + primerapellido', 'nfuncionario', 'i.cfuncionario= t.cfuncionario and i.verreg = 0');
   
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
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
    const mfiltrosMotivoPermiso: any = { 'ccatalogo': 1102 };
    const mfiltrosespMotivoPermiso: any = { 'cdetalle': null };
    const consultaMotivoPermiso = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosMotivoPermiso, mfiltrosespMotivoPermiso);
    consultaMotivoPermiso.cantidad = 50;
    this.addConsultaPorAlias('MOTIVOPERMISO', consultaMotivoPermiso);
  }

  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
       this.llenaListaCatalogo(this.ltipo, resp.MOTIVOPERMISO, 'cdetalle');
      
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
  mostrarLovFuncionarios(): void {
    this.lovFuncionarios.showDialog();
  }

  /**Retorno de lov de funcionarios. */
  fijarLovFuncionariosSelect(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.nfuncionario = reg.registro.mdatos.nombre;
      this.mfiltros.cfuncionario = reg.registro.cfuncionario;
      this.consultar();
    }
  }
}
