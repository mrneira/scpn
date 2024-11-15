import { Component, OnInit, Output, Input,  ViewChild, HostListener } from '@angular/core';
import { BaseComponent } from './base.component';

export abstract class BaseLovComponent extends BaseComponent{
  displayLov = false;
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (!this.displayLov) return;
    if (event.keyCode === this.KEY_CODE.KEY_ENTER) {
      this.consultar();
      return;
    }
    if (this.lregistros.length > 0) {
      if (event.keyCode === this.KEY_CODE.KEY_AV_PAG && event.shiftKey) {
        this.consultarSiguiente();
        return;
      }
    }
    if (event.keyCode === this.KEY_CODE.KEY_RE_PAG && event.shiftKey) {
        this.consultarAnterior();
        return;
    }
  }

  init(){ 
  }

  inicializaFormulario() {
  }

}

