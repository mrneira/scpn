import { ImpresionService } from '../../servicios/impresion.service';
import { Component, OnInit } from '@angular/core';
import {DialogModule} from 'primeng/primeng';

@Component({
  selector: 'app-impresion',
  templateUrl: './impresion.component.html',
  styleUrls: ['./impresion.component.css']
})
export class ImpresionComponent implements OnInit {
  servidorconectado: boolean = false;
  ultimomsgservidor: any;
  display: boolean = false;

  constructor(private impresionService: ImpresionService) { }

  ngOnInit() {
        this.impresionService.obtenerObservable().subscribe(ultimomsg =>
        { this.ultimomsgservidor = ultimomsg; this.servidorconectado = this.impresionService.servidorconectado; });
  }

  conectarServidorImpresion(): void{
    this.impresionService.conectarServidorImpresion();
  }

  mostrarDialogo() {
        this.display = true;
  }
}
