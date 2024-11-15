import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovCodificadosComponent } from '../../../lov/codificados/componentes/lov.codificados.component';

@Component({
  selector: 'app-revalorizacion',
  templateUrl: 'revalorizacion.html'
})
export class RevalorizacionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;
  @ViewChild(LovCodificadosComponent)
  private lovcodificados: LovCodificadosComponent;  

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tacfhistorialrevalorizacion', 'HISTORIAL', false,false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.mcampos.nproducto === undefined || this.mcampos.cbarras === undefined){
      super.mostrarMensajeError("DEBE SELECCIONAR UN ACTIVO FIJO");
      return ;
    }    
    super.crearNuevo();

    this.registro.valorunitario = this.mcampos.vunitario;
    this.registro.valorlibros = this.mcampos.valorlibros;
    this.registro.cbarras = this.mcampos.cbarras;
    this.registro.fingreso = this.fechaactual;
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    this.registro.cproducto = this.mcampos.cproducto;
    this.registro.ccuenta =  this.mcampos.ccuenta;
    this.registro.ccuentagasto = this.mcampos.ccuentagasto;
    this.registro.centrocostoscdetalle = this.mcampos.centrocostoscdetalle;
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
    this.mfiltros.cproducto = this.mcampos.cproducto;
    const consulta = new Consulta(this.entityBean, 'Y', 't.fingreso desc', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tconcomprobante','numerocomprobantecesantia','numerocomprobantecesantia','t.ccomprobante = i.ccomprobante');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {

    return true;
  }

  cerrarDialogo(){
    this.ins = false;
  }
  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  mostrarlovcodificados(): void {
    //this.lovcodificados.mfiltros.cusuarioasignado = 'CUSTODIOAF';
    this.lovcodificados.mfiltros.estado = 1;
    this.lovcodificados.showDialog();
  }

  /**Retorno de lov de productos codificados. */
  fijarlovcodificadosSelec(reg: any): void {
    
    this.registro.cproducto = reg.registro.cproducto;
    this.mcampos.cproducto = reg.registro.cproducto;
    this.mcampos.valorunitario = reg.registro.vunitario;
    this.mcampos.vunitario = reg.registro.vunitario;
    this.registro.mdatos.valorlibros = reg.registro.valorlibros;
    this.registro.mdatos.valorresidual = reg.registro.valorresidual;
    this.mcampos.valorresidual = reg.registro.valorresidual;
    this.mcampos.valorlibros = reg.registro.valorlibros;
    this.registro.mdatos.serial = reg.registro.serial;
    this.registro.mdatos.ccuenta = reg.registro.ccuenta;
    this.registro.ccuenta = reg.registro.ccuenta;
    this.registro.ccuentagasto = reg.registro.ccuentagasto;
    this.registro.mdatos.ccuentagasto = reg.registro.ccuentagasto; 
    this.mcampos.cbarras = reg.registro.cbarras;
    this.registro.mdatos.cbarras = reg.registro.cbarras;
    this.registro.cbarras = reg.registro.cbarras;
    this.registro.mdatos.centrocostoscdetalle = reg.registro.centrocostoscdetalle;
    this.mcampos.nproducto = reg.registro.mdatos.nombre;
    this.actualizar(); 
  }

  // Inicia MANTENIMIENTO *********************
  grabar(): void {


    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    this.rqMantenimiento.mdatos.generarcomprobante = true;
    this.rqMantenimiento.mdatos.actualizarsaldosenlinea = true;
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
