import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovSaldoRoutingModule } from './lov.saldo.routing';

import { LovSaldoComponent } from './componentes/lov.saldo.component';


@NgModule({
  imports: [SharedModule, LovSaldoRoutingModule],
  declarations: [LovSaldoComponent],
  exports: [LovSaldoComponent]
})
export class LovSaldoModule { }

