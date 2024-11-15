import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { NovedadesRoutingModule } from './novedades.routing';

import { NovedadesComponent } from './componentes/novedades.component';

import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';

@NgModule({
  imports: [SharedModule, NovedadesRoutingModule, LovPersonasModule ],
  declarations: [NovedadesComponent],
  exports: [NovedadesComponent]
})
export class NovedadesModule { }
