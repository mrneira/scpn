import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PagoRoutingModule } from './pago.routing';

import { PagoComponent } from './componentes/pago.component';

import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovOperacionCarteraModule } from '../../lov/operacion/lov.operacionCartera.module';
import { LovCuentasContablesModule } from '../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';

@NgModule({
  imports: [SharedModule, PagoRoutingModule, LovPersonasModule, LovOperacionCarteraModule, LovCuentasContablesModule ],
  declarations: [PagoComponent]
})
export class PagoModule { }
