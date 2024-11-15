import { Directive, Output, EventEmitter } from '@angular/core';
import { ElementRef, Renderer, HostListener } from '@angular/core';
import { NgModule } from '@angular/core';

@Directive({
    selector: '[ngModel][mayusculas]'
})
export class MayusculasDirective {
    @Output() ngModelChange: EventEmitter<any> = new EventEmitter();

    constructor(private el: ElementRef,
        private render: Renderer) { }

    @HostListener('keyup', ['$event']) onInputChange(event) {
        let pos1 = this.el.nativeElement.selectionStart;
        let pos2 = this.el.nativeElement.selectionEnd;
        let val = this.el.nativeElement.value;

        val = val.toUpperCase();
        this.render.setElementProperty(this.el.nativeElement, 'value', val);
        this.ngModelChange.emit(val);
        this.el.nativeElement.setSelectionRange(pos1, pos2, 'none');
    }
}