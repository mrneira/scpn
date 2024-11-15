import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-expedientes',
  template: ''
})
export class ExpedientesComponent extends BaseComponent implements OnInit, AfterViewInit {

  public linstfinanciera: SelectItem[] = [{ label: '...', value: null }];
  public ltipocuenta: SelectItem[] = [{ label: '...', value: null }];
  public lblnoexpediente = 'Nro. Expediente';

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tpreexpediente', 'DATOSEXPEDIENTE', true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.ccatalogotipoexp = 2802;
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.registro.optlock = 0;
    this.registro.ccatalogoetapa = 2806;
    this.registro.numeroarchivo = '01';
    this.registro.ccatalogoestado = 2803;
    this.registro.cdetalleestado = 'ACT';

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
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'N', 't.cexpediente', this.mfiltros, this.mfiltrosesp);
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.ccompania = this.dtoServicios.mradicacion.ccompania;
    //consulta el expediente activo de un socio.
    this.mfiltros.cdetalleestado = "ACT";
    if (!this.estaVacio(this.mcampos.cdetalleetapa) && this.mcampos.cdetalleetapa === '5') {
      this.mfiltros.cdetalleestado = "CAN";
    }
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }



  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    const exp = resp.DATOSEXPEDIENTE;
    if (!this.estaVacio(exp)) {
      if (!this.estaVacio(exp.fechaliquidacion)) {
        this.registro.fechaliquidacion = new Date(exp.fechaliquidacion);
      }
    }
  }
  // Fin CONSULTA *********************




  // Inicia MANTENIMIENTO *********************
  grabar(): void {

    //this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  fijarValoresGrabarExpediente(): void {
    this.registro.mdatos.jerarquia = this.mcampos.cjerarquia;
    this.registro.cdetalletipoexp = this.mcampos.cdetalletipoexp;
    this.registro.cpersona = this.mcampos.cpersona;
    if (!this.mcampos.bandeja) {
      this.registro.cdetalleetapa = '2';
    }

    this.registro.fentradapolicia = this.mcampos.fechaAlta;
    this.registro.fsalidapolicia = this.mcampos.fechaBaja;
    this.registro.tiemposervicio = this.mcampos.tiemposervicio;
    if (this.mcampos.cdetalletipoexp !== 'ANT') {
      this.registro.numerocarpeta = this.mcampos.numerocarpeta;
    } else {
      this.registro.numerocarpeta = 'N/A';
    }


  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  public registrarDatosGrabar() {
    this.lregistros = [];
    //let cjerar = this.valoresExpediente.regDatos.cdetallejerarquia;
    /*let cuantiaBasica = 0;
    if (cjerar === 2)
      cuantiaBasica = this.valoresExpediente.GetvalorParametroNumero("CUANTIABASICACLASES");
    else
      cuantiaBasica = this.valoresExpediente.GetvalorParametroNumero("CUANTIABASICAOFICIALES");
    var fechabaja = new Date(this.valoresExpediente.regDatos.fechaBaja);
    let year = fechabaja.getFullYear();
    this.registro.numeroarchivo = this.registro.cpersona + "/" + year;
    this.registro.cdetalleestado = 'ACT';
    this.registro.ccatalogoestado = 2803;
    this.registro.ccatalogotipoexp = 2802;
    this.registro.valorcuantiabasica = cuantiaBasica;
    this.registro =  Object.assign(this.registro , this.valoresExpediente.regDatosExp);
    this.registro.valorbonificacion = this.valoresExpediente.regDatos.vbonificacion;
    this.registro.mdatos.cdetallejerarquia = this.valoresExpediente.regDatos.cdetallejerarquia;
    this.registro.mdatos.fechaalta = this.valoresExpediente.regDatos.fechaAlta;
    this.registro.mdatos.fechabaja = fechabaja;
    
    this.lregistros.push(this.registro);*/
  }

  public validaGrabar(): boolean {
    /*if (this.valoresExpediente.regDatos.simulacion === true) {
      super.mostrarMensajeError('MODO SIMULACIÓN NO SE PUEDE GRABAR');
      return false
    }

    if (this.estaVacio(this.registro.cdetalletipoexp)) {
      super.mostrarMensajeError('INGRESE EL TIPO DE LIQUIDACION A REALIZAR');
      return false
    }

    if (this.valoresExpediente.regDatosExp.totalliquidacion < 0) {
      super.mostrarMensajeError('LIQUIDACIÓN CON SALDO NEGATIVO, NO SE PUEDE ALMACENAR');
      return false
    }
    if (this.estaVacio(this.registro.numerocarpeta)) {
      super.mostrarMensajeError('INGRESE EL NÚMERO DE CARPETA');
      return false
    }

    //fallecido no se verifca cuentas de banco
    if (this.valoresExpediente.regDatos.fallecido)
      return true;*/

    return true;
  }
  //Fin Mantenimiento

  limpiar() {
    this.mcampos = {};
    this.registro.mdatos = {};
    // this.estadoListaTipos = false;
  }


  //fijar Valores para liquidacion.
  fijarDatosBajaLiquidacion(resp: any) {

    this.fijarDatosExpediente(resp);
  }

  fijarDatosExpediente(resp: any): void {
    if (this.estaVacio(resp.DATOSEXPEDIENTE)) {
      this.mcampos.etapaactual = "CREACIÓN DE EXPEDIENTE";

      //this.estadoListaTipos = false;
      this.generarCodigoExpediente();
    }
    else {
      // this.estadoListaTipos = true;
      this.mcampos.cexpediente = resp.DATOSEXPEDIENTE.cexpediente;
      this.mcampos.secuencia = resp.DATOSEXPEDIENTE.secuencia;
      if (this.estaVacio(resp.DATOSEXPEDIENTE.mdatos.descripcionetapa))
        this.mcampos.etapaactual = "EXPEDIENTE CREADO -  EDICIÓN HABILITADA";
      else
        this.mcampos.etapaactual = resp.DATOSEXPEDIENTE.mdatos.descripcionetapa
      this.mcampos.numerocarpeta = resp.DATOSEXPEDIENTE.numerocarpeta;
      this.mcampos.tipoliquidacion = resp.DATOSEXPEDIENTE.cdetalletipoexp;

      this.mcampos.observacion = resp.DATOSEXPEDIENTE.observacion;

      //this.getAnioBaja();
    }
  }

  generarCodigoExpediente(): void {
    //si es anticipo activar el uso de check anticipo
    //GENERAR CODIGO DEL EXPEDIENTE

    //this.getAnioBaja();
    this.consultarSecuencia();

  }

  ObtenerCodigoExpediente(secuencia) {
    const tipobaja = this.mcampos.tipobaja;
    this.registro.cexpediente = secuencia + this.mcampos.year.toString() + this.registro.cdetalletipoexp + this.registro.mdatos.jerarquia;

  }

  //consultar secuencia
  public consultarSecuencia() {
    this.rqConsulta.cmodulo = 28;
    this.rqConsulta.ctransaccion = 202;
    this.rqConsulta.CODIGOCONSULTA = 'SECUENCIAEXPEDIENTE';
    this.rqConsulta.cdetalletipoexp = this.registro.cdetalletipoexp;
    this.rqConsulta.year = this.mcampos.year;

    this.registro.numeroarchivo = this.mfiltros.cpersona + "/" + this.mcampos.year;
    this.mcampos.tipoliquidacion = this.registro.cdetalletipoexp;
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false);
          if (resp.cod !== 'OK') {
            return;
          }
          this.mcampos.secuencia = resp.SECUENCIA;

          this.ObtenerCodigoExpediente(this.mcampos.secuencia);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }
}
