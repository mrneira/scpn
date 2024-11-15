import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { MayorRoutingModule } from './mayor.routing';

import { MayorComponent } from './componentes/mayor.component';

import { LovPersonasModule } from '../../../../../personas/lov/personas/lov.personas.module';

import { LovCuentasContablesModule } from '../../../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';

@NgModule({
  imports: [SharedModule, MayorRoutingModule, LovPersonasModule, LovCuentasContablesModule ],
  declarations: [MayorComponent],
  exports: [MayorComponent]
})
export class MayorModule { }
