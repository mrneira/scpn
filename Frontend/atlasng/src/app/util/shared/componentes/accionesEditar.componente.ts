import {Component, Input} from '@angular/core';
import {NgForm} from '@angular/forms';
import {BaseComponent} from './base.component';

@Component({
  selector: 'acciones-editar',
  templateUrl: 'accionesEditar.html'
})

export class AccionesEditarComponent {
  @Input()
  formAcciones: NgForm;

  @Input()
  componentes: BaseComponent[];

  habilitarEdicion(): void {
    let habilita = true;
    for (const i in this.componentes) {
      if (this.componentes.hasOwnProperty(i) && this.componentes[i].esform) {
        this.componentes[i].habilitarEdicion();
        habilita = habilita && this.componentes[i].editable;
        if (!habilita) {
          break;
        }
      }
    }
    if (habilita) {
      for (const i in this.componentes) {
        if (this.componentes.hasOwnProperty(i) && this.componentes[i].esform) {
          this.componentes[i].selectRegistro(this.componentes[i].registro);
        }
      }
    } else {
      for (const i in this.componentes) {
        if (this.componentes.hasOwnProperty(i) && this.componentes[i].esform) {
          this.componentes[i].deshabilitarEdicion();
        }
      }
    }
  }

  actualizar(): void {
    for (const i in this.componentes) {
      if (this.componentes.hasOwnProperty(i) && this.componentes[i].esform) {
        this.componentes[i].formvalidado = true;
        this.componentes[i].deshabilitarEdicion();
        this.componentes[i].actualizar();
      }
    }
  }

  cancelar(): void {
    for (const i in this.componentes) {
      if (this.componentes.hasOwnProperty(i) && this.componentes[i].esform) {
        this.componentes[i].deshabilitarEdicion();
        this.componentes[i].cancelar();
      }
    }
  }
}
