import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-catalogo-detalle',
  templateUrl: '_catalogoDetalle.html'
})
export class CatalogoDetalleComponent extends BaseComponent implements OnInit, AfterViewInit {

  public mvisibleCodigoLegal: boolean = true;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tgencatalogodetalle', 'CATALOGODETALLE', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    if (this.mfiltros.ccatalogo === undefined || this.mfiltros.ccatalogo === null) {
      this.mostrarMensajeError('SELECCIONE UN CATÁLOGO PADRE');
      return;
    }
    this.mvisibleCodigoLegal = this.visibleCodigoLegal();
    super.crearNuevo();

    this.registro.optlock = 0;
    this.registro.ccatalogo = this.mfiltros.ccatalogo;
    this.registro.activo= true;
  }

  actualizar() {
    if (!this.validaDatosRegistro(this.registro)) {
      this.mostrarMensajeWarn("EXISTEN DATOS DUPLICADOS");
      return;
    }
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    this.mvisibleCodigoLegal = this.visibleCodigoLegal();
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.mvisibleCodigoLegal = this.visibleCodigoLegal();
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.cdetalle', this.mfiltros, this.mfiltrosesp);
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    if (this.mfiltros.ccatalogo === undefined) {
      this.mostrarMensajeError('CATÁLOGO REQUERIDO');
      return false;
    }
    return true;
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

  public consultarCatalogoDetalle(pLista: any, ccatalogo: number, agregaRegistroVacio: boolean): any {
    while (pLista.length > 0) {
      pLista.pop();
    }
    if (this.estaVacio(ccatalogo)) {
      return;
    }

    this.mfiltros.ccatalogo = ccatalogo;
    this.crearDtoConsulta();
    const rq = this.getRequestConsulta('C');
    return this.dtoServicios.ejecutarConsultaRest(rq).subscribe(
      resp => {
        if (resp.cod === 'OK') {
          if (agregaRegistroVacio) {
            pLista.push({ label: '...', value: '-1' });
          }
          const lista = resp[this.alias];
          for (let i in lista) {
            let reg = lista[i];
            pLista.push({ label: reg.nombre, value: reg.cdetalle });
          }
        } else {
          this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
        }
      }, error => {
        this.dtoServicios.manejoError(error);
      }
    );
  }

  validaDatosRegistro(reg: any): boolean {
    super.encerarMensajes();
    const existe = this.lregistros.find(x => x.cdetalle === reg.cdetalle && Number(x.idreg) !== Number(reg.idreg));

    if (!this.estaVacio(existe)) {
      return false;
    }
    return true;
  }

  visibleCodigoLegal(): boolean {
    let lblnRreturn: boolean = true;
    if (sessionStorage.getItem('m') == '12') 
    {
      lblnRreturn = false;
      if (this.mfiltros.ccatalogo == 1213 || this.mfiltros.ccatalogo == 1219) {
        lblnRreturn = true;
      }
    }
    return lblnRreturn;
  }
}
