import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BaseComponent } from './base.component';

@Component({
  selector: 'acciones-dialogo',
  templateUrl: 'accionesDialogo.html'
})

export class AccionesDialogoComponent {
  @Input()
  formAcciones: NgForm;

  @Input()
  componente: BaseComponent;

}
