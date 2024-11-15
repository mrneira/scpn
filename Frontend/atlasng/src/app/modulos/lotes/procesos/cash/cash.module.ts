import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CashRoutingModule } from './cash.routing';

import { CashComponent } from './componentes/cash.component';

@NgModule({
  imports: [SharedModule, CashRoutingModule ],
  declarations: [CashComponent]
})
export class CashModule { }
