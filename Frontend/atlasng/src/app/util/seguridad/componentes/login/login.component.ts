import {Component, NgModule, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {Message, PasswordModule} from 'primeng/primeng';

import {DtoServicios} from '../../../../util/servicios/dto.servicios';
import {AppService} from '../../../../util/servicios/app.service';
import {ImpresionService} from '../../../servicios/impresion.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  /**Control de ejecucion del login, previene que se ejecute varias veces el boton del login. */
  private enejecucion = false;
  /**Objeto que contine mensajes aplicativos. */
  msgs: Message[] = [];

  constructor(private router: Router, private dtoServicios: DtoServicios, public appService: AppService, public impresionService: ImpresionService) {}

  ngOnInit() {
    // consulta la ip local
    this.dtoServicios.consultarIpLocal();
  }

  /**Invoca al core para realizar login de la aplicacion. */
  ejecutalogin() {
    this.msgs = [];
    if (this.enejecucion) {
      return;
    }
    this.enejecucion = true;
    this.appService.login = false;
    this.dtoServicios.ejecutarLogin(this.appService.modelo.u, this.appService.modelo.p, 'OFI', '1')
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
      if (resp.validarotp !== null && resp.validarotp !== undefined) {
        this.appService.validarotp = resp.validarotp;
        sessionStorage.setItem('validarotp', resp.validarotp + '');
      } else {
        this.appService.validarotp = false;
        sessionStorage.setItem('validarotp', 'false');
      }
      this.inicializarAmbiente(resp); // manejo de respuesta
    }
    if (resp.cod !== 'OK') {
      let msg = '';
      msg = resp.cod !== undefined ? msg = msg + resp.cod + ' ' : msg + ' ';
      msg = resp.msgusu !== undefined ? msg = msg + resp.msgusu : msg + '';
      this.dtoServicios.llenarMensaje(resp, false);
    }
  }

  /**Invoca al core para realizar el olvido de contrasenia de la aplicacion. */
  ejecutaolvidocontrasenia() {
    this.msgs = [];
    if (this.enejecucion) {
      return;
    }
    this.enejecucion = true;
    this.appService.login = true;
    this.appService.validarclavetemp = true;
    this.appService.validarotp = true;
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
    sessionStorage.setItem('cfuncionario', mradicacion.cfuncionario);
    sessionStorage.setItem('cfuncionariojefe', mradicacion.cfuncionariojefe);
    sessionStorage.setItem('ambiente', mradicacion.ambiente);


    // delete mradicacion.roles;

    // ejecuta consulta del menu del primer rol
    this.appService.consultarMenu(false);

    // Fija datos de radicacion del usuario en el singleton de servicios.
    this.dtoServicios.actualizarRadicacion(mradicacion);

    // Verifica el cambio de password
    this.validaCambioPassword(mradicacion);

    if (!this.appService.validarotp && !this.appService.cambiopassword) {
      this.msgs.push({severity: 'success', summary: 'INGRESO EXITOSO, BIENVENIDO: ' + this.dtoServicios.mradicacion.cusuario, detail: ''});
      this.dtoServicios.mostrarMensaje(this.msgs);
    } else {
      this.msgs.push({severity: 'success', summary: 'LOGIN EXITOSO, VALIDACIÓN DOBLE FACTOR DE AUTENTICACIÓN (2FA)', detail: ''});
      this.dtoServicios.mostrarMensaje(this.msgs);
    }
    //this.appService.cargaPaginaInicial();
  }

  validaCambioPassword(mradicacion: any) {
    const cambio = mradicacion.pss;
    if (cambio !== null && cambio === '1') {
      this.appService.cambiopassword = true;
      this.appService.cambiocontraseniacomponent.consultar();
    }
  }


}
