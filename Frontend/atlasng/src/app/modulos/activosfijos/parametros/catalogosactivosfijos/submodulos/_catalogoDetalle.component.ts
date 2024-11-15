import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { CatalogoPadreComponent } from './_catalogoPadre.component';


@Component({
  selector: 'app-catalogo-detalle',
  templateUrl: '_catalogoDetalle.html'
})
export class CatalogoDetalleComponent extends BaseComponent implements OnInit, AfterViewInit {

  @Input() catalogoPadre: CatalogoPadreComponent;

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
    if (this.catalogoPadre.validarCatalogoPadre()) {
      super.crearNuevo();
      this.registro.optlock = 0;

      if(this.catalogoPadre.registro.ccatalogo != undefined)
        this.registro.ccatalogo = parseInt(this.catalogoPadre.registro.ccatalogo);
      else
        {
          this.mostrarMensajeError('SELECCIONE UN CATÁLOGO PADRE');
          return;
        }
    }
  }

  actualizar() {
    this.registro.ccatalogo = this.mfiltros.ccatalogo;
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
    const consulta = new Consulta(this.entityBean, 'Y', 't.nombre', this.mfiltros, this.mfiltrosesp);
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

}
