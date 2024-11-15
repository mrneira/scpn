import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { LovClientesComponent } from '../../../lov/clientes/componentes/lov.clientes.component';
import { LovPersonasComponent } from '../../../../personas/lov/personas/componentes/lov.personas.component';
import { LovCuentasContablesComponent } from '../../../lov/cuentascontables/componentes/lov.cuentasContables.component';

import { InformacionGeneralComponent } from '../submodulos/infgeneral/componentes/_informacionGeneral.component';
import { PersonaClienteComponent } from '../submodulos/infgeneral/componentes/_personaCliente.component';
import { ClienteDireccionComponent } from '../submodulos/direccion/componentes/_clienteDireccion.component';
import { ClienteRefBancariaComponent } from '../submodulos/refbancaria/componentes/_clienteRefBancaria.component';

import { DocumentoDirective } from '../../../../../util/directivas/documento.directive';

@Component({
  selector: 'app-clientes',
  templateUrl: 'clientes.html'
})
export class ClientesComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(LovCuentasContablesComponent)
  lovCuentasContables: LovCuentasContablesComponent;

  @ViewChild(LovClientesComponent)
  private lovClientes: LovClientesComponent;

  @ViewChild(LovPersonasComponent)
  lovPersonas: LovPersonasComponent;

  @ViewChild(InformacionGeneralComponent)
  informacionGeneralComponent: InformacionGeneralComponent;
  @ViewChild(PersonaClienteComponent)
  personaClienteComponent: PersonaClienteComponent;

  @ViewChild(ClienteDireccionComponent)
  clienteDireccionComponent: ClienteDireccionComponent;

  @ViewChild(ClienteRefBancariaComponent)
  clienteRefBancariaComponent: ClienteRefBancariaComponent;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ABSTRACT', 'CREACLIENTEES', false);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);

    this.consultarCatalogos();
  }

  ngAfterViewInit() {
    //    this.clienteRefBancariaComponent.mfiltros.cpersona = 0;
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
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta() {
    this.fijarFiltrosConsulta();
    // Consulta datos.
    const conPersonaNatural = this.personaClienteComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.personaClienteComponent.alias, conPersonaNatural);

    const conRefBancariaDireccion = this.clienteRefBancariaComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.clienteRefBancariaComponent.alias, conRefBancariaDireccion);

    const conPersonaDireccion = this.clienteDireccionComponent.crearDtoConsulta();
    this.addConsultaPorAlias(this.clienteDireccionComponent.alias, conPersonaDireccion);

  }

  private fijarFiltrosConsulta() {
    this.personaClienteComponent.fijarFiltrosConsulta();
    this.clienteRefBancariaComponent.fijarFiltrosConsulta();
    this.clienteDireccionComponent.fijarFiltrosConsulta();
  }

  validaFiltrosConsulta(): boolean {
    return this.personaClienteComponent.validaFiltrosConsulta()
      && this.clienteRefBancariaComponent.validaFiltrosConsulta()
      && this.clienteDireccionComponent.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    this.personaClienteComponent.postQuery(resp);
    this.clienteRefBancariaComponent.postQuery(resp);
    this.clienteDireccionComponent.postQuery(resp);
  }

  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    this.lmantenimiento = []; // Encerar Mantenimiento

    if (this.personaClienteComponent.registro.identificacion == null) {
      super.mostrarMensajeError('IDENTIFICACIÓN DE CLIENTE REQUERIDA');
      return;
    }

   

    if (this.personaClienteComponent.registro.nombre == null) {
      super.mostrarMensajeError('NOMBRE DE CLIENTE REQUERIDO');
      return;
    }

    if (this.personaClienteComponent.registro.cactividad == null) {
      super.mostrarMensajeError('ACTIVIDAD ECONOMICA DE CLIENTE REQUERIDA');
      return;
    }

    if (this.personaClienteComponent.registro.tipoidentificacioncdetalle == null) {
      super.mostrarMensajeError('TIPO DE IDENTIFICACIÓN DE CLIENTE REQUERIDO');
      return;
    }

    if (this.personaClienteComponent.registro.estadoccdetalle == null) {
      super.mostrarMensajeError('ESTADO DE CLIENTE REQUERIDO');
      return;
    }

    if (this.personaClienteComponent.registro.tipoinstitucioncdetalle == null) {
      super.mostrarMensajeError('TIPO DE INSTITUCIÓN DE CLIENTE REQUERIDO');
      return;
    }
    // if (this.personaClienteComponent.registro.contactocpersona == null) {
    //   super.mostrarMensajeError('CONTACTO DE CLIENTE REQUERIDO');
    //   return;
    // }

    if(this.personaClienteComponent.registro.cpersona != undefined){
      var cp = 0;
      this.clienteRefBancariaComponent.lregistros.forEach(element => {
        if(element.cuentaprincipal) cp++;
      });
      if(cp!=1){
        super.mostrarMensajeError('DEBE ESPECIFICAR 1 CUENTA COMO PRINCIPAL');
        return;
      }
    }

    super.addMantenimientoPorAlias(this.personaClienteComponent.alias, this.personaClienteComponent.getMantenimiento(1));
    super.addMantenimientoPorAlias(this.clienteRefBancariaComponent.alias, this.clienteRefBancariaComponent.getMantenimiento(2));
    super.addMantenimientoPorAlias(this.clienteDireccionComponent.alias, this.clienteDireccionComponent.getMantenimiento(3));

    this.rqMantenimiento.cpersona = this.personaClienteComponent.registro.cpersona;
    // para adicionar otros entity bean super.addMantenimientoPorAlias('alias',mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    // No existe para el padre
  }

  validaGrabar() {
    return this.personaClienteComponent.validaGrabar()
      && this.clienteRefBancariaComponent.validaGrabar()
      && this.clienteDireccionComponent.validaGrabar();
  }

  public postCommit(resp: any) {
    this.clienteRefBancariaComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.clienteRefBancariaComponent.alias));
    this.clienteDireccionComponent.postCommitEntityBean(resp, this.getDtoMantenimiento(this.clienteDireccionComponent.alias));

    if (resp.cpersona !== undefined){
      super.mostrarMensajeSuccess("TRANSACCION FINALIZADA CORRECTAMENTE");
      this.personaClienteComponent.mfiltros.cpersona = resp.cpersona;
      this.clienteRefBancariaComponent.mfiltros.cpersona = resp.cpersona;
      this.clienteDireccionComponent.mfiltros.cpersona = resp.cpersona;      
    }else{
      super.mostrarMensajeError(resp.msgusu);
      return;
    }
    
    // this.personaClienteComponent.postCommit(resp);
    // this.personaClienteComponent.postCommitEntityBean(resp);
    // this.clienteRefBancariaComponent.postCommit(resp);
    // this.clienteRefBancariaComponent.postCommitEntityBean(resp);
    // this.clienteDireccionComponent.postCommit(resp);
    // this.clienteDireccionComponent.postCommitEntityBean(resp);

    this.enproceso = false;
    this.consultar();
  }

  /**Muestra lov de clientes */
  mostrarLovClientes(): void {
    // this.lovPersonas.mfiltros.CLIENTE = true;
    this.lovClientes.showDialog();
  }

  /**Retorno de lov de clientes. */
  fijarLovClientesSelect(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.npersona = reg.registro.nombre;

      this.personaClienteComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.clienteDireccionComponent.mfiltros.cpersona = reg.registro.cpersona;
      this.clienteRefBancariaComponent.mfiltros.cpersona = reg.registro.cpersona;

      this.personaClienteComponent.registro.cpersona = reg.registro.cpersona;
      this.clienteDireccionComponent.registro.cpersona = reg.registro.cpersona;
      this.clienteRefBancariaComponent.registro.cpersona = reg.registro.cpersona;

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

    const mfiltroESTADO: any = { 'ccatalogo': 1030 };
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
      this.llenaListaCatalogo(this.clienteDireccionComponent.ltipodireccion, resp.TIPDIRECCION, 'cdetalle');
      this.llenaListaCatalogo(this.clienteRefBancariaComponent.linstfinanciera, resp.INSFIN, 'cdetalle');
      this.llenaListaCatalogo(this.clienteRefBancariaComponent.ltipocuenta, resp.TIPCUENTA, 'cdetalle');

      this.llenaListaCatalogo(this.personaClienteComponent.ltipoidentif, resp.TIPOIDENTIF, 'cdetalle');
      this.llenaListaCatalogo(this.personaClienteComponent.lestado, resp.ESTADO, 'cdetalle');
      this.llenaListaCatalogo(this.personaClienteComponent.ltipoinsit, resp.TIPOINSTIT, 'cdetalle');
      this.llenaListaCatalogo(this.personaClienteComponent.lactivecon, resp.ACTIVECON, 'cactividad');
    }
    this.lconsulta = [];
  }
}
