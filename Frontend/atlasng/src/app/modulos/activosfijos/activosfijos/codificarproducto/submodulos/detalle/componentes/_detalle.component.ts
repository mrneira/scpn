import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { CatalogoDetalleComponent } from '../../../../../../generales/catalogos/componentes/_catalogoDetalle.component';
import { SelectItem } from 'primeng/primeng';
import { AccordionModule } from 'primeng/primeng';
@Component({
  selector: 'app-detalle',
  templateUrl: '_detalle.html'
})
export class DetalleComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public totalCantidad = 0;
  public totalValorUnitario = 0;
  public totalValorTotal = 0;
  private catalogoDetalle: CatalogoDetalleComponent;
  public lestadocdetalle: SelectItem[] = [{ label: '...', value: null }];

  public lestructura: SelectItem[] = [{ label: '...', value: null }];
  public lmarca: SelectItem[] = [{ label: '...', value: null }];

  public lubicacioncdetalle: SelectItem[] = [{ label: '...', value: null }];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tacfproductocodificado', 'AF_PRODUCTOCODIFICADO', false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
  }

  actualizar() {

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
    this.consultaDetalleProducto();
    //this.consultarCatalogos();    
  }

  public crearDtoConsulta() {
    this.consultaDetalleProducto();
  }

  public fijarFiltrosConsulta() {
  }

  validaFiltrosConsulta(): boolean {
    return true;
  }
  consultaDetalleProducto() {
    this.rqConsulta.CODIGOCONSULTA = 'AF_PRODUCTOCODIFICADO';
    this.rqConsulta.storeprocedure = "sp_AcfConCodificaProducto";
    if (this.estaVacio(this.mfiltros.cingreso)) {
      //  super.mostrarMensajeError("SELECCIONE UN INGRESO PARA LA CODIFICACIÓN");
      return;
    }
    this.rqConsulta.mdatos.cingreso = this.mfiltros.cingreso;
    this.rqConsulta.parametro_cingreso = this.mfiltros.cingreso === undefined ? "" : this.mfiltros.cingreso;
    this.msgs = [];

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          if (resp.cod != "OK") {
            super.mostrarMensajeError(resp.msgusu);
          } else {
            this.postQuery(resp);
          }
        },
        error => {
          this.dtoServicios.manejoError(error);
          
        });
  }

  private manejaRespuesta(resp: any) {
    this.lregistros = [];
    if (resp.cod === 'OK') {
      this.lregistros = resp.AF_PRODUCTOCODIFICADO;
    }
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.actualizar();
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


  crearNuevoRegistro() {
    super.crearnuevoRegistro();
  }


  consultarCatalogos(): void {
    this.msgs = [];
    this.lconsulta = [];

    // this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
    //   .subscribe(
    //   resp => {
    //     this.encerarMensajes();
    //     this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.

    //   },
    //   error => {
    //     this.dtoServicios.manejoError(error);
    //   });

    const mfiltrosEstado: any = { 'ccatalogo': 1301 };
    const consultaEstado = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosEstado, {});
    consultaEstado.cantidad = 10000;
    this.addConsultaCatalogos('ESTADOS', consultaEstado, this.lestadocdetalle, super.llenaListaCatalogo, 'cdetalle');


    const mfiltrosMarca: any = { 'ccatalogo': 1302 };
    const consultaMarca = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosMarca, {});
    consultaMarca.cantidad = 10000;
    this.addConsultaCatalogos('MARCA', consultaMarca, this.lmarca, super.llenaListaCatalogo, 'cdetalle');


    const mfiltrosUbicacion: any = { 'ccatalogo': 1309 };
    const consultaUbicacion = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosUbicacion, {});
    consultaUbicacion.cantidad = 10000;
    this.addConsultaCatalogos('UBICACION', consultaUbicacion, this.lubicacioncdetalle, super.llenaListaCatalogo, 'cdetalle');

    const mfiltrosEstructura: any = { 'ccatalogo': 1310 };
    const consultaEstructura = new Consulta('TgenCatalogoDetalle', 'Y', 't.cdetalle', mfiltrosEstructura, {});
    consultaEstructura.cantidad = 10000;
    this.addConsultaCatalogos('ESTRUCTURA', consultaEstructura, this.lestructura, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }

}
