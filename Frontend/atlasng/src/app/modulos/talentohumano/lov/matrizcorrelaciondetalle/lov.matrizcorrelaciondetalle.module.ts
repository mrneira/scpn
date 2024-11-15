import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovMatrizCorrelacionDRoutingModule } from './lov.matrizcorrelaciondetalle.routing';
import { LovMatrizCorrelacionDComponent } from './componentes/lov.matrizcorrelaciondetalle.component';

@NgModule({
  imports: [SharedModule, LovMatrizCorrelacionDRoutingModule],
  declarations: [LovMatrizCorrelacionDComponent],
  exports: [LovMatrizCorrelacionDComponent]
})
export class LovMatrizCorrelacionDModule { }

