import { Component, Input, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from './base.component';

@Component({
  selector: 'acciones-etapa',
  templateUrl: 'accionesEtapa.html'
})

export class AccionesEtapaComponent {

  @Input()
  etapa: boolean = true;

  @Input()
  mostraretapas: boolean = true;

  @Input()
  componente: BaseComponent;

  constructor(public router: Router) {
  }
}
