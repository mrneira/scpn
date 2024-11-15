import { Injectable, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { AlertService } from '../../util/servicios/alert.service';
import { SocketimpresionService } from './socketimpresion.service';
import { Message } from 'primeng/primeng';
/**
 * Servicio para enviar a imprimir directamenta a una impresora
 * 
 * Comandos:
 * conectar -> Realiza la conexion a la impresora
 * imprimir -> Ejecuta, envia a realizar una impresion
 */
@Injectable()
export class ImpresionService {
  private subject = new Subject<string>();
  public hostnameimpresora: string = 'EPSON TM-U220';
  public servidorconectado: boolean = false;
  private numintentos = 3;
  private controlintentos = 0;

  constructor(public alertService: AlertService, private wss: SocketimpresionService) {
    this.subject.next('SERVIDOR DESCONECTADO');
    this.inicializarWebSocket();
  }

  public inicializarWebSocket() {
    this.wss.obtenerListener().subscribe(event => {
      if (event.tipo == 'message') {
        let data = event.data;
        if (event.data.sender) {
          data = event.data.sender + ': ' + data;
        }
        const msgsrv = JSON.parse(data);
        this.subject.next(msgsrv.summary);
        const msgs: Message[] = [];
        msgs.push(JSON.parse(data));
        this.alertService.mostrarMensaje(msgs);
      }
      if (event.tipo == 'close') {
        this.servidorconectado = false;
        this.subject.next('SERVIDOR DESCONECTADO');
        const msgs: Message[] = [{ severity: 'error', summary: 'CLIENTE IMPRESORA: SERVIDOR DE IMPRESIÓN DESCONECTADO', detail: '' }];
        this.alertService.mostrarMensaje(msgs);
        this.controlintentos = this.controlintentos + 1;
        if (this.controlintentos <= this.numintentos) {
          this.conectarServidorImpresion();
        }
      }
      if (event.tipo == 'open') {
        this.servidorconectado = true;
        this.subject.next('SERVIDOR CONECTADO');
        this.controlintentos = 0;
        // let msgs : Message[] = [{ severity: 'info', summary: 'CLIENTE IMPRESORA: SERVIDOR DE IMPRESIÓN CONECTADO EXITOSAMENTE', detail: '' }];
        // this.alertService.mostrarMensaje(msgs);
      }
    });
  }

  conectarServidorImpresion(): void {
    this.wss.conectar();
  }

  imprimirTexto(jsonimprimir: any) {
    const request = new Object();
    request['datos'] = jsonimprimir;
    request['comando'] = 'imprimir';
    request['hostnameimpresora'] = this.hostnameimpresora;

    const resp = this.wss.enviar(JSON.stringify(request));
    const msgs: Message[] = [{ severity: resp['severity'], summary: resp['mensaje'], detail: '' }];
    this.alertService.mostrarMensaje(msgs);
    if (resp['severity'] !== undefined && resp['severity'] === 'success') {
      return true;
    }
    return false; // Retorna falso cuando existe algun error en la impresion.
  }

  obtenerObservable(): Observable<any> {
    return this.subject.asObservable();
  }

}
