import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovLiquidacionesRoutingModule } from './lov.liquidaciones.routing';

import { LovLiquidacionesComponent } from './componentes/lov.liquidaciones.component';

@NgModule({
  imports: [SharedModule, LovLiquidacionesRoutingModule],
  declarations: [LovLiquidacionesComponent],
  exports: [LovLiquidacionesComponent]
})
export class LovLiquidacionesModule { }

