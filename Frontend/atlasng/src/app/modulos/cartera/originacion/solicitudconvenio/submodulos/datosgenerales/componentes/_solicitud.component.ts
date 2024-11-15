import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta, Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { MenuItem } from 'primeng/components/common/menuitem';
import { TipoProductoComponent } from '../../../../../../generales/tipoproducto/componentes/tipoProducto.component';

@Component({
  selector: 'app-solicitud',
  template: ''
})
export class SolicitudComponent extends BaseComponent implements OnInit, AfterViewInit {

  @Output() eventoSimulacion = new EventEmitter();

  public ltablaamortizacion: SelectItem[] = [{ label: '...', value: null }];
  public ltipocredito: SelectItem[] = [{ label: '...', value: null }];
  public lsegmentos: SelectItem[] = [{ label: '...', value: null }];

  public lproducto: SelectItem[] = [{ label: '...', value: null }];
  public ltipoproducto: SelectItem[] = [{ label: '...', value: null }];
  public ltipoproductototal: any = [];
  public lrangos: any = [];
  public lflujoquirografario: any = [];
  public lflujohipotecario: any = [];
  public lflujoprendario: any = [];
  public lrequisitostotal: any = [];
  public lrequisitos: any = [];

  public pagoVencimiento = false;
  public nproducto = "";
  public idstep = null;
  public items: MenuItem[];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarSolicitud', 'TCARSOLICITUD', true, false);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
    this.mcampos.camposfecha.finiciopagos = null;
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.csolicitud = null;
    this.registro.cmodulo = 7;
    this.registro.cmoneda = 'USD';
    this.registro.cestadooperacion = 'N';
  }

  actualizar() {
    this.registro.finiciopagos = null;
    this.registro.valorcuota = null;
    if ((this.estaVacio(this.registro.cuotasgracia))) {
      this.registro.cuotasgracia = null;
    }
    super.actualizar();
  }

  eliminar() {
    super.eliminar();
  }

  cancelar() {
    super.cancelar();
    this.ltipoproducto = [];
    if (this.registro.cproducto !== undefined && this.registro.cproducto !== null) {
      this.fijarListaTipoProducto(this.registro.cproducto);
    };
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'N', 't.csolicitud', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TcarProducto', 'csegmento', 'csegmento', 'i.cmodulo=t.cmodulo and i.cproducto=t.cproducto and i.ctipoproducto=t.ctipoproducto and i.verreg=0');
    consulta.addSubquery('TperPersonaDetalle', 'identificacion', 'identificacion', 'i.cpersona = t.cpersona and i.verreg = 0 ');
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {

  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  habilitarEdicion() {
    if (this.estaVacio(this.mfiltros.cpersona)) {
      this.mostrarMensajeError('PERSONA REQUERIDA');
      return false;
    }
    if (!this.validaFiltrosRequeridos()) {
      return false;
    }
    return super.habilitarEdicion();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    if (this.mfiltros.csolicitud !== 0) {
      this.fijarListaTipoProducto(this.registro.cproducto);
    }
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
  }

  validaGrabar() {
    return super.validaGrabar('NO HA REALIZADADO LA VALIDACIÓN DEL FORMULARIO [DATOS GENERAL]');
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any, dtoext = null) {
    super.postCommitEntityBean(resp, dtoext);
  }

  public actualizaFrecuencia() {
    if (!this.estaVacio(this.registro.cfrecuecia) && this.registro.cfrecuecia === 0) {
      this.pagoVencimiento = true;
    } else {
      this.pagoVencimiento = false;
    }
    this.registro.numerocuotas = null;
    this.mcampos.plazo = null;
  }

  limpiar() {
    this.registro.ctipoproducto = null;
    this.ltipoproducto = [];
    this.registro.cfrecuecia = null;
    this.registro.ctabla = null;
    this.registro.cbasecalculo = null;
    this.registro.tasa = null;
    this.registro.periodicidadcapital = null;
    this.registro.mesnogeneracuota = null;
    this.registro.montoporaportaciones = null;
    this.items = [];
    this.actualizar();
  }

  public mostrar(event: any): any {
    if (this.estaVacio(this.registro.ctipoproducto)) {
      return;
    };
    this.consultarDatosPrestamo();
  }

  /**
   * Consuta informacion del producto de cartera.
   */
  public cambiarTipoProducto(event: any): any {
    if (this.registro.cproducto === undefined || this.registro.cproducto === null) {
      this.limpiar();
      return;
    };
    this.fijarListaTipoProducto(Number(event.value));
  }

  fijarListaTipoProducto(cproducto: any) {
    super.limpiaLista(this.ltipoproducto);

    for (const i in this.ltipoproductototal) {
      if (this.ltipoproductototal.hasOwnProperty(i)) {
        const reg: any = this.ltipoproductototal[i];
        if (reg !== undefined && reg.value !== null && reg.cproducto === Number(cproducto)) {
          this.ltipoproducto.push({ label: reg.nombre, value: reg.ctipoproducto });
        }
      }
    }

    this.mfiltros.cproducto = null;
    if (this.ltipoproducto.length <= 0) {
      this.ltipoproducto.push({ label: '...', value: null });
    } else {
      this.mfiltros.cproducto = this.ltipoproducto[0].value;
    }

    this.llenaListaTipoProducto(this.ltipoproducto, this.componentehijo);
    this.consultarDatosPrestamo();
  }

  public llenaListaTipoProducto(pLista: any, componentehijo = null) {
    if (pLista.length === 0) {
      this.limpiar();
      componentehijo.mostrarMensajeError('NO EXISTE DATOS DE TIPO PRODUCTO PARA EL PRODUCTO SELECCIONADO');
      return;
    }
    componentehijo.registro.ctipoproducto = pLista[0].value;
  }

  public consultarDatosPrestamo() {
    const tipoProductoComponent = new TipoProductoComponent(this.router, this.dtoServicios);
    tipoProductoComponent.mfiltros.cmodulo = 7;
    tipoProductoComponent.mfiltros.cproducto = this.registro.cproducto;
    tipoProductoComponent.mfiltros.ctipoproducto = this.registro.ctipoproducto;
    tipoProductoComponent.rqConsulta.CODIGOCONSULTA = 'TIPOPRODUCTOCARTERA';
    tipoProductoComponent.rqConsulta.cmoneda = 'USD';
    tipoProductoComponent.rqConsulta.mdatos.cpersona = this.mfiltros.cpersona;
    const contipoProducto = tipoProductoComponent.crearDtoConsulta();

    this.dtoServicios.ejecutarConsultaRest(tipoProductoComponent.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.manejaRespuestaDatosProductoCartera(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  /**Manejo respuesta de ejecucion de login. */
  private manejaRespuestaDatosProductoCartera(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK' && !this.estaVacio(resp.TIPOPRODUCTO)) {
      const tp = resp.TIPOPRODUCTO[0];
      this.registro.cfrecuecia = tp.mdatos.cfrecuencia;
      this.registro.ctabla = tp.mdatos.ctabla;
      this.registro.cbasecalculo = tp.mdatos.cbasecalculo;
      this.registro.tasa = tp.mdatos.tasa;
      this.registro.montoporaportaciones = tp.mdatos.montoporaportaciones;
      this.registro.periodicidadcapital = tp.mdatos.periodicidadcapital;
      this.registro.mesnogeneracuota = tp.mdatos.mesnogeneracuota;
      this.registro.mdatos.csegmento = tp.mdatos.csegmento;
      this.registro.mdatos.gracia = tp.mdatos.gracia;
      this.registro.montooriginal = this.estaVacio(tp.mdatos.montodefault) ? undefined : tp.mdatos.montodefault;
      this.lrangos = tp.mdatos.RANGOS;
      this.cargarCuotas(this.registro.montooriginal);
      this.cargarFlujo(tp.mdatos.cflujo);
      this.cargarRequisitos();
    }
  }

  recargarSimulacion() {
    this.eventoSimulacion.emit();
  }

  cargarFlujo(cflujo: any): any {
    switch (cflujo) {
      case 700:
        this.items = this.lflujoquirografario;
        break;
      case 701:
        this.items = this.lflujohipotecario;
        break;
      case 706:
        this.items = this.lflujoprendario;
        break;
    }
  }

  cargarCuotas(monto: any): any {
    this.registro.numerocuotas = undefined;
    if (!this.estaVacio(monto)) {
      if (this.lrangos.some(x => x.montominimo <= monto && x.montomaximo >= monto)) {
        this.registro.numerocuotas = this.lrangos.find(x => x.montominimo <= monto && x.montomaximo >= monto).plazomaximo;
      }

      if (this.estaVacio(this.registro.numerocuotas) && (monto > this.lrangos[this.lrangos.length - 1].montomaximo)) {
        monto = this.lrangos[this.lrangos.length - 1].montomaximo;
        this.registro.montooriginal = monto;
        this.cargarCuotas(monto);
      }
    }
  }

  cargarRequisitos(): any {
    super.limpiaLista(this.lrequisitos);

    for (const i in this.lrequisitostotal) {
      if (this.lrequisitostotal.hasOwnProperty(i)) {
        const reg: any = this.lrequisitostotal[i];
        if (!this.estaVacio(reg) && reg.cproducto === this.registro.cproducto && reg.ctipoproducto === this.registro.ctipoproducto) {
          this.lrequisitos.push(reg);
        }
      }
    }
  }
}
