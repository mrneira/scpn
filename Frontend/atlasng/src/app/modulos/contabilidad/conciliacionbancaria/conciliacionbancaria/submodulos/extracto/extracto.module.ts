import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { ExtractoRoutingModule } from './extracto.routing';

import { ExtractoComponent } from './componentes/extracto.component';

import { LovPersonasModule } from '../../../../../personas/lov/personas/lov.personas.module';

import { LovCuentasContablesModule } from '../../../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';

@NgModule({
  imports: [SharedModule, ExtractoRoutingModule, LovPersonasModule, LovCuentasContablesModule ],
  declarations: [ExtractoComponent],
  exports: [ExtractoComponent]
})
export class ExtractoModule { }
