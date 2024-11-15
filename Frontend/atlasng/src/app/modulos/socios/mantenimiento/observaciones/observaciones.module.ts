import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ObservacionesRoutingModule } from './observaciones.routing';

import { ObservacionesComponent } from './componentes/observaciones.component';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';

@NgModule({
  imports: [SharedModule, ObservacionesRoutingModule, LovPersonasModule ],
  declarations: [ObservacionesComponent]
})
export class ObservacionesModule { }
