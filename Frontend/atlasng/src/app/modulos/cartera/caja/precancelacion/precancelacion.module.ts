import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PrecancelacionRoutingModule } from './precancelacion.routing';

import { PrecancelacionComponent } from './componentes/precancelacion.component';

import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovOperacionCarteraModule } from '../../lov/operacion/lov.operacionCartera.module';




@NgModule({
  imports: [SharedModule, PrecancelacionRoutingModule, LovPersonasModule, LovOperacionCarteraModule ],
  declarations: [PrecancelacionComponent]
})
export class PrecancelacionModule { }
