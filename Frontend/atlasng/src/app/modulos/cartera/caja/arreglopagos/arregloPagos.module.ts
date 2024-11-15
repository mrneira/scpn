import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ArregloPagosRoutingModule } from './arregloPagos.routing';

import { ArregloPagosComponent } from './componentes/arregloPagos.component';

import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovOperacionCarteraModule } from '../../lov/operacion/lov.operacionCartera.module';




@NgModule({
  imports: [SharedModule, ArregloPagosRoutingModule, LovPersonasModule, LovOperacionCarteraModule ],
  declarations: [ArregloPagosComponent]
})
export class ArregloPagosModule { }
