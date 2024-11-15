import { Directive, Output, EventEmitter, Attribute, ElementRef } from '@angular/core';
import { NgModule } from '@angular/core';
import { BaseComponent } from '../../util/shared/componentes/base.component';
import { Router } from '@angular/router';
import { DtoServicios } from '../../util/servicios/dto.servicios';

@Directive({
  selector: '[ngModel][hora]',
  host: {
    '(focusout)': 'focusout($event)'
  }
})

// npm i ng2-currency-mask    esta es la directiva original.
export class HoraDirective extends BaseComponent {
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter()
  value: any;

  optionsTemplate = {
    align: 'left'
  };

  constructor(router: Router, dtoServicios: DtoServicios) {
    super(router, dtoServicios, 'TconCuentaPorCobrar', 'CUENTASPORCOBRAR', false);
    this.componentehijo = this;}
  
    focusout($event: any) {
    this.value = $event.target.value;
    if (this.value) {
      var patt= new RegExp(/^([0-1]?[0-9]|2[0-3])(:[0-5][0-9])?$/).test(this.value);
      if (!patt)
      {
      super.mostrarMensajeError('FORMATO DE HORA INCORRECTA '+ $event.currentTarget.id);
      this.ngModelChange.emit('');
      }
    }
  }
}