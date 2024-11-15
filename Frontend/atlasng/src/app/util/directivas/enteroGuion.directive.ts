import { Directive, Output, EventEmitter, Attribute, ElementRef } from '@angular/core';
import { NgModule } from '@angular/core';

@Directive({
  selector: '[ngModel][enteroGuion]',
  host: {
    '(keyup)': 'onKeyup($event)'
  }
})

// npm i ng2-currency-mask    esta es la directiva original.
export class EnteroGuionDirective {
  @Output() ngModelChange: EventEmitter<any> = new EventEmitter()
  value: any;

  optionsTemplate = {
    align: 'left'
  };

  constructor(private elementRef: ElementRef) {
  }
  ngAfterViewInit() {
    this.elementRef.nativeElement.style.textAlign = this.optionsTemplate.align;
  }

  onKeyup($event: any) {
    this.value = $event.target.value;
    if (this.value) {
      this.value = this.value.replace(/[^0-9 -]/g, '');
    }
    this.ngModelChange.emit(this.value);
  }
}