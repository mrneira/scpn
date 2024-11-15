import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';

@Component({
  selector: 'app-genera-devolucion',
  templateUrl: 'generaDevolucion.html'
})
export class GeneraDevolucionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  selectedRegistros;
  // mostrarGrabar = true;
  public ldetalle: any = [];
  public mostrarDialogoDetalle = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarDevolucion', 'DEVOLUCIONESCARTERA', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.consultar();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.fijarFiltrosConsulta();
    this.rqConsulta.mdatos.CODIGOCONSULTA = 'DEVOLUCIONESCARTERA';
    this.rqConsulta.storeprocedure = "sp_CarConDevolucionesPago";
    super.consultar();
  }

  private fijarFiltrosConsulta() {
    this.rqConsulta.parametro_tipo = "T"; // Todos los registros
  }

  public postQuery(resp: any) {
    this.manejaRespuesta(resp);
  }

  manejaRespuesta(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.lregistros = resp.DEVOLUCIONESCARTERA;
    }
    this.lconsulta = [];
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.encerarMensajes();
    if (!this.validaRegistros()) {
      super.mostrarMensajeError("EXISTEN REGISTROS SELECCIONADOS SIN REFERENCIA BANCARIA");
      return;
    }

    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.mdatos.PAGODEVOLUCION = this.selectedRegistros;
    this.rqMantenimiento.mdatos.tipotransaccion = 'I';

    this.crearDtoMantenimiento();
    super.grabar();
  }

  public crearDtoMantenimiento() {
    super.addMantenimientoPorAlias(this.alias, this.getMantenimiento(1));
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
     if (!this.estaVacio(resp.ccomprobante)) {
       this.recargar();
     }
  }
  // Fin MANTENIMIENTO *********************

  mostrarDialogoDevolucion(registro: any) {
    this.mcampos.total = registro.monto;
    this.consultarDetalle(registro.cpersona);
    this.mostrarDialogoDetalle = true;
  }

  public consultarDetalle(cpersona: string) {
    this.ldetalle = [];
    const rqConsulta: any = new Object();
    rqConsulta.CODIGOCONSULTA = 'DEVOLUCIONESCARTERA';
    rqConsulta.storeprocedure = "sp_CarConDevoluciones";
    rqConsulta.parametro_tipo = "D"; // Detalle de devolucion
    rqConsulta.parametro_cpersona = cpersona;

    this.dtoServicios.ejecutarConsultaRest(rqConsulta)
      .subscribe(
        resp => {
          this.dtoServicios.msgs = [];
          this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
          if (resp.cod !== 'OK') {
            return;
          }
          this.ldetalle = resp.DEVOLUCIONESCARTERA;
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  cerrarDialogoPagos() {
    this.mostrarDialogoDetalle = false;
  }

  validaRegistros(): boolean {
    for (const i in this.selectedRegistros) {
      if (this.selectedRegistros.hasOwnProperty(i)) {
        const reg: any = this.selectedRegistros[i];
        if (this.estaVacio(reg.numero) || this.estaVacio(reg.ninstitucion) || this.estaVacio(reg.ntipocuenta)) {
          return false;
        }
      }
    }
    return true;
  }

}
