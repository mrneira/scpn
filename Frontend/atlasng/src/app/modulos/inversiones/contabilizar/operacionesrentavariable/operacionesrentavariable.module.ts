import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { OperacionesrentavariableRoutingModule } from './operacionesrentavariable.routing';
import { OperacionesrentavariableComponent } from './componentes/operacionesrentavariable.component';

@NgModule({
  imports: [
    SharedModule, 
    OperacionesrentavariableRoutingModule
   ],
  declarations: [OperacionesrentavariableComponent],
  exports: [OperacionesrentavariableComponent]
})
export class OperacionesrentavariableModule { }
