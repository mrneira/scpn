import { Component, OnInit, Output, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';

@Component({
  selector: 'app-retenciones',
  templateUrl: 'retenciones.html'
})
export class RetencionesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoCliente = new EventEmitter();

  public lestado: SelectItem[] = [{label: '...', value: null}];
  public lbancos: SelectItem[] = [{label: '...', value: null}];
  public ltipocuenta: SelectItem[] = [{label: '...', value: null}];
  public ltipoNovedad: SelectItem[] = [{label: '...', value: null}];

  mensaje = "";
  public edited = false;
  public grabo = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tsocnovedadades', 'RETENCIONES', false, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init(this.formFiltros);
    this.llenarEstado();
  }

  ngAfterViewInit() {
    //this.mfiltros.cpersona = 0;
  }

  crearNuevo() {
    if (!this.validaFiltrosConsulta()) {
      return;
    }

    if (this.estaVacio(this.mcampos.cdetalletipoexp)) {
      this.mostrarMensajeError("TIPO DE LIQUIDACIÓN REQUERIDO")
      return;
    }

    super.crearNuevo();
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.registro.ccatalogonovedad = 220;
    this.registro.ccatalogobanco = 305;
    this.registro.ccatalogotipocuenta = 306;
    this.registro.cpersona = this.mfiltros.cpersona;
    this.registro.retencion = true;
    this.registro.pagado = false;
    this.registro.fecha = this.fechaactual;
    this.registro.cusuario = this.dtoServicios.mradicacion.cusuario;
    
  }

  actualizar() {
    // if (this.registro.valor === 0) {
    //   this.validarValores(true, "INGRESE EL VALOR DE LA RETENCION");
    //   return
    // }

    if (this.registro.porcentajeretencion === 0) {
      this.validarValores(true, "INGRESE EL PORCENTAJE DE LA RETENCION");
      return
    }

    this.validarValores(false, "");
    
  }

  eliminar() {
    super.eliminar();
    this.grabar();
  }

  cancelar() {
    super.cancelar();
  }

  consultar() {
    this.grabo = false;
    if (!this.validaFiltrosConsulta()) {
      return;
    }

    if (this.estaVacio(this.mcampos.cdetalletipoexp)) {
      this.mostrarMensajeError("TIPO DE LIQUIDACIÓN REQUERIDO")
      return;
    }

    this.crearDtoConsulta();
    //super.consultar();
  }

  // Inicia CONSULTA *********************

  public crearDtoConsulta() {
    this.rqConsulta.cmodulo = 28;
    this.rqConsulta.ctransaccion = 206;
    this.rqConsulta.CODIGOCONSULTA = 'DATOSRETENCIONES';
    this.rqConsulta.cdetalletipoexp = this.mcampos.cdetalletipoexp;
    this.rqConsulta.cdetallejerarquia = this.mcampos.cdetallejerarquia;
    this.rqConsulta.fechaalta = this.mcampos.fechaalta;
    this.rqConsulta.fechabaja = this.mcampos.fechabaja;
    this.rqConsulta.coeficiente = this.mcampos.coeficiente;
    this.rqConsulta.cpersona = this.mfiltros.cpersona;
    this.rqConsulta.bandeja = this.mcampos.bandeja;
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
      resp => {
        this.dtoServicios.llenarMensaje(resp, this.grabo);
        if (resp.cod === 'OK') {
          super.postQueryEntityBean(resp);
          this.obtenertotal(resp);
        
        }
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  public fijarFiltrosConsulta() {

  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {

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
    this.enproceso = false;
    this.grabo = true;
    this.crearDtoConsulta();
    this.eventoCliente.emit({ registro: this.mcampos.bandeja });
  }

  llenarEstado() {
    this.lestado = [];
    this.lestado.push({label: '...', value: null});
    this.lestado.push({label: 'ACTIVO', value: 'ACT'});
    this.lestado.push({label: 'INACTIVO', value: 'INA'});
  }

  public obtenertotal(resp: any): number {
    const valorliquidacion = this.redondear(resp.totalingresos,2);//this.valoresExpediente.regDatosExp.subtotal;
    let valor = 0;
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        if (this.lregistros[i].estado === 'ACT') {
          let vret = (valorliquidacion * this.lregistros[i].porcentajeretencion) / 100;
          vret = this.redondear(vret,2);
          valor = valor + vret;
        }
      }
    }
    this.mcampos.total = valor;
    // this.valoresExpediente.regDatos.tretenciones = valor;
    // this.valoresExpediente.calcularTotalLiquidacion(false,'');
    return valor
  }
  public limpiar() {
    this.lregistros = [];
  }

  validarValores(resultado: boolean, mensaje: string) {
    if (resultado) {
      this.mensaje = mensaje;
      this.edited = true;
      //wait 3 Seconds and hide
      setTimeout(function() {
        this.edited = false;
        console.log(this.edited);
      }.bind(this), 3000);
    }
    else {
      this.mensaje = "";
      super.actualizar();
      this.grabar();
    }
  }
}
