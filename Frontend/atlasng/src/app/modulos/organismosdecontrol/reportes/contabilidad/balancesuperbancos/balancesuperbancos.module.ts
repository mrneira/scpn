import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { BalanceSuperBancosRoutingModule } from './balancesuperbancos.routing';
import { BalanceSuperBancosComponent } from './componentes/balancesuperbancos.component';
import { JasperModule } from '../../../../../util/componentes/jasper/jasper.module';



@NgModule({
  imports: [SharedModule, BalanceSuperBancosRoutingModule, JasperModule ],
  declarations: [BalanceSuperBancosComponent]
})
export class BalanceSuperBancosModule { }
