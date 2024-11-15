import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-datos-poliza',
  templateUrl: '_datosPoliza.html'
})
export class DatosPolizaComponent extends BaseComponent implements OnInit, AfterViewInit {

  public ltiposeguro: SelectItem[] = [{ label: '...', value: null }];
  public habilitagrabar = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TsgsPoliza', 'POLIZAINCREMENTO', true);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init();
  }

  ngAfterViewInit() {
    this.registro.renovacion = true;
  }

  crearNuevo() {
    // No existe para el padre
  }

  actualizar() {
    if (this.fechaToInteger(this.mcampos.finicio) >= this.fechaToInteger(this.mcampos.fvencimiento)) {
      super.mostrarMensajeError("FECHA DE VENCIMIENTO DEBE SER MAYOR A FECHA DE INICIO");
      this.habilitagrabar = false;
      return;
    }

    super.actualizar();
    this.habilitagrabar = true;
  }

  eliminar() {
    // No existe para el padre
  }

  cancelar() {
    // No existe para el padre
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {

  }

  public crearDtoConsulta(): Consulta {
    const consulta = new Consulta(this.entityBean, 'Y', 't.coperacioncartera', this.mfiltros, this.mfiltrosesp);

    this.addConsulta(consulta);
    return consulta;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    this.mcampos.finicio = this.integerToDate(this.registro.finicio);
    this.mcampos.fvencimiento = this.integerToDate(this.registro.fvencimiento);
    this.registro.numerofactura = undefined;
    this.registro.valorprimaretenida = this.mcampos.valorprimaretenida;
    this.registro.ctiposeguro = this.mcampos.ctiposeguro;
    this.registro.esnuevo = true;
    this.registro.actualizar = false;
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    // No existe para el padre
  }

  validaGrabar() {
    return super.validaGrabar('NO HA REALIZADADO LA VALIDACIÓN DEL FORMULARIO[DATOS GENERAL]');
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }
  // Fin MANTENIMIENTO *********************

  private actualizarMonto() {
    const valordevolucion = this.registro.valorprimaretenida - this.registro.valorfactura;
    this.registro.valorprima = this.registro.valorfactura;
    this.mcampos.valordevolucion = valordevolucion;
    return valordevolucion;
  }


}
