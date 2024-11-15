import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BaseComponent } from '../../../shared/componentes/base.component';
import { ConfirmationService} from 'primeng/primeng';
import { TreeNode } from 'primeng/primeng';

@Component({
  selector: 'acciones-arbol',
  templateUrl: './accionesArbol.component.html'
})
export class AccionesArbolComponent {
  @Input()
  componente: BaseComponent;

  @Input()
  nodo: TreeNode;

  @Input()
  mostrarEditar = true;

  @Input()
  mostrarEliminar = true;

  constructor(private confirmationService: ConfirmationService) {
  }

  eliminarRegistro(nodo: TreeNode) {
      this.confirmationService.confirm({
      message: 'Está seguro que desea eliminar?',
      header: 'Confirmación',
      accept: () => {
                    this.componente.selectRegistro(nodo);
                    this.componente.eliminar();
                }
      });
  }

}
