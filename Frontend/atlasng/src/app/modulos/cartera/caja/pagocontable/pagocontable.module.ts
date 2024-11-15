import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PagoContableRoutingModule } from './pagocontable.routing';

import { PagoContableComponent } from './componentes/pagocontable.component';

import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovOperacionCarteraModule } from '../../lov/operacion/lov.operacionCartera.module';

@NgModule({
  imports: [SharedModule, PagoContableRoutingModule, LovPersonasModule, LovOperacionCarteraModule ],
  declarations: [PagoContableComponent]
})
export class PagoContableModule { }
