import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { ParametroanualComponent } from '../../../../../lov/parametroanual/componentes/lov.parametroanual.component';
import { LovDesignacionesComponent } from '../../../../../lov/designaciones/componentes/lov.designaciones.component';


@Component({
  selector: 'app-datosgenerales',
  templateUrl: 'datosgenerales.html'
})
export class DatosgeneralesComponent extends BaseComponent implements OnInit, AfterViewInit {



  @ViewChild(ParametroanualComponent)
  private lovParametro: ParametroanualComponent;
  @ViewChild(LovDesignacionesComponent)
  private lovFuncionarios: LovDesignacionesComponent;

  public lmeses: SelectItem[] = [{ label: '...', value: null }];

  public lestado: SelectItem[] = [{ label: '...', value: null }];
  public nuevo: boolean = true;
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tnomjubilacion', 'JUBILACION', true);
    this.componentehijo = this;
  }
  fechaactual = new Date();
  fmin = new Date();
  factiva = false;

  ngOnInit() {
    super.init();

  }
  validarFecha() {
    if (!this.estaVacio(this.registro.finicio)) {
      this.fmin = new Date(this.registro.finicio);
      this.fmin.setDate(this.fmin.getDate() + 1);
      this.factiva = true;
    }
    this.registro.ffin = null;
  }
  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    this.registro.fingreso = this.fechaactual;
    this.registro.cerrada = false;
    this.registro.contabilizada = false;
    this.registro.total=0;
    this.registro.totalingresos=0;
    this.registro.totalegresos=0;
    
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
  mostrarLovFuncionario(): void {
    //this.lovFuncionarios.mfiltros.estadocontratocdetalle='ACT';
    this.lovFuncionarios.showDialog();
    //this.lovPersonas.mfiltros.csocio = 1;
  }

  /**Retorno de lov de personas. */
  fijarLovFuncionarioSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cfuncionario = reg.registro.cfuncionario;
      this.registro.cfuncionario = reg.registro.cfuncionario;
      this.registro.ccontrato= reg.registro.ccontrato;
      this.registro.ccargo= reg.registro.ccargo;
      //this.registro.fvinculacion= reg.registro.fvinculacion;
      
      this.mcampos.nfuncionario = reg.registro.mdatos.nfuncionario;
      this.registro.mdatos.nfuncionario = reg.registro.mdatos.nfuncionario;
    }
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.cjubilacion', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tthfuncionariodetalle', 'primernombre + \' \' + primerapellido', 'nfuncionario', 'i.cfuncionario= t.cfuncionario and i.verreg = 0');
  
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

  mostrarLovParametro(): void {
    this.lovParametro.mfiltros.verreg = 0;
    this.lovParametro.showDialog();
  }

  /**Retorno de lov de paises. */
  fijarLovParametroSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.anio = reg.registro.anio;
    }
  }


  validaGrabar() {
    return this.validarDatos();
  }
  validarDatos(): boolean {
    let mensaje = '';
    if (this.registro.anio) {
      

    }
    return true;
  }
}
