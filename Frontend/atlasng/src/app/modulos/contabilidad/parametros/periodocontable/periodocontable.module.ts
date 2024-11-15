import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PeriodoContableRoutingModule } from './periodocontable.routing';

import { PeriodoContableComponent } from './componentes/periodocontable.component';


@NgModule({
  imports: [SharedModule, PeriodoContableRoutingModule ],
  declarations: [PeriodoContableComponent]
})
export class PeriodoContableModule { }
