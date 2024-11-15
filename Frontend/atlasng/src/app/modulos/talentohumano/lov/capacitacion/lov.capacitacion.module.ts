import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovCapacitacionRoutingModule } from './lov.capacitacion.routing';
import { LovCapacitacionComponent } from './componentes/lov.capacitacion.component';

@NgModule({
  imports: [SharedModule, LovCapacitacionRoutingModule],
  declarations: [LovCapacitacionComponent],
  exports: [LovCapacitacionComponent]
})
export class LovCapacitacionModule { }

