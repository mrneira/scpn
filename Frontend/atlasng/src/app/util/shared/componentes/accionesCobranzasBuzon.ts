import { Component, Input, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from './base.component';

@Component({
  selector: 'acciones-cobranzasbuzon',
  templateUrl: 'accionesCobranzasBuzon.html'
})

export class AccionesCobranzasBuzonComponent {

  @Input()
  etapa: boolean = true;

  @Input()
  componente: BaseComponent;

  constructor(public router: Router) {
  }
}
