import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { CarrerahistoricoRoutingModule } from './carrerahistorico.routing';

import { CarrerahistoricoComponent } from './componentes/carrerahistorico.component';

import { LovPersonasModule } from '../../../../personas/lov/personas/lov.personas.module';


@NgModule({
  imports: [SharedModule, CarrerahistoricoRoutingModule, LovPersonasModule ],
  declarations: [CarrerahistoricoComponent],
  exports: [CarrerahistoricoComponent]
})
export class CarrerahistoricoModule { }
