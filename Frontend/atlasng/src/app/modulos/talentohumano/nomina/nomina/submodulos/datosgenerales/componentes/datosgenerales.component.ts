import { Component, OnInit, AfterViewInit, ViewChild ,Output,EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { ParametroanualComponent } from '../../../../../lov/parametroanual/componentes/lov.parametroanual.component';

import { MenuItem } from 'primeng/components/common/menuitem';
@Component({
  selector: 'app-datosgenerales',
  templateUrl: 'datosgenerales.html'
})
export class DatosgeneralesComponent extends BaseComponent implements OnInit, AfterViewInit {



  @ViewChild(ParametroanualComponent)
  private lovParametro: ParametroanualComponent;
  
  @Output() eventoReporte = new EventEmitter();

  public itemsReporte: MenuItem[] = [{ label: 'ROL PAGOS', icon: 'ui-icon-circle-arrow-e', command: () => { this.ROLPAGOS(); } },
  { label: 'PROVISIONES', icon: 'ui-icon-circle-arrow-w', command: () => { this.PROVISIONES(); } }];

  public lmeses: SelectItem[] = [{ label: '...', value: null }];

  public lestado: SelectItem[] = [{ label: '...', value: null }];
  public ltipo: SelectItem[] = [{ label: '...', value: null }];
  
  public nuevo: boolean = true;
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tnomnomina', 'NOMINA', true);
    this.componentehijo = this;
  }
  fechaactual = new Date();
  fmin = new Date();
  fmini = new Date();
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
  generarFecha(){

    this.registro.finicio= new Date(this.registro.anio,Number(this.registro.mescdetalle)-1,1);
    var d = new Date(this.registro.anio,Number(this.registro.mescdetalle),1)
    d.setDate(d.getDate()-1);
    this.registro.ffin = d;
  }
  ROLPAGOS() {
    this.mcampos.tipo = "EXCEL";
    this.mcampos.tiporeporte = "ROLP";
   this.eventoReporte.emit();
  }

  PROVISIONES() {

    this.mcampos.tipo = "EXCEL";
    this.mcampos.tiporeporte = "ROLPR";
    this.eventoReporte.emit();
  }
  crearNuevo() {
    super.crearNuevo();
    this.registro.mesccatalogo = 4;
    this.registro.estadoccatalogo = 1148;
    
    this.registro.tipoccatalogo=1153;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    this.registro.fingreso = this.fechaactual;
    this.registro.cerrada = false;
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.cnomina', this.mfiltros, this.mfiltrosesp);
    
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
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp.NOMINA){

    }
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
    return super.validaGrabar('NO HA REALIZADADO LA VALIDACIÓN DEL FORMULARIO [DATOS NÓMINA]');
  }
  validarDatos(): boolean {
    let mensaje = '';
    if (this.registro.anio) {
      
    }
    return true;
  }
}
