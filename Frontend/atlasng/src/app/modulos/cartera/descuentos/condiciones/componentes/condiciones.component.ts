import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta, Subquery } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';
import { LovOperacionCarteraComponent } from '../../../lov/operacion/componentes/lov.operacionCartera.component';

@Component({
  selector: 'app-condiciones-descuentos',
  templateUrl: 'condiciones.html'
})
export class CondicionesDescuentosComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovPersonasComponent)
  lovPersonas: LovPersonasComponent;

  @ViewChild(LovOperacionCarteraComponent)
  lovOperacion: LovOperacionCarteraComponent;

  public checkableConyuge = false;
  public lsueldo: any = [];

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcarOperacionDescuentos', 'CONDICIONESDESCUENTOS', true, true);
    this.componentehijo = this;
  }

  ngOnInit() {
    super.init();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.verreg = 0;
  }

  habilitarEdicion() {
    if (this.estaVacio(this.mfiltros.coperacion)) {
      super.mostrarMensajeInfo('NÚMERO DE OPERACIÓN REQUERIDA');
      return;
    }

    return super.habilitarEdicion();
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (this.estaVacio(this.mfiltros.coperacion)) {
      super.mostrarMensajeInfo('NÚMERO DE OPERACIÓN REQUERIDA');
      return;
    }
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.mfiltros.verreg = 0;
    const consulta = new Consulta(this.entityBean, 'Y', 't.coperacion', this.mfiltros, this.mfiltrosesp);
    this.addConsulta(consulta);
    return consulta;
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    if (resp.CONDICIONESDESCUENTOS !== null && resp.CONDICIONESDESCUENTOS.length > 0) {
      this.marcarCuenta(resp.CONDICIONESDESCUENTOS[0].autorizacion);
      this.checkableConyuge = resp.CONDICIONESDESCUENTOS[0].descuentoconyuge;
    }
    this.registro.comentario = null;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    if (this.checkableConyuge) {
      if (this.registro.porcentajeconyuge === null) {
        super.mostrarMensajeWarn('NO HA REGISTRADO PORCENTAJE DE DESCUENTO DE CÓNYUGE');
        return;
      }
      if (this.registro.porcentajeconyuge <= 0 || this.registro.porcentajeconyuge > 100) {
        super.mostrarMensajeWarn('PORCENTAJE DE DESCUENTO DE CÓNYUGE DEBE ENCONTRARSE ENTRE 1 Y 100');
        return;
      }
    }

    this.lmantenimiento = []; // Encerar Mantenimiento
    this.registro.coperacion = this.mfiltros.coperacion;
    this.registro.cusuario = this.dtoServicios.mradicacion.cusuario;
    this.registro.fregistro = new Date(super.integerToFormatoFecha(this.dtoServicios.mradicacion.fcontable));

    this.crearDtoMantenimiento();
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  /**Muestra lov de personas */
  mostrarlovpersona(): void {
    this.lovPersonas.mfiltros.csocio = 1;
    this.lovPersonas.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.nombre = reg.registro.nombre;
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.identificacion = reg.registro.identificacion;

      this.lovOperacion.mfiltros.cpersona = this.mcampos.cpersona;
      this.lovOperacion.consultar();
      this.lovOperacion.showDialog();
    }
  }

  /**Muestra lov de operaciones */
  mostrarlovoperacion(): void {
    if (this.estaVacio(this.mcampos.cpersona)) {
      super.mostrarMensajeInfo('PERSONA REQUERIDA');
      return;
    }
    this.lovOperacion.mfiltros.cpersona = this.mcampos.cpersona;
    this.lovOperacion.showDialog();
  }


  /**Retorno de lov de operaciones. */
  fijarLovOperacionSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mfiltros.coperacion = reg.registro.coperacion;
      this.mcampos.nmoneda = reg.registro.mdatos.nmoneda;
      this.mcampos.ntipoprod = reg.registro.mdatos.nproducto + ' - ' + reg.registro.mdatos.ntipoproducto;
      this.mcampos.csolicitud = reg.registro.csolicitud;
      this.mcampos.cproducto = reg.registro.cproducto;
      this.mcampos.ctipoproducto = reg.registro.ctipoproducto;
      this.consultarSueldo()
      this.consultar();
    }
  }

  consultarSueldo(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.lsueldo = [];

    const mfiltrosSueldo: any = { 'cpersona': this.mcampos.cpersona, 'verreg': 0, 'cuentaprincipal' : true};
    const consultaSueldo = new Consulta('TperReferenciaBancaria', 'Y', 't.cpersona', mfiltrosSueldo, {});
    consultaSueldo.addSubquery('TgenCatalogoDetalle', 'nombre', 'ninstitucion', 'i.ccatalogo = t.tipoinstitucionccatalogo and i.cdetalle = t.tipoinstitucioncdetalle');
    consultaSueldo.addSubquery('TgenCatalogoDetalle', 'nombre', 'ntipocuenta', 'i.ccatalogo = t.tipocuentaccatalogo and i.cdetalle = t.tipocuentacdetalle');
    consultaSueldo.cantidad = 100;
    this.addConsultaPorAlias("SUELDO", consultaSueldo);

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta("C")).subscribe(
      resp => {
        this.lsueldo = resp.SUELDO;
      },
      error => {
        this.dtoServicios.manejoError(error);
      }
    );
  }


  marcarCuenta(value: boolean): void {
    if (value) {
      if (this.lsueldo !== undefined && this.lsueldo.length > 0) {
        this.registro.mdatos.ncuenta = this.lsueldo[0].mdatos.ninstitucion + '-' + this.lsueldo[0].mdatos.ntipocuenta + '-' + this.lsueldo[0].numero;
      } else {
        super.mostrarMensajeError('SOCIO NO REGISTRA INFORMACIÓN DE CUENTA');
        if (this.registro.autorizacion !== undefined) {
          this.registro.autorizacion = false;
        }
        return;
      }
    } else {
      super.encerarMensajes();
      this.registro.mdatos.ncuenta = null;
    }
  }

  marcarConyuge(value: boolean): void {
    this.checkableConyuge = value;
    this.registro.porcentajeconyuge = null;
  }

}
