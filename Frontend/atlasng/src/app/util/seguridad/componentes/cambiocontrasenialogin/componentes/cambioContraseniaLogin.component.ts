import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DtoServicios } from '../../../../../util/servicios/dto.servicios';
import { Consulta } from '../../../../../util/dto/dto.component';
import { Mantenimiento } from '../../../../../util/dto/dto.component';
import { BaseComponent } from '../../../../../util/shared/componentes/base.component';
import { AppService } from '../../../../servicios/app.service';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-cambio-contrasenia-login',
  templateUrl: 'cambioContraseniaLogin.html'
})
export class CambioContraseniaLoginComponent extends BaseComponent implements OnInit, AfterViewInit {

  politica: any = new Object();

  constructor(router: Router, dtoServicios: DtoServicios, public appService: AppService) {
    super(router, dtoServicios, 'TsegUsuarioDetalle', 'CAMBIOCONTRASENIA', true, true);
  }

  ngOnInit() {
    this.componentehijo = this;
    super.init();
  }

  ngAfterViewInit() {
  }

  crearNuevo() {
    // NO APLICA
  }

  actualizar() {
    super.actualizar();
  }

  eliminar() {
    // NO APLICA
  }

  cancelar() {
    super.cancelar();
  }

  public selectRegistro(registro: any) {
    super.selectRegistro(registro);
  }

  // Inicia CONSULTA *********************
  consultar() {
    if (this.estaVacio(this.dtoServicios.mradicacion)) {
      return;
    }

    if (this.dtoServicios.mradicacion.cusuario !== undefined && this.dtoServicios.mradicacion.cusuario != null) {
      this.mfiltros.cusuario = this.dtoServicios.mradicacion.cusuario;
    }
    this.rqConsulta.cmodulo = 2;
    this.rqConsulta.ctransaccion = 10;

    this.crearDtoConsulta();
    this.crearDtoConsultaPolitica();

    if (this.enproceso) {
      return; // Si esta en ejecucion al core no volver a consultar.
    }
    this.enproceso = true;
    // Objeto con que contiene 1..n beans a consultar
    const rq = this.getRequestConsulta('C');
    const appName = null;
    const metodo = null;
    this.dtoServicios.ejecutarConsultaRest(rq,appName,metodo).subscribe(
      resp => {
        if (resp.cod !== 'OK') {
          this.dtoServicios.llenarMensaje(resp, false); // solo presenta errores.
        }
        this.postQuery(resp);
        this.respuestacore = resp;
        this.enproceso = false;
      },
      error => {
        this.dtoServicios.manejoError(error);
        this.enproceso = false;
      }
    );
  }

  public crearDtoConsulta(): Consulta {
    this.fijarFiltrosConsulta();
    const consulta = new Consulta(this.entityBean, 'N', 't.cusuario', this.mfiltros, this.mfiltrosesp);
    this.addConsulta(consulta);
    return consulta;
  }

  public crearDtoConsultaPolitica(): Consulta {
    const mfiltrospol = new Object();
    mfiltrospol['ccompania'] = this.dtoServicios.mradicacion.ccompania;
    mfiltrospol['ccanal'] = 'OFI';

    const consulta = new Consulta(this.obtenerBean('TsegPolitica'), 'N', '', mfiltrospol, null);
    this.addConsultaPorAlias('POLITICA', consulta);
    return consulta;
  }

  public fijarFiltrosConsulta() {
    this.mfiltros.ccompania = this.dtoServicios.mradicacion.ccompania;
    this.mfiltros.verreg = 0;
  }

  validaFiltrosConsulta(): boolean {
    return super.validaFiltrosRequeridos();
  }

  /**Se llama automaticamente luego de ejecutar una consulta. */
  public postQuery(resp: any) {
    super.postQueryEntityBean(resp);
    this.politica = resp['POLITICA'];
    this.selectRegistro(this.registro);
  }
  // Fin CONSULTA *********************

  // Inicia MANTENIMIENTO *********************
  grabar(): void {
    if (this.mcampos.confirmarcon !== this.mcampos.nuevacon) {
      this.mostrarMensajeError('LAS CONSTRASEÑAS DEBEN SER IGUALES');
      return;
    }
    const newPass = this.mcampos.confirmarcon;
    this.rqMantenimiento.mdatos.bas64 = newPass;
    this.rqMantenimiento.mdatos.anteriorcon = this.mcampos.anteriorcon;
    this.rqMantenimiento.cmodulo = 2;
    this.rqMantenimiento.ctransaccion = 10;

    this.registro.cambiopassword = 0;

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

  public postCommit(resp: any) {
    super.postCommitEntityBean(resp);
    if (resp['cambioexitoso'] != null && resp['cambioexitoso'] === true) {
      this.appService.cambiopassword = false;
      this.dtoServicios.mradicacion['pss'] = '0';
      // Fija datos de radicacion del usuario en el singleton de servicios.
      sessionStorage.setItem('mradicacion', JSON.stringify(this.dtoServicios.mradicacion));
    }
  }

  public cancelarCambio() {
    this.dtoServicios.encerarCredencialesLogin();
    location.reload();
  }

}
