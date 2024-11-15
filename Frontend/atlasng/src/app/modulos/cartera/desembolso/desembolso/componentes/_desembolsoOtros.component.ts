import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta, Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { RadioButtonModule, SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-desembolso-otros',
  templateUrl: '_desembolsoOtros.html'
})
export class DesembolsoOtrosComponent extends BaseComponent implements OnInit, AfterViewInit {

  public lotros: SelectItem[] = [{ label: '...', value: null }];
  public montootros = 0;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarOperacionDesembolso', 'OTROS', false, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.estaVacio(this.mfiltros.coperacion)) {
      super.mostrarMensajeError('OPERACION ES REQUERIDA');
      return;
    }
    this.validaFiltrosConsulta();
    super.crearNuevo();
    this.registro.coperacion = this.mfiltros.coperacion;
    this.registro.tipo = 'C';
    this.registro.transferencia= true;
    this.registro.pagado= false;
    
  }

  actualizar() {
    super.actualizar();
    this.consultaFormaPago();
    this.sumar();
  }

  eliminar() {
    super.eliminar();
    this.sumar();
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    super.consultar();
  }

  public crearDtoConsulta(coperacion: any): Consulta {
    this.fijarFiltrosConsulta(coperacion);
    const consulta = new Consulta(this.entityBean, 'Y', 't.coperacion', this.mfiltros, this.mfiltrosesp);
    consulta.cantidad = 20;
    this.addConsulta(consulta);
    return consulta;
  }

  private fijarFiltrosConsulta(coperacion: any) {
    this.mfiltros.coperacion = coperacion;
    this.mfiltros.tipo = 'C';
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    this.consultaFormaPago();
    this.sumar();
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

  sumar() {
    this.montootros = 0;
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        if (reg.valor !== undefined && reg.valor !== null) {
          this.montootros = this.montootros + reg.valor;
        }
      }
    }
  }

  consultaFormaPago() {
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        const fpago = this.lotros.find(x => x.value === reg.crubro);
        if (fpago !== undefined && fpago !== null) {
          this.lregistros[i].mdatos.nsaldo = fpago.label;
        }
      }
    }
  }

}
