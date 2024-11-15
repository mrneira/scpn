import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { AccionesReporteComponent } from '../../../../../../../util/shared/componentes/accionesReporte.component';
import { SelectItem } from 'primeng/primeng';

import { LovFuncionariosComponent } from '../../../../../lov/funcionarios/componentes/lov.funcionarios.component';

@Component({
  selector: 'app-metadetalle',
  templateUrl: 'metadetalle.html'
})
export class MetaDetalleComponent extends BaseComponent implements OnInit, AfterViewInit {

  @Output() calcularTotalesEvent = new EventEmitter();

  @ViewChild(LovFuncionariosComponent)
  private lovFuncionarios: LovFuncionariosComponent;

  public ldetreza: SelectItem[] = [{ label: '...', value: null }];

  @Output() calcularTotalesQuejas = new EventEmitter();

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tthmetadetalle', 'QUEJASCI', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
  }

  ngAfterViewInit() {
  }
  validarRegistros(): string {
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        if (this.estaVacio(reg.producto)) {
          return 'NO SE HA DEFINIDO EL PRODUCTO EN EL REGISTRO ' + (Number(i) + 1) + ' DE LAS METAS POR UNIDAD';
        }
        if (this.estaVacio(reg.indicador)) {
          return 'NO SE HA DEFINIDO EL INDICADOR EN EL REGISTRO ' + (Number(i) + 1) + ' DE LAS METAS POR UNIDAD';
        }
        if (this.estaVacio(reg.mproyectada) ) {
          return 'NO SE HA DEFINIDO LA META DEL PERÍODO EN EL REGISTRO ' + (Number(i) + 1) + ' DE LAS METAS POR UNIDAD';
        }
      
      }
    }
    return "";
  }
  crearNuevo() {

    if (this.estaVacio(this.mcampos.cmeta)) {
      super.mostrarMensajeError("NO SE HA DEFINIDO UNA META PARA EVALUALR");
      return;
    }
    super.crearNuevo();
    this.registro.cmeta = this.mcampos.cmeta;

  }

  agregarlinea() {

    if (this.estaVacio(this.mcampos.cmeta)) {
      super.mostrarMensajeError("NO SE HA DEFINIDO UNA META PARA EVALUAR");
      return;
    }
    super.crearnuevoRegistro();
this.registro.cmeta=this.mcampos.cmeta;
    this.actualizar();
    for (var _i = 0; _i < this.lregistros.length; _i++) {
      this.actualizarTotal(_i);
    }

  }
  actualizar() {
    super.actualizar();

  }

  eliminar() {
    super.eliminar();
    for (var _i = 0; _i < this.lregistros.length; _i++) {
      this.actualizarTotal(_i);
    }

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
  } klm

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cmetadetalle', this.mfiltros, this.mfiltrosesp);
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    //  this.mfiltros.cfuncionario= this.mcampos.cfuncionario;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }
  aplicaAdelanto() {
    this.calcularTotalesEvent.emit();
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

  mostrarLovFuncionario(): void {
    this.lovFuncionarios.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovFuncionarioSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.sancionadocfuncionario = reg.registro.cfuncionario;
      this.mcampos.cfuncionario = reg.registro.cfuncionario;
      this.mcampos.nombre = reg.registro.primernombre + " " + reg.registro.primerapellido;
      this.registro.nombre = this.mcampos.nombre;
    }
  }
  actualizarTotal(index: number): void {

    if (this.estaVacio(this.lregistros[index].mcumplida)) {
      this.lregistros[index].cumplimiento=0;
      return;
    }
    let porcentaje = 0;
    if (Number(this.lregistros[index].mproyectada) < (Number(this.lregistros[index].mcumplida))) {
      porcentaje = 100;
    }
    else {
      porcentaje = ((Number(this.lregistros[index].mcumplida)) * 100) / (Number(this.lregistros[index].mproyectada));

    }
    if (this.estaVacio(porcentaje)) {
      porcentaje = 0;
    }
    porcentaje = this.redondear(porcentaje, 2);

    this.lregistros[index].cumplimiento = porcentaje;

    let totalregistros = this.lregistros.length;
    this.lregistros[index].cumplimiento = porcentaje;
    this.lregistros[index].mdatos.total = porcentaje / totalregistros;
    this.lregistros[index].mdatos.valorFactor = porcentaje;

    this.calcularTotalesEvent.emit();
  }

}
