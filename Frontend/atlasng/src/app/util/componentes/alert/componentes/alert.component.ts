import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../../servicios/alert.service';
import { DtoServicios } from '../../../servicios/dto.servicios';
import { AppService } from '../../../servicios/app.service';
import {Message} from 'primeng/primeng';


@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html'
})
export class AlertComponent implements OnInit {
    msgs: Message[];
    msgsglow: Message[];
    muestraAlerta = {mostrar: false, mostrarlogout: false, msg: ''};

    constructor(private alertService: AlertService, public dtoServicios: DtoServicios, public appService: AppService) { }

    ngOnInit() {
        this.alertService.obtenerMensaje().subscribe(messages => {
          this.msgs = messages;
          if (messages !== undefined) {
            this.msgsglow = JSON.parse(JSON.stringify(messages));
          }
        });

        this.alertService.obtenerMuestraAlerta().subscribe(ma => {
          this.muestraAlerta = ma;
        });
    }

    recargar() {
      location.reload();
      
    }

    public integerToFormatoFecha(valor: number): string {
      // ejemplo yyyyMMdd 20170131    31 de enero del 2017
      const anio = valor.toString().substring(0, 4);
      const mes = valor.toString().substring(4, 6);
      const dia = valor.toString().substring(6, 8);
      const fecha = anio + '-' + mes + '-' + dia;
      return fecha;
    }
}
