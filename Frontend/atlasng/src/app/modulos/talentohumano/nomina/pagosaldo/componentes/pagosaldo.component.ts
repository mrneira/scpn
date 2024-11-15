import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import {LovFuncionariosComponent} from '../../../lov/funcionarios/componentes/lov.funcionarios.component';

import { ParametroanualComponent } from '../../../lov/parametroanual/componentes/lov.parametroanual.component';
@Component({
  selector: 'app-pagosaldo',
  templateUrl: 'pagosaldo.html'
})
export class PagoSaldoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  
  @ViewChild(ParametroanualComponent)
  private lovParametro: ParametroanualComponent;

  @ViewChild(LovFuncionariosComponent)
  private lovFuncionarios: LovFuncionariosComponent;
 
  public ltipo: SelectItem[] = [{label: '...', value: null}];

  public lmeses: SelectItem[] = [{label: '...', value: null}];
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tnompagosaldo', 'PAGOSALDOS', false, false);
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
 
    super.crearNuevo();
  
    this.registro.saldoccatalogo=1145;
    this.registro.pagado=false;
    this.registro.fingreso = this.fechaactual;
    this.registro.cusuarioing= this.dtoServicios.mradicacion.cusuario;
   
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.saldocdetalle', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TgenCatalogoDetalle', 'nombre', 'ntipo', 'i.ccatalogo=t.saldoccatalogo and i.cdetalle=t.saldocdetalle');
    
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

   
    const mfiltrosTipo: any = {'ccatalogo': 1145};
    const consultaTipo = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosTipo, {});
    consultaTipo.cantidad = 50;
    this.addConsultaCatalogos('TIPOSALDO', consultaTipo, this.ltipo, super.llenaListaCatalogo, 'cdetalle');

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
