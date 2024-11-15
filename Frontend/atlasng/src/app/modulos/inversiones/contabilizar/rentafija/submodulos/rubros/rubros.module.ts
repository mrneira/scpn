import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { RubrosRoutingModule } from './rubros.routing';
import { LovCuentasContablesModule } from '../../../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';

import { RubrosComponent } from './componentes/rubros.component';

import { LovPersonasModule } from '../../../../../personas/lov/personas/lov.personas.module';

@NgModule({
  imports: [SharedModule, RubrosRoutingModule, LovPersonasModule, LovCuentasContablesModule ],
  declarations: [RubrosComponent],
  exports: [RubrosComponent]
})
export class RubrosModule { }
