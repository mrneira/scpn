import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ContabilizacionAccrualRoutingModule } from './contabilizacionAccrual.routing';

import { ContabilizacionAccrualComponent } from './componentes/contabilizacionAccrual.component';
@NgModule({
  imports: [SharedModule, ContabilizacionAccrualRoutingModule],
  declarations: [ContabilizacionAccrualComponent]
})
export class ContabilizacionAccrualModule { }
