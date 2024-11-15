import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovPeriodoRoutingModule } from './lov.periodo.routing';
import { LovPeriodoComponent } from './componentes/lov.periodo.component';

@NgModule({
  imports: [SharedModule, LovPeriodoRoutingModule],
  declarations: [LovPeriodoComponent],
  exports: [LovPeriodoComponent]
})
export class LovPeriodoModule { }

