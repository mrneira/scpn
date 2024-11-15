import { Injectable } from '@angular/core';
import { Routes, Router, ActivatedRoute, RouterModule, provideRoutes } from '@angular/router';
import { DtoServicios } from './dto.servicios';
import { SelectItem } from 'primeng/primeng';
import { Message } from 'primeng/primeng';
import { MenuItem } from 'primeng/primeng';
import { VerificaAutorizacionService } from '../../util/servicios/verificaAutorizacion.service';
import { InicioComponent } from '../../sobre/inicio/componentes/inicio.component';
import { ReloadComponent } from '../../util/seguridad/componentes/login/reload.component';
import { CambioContraseniaLoginComponent } from '../../util/seguridad/componentes/cambiocontrasenialogin/componentes/cambioContraseniaLogin.component';


@Injectable()
export class AppService {
  public modelo: any = {};
  /**Objeto que contine mensajes aplicativos. */
  msgs: Message[] = [];
  /**Menu asociado a un rol del usuario.*/
  lmenu: any = [];
  /**false, indica que el usuario no ingresa a la aplicacion, true el usuario esta en la aplicacion y se muestra el menu.*/
  public login = false;

  /**Varible que valida la la clave del otp*/
  public validarotp = true;
  /**Variable que valida el olvido contrasenia*/
  public validarclavetemp = false;
  /**Varible que valida la la clave del otp*/
  public cambiopassword = false;

  /**Varible de referencia al componente de cambio de password*/
  public cambiocontraseniacomponent: CambioContraseniaLoginComponent;

  /**Lista de roles del usuario.*/
  public lrolesusuario: SelectItem[] = [{ label: '...', value: null }];
  public lmodulosusuario: SelectItem[] = [{ label: '...', value: null }];

  public lmodulosusuariod: any = [];
  /**Codigo de rol activo*/
  public crol: any;
  /**Nombre de rol activo*/
  public nrol: any;

  public cmodulo: any;
  /**Nombre de rol activo*/
  public nmodulo: any;

  /** Menu asociado al rol */
  menu: MenuItem[];

  public menutransaccion: any =[];

  muestraRoles = false;

  muestraAyuda = false;

  muestraUserInfo = false;

  public titulopagina = '';

  /**Rutas por defecto**/
  public appRutasDefecto: Routes = [
    { path: '2-10', loadChildren: 'app/modulos/seguridad/cambiocontrasenia/cambioContrasenia.module#CambioContraseniaModule', canActivate: [VerificaAutorizacionService] },
    { path: '', component: InicioComponent, canActivate: [VerificaAutorizacionService] },
    { path: 'reload', component: ReloadComponent },
    { path: '**', redirectTo: '' },
  ];


  constructor(public router: Router, public dtoServicios: DtoServicios) { }

  /**Metodo que se ejecuta en el bootstrap de la aplicacion, o al salir de la aplicacion. */
  public salir(event = null): void {
    this.msgs = [];
    this.modelo = {};
    if (event !== null && event !== undefined) {
      event.preventDefault();
    }
    this.dtoServicios.logout();
    this.login = false;
  }

  /**Metodo que se ejecuta en el bootstrap de la aplicacion, o dar la ruta hacia cambio de password. */
  public cambioPassword(event = null): void {
    this.msgs = [];

    if (event !== null && event !== undefined) {
      event.preventDefault();
    }

    sessionStorage.setItem('m', '2');
    sessionStorage.setItem('t', '10');
    sessionStorage.setItem('titulo', '2-10 Cambio De Constraseña');
    sessionStorage.setItem('ins', 'true');
    sessionStorage.setItem('upd', 'true');
    sessionStorage.setItem('del', 'false');
    sessionStorage.setItem('ac', 'false');
    sessionStorage.setItem('path', '2-10');

    this.router.navigate(['2-10'], { skipLocationChange: true });
    this.titulopagina = '2-10 Cambio De Constraseña';
  }

  public cargaPaginaInicial(): void {
    setTimeout(() => {
      sessionStorage.setItem('m', '2');
      sessionStorage.setItem('t', '10');
      sessionStorage.setItem('titulo', '2-10 Cambio De Constraseña');
      sessionStorage.setItem('ins', 'true');
      sessionStorage.setItem('upd', 'true');
      sessionStorage.setItem('del', 'false');
      sessionStorage.setItem('ac', 'false');
      sessionStorage.setItem('path', '2-10');

      this.router.navigate(['2-10'], { skipLocationChange: true });
      this.titulopagina = '2-10 Cambio De Constraseña-carga inicial';
    }, 500);
  }

  public cargaPaginaAfterMenu(): void {
    setTimeout(() => {
      sessionStorage.setItem('m', '2');
      sessionStorage.setItem('t', '10');
      sessionStorage.setItem('titulo', '2-10 Cambio De Constraseña');
      sessionStorage.setItem('ins', 'true');
      sessionStorage.setItem('upd', 'true');
      sessionStorage.setItem('del', 'false');
      sessionStorage.setItem('ac', 'false');
      sessionStorage.setItem('path', '2-10');

      this.router.navigate(['2-10'], { skipLocationChange: true });
      this.titulopagina = '2-10 Cambio De Constraseña-after rol';
    }, 500);
  }

  // Lista de datos roles de usuario a utlizar en la pagina.
  public llenarRolesUsuario(lroles: any): void {


    this.lrolesusuario = [];
    for (const i in lroles) {
      if (lroles.hasOwnProperty(i)) {
        const reg = lroles[i];
        this.lrolesusuario.push({ label: reg.name, value: reg.id });
      }
    }
    if (this.lrolesusuario != null && this.lrolesusuario.length > 0) {
      this.crol = this.lrolesusuario[0].value;
      this.nrol = this.lrolesusuario[0].label;
    }
  }

  public llenarModulosUsuario(lmodulos: any): void {
    this.lmodulosusuariod = lmodulos;
    this.lmodulosusuario = [];
    for (const i in lmodulos) {
      if (lmodulos.hasOwnProperty(i)) {
        const reg = lmodulos[i];
        this.lmodulosusuario.push({ label: reg.nombre, value: reg.cmodulo });
      }
    }
    if (this.lmodulosusuario != null && this.lmodulosusuario.length > 0) {
      this.cmodulo = this.lmodulosusuario[0].value;
      this.nmodulo = this.lmodulosusuario[0].label;
    }
  }

  /**Invoca al core para realizar login de la aplicacion. */
  public consultarMenu(iscargapagina = true) {
    this.msgs = [];
    const rqConsulta: any = new Object();
    rqConsulta.CODIGOCONSULTA = 'MENU';
    rqConsulta.crol = this.crol;
    rqConsulta.angular = 'Y'; // para que reorne el menu en formato json
    rqConsulta.cmodulo = '2';
    rqConsulta.ctransaccion = '2';
    this.dtoServicios.ejecutarConsultaRest(rqConsulta, '', 'menu')
      .subscribe(
        resp => {
          this.manejaRespuestaMenu(resp);
          // if (iscargapagina) {
          //   this.cargaPaginaAfterMenu();
          // }
        },
        error => {
          this.dtoServicios.manejoError(error);
        });
  }

  /**Manejo respuesta de ejecucion de login. */
  private manejaRespuestaMenu(resp: any) {
    this.msgs = [];
    if (resp.cod === 'OK') {
      this.menu = resp.menu;
      this.menutransaccion = resp.menutransaccion
      this.llenarModulosUsuario(resp.lmodulos);
      this.login = true;

      for (const i in resp.rutas) {
        if (resp.rutas.hasOwnProperty(i)) {
          resp.rutas[i].canActivate[0] = VerificaAutorizacionService;
        }
      }
      for (const i in this.appRutasDefecto) {
        if (this.appRutasDefecto.hasOwnProperty(i)) {
          resp.rutas.push(this.appRutasDefecto[i]);
        }
      }
      while (this.router.config.length > 0) {
        this.router.config.pop();
      }
      this.router.resetConfig(resp.rutas);
    }
    if (resp.cod !== 'OK') {
      let msg = '';
      msg = resp.cod !== undefined ? msg = msg + resp.cod + ' ' : msg + ' ';
      msg = resp.msgusu !== undefined ? msg = msg + resp.msgusu : msg + '';
      this.dtoServicios.llenarMensaje(resp, false);
    }
  }

  /** Regenera el objeto que tiene la radicacion del usuario. */
  public fijarRadicacion(mradicacion: any) {
    //    let c: string;
    //    c = mradicacion.cc + '^' + mradicacion.cs + '^' + mradicacion.cag + '^' + mradicacion.cu + '^';
    //    c = c + this.crol + '^' + mradicacion.ci + '^' + mradicacion.cca;
    //    sessionStorage.setItem('c', c);
    sessionStorage.setItem('mradicacion', JSON.stringify(mradicacion));
  }

  public cargarRol(item: any) {
    this.crol = item.value;
    this.nrol = item.label;
    const mradicacion = JSON.parse(sessionStorage.getItem('mradicacion'));
    this.fijarRadicacion(mradicacion);
    this.consultarMenu();
    this.mostrarRoles();
  }
  public cargarAyuda(item: any) {
    this.cmodulo = item.value;
    this.nmodulo = item.label;
    const mradicacion = JSON.parse(sessionStorage.getItem('mradicacion'));
    this.fijarRadicacion(mradicacion);
    for (const i in this.lmodulosusuariod) {
      if (this.lmodulosusuariod.hasOwnProperty(i)) {
        const reg = this.lmodulosusuariod[i];
        if (reg.cmodulo === this.cmodulo) {
          window.open(reg.rutaayuda);

        }
      }
    }
    this.muestraAyuda = !this.muestraAyuda;
  }

  public mostrarRoles() {
    this.muestraRoles = !this.muestraRoles;
  }
  public mostrarAyuda() {
    //    window.open('http://172.16.21.104/manuales/ATLAS_Manual%20de%20Usuario_Seguridad.docx');
    this.muestraAyuda = !this.muestraAyuda;
  }
}
