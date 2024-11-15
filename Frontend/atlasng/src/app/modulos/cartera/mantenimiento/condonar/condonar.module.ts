import { NgModule } from '@angular/core';
import { SharedModule } from '../../.././../util/shared/shared.module';
import { CondonarRoutingModule } from './condonar.routing';

import { CondonarComponent } from './componentes/condonar.component';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovOperacionCarteraModule } from '../../lov/operacion/lov.operacionCartera.module';

@NgModule({
  imports: [SharedModule, CondonarRoutingModule, LovPersonasModule, LovOperacionCarteraModule],
  declarations: [CondonarComponent]
})
export class CondonarModule { }
