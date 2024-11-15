import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovHorarioRoutingModule } from './lov.horario.routing';
import { LovHorarioComponent } from './componentes/lov.horario.component';

@NgModule({
  imports: [SharedModule, LovHorarioRoutingModule],
  declarations: [LovHorarioComponent],
  exports: [LovHorarioComponent]
})
export class LovHorarioModule { }

