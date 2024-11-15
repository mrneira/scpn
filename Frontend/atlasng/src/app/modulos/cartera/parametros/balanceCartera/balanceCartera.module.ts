import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { BalanceCarteraRoutingModule } from './balanceCartera.routing';

import { BalanceCarteraComponent } from './componentes/balanceCartera.component';


@NgModule({
  imports: [SharedModule, BalanceCarteraRoutingModule],
  declarations: [BalanceCarteraComponent]
})
export class BalanceCarteraModule { }
