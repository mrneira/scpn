import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovFuncionariosComponent } from '../../../lov/funcionarios/componentes/lov.funcionarios.component';

import { ParametroanualComponent } from '../../../lov/parametroanual/componentes/lov.parametroanual.component';
@Component({
  selector: 'app-horasextras',
  templateUrl: 'horasextras.html'
})
export class HorasextrasComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;


  @ViewChild(ParametroanualComponent)
  private lovParametro: ParametroanualComponent;

  @ViewChild(LovFuncionariosComponent)
  private lovFuncionarios: LovFuncionariosComponent;

  public ltipo: SelectItem[] = [{ label: '...', value: null }];

  public lmeses: SelectItem[] = [{ label: '...', value: null }];
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tnomhoraextranomina', 'THORAEXTRA', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    // para ejecutar consultas automaticas.
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.estaVacio(this.mfiltros.anio)) {
      super.mostrarMensajeError("NO HA SELECIONADO UN AÑO VALIDO");
      return;
    }
    if (this.estaVacio(this.mfiltros.mescdetalle)) {
      super.mostrarMensajeError("NO HA SELECIONADO UN MES");
      return;
    }
    super.crearNuevo();
    this.registro.mesccatalogo = 4;
    this.registro.tipoccatalogo = 1140;
    this.registro.aprobada = false;
    this.registro.contabilizada = false;
    this.registro.vhora = 0;
    this.registro.vtotal = 0;
    this.registro.estado = true;
    this.registro.fingreso = this.fechaactual;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    this.registro.anio = this.mfiltros.anio;
    this.registro.mescdetalle = this.mfiltros.mescdetalle;
    this.registro.fhora = this.fechaactual;
    this.registro.estado= true;
  }
  mostrarLovParametro(): void {
    this.lovParametro.mfiltros.verreg = 0;
    this.lovParametro.showDialog();
  }

  /**Retorno de lov de paises. */
  fijarLovParametroSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.anio = reg.registro.anio;
    }
  }
  actualizar() {
    super.actualizar();
  }
  total() {
    if (!this.estaVacio(this.registro.thoras)) {
      if(this.registro.thoras>0){
      let total = this.redondear(this.registro.thoras, 0);
      let vajuste =  this.registro.thoras-total;
      vajuste = (vajuste / 60) * 100;
      vajuste= this.redondear(vajuste,2);
      this.registro.horas=vajuste+total;
    }
    }
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.choraextra', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'nmes', 'i.ccatalogo=t.mesccatalogo and i.cdetalle=t.mescdetalle');
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'ntipo', 'i.ccatalogo=t.tipoccatalogo and i.cdetalle=t.tipocdetalle');
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

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosMes: any = { 'ccatalogo': 4 };
    const consultaMes = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosMes, {});
    consultaMes.cantidad = 50;
    this.addConsultaCatalogos('MESES', consultaMes, this.lmeses, super.llenaListaCatalogo, 'cdetalle');

    const mfiltrosTipo: any = { 'ccatalogo': 1140 };
    const consultaTipo = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosTipo, {});
    consultaTipo.cantidad = 50;
    this.addConsultaCatalogos('TNTIPOHORA', consultaTipo, this.ltipo, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }
  mostrarLovFuncionarios(): void {
    this.lovFuncionarios.showDialog();
  }

  /**Retorno de lov de funcionarios. */
  fijarLovFuncionariosSelect(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.nfuncionario = reg.registro.mdatos.nombre;
      this.registro.cfuncionario = reg.registro.cfuncionario;


    }
  }

}
