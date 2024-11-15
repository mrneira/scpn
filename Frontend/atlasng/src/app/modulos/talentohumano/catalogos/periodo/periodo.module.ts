import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PeriodoRoutingModule } from './periodo.routing';

import { PeriodoComponent } from './componentes/periodo.component';


@NgModule({
  imports: [SharedModule, PeriodoRoutingModule ],
  declarations: [PeriodoComponent]
})
export class PeriodoModule { }
