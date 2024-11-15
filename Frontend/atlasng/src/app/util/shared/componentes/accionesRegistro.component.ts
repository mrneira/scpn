import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BaseComponent } from './base.component';
import { ConfirmationService} from 'primeng/primeng';

@Component({
  selector: 'acciones-reg',
  templateUrl: 'accionesRegistro.html'
})

export class AccionesRegistroComponent {

  @Input()
  componente: BaseComponent;

  @Input()
  reg: any;

  @Input()
  mostrarEditar = true;

  @Input()
  mostrarEliminar = true;

  constructor(private confirmationService: ConfirmationService) {
  }


  eliminarRegistro(reg: any) {
      this.confirmationService.confirm({
      message: 'Está seguro que desea eliminar?',
      header: 'Confirmación',
      accept: () => {
                    this.componente.selectRegistro(reg);
                    this.componente.eliminar();
                }
      });
  }

}
