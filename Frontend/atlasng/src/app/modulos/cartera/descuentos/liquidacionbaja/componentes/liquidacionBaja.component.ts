import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';
import { LovPersonaVistaComponent } from '../../../../personas/lov/personavista/componentes/lov.personaVista.component';
import { LovOperacionCarteraComponent } from '../../../lov/operacion/componentes/lov.operacionCartera.component';

@Component({
  selector: 'app-liquidacionbaja-mora',
  templateUrl: 'liquidacionBaja.html'
})
export class LiquidacionBajaComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  @ViewChild(LovPersonaVistaComponent)
  private lovPersonaVista: LovPersonaVistaComponent;

  @ViewChild(LovOperacionCarteraComponent)
  private lovOperacion: LovOperacionCarteraComponent;

  consultaRubros = true;

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

    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.coperacion = this.mcampos.coperacion;
    this.rqMantenimiento.documento = this.mcampos.numerooficio;
    this.rqMantenimiento.cpersona = this.mcampos.cpersona;
    this.rqMantenimiento.comentario = this.mcampos.novedad;
    this.rqMantenimiento.fechaoficio = this.mcampos.fechaoficio;
    this.rqMantenimiento.tiponovedad = this.mcampos.tiponovedad;
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

  /**Muestra lov de personas */
  mostrarLovPersona(): void {
    this.lovPersonas.mfiltros.csocio = 1;
    this.lovPersonas.showDialog();
  }

  /**Muestra lov de operaciones de cartera. */
  mostrarLovOperacion(): void {
    if (this.estaVacio(this.mcampos.cpersona)) {
      this.mostrarMensajeInfo('SELECCIONE CLIENTE');
      return;
    }
    this.lovOperacion.mfiltrosesp.cestatus = 'not in (\'APR\',\'CAN\')';
    this.lovOperacion.mfiltros.cpersona = this.mcampos.cpersona;
    this.lovOperacion.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.mcampos.nombre = reg.registro.nombre;
      this.mcampos.cjerarquia = reg.registro.mdatos.cjerarquia;
      this.mostrarLovOperacion();
      this.lovOperacion.consultar();
    }
  }

  /**Retorno de lov de operacion de cartera. */
  fijarLovOperacionSelec(reg: any): void {
    this.mcampos.coperacion = reg.registro.coperacion;
    this.mcampos.nmoneda = reg.registro.mdatos.nmoneda;
    this.mcampos.ntipoprod = reg.registro.mdatos.nproducto + ' - ' + reg.registro.mdatos.ntipoproducto;
    this.consultarDatosOperacion();
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
          this.actualizarMonto();
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  private actualizarMonto() {
    this.rqMantenimiento.monto = 0;
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
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        const reg: any = this.lregistros[i];
        if (this.mcampos.montoaportes < this.mcampos.valor) {
          reg.monto = this.mcampos.montoaportes
        } else {
          reg.monto = this.mcampos.valor;
        }
        this.rqMantenimiento.monto = reg.monto;
      }
    }
    return this.rqMantenimiento.monto;
  }
}
