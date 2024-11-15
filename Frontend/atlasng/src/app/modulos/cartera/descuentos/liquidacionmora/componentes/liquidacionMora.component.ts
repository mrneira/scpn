import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Consulta } from '../../../../../util/dto/dto.component';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';
import { LovPersonaVistaComponent } from '../../../../personas/lov/personavista/componentes/lov.personaVista.component';
import { LovOperacionCarteraComponent } from '../../../lov/operacion/componentes/lov.operacionCartera.component';

@Component({
  selector: 'app-liquidacion-mora',
  templateUrl: 'liquidacionMora.html'
})
export class LiquidacionMoraComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  @ViewChild(LovPersonaVistaComponent)
  private lovPersonaVista: LovPersonaVistaComponent;

  @ViewChild(LovOperacionCarteraComponent)
  private lovOperacion: LovOperacionCarteraComponent;

  consultaRubros = true;
  public nocobrado: any = { 'mdatos': {} };

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'DtoRubro', '_RUBROS', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    this.rqMantenimiento.monto = 0;
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  // Inicia CONSULTA *********************

  consultar() {
    this.rqConsulta.mdatos.CODIGOCONSULTA = 'RUBROSTRANSACCION';
    super.consultar();
  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    if (this.consultaRubros) {
      super.postQueryEntityBean(resp);
    }
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    super.encerarMensajes();

    if (this.estaVacio(this.mcampos.numerooficio)) {
      this.mostrarMensajeError('NÚMERO DE DOCUMENTO REQUERIDO');
      return;
    }

    if (this.estaVacio(this.mcampos.fechaoficio)) {
      this.mostrarMensajeError('FECHA REQUERIDA');
      return;
    }

    if (this.estaVacio(this.mcampos.novedad)) {
      this.mostrarMensajeError('COMENTARIO REQUERIDO');
      return;
    }

    if (this.estaVacio(this.mcampos.coperacion)) {
      this.mostrarMensajeError('NÚMERO DE OPERACIÓN REQUERIDA');
      return;
    }

    if (this.estaVacio(this.rqMantenimiento.monto) || this.rqMantenimiento.monto === 0) {
      this.mostrarMensajeError('MONTO NO PUEDE SER CERO');
      return;
    }

    if (this.rqMantenimiento.monto > this.nocobrado.totalliquidacion) {
      this.mostrarMensajeError('VALOR DE PAGO NO PUEDE SER MAYOR AL VALOR A RECIBIR');
      return;
    }

    // if (this.rqMantenimiento.monto < this.mcampos.valorpagominimo) {
    //   this.mostrarMensajeError('VALOR DE PAGO NO PUEDE SER MENOR A [' + this.mcampos.valorpagominimo + ']');
    //   return;
    // }

    // Valida tipo de pago
    this.mcampos.pagototal = false;
    this.mcampos.pagoextraordinario = false;
    if (this.mcampos.montopago === this.mcampos.saldo) {
      this.mcampos.pagototal = true;
    } else {
      if (this.mcampos.montopago >= this.mcampos.valorextraordinario) {
        this.mcampos.pagoextraordinario = true;
      }
    }

    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.coperacion = this.mcampos.coperacion;
    this.rqMantenimiento.documento = this.mcampos.numerooficio;
    this.rqMantenimiento.cpersona = this.mcampos.cpersona;
    this.rqMantenimiento.comentario = this.mcampos.novedad;
    this.rqMantenimiento.fechaoficio = this.mcampos.fechaoficio;
    this.rqMantenimiento.tiponovedad = this.mcampos.tiponovedad;
    this.rqMantenimiento.pagototal = this.mcampos.pagototal;
    this.rqMantenimiento.pagoextraordinario = this.mcampos.pagoextraordinario;
    this.crearDtoMantenimiento();
    super.grabar(false);
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1, true);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }
  // Fin MANTENIMIENTO *********************

  /**Muestra lov de personas */
  mostrarLovPersona(): void {
    this.lovPersonas.mfiltros.csocio = 1;
    this.lovPersonas.validaRegimen = true; //MNE20240716
    this.lovPersonas.showDialog();
  }

  /**Muestra lov de operaciones de cartera. */
  mostrarLovOperacion(): void {
    super.encerarMensajes();
    if (this.estaVacio(this.mcampos.cpersona)) {
      this.mostrarMensajeInfo('SELECCIONE CLIENTE');
      return;
    }
    if (this.estaVacio(this.nocobrado.cpersona)) {
      this.mostrarMensajeError('SOCIO NO REGISTRA INFORMACIÓN, VERIFIQUE EL ESTADO DEL SOCIO O EXPEDIENTE');
      return;
    }
    this.lovOperacion.mfiltrosesp.cestatus = 'not in (\'APR\',\'CAN\')';
    this.lovOperacion.mfiltros.cpersona = this.mcampos.cpersona;
    this.lovOperacion.showDialog();
    if (this.estaVacio(this.mcampos.coperacion)) {
      this.lovOperacion.consultar();
    }
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.mcampos.nombre = reg.registro.nombre;
      this.mcampos.cjerarquia = reg.registro.mdatos.cjerarquia;
      this.consultarNoCobrado();
    }
  }

  /**Retorno de lov de operacion de cartera. */
  fijarLovOperacionSelec(reg: any): void {
    this.mcampos.coperacion = reg.registro.coperacion;
    this.mcampos.nmoneda = reg.registro.mdatos.nmoneda;
    this.mcampos.ntipoprod = reg.registro.mdatos.nproducto + ' - ' + reg.registro.mdatos.ntipoproducto;
    this.consultarDatosOperacion();
    this.consultarDatosExpediente();
  }

  /**Consulta de no cobrado */
  consultarNoCobrado(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosNoCob: any = { 'cpersona': this.mcampos.cpersona };
    const consultaNoCob = new Consulta('TpreNoCobradas', 'N', 't.cpersona', mfiltrosNoCob, {});
    consultaNoCob.addSubquery('TgenCatalogoDetalle', 'nombre', 'ntipo', 'i.ccatalogo = t.ccatalogotipoexp and i.cdetalle = cdetalletipoexp');
    this.addConsultaCatalogos('NOCOBRADO', consultaNoCob, this.nocobrado, this.llenarNoCobrado, null, this.componentehijo);

    this.ejecutarConsultaCatalogos();
  }

  public llenarNoCobrado(pLista: any, pListaResp, campopk, agregaRegistroVacio = true, componentehijo = null, campoetiqueta = null): any {
    if (pListaResp !== null) {
      componentehijo.nocobrado = pListaResp;
    }
  }

  /**Muestra lov de persona vista */
  mostrarLovPersonaVista(): void {
    this.lovPersonaVista.showDialog();
    this.lovPersonaVista.mcampos.cpersona = this.mcampos.cpersona;
    this.lovPersonaVista.mcampos.identificacion = this.mcampos.identificacion;
    this.lovPersonaVista.mcampos.nombre = this.mcampos.nombre;
    this.lovPersonaVista.consultar();
  }

  public consultarDatosOperacion() {
    const rqConsulta: any = new Object();
    rqConsulta.CODIGOCONSULTA = 'SALDOPRECANCELACIONCARTERA';
    rqConsulta.coperacion = this.mcampos.coperacion;

    this.dtoServicios.ejecutarConsultaRest(rqConsulta)
      .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
          if (resp.cod !== 'OK') {
            return;
          }
          this.mcampos.valor = resp.SALDO[0]['saldo'];
          //this.actualizarMonto(undefined);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  public consultarDatosExpediente() {
    const rqConsulta: any = new Object();
    rqConsulta.CODIGOCONSULTA = 'EXPEDIENTEPRESTAMOS';
    rqConsulta.cpersona = this.mcampos.cpersona;

    this.dtoServicios.ejecutarConsultaRest(rqConsulta)
      .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
          if (resp.cod !== 'OK') {
            return;
          }
          const lprestamos = resp.PRESTAMOS
          for (const i in lprestamos) {
            if (lprestamos.hasOwnProperty(i)) {
              const pre: any = lprestamos[i];
              if (pre.coperacion === this.mcampos.coperacion) {
                this.mcampos.montooriginal = pre.monto;
                this.mcampos.porcentaje = pre.porcentaje;
                this.mcampos.saldo = pre.saldo;
                this.mcampos.valorvencido = pre.valorvencido;
                this.mcampos.pagototal = pre.pagototal;
                this.mcampos.valorpagominimo = pre.valorpagominimo;
                this.mcampos.valorextraordinario = pre.valorextraordinario;
              }
            }
          }
          for (const i in this.lregistros) {
            if (this.lregistros.hasOwnProperty(i)) {
              const reg: any = this.lregistros[i];
              if (this.mcampos.cjerarquia === 'CLA' && reg.rubro === 2) {
                this.mcampos.tiponovedad = 15;
                this.selectRegistro(reg);
                super.eliminar();
              }
              if (this.mcampos.cjerarquia === 'OFI' && reg.rubro === 1) {
                this.mcampos.tiponovedad = 17;
                this.selectRegistro(reg);
                super.eliminar();
              }
            }
          }

          // Monto de pago
          let montopago = 0;
          if (this.nocobrado.totalliquidacion > this.mcampos.valorpagominimo) {
            montopago = this.mcampos.valorpagominimo;
          } else {
            montopago = this.nocobrado.totalliquidacion;
          }
          for (const i in this.lregistros) {
            if (this.lregistros.hasOwnProperty(i)) {
              const reg: any = this.lregistros[i];
              reg.monto = montopago;
              this.mcampos.montopago = reg.monto;
              this.rqMantenimiento.monto = reg.monto;
              this.rqMantenimiento.csaldo = reg.csaldo;
            }
          }
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }


  private actualizarMonto(monto: any) {
    this.mcampos.montopago = monto;
    this.rqMantenimiento.monto = monto;
    return this.rqMantenimiento.monto;
  }

}
