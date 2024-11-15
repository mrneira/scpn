import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import {LiquidacionRoutingModule  } from './liquidacion.routing';

import { LiquidacionComponent } from './componentes/liquidacion.component';


@NgModule({
  imports: [SharedModule, LiquidacionRoutingModule ],
  declarations: [LiquidacionComponent]
})
export class LiquidacionModule { }
