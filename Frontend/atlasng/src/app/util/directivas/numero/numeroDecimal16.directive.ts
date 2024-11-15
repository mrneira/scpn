import { AfterViewInit, Directive, DoCheck, ElementRef, forwardRef, HostListener, KeyValueDiffer, KeyValueDiffers, Input, OnInit } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

import { InputHandler } from "./input.handler";

export const CURRENCYMASKDIRECTIVE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NumeroDecimal16Directive),
  multi: true
};

@Directive({
  selector: "input[numeroDecimal16]",
  providers: [CURRENCYMASKDIRECTIVE_VALUE_ACCESSOR]
})
export class NumeroDecimal16Directive implements AfterViewInit, ControlValueAccessor, DoCheck, OnInit {

  //Ejemplo de uso
  //numero [options]="{ prefix: '', thousands: ',', decimal: '.' }"
  @Input() options: any = {};

  inputHandler: InputHandler;
  keyValueDiffer: KeyValueDiffer<any, any>;

  optionsTemplate = {
    align: "right",
    allowNegative: true,
    precision: 16,
    prefix: "",
    thousands: ",",
    decimal: ".",
    allowZero: true
  };

  constructor(private elementRef: ElementRef, private keyValueDiffers: KeyValueDiffers) {
    this.keyValueDiffer = keyValueDiffers.find({}).create(null);
  }

  ngAfterViewInit() {
    this.elementRef.nativeElement.style.textAlign = this.optionsTemplate.align;
  }

  ngDoCheck() {
    if (this.keyValueDiffer.diff(this.options)) {
      this.inputHandler.updateOptions(Object.assign({}, this.optionsTemplate, this.options));
    }
  }

  ngOnInit() {
    this.inputHandler = new InputHandler(this.elementRef.nativeElement, Object.assign({}, this.optionsTemplate, this.options));
  }

  @HostListener("click", ["$event"])
  handleClick(event: any) {
    this.inputHandler.handleClick(event);
  }

  @HostListener("cut", ["$event"])
  handleCut(event: any) {
    if (!this.isChromeAndroid()) {
      this.inputHandler.handleCut(event);
    }
  }

  @HostListener("input", ["$event"])
  handleInput(event: any) {
    if (this.isChromeAndroid()) {
      this.inputHandler.handleInput(event);
    }
  }

  @HostListener("keydown", ["$event"])
  handleKeydown(event: any) {
    if (!this.isChromeAndroid()) {
      this.inputHandler.handleKeydown(event);
    }
  }

  @HostListener("keypress", ["$event"])
  handleKeypress(event: any) {
    this.inputHandler.handleKeypress(event);
  }

  @HostListener("paste", ["$event"])
  handlePaste(event: any) {
    if (!this.isChromeAndroid()) {
      this.inputHandler.handlePaste(event);
    }
  }

  isChromeAndroid(): boolean {
    return /chrome/i.test(navigator.userAgent) && /android/i.test(navigator.userAgent);
  }

  registerOnChange(callbackFunction: Function): void {
    this.inputHandler.setOnModelChange(callbackFunction);
  }

  registerOnTouched(callbackFunction: Function): void {
    this.inputHandler.setOnModelTouched(callbackFunction);
  }

  setDisabledState(value: boolean): void {
    this.elementRef.nativeElement.disabled = value;
  }

  writeValue(value: number): void {
    this.inputHandler.setValue(value);
  }
  
  @HostListener('keydown', ['$event']) onKeyDown(event) {
    let e = <KeyboardEvent>event;
    if ([46, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+C
      (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+V
      (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+X
      (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
      // let it happen, don't do anything
      return;
    }
    if (e.keyCode == 8 || e.keyCode == 46) {
      this.inputHandler.handleKeydown(e);
    }

    // Asegurar que se ingresen solo números
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105) && (e.keyCode != 8)) {
      e.preventDefault();
    }
  }
}