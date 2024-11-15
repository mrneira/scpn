import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovCuentasContablesRoutingModule } from './lov.cuentasContables.routing';

import { LovCuentasContablesComponent } from './componentes/lov.cuentasContables.component';


@NgModule({
  imports: [SharedModule, LovCuentasContablesRoutingModule],
  declarations: [LovCuentasContablesComponent],
  exports: [LovCuentasContablesComponent]
})
export class LovCuentasContablesModule { }

