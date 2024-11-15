import { Directive, Output, EventEmitter, Attribute, ElementRef } from '@angular/core';
import { NgModule } from '@angular/core';

@Directive({
  selector: '[ngModel][letras]',
  host: {
    '(keyup)': 'onKeyup($event)'
  }
})

// npm i ng2-currency-mask    esta es la directiva original.
export class LetrasDirective {
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter()
  value: any;

  constructor(private elementRef: ElementRef) {
  }

  onKeyup($event: any) {
    this.value = $event.target.value;
    if (this.value) {
      this.value = this.value.replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚ\s]/g, "");
    }
    this.ngModelChange.emit(this.value.toUpperCase());
  }
}
