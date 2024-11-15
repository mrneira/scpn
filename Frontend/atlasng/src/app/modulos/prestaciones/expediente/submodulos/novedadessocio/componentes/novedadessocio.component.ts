import { Component, OnInit, Output, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';


@Component({
  selector: 'app-novedadessocio',
  templateUrl: 'novedadessocio.html'
})
export class NovedadessocioComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @Output() eventoCliente = new EventEmitter();

  public lestado: SelectItem[] = [{ label: '...', value: null }];
  public lbancos: SelectItem[] = [{ label: '...', value: null }];
  public ltipocuenta: SelectItem[] = [{ label: '...', value: null }];
  public ltipoNovedad: SelectItem[] = [{ label: '...', value: null }];

  fecha = new Date();
  mensaje = "";
  public edited = false;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tsocnovedadades', 'NOVEDADES', false, false);
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
    this.registro.retencion = this.mfiltros.retencion;
    this.registro.fecha = this.fecha;
    this.registro.cusuario = this.dtoServicios.mradicacion.cusuario;
    this.registro.estado = 'ACT';
    this.registro.valor = 0;

    //}
  }

  actualizar() {
    if (!this.validarValor("INGRESE EL VALOR DE LA NOVEDAD")) {
      return;
    }
    if (this.registro.fechaoficio > this.registro.fecharecepcion) {
      this.mensaje = "Fecha de oficio no puede ser mayor que fecha de recepción";
      this.edited = true;
      return;
    }
    else {
      this.edited = false;
      this.mensaje = '';
    }
    super.actualizar();
    this.grabar();
    this.obtenertotal();
  }

  eliminar() {
    super.eliminar();
    this.grabar();
    this.obtenertotal();
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    if(registro.automatico){
      this.mostrarMensajeError("NO SE PUEDE REALIZAR ACCIONES EN NOVEDADES ATUMÁTICAS")
      return;
    }
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.rqConsulta = [];
    if (!this.validaFiltrosConsulta()) {
      return;
    }

    if (this.estaVacio(this.mcampos.cdetalletipoexp)) {
      this.mostrarMensajeError("TIPO DE LIQUIDACIÓN REQUERIDO")
      return;
    }

    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'Y', 't.fecharecepcion asc', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tgencatalogodetalle', 'nombre', 'ntiponovedad', 'i.ccatalogo = t.ccatalogonovedad and i.cdetalle = t.cdetallenovedad');
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.ccompania = this.dtoServicios.mradicacion.ccompania
    this.mfiltros.retencion = false;
  //  this.mfiltros.estado = 'ACT';
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    this.obtenertotal();
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
    this.eventoCliente.emit({ registro: this.mcampos.bandeja });

  }

  private validarValor(mnsj: string): boolean {
    if (this.registro.valor === 0) {
      this.mensaje = mnsj;//"INGRESE EL VALOR DE LA NOVEDAD";
      this.edited = true;
      //wait 3 Seconds and hide
      setTimeout(function () {
        this.edited = false;
        console.log(this.edited);
      }.bind(this), 5000);
      return false;
    } else {
      return true;
    }
  }


  llenarEstado() {
    this.lestado = [];
    this.lestado.push({ label: '...', value: null });
    this.lestado.push({ label: 'ACTIVO', value: 'ACT' });
    this.lestado.push({ label: 'INACTIVO', value: 'INA' });
  }

  public obtenertotal(): number {
    let valor: number = 0;
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        if (this.lregistros[i].estado === 'ACT') {
          valor = valor + this.lregistros[i].valor;
        }
      }
    }
    this.mcampos.totalmonto = valor;
    //this.valoresExpediente.regDatos.tnovedades = valor;
    //this.valoresExpediente.calcularTotalLiquidacion(false, '');
    return valor
  }
  public limpiar() {
    this.lregistros = [];
  }

  validarDocumento() {
    this.rqConsulta = [];
    this.rqConsulta.cmodulo = 28;
    this.rqConsulta.ctransaccion = 2;
    this.rqConsulta.CODIGOCONSULTA = 'NOVEDADESOFICIO';
    this.rqConsulta.cpersona = this.registro.cpersona;
    this.rqConsulta.numerooficio = this.registro.numerooficio;
    this.msgs = [];
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false);
          if (resp.cod != 'OK') {
            this.mensaje = resp.msgusu;
            this.edited = true;
          }
          else {
            this.edited = false;
            this.mensaje = '';
          }
        })
  }
}
