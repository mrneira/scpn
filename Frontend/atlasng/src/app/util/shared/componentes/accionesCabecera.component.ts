import { Component, Input, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from './base.component';

@Component({
  selector: 'acciones-cabecera',
  templateUrl: 'accionesCabecera.html'
})

export class AccionesCabeceraComponent {

  @Input()
  grabar: boolean = true;

  @Input()
  cargar: boolean = true;

  @Input()
  componente: BaseComponent;

  constructor(public router: Router) {
  }

  recargar() {
    this.router.navigate([''], { skipLocationChange: true });
  }

}
