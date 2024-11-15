import { Directive, Output, EventEmitter, Attribute, ElementRef } from '@angular/core';
import { NgModule } from '@angular/core';
import { BaseComponent } from '../../util/shared/componentes/base.component';
import { Router } from '@angular/router';
import { DtoServicios } from '../../util/servicios/dto.servicios';

@Directive({
  selector: '[ngModel][numerodocumento]',
  host: {
    '(focusout)': 'focusout($event)'
  }
})

// npm i ng2-currency-mask    esta es la directiva original.
export class NumeroDocumentoDirective extends BaseComponent {
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
      var patt= new RegExp(/^[0-9]{3}-[0-9]{3}-[0-9]{9}$/).test(this.value);
      if (!patt)
      {
      super.mostrarMensajeError('FORMATO DE NÚMERO DOCUMENTO INCORRECTO, Ej: 999-999-999999999 ');
      //this.ngModelChange.emit('');
      }
    }
  }
}