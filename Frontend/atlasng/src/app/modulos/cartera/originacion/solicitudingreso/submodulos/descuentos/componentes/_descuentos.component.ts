import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';

@Component({
  selector: 'app-descuentos',
  templateUrl: '_descuentos.html'
})
export class DescuentosComponent extends BaseComponent implements OnInit, AfterViewInit {

  public checkableConyuge = false;
  public lsueldo: any = [];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarSolicitudDescuentos', 'TCARSOLICITUDDESCUENTOS', true, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
  }

  actualizar() {
    super.encerarMensajes();
    super.actualizar();
  }

  eliminar() {
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.encerarMensajes();
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'N', 't.csolicitud', this.mfiltros, this.mfiltrosesp);
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {

  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public async postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    await new Promise(resolve => setTimeout(resolve, 3000));
    if (resp.TCARSOLICITUDDESCUENTOS !== null) {
      this.marcarCuenta(resp.TCARSOLICITUDDESCUENTOS.autorizacion);
      this.checkableConyuge = resp.TCARSOLICITUDDESCUENTOS.descuentoconyuge;
    }
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  validaGrabar() {
    if (this.checkableConyuge) {
      if (this.registro.porcentajeconyuge === null) {
        super.mostrarMensajeError('NO HA REGISTRADO PORCENTAJE DE DESCUENTO DE CÓNYUGE');
        return false;
      }
      if (this.registro.porcentajeconyuge <= 0 || this.registro.porcentajeconyuge > 100) {
        super.mostrarMensajeError('PORCENTAJE DE DESCUENTO DE CÓNYUGE DEBE ENCONTRARSE ENTRE 1 Y 100');
        return false;
      }
    }
    return super.validaGrabar('NO HA REALIZADADO LA VALIDACIÓN DEL FORMULARIO [CONDICIONES DESCUENTOS]');
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  marcarCuenta(value: boolean): void {
    if (value) {
      if (this.lsueldo !== undefined && this.lsueldo.length > 0) {
        this.registro.mdatos.ncuenta = this.lsueldo[0].mdatos.ninstitucion + '-' + this.lsueldo[0].mdatos.ntipocuenta + '-' + this.lsueldo[0].numero;
      } else {
        super.mostrarMensajeError('SOCIO NO REGISTRA INFORMACIÓN DE CUENTA');
        if (this.registro.autorizacion !== undefined) {
          this.registro.autorizacion = false;
        }
        return;
      }
    } else {
      super.encerarMensajes();
      this.registro.mdatos.ncuenta = null;
    }
  }

  marcarConyuge(value: boolean): void {
    this.checkableConyuge = value;
    this.registro.porcentajeconyuge = null;
  }

}