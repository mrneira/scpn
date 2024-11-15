import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';
import { LovOperacionCarteraComponent } from '../../../lov/operacion/componentes/lov.operacionCartera.component';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-condonar',
  templateUrl: 'condonar.html'
})
export class CondonarComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  @ViewChild(LovOperacionCarteraComponent)
  private lovOperacion: LovOperacionCarteraComponent;

  public ltipoarreglo: SelectItem[] = [{ label: '...', value: null }];
  public SALDOCAPITAL = "CAP";
  private SALDOINT = "INT";
  private SALDOMORA = "MOR";

  public totalprecancelacion = 0;
  public totalcondonar = 0;
  public montooperacion = 0;
  public montocondonado = 0;
  public montocapital = 0;
  public monto = 0;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'DtoRubro', 'RUBROS', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
  }

  actualizar() {
  }

  eliminar() {
  }

  cancelar() {
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.rqConsulta.mdatos.CODIGOCONSULTA = 'RUBROSPRECANCELACIONCARTERA';
    super.consultar();
  }

  validaFiltrosConsulta(): boolean {
    return this.validaFiltrosRequeridos();
  }

  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    super.encerarMensajes();

    if (this.estaVacio(this.mcampos.coperacion)) {
      this.mostrarMensajeError('NÚMERO DE OPERACIÓN REQUERIDA');
      return;
    }
    if (this.montocondonado <= 0) {
      this.mostrarMensajeError('SE REQUIEREN VALORES DE RUBROS A CONDONAR');
      return;
    }

    this.lmantenimiento = []; // Encerar Mantenimiento
    this.rqMantenimiento.coperacion = this.mcampos.coperacion;
    this.rqMantenimiento.monto = this.montocondonado;
    this.rqMantenimiento.RUBROS = this.lregistros;

    super.grabar(false);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  /**Muestra lov de personas */
  mostrarLovPersona(): void {
    this.lovPersonas.mfiltros.csocio = 1;
    this.lovPersonas.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (!this.estaVacio(reg.registro)) {
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.mcampos.nombre = reg.registro.nombre;
      this.mostrarLovOperacion();
    }
  }

  /**Muestra lov de operaciones de cartera. */
  mostrarLovOperacion(): void {
    if (this.estaVacio(this.mcampos.cpersona)) {
      this.mostrarMensajeInfo('SELECCIONE UN CLIENTE');
      return;
    }
    this.lovOperacion.mfiltrosesp.cestatus = 'not in (\'APR\',\'CAN\')';
    this.lovOperacion.mfiltrosesp.fapertura = '!= ' + this.dtoServicios.mradicacion.fcontable;
    this.lovOperacion.mfiltros.cpersona = this.mcampos.cpersona;
    this.lovOperacion.consultar();
    this.lovOperacion.showDialog();
  }

  /**Retorno de lov de operacion de cartera. */
  fijarLovOperacionSelec(reg: any): void {
    this.mcampos.coperacion = reg.registro.coperacion;
    this.mcampos.ntipoprod = reg.registro.mdatos.nproducto + ' - ' + reg.registro.mdatos.ntipoproducto;
    this.montooperacion = reg.registro.montooriginal;
    this.mcampos.cproducto = reg.registro.cproducto;
    this.mcampos.ctipoproducto = reg.registro.ctipoproducto;
    this.consultaOperacionRubros();
  }

  consultaOperacionRubros() {
    const rqConsulta: any = new Object();
    this.lregistros = [];
    const lcondonar: any = [];
    let montocapital = 0;
    let montocondonar = 0;

    rqConsulta.coperacion = this.mcampos.coperacion;
    rqConsulta.CODIGOCONSULTA = 'RUBROSPRECANCELACIONCARTERA';

    this.dtoServicios.ejecutarConsultaRest(rqConsulta)
      .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
          if (resp.cod === 'OK') {
            for (const i in resp.RUBROS) {
              if (resp.RUBROS.hasOwnProperty(i)) {
                const reg: any = resp.RUBROS[i];

                // Rubros operacion
                switch (reg.ctiposaldo) {
                  case this.SALDOCAPITAL:
                    montocapital += reg.monto;
                    break;
                  case this.SALDOINT:
                    montocondonar += reg.monto;
                    lcondonar.push(reg);
                    break;
                  case this.SALDOMORA:
                    montocondonar += reg.monto;
                    lcondonar.push(reg);
                    break;
                }
              }
            }

            resp.RUBROS = lcondonar;
            this.postQuery(resp);
            this.totalcondonar = montocondonar;
            this.totalprecancelacion = resp.TOTALPRECANCELACION;
            this.montooperacion = this.montooperacion;
            this.montocapital = montocapital;
            this.monto = this.totalprecancelacion;
          }
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  fijarCondonacion(reg: any, value: boolean) {
    this.calcularTotales();
  }

  calcularTotales(): void {
    this.montocondonado = 0;
    for (const i in this.lregistros) {
      const reg = this.lregistros[i];
      if (!this.estaVacio(reg.mdatos.condonar) && reg.mdatos.condonar) {
        this.montocondonado += reg.monto;
      }
    }
    this.monto = this.totalprecancelacion - this.montocondonado;
  }
}
