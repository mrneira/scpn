import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../../../util/shared/componentes/base.component';
import { SelectItem } from 'primeng/primeng';
import { DocumentoDirective } from '../../../../../../../util/directivas/documento.directive';
import { LovNacionalidadesComponent } from '../../../../../../generales/lov/nacionalidades/componentes/lov.nacionalidades.component';
import { LovPersonasComponent } from '../../../../../../personas/lov/personas/componentes/lov.personas.component';
import { LovCuentasContablesComponent } from '../../../../../lov/cuentascontables/componentes/lov.cuentasContables.component';

@Component({
  selector: 'app-informacion-general-proveedor',
  templateUrl: '_informacionGeneral.html'
})
export class InformacionGeneralComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild(LovCuentasContablesComponent)
  lovCuentasContables: LovCuentasContablesComponent;

  @ViewChild(LovPersonasComponent)
  lovPersonas: LovPersonasComponent;

  public ltipoidentif: SelectItem[] = [{ label: '...', value: null }];
  public lestado: SelectItem[] = [{ label: '...', value: null }];
  public ltipoinsit: SelectItem[] = [{ label: '...', value: null }];
  public lactivecon: SelectItem[] = [{ label: '...', value: null }];
  
  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'tperproveedor', 'PROVEEDOR', true);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init();
    this.crearNuevo();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    super.crearNuevo();
    this.registro.optlock = 0;
    this.registro.verreg = 0;
    this.registro.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.registro.cliente = false;
    this.registro.tipoidentificacionccatalogo = 303;
    this.registro.tipoinstitucionccatalogo = 1021
    this.registro.estadoccatalogo = 1029;
    this.registro.estadoccdetalle = "N";
    this.registro.contribuyentespecial = false;
    this.registro.cusuarioing= this.dtoServicios.mradicacion.cusuario;
    this.registro.fingreso= this.fechaactual;
  }

  actualizar() {
    super.actualizar();
  }
  validarDocumento() {

    this.rqConsulta.CODIGOCONSULTA = 'VALPROVEEDOR';
    this.rqConsulta.mdatos.documento = this.registro.identificacion;
    this.rqConsulta.mdatos.tipo = this.registro.tipoidentificacioncdetalle;
    this.rqConsulta.mdatos.esnuevo = this.registro.esnuevo;
    this.rqConsulta.mdatos.cliente= false;

    this.msgs = [];
    this.dtoServicios.ejecutarConsultaRest(this.getRequestConsulta('C'))
      .subscribe(
        resp => {
         
          if (resp.cod != 'OK') {
            this.registro.identificacion=null;
            super.mostrarMensajeError(resp.msgusu);           
          }

        })
  }


  eliminar() {
    super.eliminar();
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'N', 't.cpersona', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('tperactividadeconomica', 'nombre', 'pactividad', 'i.cactividad = t.cactividad');
    consulta.addSubquery('tperpersonadetalle', 'nombre', 'contactonpersona', 'i.cpersona = t.contactocpersona and i.verreg = t.verreg');
    consulta.addSubquery('"tconcatalogo"', 'nombre', 'ccuentaContable', 'i.ccuenta = t.ccuenta');
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.mfiltros.verreg = 0; 
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosConsulta();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {

    if (this.registro.identificacion == null) {
      super.mostrarMensajeError('IDENTIFICACIÓN DE PROVEEDOR REQUERIDA');
      return;
    }

    if (this.registro.nombre == null) {
      super.mostrarMensajeError('NOMBRE DE PROVEEDOR REQUERIDO');
      return;
    }

    if (this.registro.cactividad == null) {
      super.mostrarMensajeError('ACTIVIDAD ECONOMICA DE PROVEEDOR REQUERIDA');
      return;
    }

    if (this.registro.tipoidentificacioncdetalle == null) {
      super.mostrarMensajeError('TIPO DE IDENTIFICACIÓN DE PROVEEDOR REQUERIDO');
      return;
    }

    if (this.registro.estadoccdetalle == null) {
      super.mostrarMensajeError('ESTADO DE PROVEEDOR REQUERIDO');
      return;
    }

    if (this.registro.tipoinstitucioncdetalle == null) {
      super.mostrarMensajeError('TIPO DE INSTITUCIÓN DE PROVEEDOR REQUERIDO');
      return;
    }

    this.actualizar();
    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    // para adicionar otros entity bean super.addMantenimientoPorAlias("alias",mantenimiento);  pude ser de otros componentes
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  validaGrabar() {
    return super.validaGrabar('NO HA REALIZADADO LA VALIDACIÓN DEL FORMULARIO[INFORMACION GENERAL]');
  }

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
  }

  /**Muestra lov de personas contacto */
  mostrarLovPersonaContacto(): void {
    this.lovPersonas.showDialog();
  }

  /**Retorno de lov de personas contacto. */
  fijarLovPersonaContacto(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.contactocpersona = reg.registro.cpersona;
      this.mcampos.contactonpersona = reg.registro.nombre;

      this.registro.contactocpersona = reg.registro.cpersona;
      this.registro.contactoccompania = reg.registro.ccompania;
    }
  }

  /**Muestra lov de cuentas contables */
  mostrarlovcuentasContables(): void {
    this.lovCuentasContables.showDialog(true);
  }

  /**Retorno de lov de cuentas contables. */
  fijarLovCuentasContablesSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.registro.ccuenta = reg.registro.ccuenta;
      this.mcampos.ncuentacontable = reg.registro.nombre;
    }
  }
  
  limpiarlovcuentacontable(): void{
    this.registro.ccuenta = undefined;
    this.mcampos.ncuentacontable = '';
  }
}
