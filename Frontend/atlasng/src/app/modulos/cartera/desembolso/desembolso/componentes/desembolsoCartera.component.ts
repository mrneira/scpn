import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';
import { LovOperacionCarteraComponent } from '../../../lov/operacion/componentes/lov.operacionCartera.component';
import { DesembolsoTransferenciaComponent } from './_desembolsoTransferencia.component';
import { DesembolsoOtrosComponent } from './_desembolsoOtros.component';

@Component({
  selector: 'app-desembolso',
  templateUrl: 'desembolsoCartera.html'
})
export class DesembolsoCarteraComponent extends BaseComponent implements OnInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  @ViewChild(LovOperacionCarteraComponent)
  private lovOperacion: LovOperacionCarteraComponent;

  @ViewChild(DesembolsoOtrosComponent)
  desembolsoOtros: DesembolsoOtrosComponent;

  @ViewChild(DesembolsoTransferenciaComponent)
  desembolsoTransferencia: DesembolsoTransferenciaComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'SALDODESEMBOLSO', false, true);
  }

  ngOnInit() {
    this.componentehijo = this;
    this.consultarCatalogos();
    super.init(this.formFiltros);
    
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (!this.validaOperacion()) {
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.rqConsulta.CODIGOCONSULTA = 'DATOSDESEMBOLSO';
    this.rqConsulta.coperacion = this.mfiltros.coperacion;
    const consultaTransferencia = this.desembolsoTransferencia.crearDtoConsulta(this.mfiltros.coperacion);
    this.addConsultaPorAlias('TRANSFERENCIA', consultaTransferencia);
    const consultaOtros = this.desembolsoOtros.crearDtoConsulta(this.mfiltros.coperacion);
    this.addConsultaPorAlias('OTROS', consultaOtros);
  }

  validaFiltrosConsulta(): boolean {
    return true;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.desembolsoTransferencia.postQuery(resp);
    this.desembolsoOtros.postQuery(resp);
    this.manejaRespuestaDatosOperacion(resp);
  }

  public consultarRubros() {
    const rqConsulta: any = new Object();
    this.desembolsoOtros.lotros = [{ label: '...', value: null }];

    rqConsulta.CODIGOCONSULTA = 'RUBROSTRANSACCION';
    rqConsulta.cmodulo = sessionStorage.getItem('m');
    rqConsulta.ctransaccion = 133;

    this.dtoServicios.ejecutarConsultaRest(rqConsulta)
      .subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
          if (resp.cod === 'OK') {
            const lrubros = resp._RUBROS;
            for (const i in lrubros) {
              if (lrubros.hasOwnProperty(i)) {
                const reg = lrubros[i];
                if (!this.estaVacio(reg.rubro)) {
                  if (reg.rubro === 1) {
                    this.desembolsoTransferencia.mcampos.rubro = reg.rubro;
                  } else {
                    this.desembolsoOtros.lotros.push({ label: reg.nombre, value: reg.rubro });
                  }
                }
              }
            }
          }
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.validaFiltrosConsulta();
    if (this.mcampos.diferencia !== 0) {
      this.mostrarMensajeError('EXISTE DIFERENCIA EN LOS VALORES DE DESEMBOLSO [' + this.mcampos.diferencia + ']');
      return;
    }

    this.lmantenimiento = []; // Encerar Mantenimiento
    if (!this.validaOperacion()) {
      return;
    }
    this.rqMantenimiento.cpersona = this.mcampos.cpersona;
    this.rqMantenimiento.coperacion = this.mfiltros.coperacion;
    this.rqMantenimiento.monto = super.redondear(Number(this.mcampos.montodesembolsar), 2);
    this.rqMantenimiento.montoabsorcion = super.redondear(Number(this.mcampos.montoabsorcion), 2);
    this.rqMantenimiento.montoreincorporado = super.redondear(Number(this.mcampos.montoreincorporado), 2);

    super.addMantenimientoPorAlias(this.desembolsoTransferencia.alias, this.desembolsoTransferencia.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.desembolsoOtros.alias, this.desembolsoOtros.getMantenimiento(2));
    super.grabar();
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  public postCommit(resp: any) {
    this.mcampos.csolicitud = resp.csolicitud;
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
    this.lovOperacion.mfiltros.cestatus = 'APR';
    this.lovOperacion.mfiltros.cpersona = this.mcampos.cpersona;
    this.lovOperacion.showDialog();
    this.lovOperacion.consultar();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.mcampos.nombre = reg.registro.nombre;
      this.mostrarLovOperacion();
    }
  }

  /**Retorno de lov de operacion de cartera. */
  fijarLovOperacionSelec(reg: any): void {
    this.msgs = [];
    this.mfiltros.coperacion = reg.registro.coperacion;
    this.mcampos.ntipoprod = reg.registro.mdatos.nproducto + ' - ' + reg.registro.mdatos.ntipoproducto;
    this.consultar();
    this.consultarRubros();
    this.consultarSueldo();
  }

  private validaOperacion(): boolean {
    if (this.estaVacio(this.mfiltros.coperacion)) {
      super.mostrarMensajeError('NÚMERO DE OPERACIÓN A DESEMBOLSAR REQUERIDA');
      return false;
    }
    return true;
  }

  manejaRespuestaDatosOperacion(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      const msaldo = resp.SALDODESEMBOLSO[0];
      this.mcampos.montodesembolsar = msaldo.montodesembolsar;
      this.mcampos.descuento = msaldo.descuento;
      this.mcampos.montoabsorcion = msaldo.montoabsorcion;
      this.mcampos.montoreincorporado = msaldo.montoreincorporado;
      this.mcampos.montoanticipo = msaldo.montoanticipo;
      this.mcampos.monto = msaldo.monto;

      const moperacion = resp.OPERACION[0];
      this.mcampos.cpersona = moperacion.cpersona;
      this.mcampos.npersona = moperacion.n_persona;
      this.mcampos.cmoneda = moperacion.cmoneda;
      this.mcampos.cmoneda = moperacion.n_moneda;
      this.mcampos.cpersona = moperacion.cpersona;
    }
    this.lconsulta = [];
  }

  consultarCatalogos(): any {
    this.encerarConsultaCatalogos();

    const mfiltrosBanc: any = { 'ccatalogo': this.desembolsoTransferencia.codCatalogoInstitucion };
    const consultaBanc = new Consulta('TgenCatalogoDetalle', 'Y', 't.nombre', mfiltrosBanc, {});
    consultaBanc.cantidad = 100;
    this.addConsultaCatalogos('BANCOS', consultaBanc, this.desembolsoTransferencia.lbancos, super.llenaListaCatalogo, 'cdetalle');

    const mfiltrosTcta: any = { 'ccatalogo': this.desembolsoTransferencia.codCatalogoTipoCuenta };
    const consultaTcta = new Consulta('TgenCatalogoDetalle', 'Y', 't.nombre', mfiltrosTcta, {});
    consultaTcta.cantidad = 100;
    this.addConsultaCatalogos('TIPOCUENTA', consultaTcta, this.desembolsoTransferencia.ltipocuenta, super.llenaListaCatalogo, 'cdetalle');

    this.ejecutarConsultaCatalogos();
  }

  consultarSueldo(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.desembolsoTransferencia.lsueldo = [];

    const mfiltrosSueldo: any = { 'cpersona': this.mcampos.cpersona, 'verreg': 0,'cuentaprincipal' : true };
    const consultaSueldo = new Consulta('TperReferenciaBancaria', 'Y', 't.cpersona', mfiltrosSueldo, {});
    consultaSueldo.cantidad = 100;
    this.addConsultaPorAlias("SUELDO", consultaSueldo);

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta("C")).subscribe(
      resp => {
        this.desembolsoTransferencia.lsueldo = resp.SUELDO;
      },
      error => {
        this.dtoServicios.manejoError(error);
      }
    );
  }

  calculaDiferencia() {
    const montodiferencia = super.redondear(Number(super.redondear(Number(this.mcampos.montodesembolsar), 2) - super.redondear(Number(this.desembolsoTransferencia.montospi), 2) - super.redondear(Number(this.desembolsoOtros.montootros), 2)), 2);
    this.mcampos.diferencia = montodiferencia;
    return montodiferencia;
  }


}
