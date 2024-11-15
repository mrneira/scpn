import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';

@Component({
  selector: 'app-poliza',
  templateUrl: '_poliza.html'
})

export class PolizaComponent extends BaseComponent implements OnInit, AfterViewInit {

  public habilitagrabar = false;
  public selectedRegistros: any;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TsgsPoliza', 'POLIZAS', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    // No existe para el padre
  }

  actualizar() {
    // No existe para el padre
  }

  eliminar() {
    // No existe para el padre
  }

  cancelar() {
    // No existe para el padre
  }

  selectRegistro(registro: any) {
    // No existe para el padre
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.fingreso', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TsgsTipoSeguroDetalle', 'nombre', 'ntiposeguro', 'i.ctiposeguro = t.ctiposeguro and i.verreg = 0');
    consulta.addSubqueryPorSentencia('SELECT p.identificacion FROM tcaroperacion o, tperpersonadetalle p WHERE o.cpersona = p.cpersona AND p.verreg = 0 AND o.coperacion = t.coperacioncartera', 'identificacion');
    consulta.addSubqueryPorSentencia('SELECT p.nombre FROM tcaroperacion o, tperpersonadetalle p WHERE o.cpersona = p.cpersona AND p.verreg = 0 AND o.coperacion = t.coperacioncartera', 'npersona');
    consulta.cantidad = 500;
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltrosesp.cpago = 'is null';
    this.mfiltrosesp.pagodirecto = 'is null';
    this.mfiltros.cdetalleestado = 'ING';
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    if (resp.cod === "OK") {
      this.selectedRegistros = [];
    }
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    // No existe para el padre
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any, dtoext = null) {
    super.postCommitEntityBean(resp, dtoext);
    if(resp.FINALIZADO){
      this.recargar();
    }
  }
  // Fin MANTENIMIENTO *********************

  validaRegistros() {
    for (const i in this.selectedRegistros) {
      if (this.selectedRegistros.hasOwnProperty(i)) {
        const reg: any = this.selectedRegistros[i];
        reg.actualizar = true;
        this.selectRegistro(reg);
        this.actualizar();
      }
    }
    if (this.selectedRegistros != null && this.selectedRegistros.length > 0) {
      return true;
    }
    return false;
  }

  getTotal(): Number {
    let total = 0;
    this.habilitagrabar = false;

    for (const i in this.selectedRegistros) {
      if (this.selectedRegistros.hasOwnProperty(i)) {
        const reg: any = this.selectedRegistros[i];
        total = super.redondear(total + reg.valorprima, 2);
      }
    }

    if (total > 0) {
      this.mcampos.total = total;
      this.habilitagrabar = true;
    }

    return total;
  }

}
