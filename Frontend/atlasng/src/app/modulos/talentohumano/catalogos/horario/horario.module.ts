import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { HorarioRoutingModule } from './horario.routing';

import { HorarioComponent } from './componentes/horario.component';


@NgModule({
  imports: [SharedModule, HorarioRoutingModule ],
  declarations: [HorarioComponent]
})
export class HorarioModule { }
