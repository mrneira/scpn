import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CuposLiquidacionRoutingModule } from './cuposliquidacion.routing';
import { CuposLiquidacionComponent } from './componentes/cuposliquidacion.component';


@NgModule({
  imports: [SharedModule, CuposLiquidacionRoutingModule ],
  declarations: [CuposLiquidacionComponent]
})
export class CuposLiquidacionModule { }
