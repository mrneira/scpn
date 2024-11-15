import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { OperacionesrentavariableRoutingModule } from './operacionesrentavariable.routing';

import { LovInversionesModule } from '../../../inversiones/lov/inversiones/lov.inversiones.module';
import { OperacionesrentavariableComponent } from './componentes/operacionesrentavariable.component';
import { LovCuentasContablesModule } from '../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';

@NgModule({
  imports: [
    SharedModule, 
    OperacionesrentavariableRoutingModule, 
 
    LovInversionesModule, 
    LovCuentasContablesModule ],
  declarations: [OperacionesrentavariableComponent],
  exports: [OperacionesrentavariableComponent]
})
export class OperacionesrentavariableModule { }
