import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { DocumentoDirective } from '../../../../../util/directivas/documento.directive';

import { LovProveedoresComponent } from '../../../lov/proveedores/componentes/lov.proveedores.component';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';
import { LovCuentasContablesComponent } from '../../../lov/cuentascontables/componentes/lov.cuentasContables.component';

import { InformacionGeneralComponent } from '../submodulos/infgeneral/componentes/_informacionGeneral.component';
import { ProveedorDireccionComponent } from '../submodulos/direccion/componentes/_proveedorDireccion.component';
import { ProveedorRefBancariaComponent } from '../submodulos/refbancaria/componentes/_proveedorRefBancaria.component';

@Component({
  selector: 'app-proveedores',
  templateUrl: 'proveedores.html'
})
export class ProveedoresComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovCuentasContablesComponent)
  lovCuentasContables: LovCuentasContablesComponent;

  @ViewChild(LovProveedoresComponent)
  lovProveedores: LovProveedoresComponent;

  @ViewChild(LovPersonasComponent)
  lovPersonas: LovPersonasComponent;

  @ViewChild(InformacionGeneralComponent)
  infGeneral: InformacionGeneralComponent;

  @ViewChild(ProveedorDireccionComponent)
  direcciones: ProveedorDireccionComponent;

  @ViewChild(ProveedorRefBancariaComponent)
  refsBancarias: ProveedorRefBancariaComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CREAPROVEEDORES', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
    this.consultarCatalogos();
  }

  ngAfterViewInit() {
  }

  selectRegistro(registro: any) {
    // No existe para el padre
  }

  crearNuevo() {
    // No existe para el padre
  }

  actualizar() {
    // No existe para el padre
  }

  eliminar() {
    // No existe para el padre
  }

  cancelar() {
    // No existe para el padre
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.lconsulta = [];
    this.rqConsulta = { 'mdatos': {} };
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    // Consulta datos
    this.addConsultaPorAlias(this.infGeneral.alias, this.infGeneral.crearDtoConsulta());
    this.addConsultaPorAlias(this.refsBancarias.alias, this.refsBancarias.crearDtoConsulta());
    this.addConsultaPorAlias(this.direcciones.alias, this.direcciones.crearDtoConsulta());
  }

  private fijarFiltrosConsulta() {
    this.infGeneral.fijarFiltrosConsulta();
    this.refsBancarias.fijarFiltrosConsulta();
    this.direcciones.fijarFiltrosConsulta();
  }

  validaFiltrosConsulta(): boolean {
    return this.infGeneral.validaFiltrosRequeridos()
      && this.refsBancarias.validaFiltrosRequeridos()
      && this.direcciones.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.infGeneral.postQuery(resp);
    this.refsBancarias.postQuery(resp);
    this.direcciones.postQuery(resp);
  }

  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento

    if (this.infGeneral.registro.identificacion == null) {
      super.mostrarMensajeError('IDENTIFICACIÓN DE PROVEEDOR REQUERIDA');
      return;
    }

    if (this.infGeneral.registro.nombre == null) {
      super.mostrarMensajeError('NOMBRE DE PROVEEDOR REQUERIDO');
      return;
    }

    if (this.infGeneral.registro.cactividad == null) {
      super.mostrarMensajeError('ACTIVIDAD ECONOMICA DE PROVEEDOR REQUERIDA');
      return;
    }

    if (this.infGeneral.registro.tipoidentificacioncdetalle == null) {
      super.mostrarMensajeError('TIPO DE IDENTIFICACIÓN DE PROVEEDOR REQUERIDO');
      return;
    }

    if (this.infGeneral.registro.estadoccdetalle == null) {
      super.mostrarMensajeError('ESTADO DE PROVEEDOR REQUERIDO');
      return;
    }

    if (this.infGeneral.registro.tipoinstitucioncdetalle == null) {
      super.mostrarMensajeError('TIPO DE INSTITUCIÓN DE PROVEEDOR REQUERIDO');
      return;
    }

    if (this.infGeneral.registro.cpersona != undefined) {
      var cp = 0;
      this.refsBancarias.lregistros.forEach(element => {
        if (element.cuentaprincipal) cp++;
      });
      if (cp != 1) {
        super.mostrarMensajeError('DEBE ESPECIFICAR 1 CUENTA COMO PRINCIPAL');
        return;
      }
    }

    super.addMantenimientoPorAlias(this.infGeneral.alias, this.infGeneral.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.refsBancarias.alias, this.refsBancarias.getMantenimiento(2));
    super.addMantenimientoPorAlias(this.direcciones.alias, this.direcciones.getMantenimiento(3));
    this.rqMantenimiento.cpersona = this.infGeneral.registro.cpersona !== undefined ?
      this.infGeneral.registro.cpersona : 0;
    // para adicionar otros entity bean super.addMantenimientoPorAlias('alias',mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  validaGrabar() {
    return this.infGeneral.validaGrabar()
      && this.refsBancarias.validaGrabar()
      && this.direcciones.validaGrabar();
  }

  public postCommit(resp: any) {

    this.direcciones.postCommitEntityBean(resp, this.getDtoMantenimiento(this.direcciones.alias));
    this.refsBancarias.postCommitEntityBean(resp, this.getDtoMantenimiento(this.refsBancarias.alias));

    if (resp.cpersona !== undefined) {
      super.mostrarMensajeSuccess("TRANSACCION FINALIZADA CORRECTAMENTE");
      this.infGeneral.mfiltros.cpersona = resp.cpersona;
      this.direcciones.mfiltros.cpersona = resp.cpersona;
      this.refsBancarias.mfiltros.cpersona = resp.cpersona;
    }else{
      super.mostrarMensajeError(resp.msgusu);
      return;
    }

    this.enproceso = false;
    this.consultar();
  }

  /**Muestra lov de proveedores */
  mostrarLovProveedores(): void {
    this.lovProveedores.showDialog();
  }

  /**Retorno de lov de proveedores. */
  fijarLovProveedoresSelect(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.npersona = reg.registro.nombre;

      this.infGeneral.mfiltros.cpersona = reg.registro.cpersona;
      this.direcciones.mfiltros.cpersona = reg.registro.cpersona;
      this.refsBancarias.mfiltros.cpersona = reg.registro.cpersona;

      this.infGeneral.registro.cpersona = reg.registro.cpersona;
      this.direcciones.registro.cpersona = reg.registro.cpersona;
      this.refsBancarias.registro.cpersona = reg.registro.cpersona;

      this.consultar();
    }
  }

  consultarCatalogos(): any {
    this.msgs = [];
    this.lconsulta = [];
    this.llenarConsultaCatalogos();

    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
          this.encerarMensajes();
          this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
          this.manejaRespuestaCatalogos(resp);
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  llenarConsultaCatalogos(): void {
    const mfiltroInsFin: any = { 'ccatalogo': 305,'activo': true };
    const consultaInsFin = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroInsFin, {});
    consultaInsFin.cantidad = 500;
    this.addConsultaPorAlias('INSFIN', consultaInsFin);

    const mfiltroTipoCuenta: any = { 'ccatalogo': 306 };
    const consultaTipoCuenta = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroTipoCuenta, {});
    consultaTipoCuenta.cantidad = 20;
    this.addConsultaPorAlias('TIPCUENTA', consultaTipoCuenta);

    const mfiltrosTipoDirec: any = { 'ccatalogo': 304 };
    const mfiltrosespTipoDirec: any = { 'cdetalle': null };
    const consultaTipoDirec = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltrosTipoDirec, mfiltrosespTipoDirec);
    consultaTipoDirec.cantidad = 50;
    this.addConsultaPorAlias('TIPDIRECCION', consultaTipoDirec);

    
    const mfiltroTIPOIDENTIF: any = { 'ccatalogo': 303 };
    const consultaTIPOIDENTIF = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroTIPOIDENTIF, {});
    consultaTIPOIDENTIF.cantidad = 50;
    this.addConsultaPorAlias('TIPOIDENTIF', consultaTIPOIDENTIF);

    const mfiltroESTADO: any = { 'ccatalogo': 1029 };
    const consultaESTADO = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroESTADO, {});
    consultaESTADO.cantidad = 50;
    this.addConsultaPorAlias('ESTADO', consultaESTADO);

    const mfiltroTIPOINSTIT: any = { 'ccatalogo': 1021 };
    const consultaTIPOINSTIT = new Consulta('tgencatalogodetalle', 'Y', 't.nombre', mfiltroTIPOINSTIT, {});
    consultaTIPOINSTIT.cantidad = 50;
    this.addConsultaPorAlias('TIPOINSTIT', consultaTIPOINSTIT);

    const mfiltroACTIVECON: any = {};
    const consultaACTIVECON = new Consulta('tperactividadeconomica', 'Y', 't.cactividad', mfiltroACTIVECON, {});
    consultaACTIVECON.cantidad = 50;
    this.addConsultaPorAlias('ACTIVECON', consultaACTIVECON);
  }

  /**Manejo respuesta de consulta de catalogos. */
  private manejaRespuestaCatalogos(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.llenaListaCatalogo(this.direcciones.ltipodireccion, resp.TIPDIRECCION, 'cdetalle');
      this.llenaListaCatalogo(this.refsBancarias.linstfinanciera, resp.INSFIN, 'cdetalle');
      this.llenaListaCatalogo(this.refsBancarias.ltipocuenta, resp.TIPCUENTA, 'cdetalle');

      this.llenaListaCatalogo(this.infGeneral.ltipoidentif, resp.TIPOIDENTIF, 'cdetalle');
      this.llenaListaCatalogo(this.infGeneral.lestado, resp.ESTADO, 'cdetalle');
      this.llenaListaCatalogo(this.infGeneral.ltipoinsit, resp.TIPOINSTIT, 'cdetalle');
      this.llenaListaCatalogo(this.infGeneral.lactivecon, resp.ACTIVECON, 'cactividad');
    }
    this.lconsulta = [];
  }

}
