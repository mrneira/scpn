import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ParametrosSecuencialRoutingModule } from './parametrossecuencial.routing';

import { ParametrosSecuencialComponent } from './componentes/parametrossecuencial.component';


@NgModule({
  imports: [SharedModule, ParametrosSecuencialRoutingModule],
  declarations: [ParametrosSecuencialComponent]
})
export class ParametrosSecuencialModule { }
