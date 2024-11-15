import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { LiquidacionRoutingModule } from './liquidacion.routing';

import { LiquidaciomComponent } from './componentes/liquidacion.component';

@NgModule({
  imports: [SharedModule, LiquidacionRoutingModule ],
  declarations: [LiquidaciomComponent],
  exports: [LiquidaciomComponent]
})
export class LiquidacionModule { }
