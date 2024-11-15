import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class SocketimpresionService {

  private socket: WebSocket;
  private listener: EventEmitter<any> = new EventEmitter();
  private url: string = 'ws://localhost:8111/servidorimpresora/api/*';

  public constructor() {
  }

  public conectar(): void {
     if (this.socket !== undefined && this.socket.readyState !== WebSocket.CLOSED) {
            return;
    }
    this.socket = new WebSocket(this.url);
    this.socket.onopen = event => {
      this.listener.emit({ 'tipo': 'open', 'data': event });
    };
    this.socket.onclose = event => {
      this.listener.emit({ 'tipo': 'close', 'data': event });
    };
    this.socket.onmessage = event => {
      this.listener.emit({ 'tipo': 'message', 'data': event.data });
    };
  }

  public enviar(data: string): Object {
    if (this.socket === undefined || this.socket.readyState === WebSocket.CLOSED) {
            return {mensaje: 'SERVIDOR DE IMPRESORA NO CONECTADO', severity: 'error'};
    }
    this.socket.send(data);
    return {mensaje: 'ENVIADO A LA COLA DE IMPRESIÓN', severity: 'success'};
  }

  public cerrar() {
    this.socket.close();
  }

  public obtenerListener() {
    return this.listener;
  }

}
