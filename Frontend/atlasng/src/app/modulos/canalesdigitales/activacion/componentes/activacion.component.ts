import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from './../../../../util/servicios/dto.servicios';
import { Consulta } from './../../../../util/dto/dto.component';
import { BaseComponent } from './../../../../util/shared/componentes/base.component';
import { LovPersonasComponent } from './../../../personas/lov/personas/componentes/lov.personas.component';
import { JasperComponent } from 'app/util/componentes/jasper/componentes/jasper.component';

@Component({
  selector: 'app-activacion',
  templateUrl: 'activacion.html'
})
export class ActivacionComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('formFiltros') formFiltros: NgForm;

  @ViewChild(JasperComponent)
  public jasper: JasperComponent;

  @ViewChild(LovPersonasComponent)
  private lovPersonas: LovPersonasComponent;

  private estatuscusuariocdetalleanterior;

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TcanActivacion', 'TCANACTIVACION', true);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init(this.formFiltros);
  }

  ngAfterViewInit() {
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  habilitarEdicion() {
    if (this.estaVacio(this.mcampos.cpersona)) {
      this.mostrarMensajeError('USUARIO REQUERIDO');
      return;
    }
    super.habilitarEdicion();
  }

  // Inicia CONSULTA *********************
  consultar() {
    this.crearDtoConsulta();
    super.consultar();
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta('tperpersonadetalle', 'N', 't.identificacion', this.mfiltros, this.mfiltrosesp);
    consulta.addSubquery('TsocCesantia', 'credencial', 'credencial', 'i.cpersona=t.cpersona and i.verreg=0');
    consulta.addSubquery('TcanActivacion', 'activo', 'activo', 'i.cpersona=t.cpersona');
    consulta.addSubquery('TcanUsuario', 'estadodetalle', 'estadousuario', 'i.cpersona=t.cpersona');
    this.addConsulta(consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.cpersona = this.mcampos.cpersona;
    this.mfiltros.verreg = 0;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    this.registro.activo = resp[this.alias].mdatos.activo;
    this.registro.esnuevo = true;
  }

  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    if (!this.validaUsuarioRequerido()) {
      return;
    }

    this.rqMantenimiento.mdatos.clave = false;
    this.registro.mdatos.celular = this.registro.celular;
    this.registro.mdatos.email = this.registro.email;

    this.lmantenimiento = []; // Encerar Mantenimiento
    this.crearDtoMantenimiento();
    super.grabar();
  }

  grabarClave(): void {
    this.rqMantenimiento.mdatos.clave = true;
    this.registro.mdatos.cpersona = this.registro.cpersona;
    super.grabar();
  }

  public crearDtoMantenimiento() {
    const mantenimiento = super.getMantenimiento(1);
    super.addMantenimientoPorAlias(this.alias, mantenimiento);
  }

  public postCommit(resp: any) {
    if (resp.cod === 'OK') {
      this.registro = { 'mdatos': {} };
      this.mcampos = { camposfecha: {} };
    }
    super.postCommitEntityBean(resp);
  }

  validaGrabar() {
    return super.validaGrabar();
  }

  validaUsuarioRequerido(): boolean {
    if (this.estaVacio(this.registro.cpersona)) {
      this.mostrarMensajeError('PERSONA ES REQUERIDO');
      return false;
    }

    if (this.estaVacio(this.registro.mdatos.credencial)) {
      this.mostrarMensajeError('PERSONA NO TIENE CREDENCIAL');
      return false;
    }

    if (this.estaVacio(this.registro.celular)) {
      this.mostrarMensajeError('CELULAR ES REQUERIDO');
      return false;
    }

    if (this.estaVacio(this.registro.email)) {
      this.mostrarMensajeError('CORREO ELECTRÓNICO ES REQUERIDO');
      return false;
    }

    if (super.estaVacio(this.registro.activo) || this.registro.activo === false) {
      this.mostrarMensajeError('ACEPTACIÓN DE TÉRMINOS Y CONDICIONES ES REQUERIDO');
      return false;
    }
    return true;
  }

  /**Muestra lov de personas */
  mostrarLovPersona(): void {
    this.lovPersonas.mfiltros.csocio = 1;
    this.lovPersonas.showDialog();
  }

  /**Retorno de lov de personas. */
  fijarLovPersonaSelec(reg: any): void {
    if (reg.registro !== undefined) {
      this.mcampos.cpersona = reg.registro.cpersona;
      this.mcampos.identificacion = reg.registro.identificacion;
      this.mcampos.nombre = reg.registro.nombre;
      this.consultar();
    }
  }

  reenviarCredenciales() {
    const cmoduloorg = sessionStorage.getItem('m');
    const ctransaccionorg = sessionStorage.getItem('t');
    this.rqMantenimiento['CODMODULOORIGEN'] = cmoduloorg;
    this.rqMantenimiento['CODTRANSACCIONORIGEN'] = ctransaccionorg;
    this.rqMantenimiento['cmodulo'] = 30;
    this.rqMantenimiento['ctransaccion'] = 3;

    this.rqMantenimiento.cpersona = this.mcampos.cpersona;
    this.rqMantenimiento.credencial = this.registro.mdatos.credencial;
    const rqMan = this.getRequestMantenimiento();
    this.dtoServicios.ejecutarRestMantenimiento(rqMan).subscribe((resp: any) => {
      if (resp.cod === 'OK') {
        super.mostrarMensajeSuccess("Credenciales enviadas con éxito")
      } else {
        super.mostrarMensajeError(resp.msgusu);
      }
    }, error => {
        this.dtoServicios.manejoError(error);
    });
  }

  //#region Reporte
  descargarReporte() {
    console.log(this.mcampos);
    if (this.estaVacio(this.mcampos.cpersona)) {
      this.mostrarMensajeError("DEBE SELECCIONAR LA PERSONA A GENERAR EL CERTIFICADO");
      return;
    }
    this.jasper.nombreArchivo = 'AutorizacionCanales';
    // Agregar parametros
    this.jasper.parametros['@i_cpersona'] = this.mcampos.cpersona + "";
    this.jasper.parametros['@i_usuario'] = this.dtoServicios.mradicacion.np;
    this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/CanalesDigitales/AutorizacionCanales';
    this.jasper.formatoexportar = 'pdf';
    //this.jasper.generaReporteCore();
  }
  //#endregion
}
