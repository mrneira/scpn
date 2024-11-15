import {Injectable} from '@angular/core';
import 'rxjs/add/operator/first';
import {Http, Headers, Jsonp, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';
import {Mantenimiento} from '../../util/dto/dto.component';
import {AlertService} from '../../util/servicios/alert.service';
import {Routes, Router, ActivatedRoute} from '@angular/router';
import {Message} from 'primeng/primeng';

@Injectable()
export class Radicacion {
  public ccompania: number;
  public csucursal: number;
  public cagencia: number;
  public cusuario: string;
  public ccanal: string;
  public ncompania: string;
  public nsucursal: string;
  public nagencia: string;
  public timeoutminutos: number;
  public timeoutsegundos: number;
  public fcontable: number;
  public cpersona: number;
  public np: string;
  public ftrabajo: string;
  public nambiente;

  constructor(ccompania: number, csucursal: number, cagencia: number, cusuario: string, ccanal: string, ncompania: string) {
    this.ccompania = ccompania;
    this.csucursal = csucursal;
    this.cagencia = cagencia;
    this.cusuario = cusuario;
    this.ccanal = ccanal;
    this.ncompania = ncompania;
  }
}

@Injectable()
export class DtoServicios {
 
config: any = { 'host': 'http://localhost', 'port': '8082', 'context': '/atlas-rest/servicioRest'};
 


  public urlConsultar = '';
  public urlMantener = '';
  public urlLogin = '';

  /**Objeto que gurada datos temporales utiiados en la transaccion. */
  public mradicacion: Radicacion;
  
  public ipreal = ' ';

  public mostrarDialogoLoading = false;
  public mostrarDialogoLoadingTemp = false;
  
  public mensajeDialogTemp = ' ';

  /**Objeto que contine mensajes aplicativos. */
  msgs: Message[] = [];

  /**Variables de timeout. */
  public minutos: number;
  public segundos: number;
  public intervalID: any;
  public logeado = false;



  constructor(private http: Http, private router: Router, private alertService: AlertService) {
    this.urlLogin = this.urlLogin + this.config.host + ':' + this.config.port + '' + this.config.context + '/login';
    //this.timeout();
  }

  private timeout() {
    this.resetTimer();
    this.intervalID = setInterval(() => this.tick(), 1000);
  }

  private tick(): void {
    if (--this.segundos < 0) {
      this.segundos = 59;
      if (--this.minutos < 0) {
        this.logout()
      }
    }
  }

  private resetTimer(): void {
    clearInterval(this.intervalID);
    if (this.logeado) {
      this.minutos = this.mradicacion.timeoutminutos;
      this.segundos = this.mradicacion.timeoutsegundos;
    }
    else {
      this.minutos = 14;
      this.segundos = 59;
    }
  }

  private setUrlMantener(appName: any, metodo: any) {
    this.urlMantener = '';
    if (appName == null && metodo == null) {
      this.urlMantener = this.urlMantener + this.config.host + ':' + this.config.port + '' + this.config.context + '/mantener';
    }
    if (appName == null && metodo != null) {
      this.urlMantener = this.urlMantener + this.config.host + ':' + this.config.port + '' + this.config.context + '/' + metodo;
    }
    if (appName != null && metodo == null) {
      this.urlMantener = this.urlMantener + this.config.host + ':' + this.config.port + '/' + appName + this.config.context + '/mantener';
    }
    if (appName != null && metodo != null) {
      this.urlMantener = this.urlMantener + this.config.host + ':' + this.config.port + '/' + appName + this.config.context + '/' + metodo;
    }
  }
 
  private setUrlConsultar(appName: any, metodo: any) {
    this.urlConsultar = '';
    if (appName == null && metodo == null) {
      this.urlConsultar = this.urlConsultar + this.config.host + ':' + this.config.port + '' + this.config.context + '/consultar';
    }
    if (appName == null && metodo != null) {
      this.urlConsultar = this.urlConsultar + this.config.host + ':' + this.config.port + '' + this.config.context + '/' + metodo;
    }
    if (appName != null && metodo == null) {
      this.urlConsultar = this.urlConsultar + this.config.host + ':' + this.config.port + '/' + appName + this.config.context + '/consultar';
    }
    if (appName != null && metodo != null) {
      this.urlConsultar = this.urlConsultar + this.config.host + ':' + this.config.port + '/' + appName + this.config.context + '/' + metodo;
    }
  }

  public dateParser(key, value) {
    const reISOFull = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
    const reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})?$/;

    if (typeof value === 'string' && value.indexOf(':00:00') > 0) {
      //const a = reISOFull.exec(value);
      if (reISOFull.exec(value) || reISO.exec(value)) {
        const anio = value.substr(0, 4);
        const mes = value.substr(5, 2);
        const dia = value.substr(8, 2);
        return new Date(anio + '-' + mes + '-' + dia + ' 00:00:00');
      }
    }
    return value;
  };

  public dateString(key, value) {
    const reISOFull = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
    const reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})?$/;
    return value;
  };
  
  public obtenerIpLocal() {
    this.consultarIpLocal();
  }

  public consultarIpLocal() {
    const win: any = window;
    win.RTCPeerConnection = win.RTCPeerConnection || win.mozRTCPeerConnection || win.webkitRTCPeerConnection;
    if (win.RTCPeerConnection === undefined) {
      return;
    }
    const pc: any = new RTCPeerConnection({iceServers: []}), noop = function() {};
    try {
      pc.createDataChannel('');
      pc.createOffer(pc.setLocalDescription.bind(pc), noop);    // create offer and set local description
      pc.onicecandidate = this.registraIp;
    } catch (e) {}
  }

  registraIp = (ice) => {
    if (!ice || !ice.candidate || !ice.candidate.candidate) {return };
    const resp = /([0-9]{1,3}(\.[0-9]{1,3}){3})/.exec(ice.candidate.candidate);
    if (resp != null && resp.length > 0) {
      this.ipreal = resp[0];
    }
  };

  /**Llamar al servicio rest de consulta */
  public ejecutarConsultaRest(rqConsulta: Object, appName: any = null, metodo: any = null) {
    rqConsulta['c'] = this.getCabecera(rqConsulta);
    const rq = JSON.stringify(rqConsulta, this.dateString);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('x-auth-token', sessionStorage.getItem('jwt'));
    this.setUrlConsultar(appName, metodo);
    this.mostrarDialogoLoading = true;


    return this.http.post(this.urlConsultar, rq, {headers: headers, withCredentials: true})
      .map(resp => {
        const r = JSON.parse(resp['_body'], this.dateParser);
        sessionStorage.setItem('jwt', resp.headers['_headers'].get('x-auth-token'));
        this.mostrarDialogoLoading = false;
        this.timeout();
        return r;
      });
  }

  /**Manejo de respuesta de la base de datos cuando existe un error */
  private handleError(error: any) {
    return Promise.reject(error.message || error);
  }


  /**Llamar al servicio rest de consulta */
  ejecutarRestMantenimiento(rqMan: Object, appName: any = null, metodo: any = null) {
    rqMan['c'] = this.getCabecera(rqMan);
    const rq = JSON.stringify(rqMan, this.dateString);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('x-auth-token', sessionStorage.getItem('jwt'));
    this.setUrlMantener(appName, metodo);
    this.mostrarDialogoLoading = true;

    return this.http.post(this.urlMantener, rq, {headers: headers, withCredentials: true})
      .map(resp => {
        const r = resp.json();
        sessionStorage.setItem('jwt', resp.headers['_headers'].get('x-auth-token'));
        this.mostrarDialogoLoading = false;
        this.timeout();
        return r;
      });
  }

  /**Llamar al servicio rest de consulta */
  ejecutarLogin(usuario: string, password: string, canal: string, transaccion: string) {
    const rqLogin = this.getRequestLogin(usuario, password, canal, transaccion);
    const rq = JSON.stringify(rqLogin);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.mostrarDialogoLoading = true;

    return this.http.post(this.urlLogin, rq, {headers: headers, withCredentials: true})
      .map(resp => {
        const r = resp.json();
        sessionStorage.setItem('jwt', resp.headers['_headers'].get('x-auth-token'));
        this.mostrarDialogoLoading = false;
        this.timeout();
        return r;
      });
  }

  /**Llamar al servicio rest de consulta */
  ejecutarRecuperarContrasenia(identificacion: string, canal: string, transaccion: string) {
    const rqLogin = this.getRequestLogin(identificacion, identificacion, canal, transaccion);
    const rq = JSON.stringify(rqLogin);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.setUrlMantener('', 'mantener');
    this.mostrarDialogoLoading = true;
    return this.http.post(this.urlMantener, rq, {headers: headers, withCredentials: true})
      .map(resp => {
        const r = resp.json();
        sessionStorage.setItem('jwt', resp.headers['_headers'].get('x-auth-token'));
        this.mostrarDialogoLoading = false;
        this.timeout();
        return r;
      });
  }

  private getRequestLogin(usuario: string, password: string, canal: string, transaccion: string) {
    const cia = '1';
    // cia^suc^ofi^usr^perfil^idioma^canal^ipaddress
    let c: string = cia + '^1^1^' + usuario + '^1^ES^' + canal + '^' + this.ipreal + '^2^' + transaccion;
    const rqLogin = new Object();
    rqLogin['c'] = c;
    rqLogin['p'] = password;
    rqLogin['vl'] = '0'; // valida login
    return rqLogin;
  }

  private getCabecera(request: Object): string {
    this.obtenerIpLocal();
    let r: string = sessionStorage.getItem('c');
    if (request.hasOwnProperty('cmodulo') && request['cmodulo'] !== undefined) {
      r = r + '^' + this.ipreal + '^' + request['cmodulo'] + '^' + request['ctransaccion'];
    } else {
      r = r + '^' + this.ipreal + '^' + sessionStorage.getItem('m') + '^' + sessionStorage.getItem('t');
    }
    //CCA 10-99
    var data = r;
    data= data.substr(-5);
    if(data == '10^99'){
      r = r.replace(data, '10^1');
    }
    return r;
  }

  logout(msg = '') {
    const rqLogin = new Object();
    rqLogin['logoutuser'] = true;
    rqLogin['valida-usuario-login'] = false;
    rqLogin['cmodulo'] = '2';
    rqLogin['ctransaccion'] = '1001';

    const rq = JSON.stringify(rqLogin);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.ejecutarRestMantenimiento(rqLogin, '', 'logout').subscribe(
      resp => {
        this.llenarMensaje(resp, true); // solo presenta errores.
        // encerar token eliminar datos de radicacion del usuario.
        this.encerarCredencialesLogin();
        location.reload();
      },
      error => {
        this.manejoError(error);
      }
    );
  }

  public encerarCredencialesLogin() {
    sessionStorage.removeItem('jwt');
    sessionStorage.clear();
  }

  // Metodo que inicializa los datos cuando un usuario se autentica exitosamente
  actualizarRadicacion(mradicacion: any): void {
    this.mradicacion = new Radicacion(mradicacion.cc, mradicacion.cs, mradicacion.cag, mradicacion.cu, mradicacion.cca, mradicacion.nc);
    this.mradicacion.nsucursal = mradicacion.ns;
    this.mradicacion.nagencia = mradicacion.age;
    this.mradicacion.timeoutminutos = mradicacion.timeoutminutos;
    this.mradicacion.timeoutsegundos = mradicacion.timeoutsegundos;
    this.mradicacion.fcontable = mradicacion.fcontable;
    this.mradicacion.cpersona = mradicacion.cp;
    this.mradicacion.np = mradicacion.np;
    this.mradicacion.ftrabajo = mradicacion.ftrabajo;
    this.mradicacion.nambiente= mradicacion.ambiente;
    this.logeado = true;
  }


  // OTROS ********************************************************
  public llenarMensaje(resp: any, muestaexito: boolean, limpiamsg = true) {
    if (limpiamsg) {
      this.msgs = [];
    }
    if (resp.cod === 'OK') {
      if (muestaexito) {
        this.msgs.push({severity: 'success', summary: 'TRANSACCIÓN FINALIZADA CORRECTAMENTE', detail: ''});
      } 
//      else {
//        this.msgs = [];
//      }
    } else if (resp.cod === 'F-000' || resp.cod === 'BGEN-021' || resp.cod === 'SEG-031') {
      // Sesion expirada, realizar logout
      // this.msgs = [];
      let msg = '';
      msg = resp.msgusu !== undefined ? msg = msg + resp.msgusu : msg + '';
      this.msgs.push({severity: 'error', summary: msg, detail: ''});
      this.logout(msg);
      this.alertService.mostrarAlerta(msg, true);
    } else if (resp.cod === '000') {
      let msg = '';
      msg = resp.msgusu !== undefined ? msg = msg + resp.msgusu : msg + '';
      this.msgs.push({severity: 'warn', summary: msg, detail: ''});
    } else {
      // this.msgs = [];
      let msg = '';
      msg = resp.cod !== undefined ? msg = msg + resp.cod.startsWith('javax') ? '' : resp.cod + ' ' : msg + ' ';
      msg = resp.msgusu !== undefined ? msg = msg + resp.msgusu : msg + '';
      this.msgs.push({severity: 'error', summary: msg, detail: ''});
    }
    this.alertService.mostrarMensaje(this.msgs);
  }

  /**Fija mensaje de respuesta resultado de ejecucion de una peticion al core. */
  public manejoError(resp: any) {
    if (resp !== null && resp.headers !== undefined) {
      sessionStorage.setItem('jwt', resp.headers['_headers'].get('x-auth-token'));
    }
    let mensaje = 'ERROR DE CONEXIÓN CON EL SERVIDOR';
    if (resp.message !== undefined && resp.message !== null) {
      mensaje = resp.message;
    }
    this.msgs = [];
    this.msgs.push({severity: 'error', summary: mensaje, detail: ''});
    this.alertService.mostrarMensaje(this.msgs);
  }

  /**Fija mensaje de respuesta resultado de ejecucion de una peticion al core. */
  public mostrarMensaje(msgs: Message[], persistirmsg = false, acumular = false) {
    if (!acumular) {
      this.msgs = msgs;
    } else {
      this.msgs = this.msgs.concat(msgs);
    }
    // this.msgs = msgs;
    this.alertService.mostrarMensaje(this.msgs, persistirmsg);
  }

}
