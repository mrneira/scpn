import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { JasperComponent } from '../../../../../../util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-aportes',
  templateUrl: 'aportes.html'
})
export class AportesComponent extends BaseComponent implements OnInit, AfterViewInit {
  devolucion: boolean;


  public activarnuevo = true;

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild('tblaaportes')
  public jasper: JasperComponent;

  @Output()
  childChanged = new EventEmitter<string>();


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tpreaporte', 'APORTES', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    this.formFiltrosBase = this.formFiltros;
  }

  ngAfterViewInit() {
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }


  public postCommit(resp: any) {

  }


  /**Manejo respuesta de ejecucion. */
  private manejaRespuestaDatosAportes(resp: any) {
    this.mcampos.aporteacumulado = 0.00;
    const msgs = [];
    if (resp.cod === 'OK') {

      for (const i in this.lregistros) {
        const reg = this.lregistros[i];
        this.mcampos.aporteacumulado = this.mcampos.aporteacumulado + reg.acumulado;
      }
    }
    this.lconsulta = [];
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  public postQuery(resp: any) {
    // super.postQueryEntityBean(resp);
    //this.manejaRespuestaDatosAportes(resp);
    // this.childChanged.emit(resp);
    //  this.calcularBonificacion();

  }



  public limpiar() {
    this.lregistros = [];
  }
  // Fin CONSULTA ********************* 

  consultar() {
    if (!this.validaFiltrosConsulta()) {
      return;
    }
    this.crearDtoConsulta();
    // super.consultar();
  }

  public crearDtoConsulta() {
    this.rqConsulta.cmodulo = 28;
    this.rqConsulta.ctransaccion = 36;
    this.rqConsulta.CODIGOCONSULTA = 'APORTESPATRONALES';
    this.rqConsulta.cpersona = this.mfiltros.cpersona;
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false);
          if (resp.cod === 'OK') {
            super.postQueryEntityBean(resp);
            this.manejaRespuestaDatosAportes(resp);
          }
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  // BONIFICACION
  calcularBonificacion(): void {
    // this.valoresExpediente.regDatosExp.valorbonificacion = 0;
    if (this.devolucion) {
      this.bonificacionFallecimientoDev();
    }

    else {
      this.bonificacion();
    }
  }
  public bonificacion() {
    if (this.estaVacio(this.mcampos.cdetallejerarquia)) {
      return;
    }
    const rqConsulta: any = new Object();
    rqConsulta.CODIGOCONSULTA = 'BONIFICACION';
    rqConsulta.cpersona = this.mcampos.cpersona;
    rqConsulta.fechaalta = this.mcampos.fechaAlta;
    rqConsulta.fechabaja = this.mcampos.fechaBaja;
    rqConsulta.cdetallejerarquia = this.mcampos.cdetallejerarquia;
    rqConsulta.coeficiente = this.mcampos.coeficiente;
    this.ejecutar(rqConsulta);
  }

  public bonificacionFallecimientoDev() {
    if (!this.mcampos.bonificacionFallecimientoAC) {
      return;
    }
    if (this.estaVacio(this.mcampos.cdetallejerarquia)) {
      return;
    }
    const rqConsulta: any = new Object();
    rqConsulta.CODIGOCONSULTA = 'BONIFICACIONDEVOLUCION';
    rqConsulta.cpersona = this.mcampos.cpersona;
    rqConsulta.numaportaciones = this.mcampos.numaportaciones;
    rqConsulta.aporteacumulado = this.mcampos.aporteacumulado
    rqConsulta.cdetallejerarquia = this.mcampos.cdetallejerarquia;
    this.ejecutar(rqConsulta);
  }

  ejecutar(rqConsulta): void {
    this.dtoServicios.ejecutarConsultaRest(rqConsulta)
      .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
          if (resp.cod !== 'OK') {
            return;
          }
          this.manejarRespuesta(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  manejarRespuesta(resp: any) {
    let tbonificacion = 0;
    if (this.estaVacio(resp['BONIFICACION'])) {
      let respuesta: any;
      respuesta = resp['BONIFICACIONDEVOLUCION'];
      this.mcampos.mensajeSeguro = " PORCENTAJE DE BONIFICACION POR FALLECIMIENTO EN ACTOS DE SERVICIO UTILIZADO: " + respuesta[2] + "%";
      tbonificacion = respuesta[0];
      this.mcampos.vbonificacion = respuesta[0];
      this.mcampos.cuantiaBasica = respuesta[1];
      //this.valoresExpediente.regDatos.porcentajeBonificacion = respuesta[2];
    }
    else {
      let respuesta: any;
      respuesta = resp['BONIFICACION'];
      tbonificacion = respuesta[0]
      this.mcampos.mensajeSeguro = " COEFICIENTE DE BONIFICACION: " + respuesta[2];
      this.mcampos.vbonificacion = respuesta[3];
      this.mcampos.cuantiaBasica = respuesta[1];
      if (respuesta[4]) {
        this.mcampos.tiempomixto = "SI";
      }

      else {
        this.mcampos.tiempomixto = "NO";
      }

    }

    if (tbonificacion < 0) {
      tbonificacion = 0;
      this.mcampos.mensajeSeguro = "ERROR AL CALCULAR BONIFICACIÓN, TIEMPO DE SERVICIO INCORRECTO";
      return;
    }
    this.mcampos.valorbonificacion = tbonificacion;
    // this.valoresExpediente.calcularTotalLiquidacion(false, "");
    //    if (super.estaVacio(this.valoresExpediente.resp.DATOSSOCIO.csubestado)) {
    //      this.mostrarMensajeInfo('SOCIO NO REGISTRA BAJA, SOLO SIMULACION HABILITADO');
    //    }
  }

  descargarReporte(reg: any): void {
    this.jasper.formatoexportar = reg;
    this.jasper.parametros['@i_identificacion'] = this.mcampos.identificacion;
    this.jasper.parametros['@w_usuario'] = this.dtoServicios.mradicacion.np;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Prestaciones/AportesPatronales';
    this.jasper.generaReporteCore();
  }

}
