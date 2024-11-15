import {Component, OnInit, AfterViewInit, ViewChild, EventEmitter, Output, Input} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../../../util/shared/componentes/base.component';

import {SelectItem} from 'primeng/primeng';
import {LovModuloTareasComponent} from '../../../../../lov/modulotareas/componentes/lov.moduloTareas.component';

@Component({
  selector: 'app-tareas-modulo-lote',
  templateUrl: '_tareasModuloLote.html'
})
export class TareasModuloLoteComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovModuloTareasComponent)
  lovModTareaComponent: LovModuloTareasComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {// ya estan definidos los alias
    super(router, dtoServicios, 'TloteModuloTareas', 'MODULOTAREAS', false, true); // true cuendo es pk compuesto
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  crearNuevo() {// primero crea un registro
    super.crearNuevo();
    this.registro.activo = 1;
    this.registro.clote = this.mfiltros.clote;
    this.registro.optlock = 0;
  }

  actualizar() { // Cuando doy confirmar se ejecuta
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
    const consulta = new Consulta(this.entityBean, 'Y', 'ordenmod, t.orden', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TloteModulo', 'orden', 'ordenmod', 'i.cmodulo = t.cmodulo and i.clote = t.clote');
    consulta.addSubquery('TloteTareas', 'nombre', 'ntarea', 'i.cmodulo = t.cmodulo and i.ctarea = t.ctarea');
    consulta.addSubquery('TgenModulo', 'nombre', 'nmodulo', 'i.cmodulo = t.cmodulo');
    consulta.cantidad = 50;
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {

  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    // this.fijarActivo();
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
  }

  public crearDtoMantenimiento() {
  }

  public postCommit(resp: any, dtoext = null) {
    super.postCommitEntityBean(resp, dtoext);
  }
  
  public preCambioPrevio(codigo){
    if(codigo==='L'){
      this.registro.tprevalerrtareapreviamodulo = false;
    } else if(codigo==='M'){
      this.registro.tprevalerrtareaprevialote = false;
    }
  }
  
  public finCambioPrevio(codigo){
    if(codigo==='L'){
      this.registro.tfinvalerrtareapreviamodulo = false;
      this.registro.tfinvalerrtareaprevia = false;
    } else if(codigo==='M'){
      this.registro.tfinvalerrtareaprevialote = false;
      this.registro.tfinvalerrtareaprevia = false;
    } else if(codigo==='T'){
      this.registro.tfinvalerrtareaprevialote = false;
      this.registro.tfinvalerrtareapreviamodulo = false;
    }
  }
  
  public finCambioRegistros(codigo){
    if(codigo==='L'){
      this.registro.tfinvalerrtarearegistrosmodulo = false;
      this.registro.tfinvalerrtarearegistros = false;
    } else if(codigo==='M'){
      this.registro.tfinvalerrtarearegistroslote = false;
      this.registro.tfinvalerrtarearegistros = false;
    } else if(codigo==='T'){
      this.registro.tfinvalerrtarearegistroslote = false;
      this.registro.tfinvalerrtarearegistrosmodulo = false;
    }
  }
  
  public finCambioFin(codigo){
    if(codigo==='L'){
      this.registro.tfinvalerrtareafinmodulo = false;
    } else if(codigo==='M'){
      this.registro.tfinvalerrtareafinlote = false;
    }
  }

  /**Muestra lov de transacciones */
  mostrarLovTareas(): void {
    this.lovModTareaComponent.showDialog();
  }
  /**Retorno de lov de transacciones. */
  fijarLovTareasSelect(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.mdatos.nmodulo = reg.registro.mdatos.nmodulo;
      this.registro.mdatos.ntarea = reg.registro.nombre;
      this.registro.cmodulo = reg.registro.cmodulo;
      this.registro.ctarea = reg.registro.ctarea;
    }
  }
}

