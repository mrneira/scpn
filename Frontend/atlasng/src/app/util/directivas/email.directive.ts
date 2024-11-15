import { Directive, Output, EventEmitter, Attribute, ElementRef } from '@angular/core';
import { NgModule } from '@angular/core';
import { BaseComponent } from '../../util/shared/componentes/base.component';
import { Router } from '@angular/router';
import { DtoServicios } from '../../util/servicios/dto.servicios';

@Directive({
  selector: '[ngModel][email]',
  host: {
    '(focusout)': 'focusout($event)'
  }
})

export class EmailDirective extends BaseComponent {
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter()
  value: any;

  optionsTemplate = {
    align: 'right'
  };

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'ttestransaccion', 'BCE', false);
    this.componentehijo = this;
  }

  focusout($event: any) {
    this.value = $event.target.value;
    if (this.value && this.value != "") {
      var patt = new RegExp(/^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i).test(this.value);
      if (!patt) {
        super.mostrarMensajeError('FORMATO DE EMAIL, Ej: xxxxxx@yyyyyyyy.com ');
      }
    }
  }
}