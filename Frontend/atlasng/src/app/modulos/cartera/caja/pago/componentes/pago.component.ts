import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {DtoServicios} from '../../../../../util/servicios/dto.servicios';
import {Consulta} from '../../../../../util/dto/dto.component';
import {Mantenimiento} from '../../../../../util/dto/dto.component';
import {BaseComponent} from '../../../../../util/shared/componentes/base.component';
import {SelectItem} from 'primeng/primeng';
import {LovPersonasComponent} from '../../../../personas/lov/personas/componentes/lov.personas.component';
import {LovOperacionCarteraComponent} from '../../../lov/operacion/componentes/lov.operacionCartera.component';

@Component({
  selector: 'app-pago',
  templateUrl: 'pago.html'
})
export class PagoComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  @ViewChild(LovOperacionCarteraComponent)
  private lovOperacion: LovOperacionCarteraComponent;

  consultaRubros = true;


  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'DtoRubro', '_RUBROS', false);
  }

  ngOnInit() {
    this.componentehijo = this;
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
    } else {
      const objresp = resp['VISTA'];
      if (objresp !== undefined) {
        this.mcampos.npersona = objresp.nombre;
      }
    }
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    if (this.estaVacio(this.mcampos.coperacion)) {
      this.mostrarMensajeError('NÚMERO DE OPERACIÓN REQUERIDA');
      return;
    }

    if (this.estaVacio(this.mcampos.documento)) {
      this.mostrarMensajeError('NÚMERO DE DOCUMENTO REQUERIDO');
      return;
    }

    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.coperacion = this.mcampos.coperacion;
    this.rqMantenimiento.documento = this.mcampos.documento;
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
    if (this.mcampos.cpersona === undefined) {
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

  public consultarDatosOperacion() {
    const rqConsulta: any = new Object();
    rqConsulta.CODIGOCONSULTA = 'SALDOVENCIDOCARTERA';
    rqConsulta.coperacion = this.mcampos.coperacion;

    this.dtoServicios.ejecutarConsultaRest(rqConsulta)
      .subscribe(
      resp => {
        this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
        if (resp.cod !== 'OK') {
          return;
        }
        this.mcampos.valor = resp.SALDO[0]['saldo'];
      },
      error => {
        this.dtoServicios.manejoError(error);
      });
  }

  private actualizarMonto() {
    this.rqMantenimiento.monto = 0;
    for (const i in this.lregistros) {
      if (this.lregistros.hasOwnProperty(i)) {
        this.rqMantenimiento.monto = this.rqMantenimiento.monto + this.lregistros[i].monto;
      }
    }
    return this.rqMantenimiento.monto;
  }
}
