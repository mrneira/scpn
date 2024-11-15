import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';

@Component({
  selector: 'app-consolidado',
  templateUrl: '_consolidado.html'
})
export class ConsolidadoComponent extends BaseComponent implements OnInit, AfterViewInit {

  public montooriginal = 0;
  public existedetalle = false;
  public totalconsolidado = 0;
  public totalporcentaje = 0;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tcarsolicitudconsolidado', 'DETALLECONSOLIDADO', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.cusuarioing = this.dtoServicios.mradicacion.cusuario;
    this.registro.fingreso = super.integerToDate(this.dtoServicios.mradicacion.fcontable);
    this.mostrarDialogoGenerico = true;
  }

  actualizar() {
    super.actualizar();
    this.actualizarConsolidado();
  }

  cancelar() {
    super.cancelar();
  }

  eliminar() {
    super.eliminar();
    this.actualizarConsolidado();
  }

  // Inicia CONSULTA *********************
  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, "Y", "t.csolicitud", this.mfiltros, this.mfiltrosesp);
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
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

    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }
  // Fin MANTENIMIENTO *********************

  cerrarDialogo() {
    this.mostrarDialogoGenerico = false;
  }

  public actualizarConsolidado() {
    this.existedetalle = false;
    this.totalconsolidado = 0;
    this.totalporcentaje = 0;

    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg = this.lregistros[i];
        this.totalconsolidado = super.redondear(this.totalconsolidado + reg.monto,2);
        reg.mdatos.porcentaje = super.redondear(((reg.monto * 100) / this.montooriginal), 2)
      }
    }
    if (this.totalconsolidado > 0) {
      this.existedetalle = true;
      this.totalporcentaje = super.redondear(((this.totalconsolidado * 100) / this.montooriginal), 2);
    }
    return this.totalconsolidado;
  }
}
