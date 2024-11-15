
import {Component, OnInit, AfterViewInit, ViewChild, Input} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';

@Component({
  selector: 'app-simulacion',
  templateUrl: 'simulacion.html'
})
export class SimulacionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  public valorprestamo = 0;
  public valornovedades = 0;
  public valorretenciones = 0;
  public valoraportes = 0;
  public valorinteres = 0;
  public valorbonificacion = 0;
  public valortotal = 0;
  public mostrarDialogoSimulacion = false;
  public editarSocio = false;
  selectedValues: string[] = [];

  devolucion = false;
  cesantia = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'Abstract', 'simulacion', true);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);

  }

  ngAfterViewInit() {
    this.formvalidado = true;
  }


  // Inicia CONSULTA *********************
  consultar() {
    if (this.estaVacio(this.registro.cdetalletipoexp)) {
      this.mostrarMensajeError('SELECCIONE EL TIPO DE LIQUIDACION A SIMULAR');
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {


  }


  public fijarFiltrosConsulta() {

  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.manejaRespuestaSimulacion(resp);
  }

  private manejaRespuestaSimulacion(resp: any) {
    this.mcampos.valorinteres = 0.00;
    this.mcampos.tiempomixto = "NO";
    this.mcampos.valoranticipo = 0.00;
    this.mcampos.tprestamos = 0.00;
    this.mcampos.tnovedades = 0.00;
    this.mcampos.tretenciones = 0.00;
    this.mcampos.daportes = 0.00;
    this.mcampos.porcentaje = 10.00;
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenarMensaje();
      const msimulacion = resp.SIMULACION[0];
      const mbonificacion = resp.BONIFICACION;
      this.cesantia = msimulacion.cesantia;
      this.devolucion = msimulacion.devolucion;
      this.mcampos.subtotal = msimulacion.totalingresos;
      this.mcampos.total = msimulacion.total;
      this.mcampos.tprestamos = msimulacion.tprestamos;
      this.mcampos.tnovedades = msimulacion.tnovedades;
      this.mcampos.tretenciones = msimulacion.tretenciones;
      this.mcampos.daportes = msimulacion.daportes;

      this.mcampos.valordescuentossim = this.mcampos.tprestamos + this.mcampos.tnovedades + this.mcampos.tretenciones + this.mcampos.daportes;

      if (mbonificacion[4]) {
        this.mcampos.tiempomixto = "SI";
      }
      this.mcampos.cuantiaBasica = mbonificacion[1];
      this.mcampos.vbonificacion = mbonificacion[3];
      this.mostrarDialogoSimulacion = true;
    }
    this.lconsulta = [];
  }

  private llenarMensaje() {
    this.mcampos.mensaje = "Nota: ";
    if (this.registro.cdetalletipoexp === "ANT" && !this.devolucion) {
      this.mcampos.mensaje = this.mcampos.mensaje + " - Valor correponde al " + this.mcampos.porcentaje + "% de la liquidación";
    }

    const a = this.selectedValues.indexOf("pagonovedades"); {}
    if (a < 0) {
      this.mcampos.mensaje = this.mcampos.mensaje + " - No incluye valor de Novedades";
    }

    const b = this.selectedValues.indexOf("pagoretenciones");
    if (b < 0) {
      this.mcampos.mensaje = this.mcampos.mensaje + " - No incluye valor de Retenciones";
    }

    const c = this.selectedValues.indexOf("pagoprestamos");
    if (c < 0) {
      this.mcampos.mensaje = this.mcampos.mensaje + " - No incluye valor de Prestamos ";
    }
  }


  // Fin CONSULTA *********************

  Simular() {
    this.consultar();
  }


  Ocultar() {
    this.mostrarDialogoSimulacion = false;
  }

}