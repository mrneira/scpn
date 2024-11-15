import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LiquidacionBajaRoutingModule } from './liquidacionBaja.routing';

import { LiquidacionBajaComponent } from './componentes/liquidacionBaja.component';
import {LovTipoBajaModule} from '../../../socios/lov/tipobaja/lov.tipoBaja.module';


@NgModule({
  imports: [SharedModule, LiquidacionBajaRoutingModule , LovTipoBajaModule ],
  declarations: [LiquidacionBajaComponent]
})
export class LiquidacionBajaModule { }
