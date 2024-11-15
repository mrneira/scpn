import { NgModule } from '@angular/core';
import { SharedModule } from '../../.././../util/shared/shared.module';
import { EliminarcxcRoutingModule } from './eliminarcxc.routing';

import { EliminarcxcComponent } from './componentes/eliminarcxc.component';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovOperacionCarteraModule } from '../../lov/operacion/lov.operacionCartera.module';

@NgModule({
  imports: [SharedModule, EliminarcxcRoutingModule, LovPersonasModule, LovOperacionCarteraModule],
  declarations: [EliminarcxcComponent]
})
export class EliminarcxcModule { }
