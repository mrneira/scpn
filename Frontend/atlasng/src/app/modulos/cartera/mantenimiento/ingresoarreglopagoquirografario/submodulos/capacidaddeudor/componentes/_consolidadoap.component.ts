import { Component, OnInit, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
///import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Consulta } from '../../../../../../../util/dto/dto.component';
@Component({
  selector: 'app-consolidadoap',
  templateUrl: '_consolidadoap.html'
})
export class ConsolidadoApComponent extends BaseComponent implements OnInit, AfterViewInit {

  //CCA 20221025
  public montooperacionap = 0;
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
        this.totalconsolidado = this.totalconsolidado + reg.monto;
        reg.mdatos.porcentaje = super.redondear(((reg.monto * 100) / this.montooperacionap), 2)
      }
    }
    if (this.totalconsolidado > 0) {
      this.existedetalle = true;
      this.totalporcentaje = super.redondear(((this.totalconsolidado * 100) / this.montooperacionap), 2);
    }
    return this.totalconsolidado;
  }
}
