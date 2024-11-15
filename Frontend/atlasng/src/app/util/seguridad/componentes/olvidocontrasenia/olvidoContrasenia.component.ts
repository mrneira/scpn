import {Component, NgModule, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {Message, PasswordModule} from 'primeng/primeng';

import {DtoServicios} from '../../../../util/servicios/dto.servicios';
import {AppService} from '../../../../util/servicios/app.service';
import {ImpresionService} from '../../../servicios/impresion.service';


@Component({
  selector: 'app-olvido-contrasenia',
  templateUrl: './olvidoContrasenia.component.html'
})
export class OlvidoContraseniaComponent implements OnInit {

  /**Control de ejecucion del otp, previene que se ejecute varias veces el boton del otp. */
  private enejecucion = false;

  public cseg = null;
  /**Objeto que contine mensajes aplicativos. */
  msgs: Message[] = [];

  constructor(private router: Router, private dtoServicios: DtoServicios, public appService: AppService, public impresionService: ImpresionService) {}

  ngOnInit() {

  }

  /**Invoca al core para realizar la validaicon del olvido de contrasenia. */
  ejecutaValidacionOlvContr() {
    this.msgs = [];
    if (this.enejecucion) {
      return;
    }
    this.appService.login = true;
    this.appService.validarotp = true;
    this.dtoServicios.ejecutarRecuperarContrasenia(this.cseg, 'OFI', '16')
      .subscribe(
      resp => {
        this.manejaRespuestaLogin(resp);
        this.enejecucion = false;
      },
      error => {
        this.enejecucion = false;
        this.dtoServicios.manejoError(error);
      });
  }

  /**Manejo respuesta de ejecucion de login. */
  private manejaRespuestaLogin(resp: any) {
    this.msgs = [];
    if (resp.cod === 'OK') {
      this.appService.modelo = {};
      if (resp.validarclavetemp !== null && resp.validarclavetemp !== undefined) {
        this.appService.validarclavetemp = resp.validarclavetemp;
        //sessionStorage.setItem('validarclavetemp', resp.validarclavetemp + '');
        this.msgs.push({severity: 'success', summary: 'TRANSACCIÓN CORRECTA '});
        this.msgs.push({severity: 'success', summary: 'REVISAR SU EMAIL CON SU CONTRASEÑA TEMPORAL'});
        this.dtoServicios.mostrarMensaje(this.msgs);

      } else {
        this.appService.validarclavetemp = false;
        // sessionStorage.setItem('validarclavetemp', 'false');
      }

      this.inicializarAmbiente(resp); // manejo de respuesta

    }
    if (resp.cod !== 'OK') {
      let msg = '';
      //msg = resp.cod !== undefined ? msg = msg + resp.cod + ' ' : msg + ' ';
      msg = resp.msgusu !== undefined ? msg = msg + resp.msgusu : msg + '';
      if (resp.cod === 'SEG-001') {
        this.msgs.push({severity: 'error', summary: 'NO EXISTE USUARIO CON CÉDULA:  ' + this.cseg});
      }
      else {
        this.msgs.push({severity: 'error', summary: msg});
      }
      this.dtoServicios.mostrarMensaje(this.msgs);
      // this.dtoServicios.llenarMensaje(resp, false);
    }
  }

  /**Fija datos de respuesta cuando el login es exitoso. */
  private inicializarAmbiente(resp: any) {
    const mradicacion = resp.mradicacion;
    this.impresionService.hostnameimpresora = resp.impresoraslip;
    //  cia^suc^ofi^usr^perfil^idioma^canal^ipaddress
    let c: string;
    const ip = document.domain === 'localhost' ? '127.0.0.1' : document.domain;
    //  Lista de roles del usuario.
    this.appService.llenarRolesUsuario(mradicacion.roles);

    c = mradicacion.cc + '^' + mradicacion.cs + '^' + mradicacion.cag + '^' + mradicacion.cu + '^';
    c = c + mradicacion.roles[0].id + '^' + mradicacion.ci + '^' + mradicacion.cca;
    sessionStorage.setItem('c', c);
    sessionStorage.setItem('mradicacion', JSON.stringify(mradicacion));
    // delete mradicacion.roles;

    // ejecuta consulta del menu del primer rol
    this.appService.consultarMenu();

    // Fija datos de radicacion del usuario en el singleton de servicios.
    this.dtoServicios.actualizarRadicacion(mradicacion);

    // Verifica el cambio de password
    //  this.validaCambioPassword(mradicacion);

    if (!this.appService.validarotp && !this.appService.cambiopassword) {
      this.msgs.push({severity: 'success', summary: 'INGRESO EXITOSO, BIENVENIDO: ' + this.dtoServicios.mradicacion.cusuario, detail: ''});
      this.dtoServicios.mostrarMensaje(this.msgs);
    } else {
      this.msgs.push({severity: 'success', summary: 'LOGIN EXITOSO, VALIDACIÓN DOBLE FACTOR DE AUTENTICACIÓN (2FA)', detail: ''});
      this.dtoServicios.mostrarMensaje(this.msgs);
    }
  }

  public cancelar() {
    this.dtoServicios.encerarCredencialesLogin();
    location.reload();
  }

}
