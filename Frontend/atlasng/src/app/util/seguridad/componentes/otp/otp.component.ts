import { Component, NgModule, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Message, PasswordModule } from 'primeng/primeng';

import { DtoServicios } from '../../../../util/servicios/dto.servicios';
import { AppService } from '../../../../util/servicios/app.service';
import { ImpresionService } from '../../../servicios/impresion.service';


@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html'
})
export class OtpComponent implements OnInit {

  /**Control de ejecucion del otp, previene que se ejecute varias veces el boton del otp. */
  private enejecucion = false;

  public cseg = null;
  /**Objeto que contine mensajes aplicativos. */
  msgs: Message[] = [];

  constructor(private router: Router, private dtoServicios: DtoServicios, public appService: AppService, public impresionService: ImpresionService) { }

  ngOnInit() {

  }

  /**Invoca al core para realizar la validaicon del otp. */
  ejecutaValidacionOtp() {
    this.msgs = [];
    if (this.enejecucion) {
      return;
    }
    this.enejecucion = true;

    const metadataMantenimiento = new Object();
    const cmoduloorg = sessionStorage.getItem('m');
    const ctransaccionorg = sessionStorage.getItem('t');
    metadataMantenimiento['CODMODULOORIGEN'] = cmoduloorg;
    metadataMantenimiento['CODTRANSACCIONORIGEN'] = ctransaccionorg;
    metadataMantenimiento['cmodulo'] = 2;
    metadataMantenimiento['ctransaccion'] = 0;
    metadataMantenimiento['claveotp'] = this.cseg;

    this.dtoServicios.ejecutarRestMantenimiento(metadataMantenimiento, '', 'validacionotp').subscribe(
        resp => {
          this.dtoServicios.llenarMensaje(resp, true);
          this.manejaRespuestaOtp(resp);
          this.enejecucion = false;
        },
        error => {
          this.enejecucion = false;
          this.dtoServicios.manejoError(error);
        }
    );
  }

  /**Manejo respuesta de ejecucion de login. */
  private manejaRespuestaOtp(resp: any) {
    const msgs = [];
    if (resp.cod === 'OK') {
      this.appService.modelo = {};
      if (resp.resultadovalidaotp !== null && resp.resultadovalidaotp !== undefined) {
        this.appService.validarotp = !resp.resultadovalidaotp;
        sessionStorage.setItem('validarotp', !resp.resultadovalidaotp + '');
      }

      if (!this.appService.validarotp && !this.appService.cambiopassword) {
        msgs.push({ severity: 'success', summary: 'INGRESO EXITOSO, BIENVENIDO: ' + this.dtoServicios.mradicacion.cusuario, detail: '' });
        this.dtoServicios.mostrarMensaje(msgs);
      }
      if (this.appService.cambiopassword) {
        msgs.push({ severity: 'success', summary: 'CAMBIO DE CONTRASEÑA REQUERIDO PARA EL USUARIO: ' + this.dtoServicios.mradicacion.cusuario, detail: '' });
        this.dtoServicios.mostrarMensaje(msgs);
      }
    }
  }

  public cancelar() {
    this.dtoServicios.encerarCredencialesLogin();
    location.reload();
  }

}
