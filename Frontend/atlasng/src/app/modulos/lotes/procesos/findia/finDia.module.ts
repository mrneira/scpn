import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { FinDiaRoutingModule } from './finDia.routing';

import { FinDiaComponent } from './componentes/finDia.component';

@NgModule({
  imports: [SharedModule, FinDiaRoutingModule],
  declarations: [FinDiaComponent]
})
export class FinDiaModule { }
