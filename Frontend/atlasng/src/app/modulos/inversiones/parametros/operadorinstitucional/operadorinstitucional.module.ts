import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { OperadorinstitucionalRoutingModule } from './operadorinstitucional.routing';

import { OperadorinstitucionalComponent } from './componentes/operadorinstitucional.component';

@NgModule({
  imports: [SharedModule, OperadorinstitucionalRoutingModule],
  declarations: [OperadorinstitucionalComponent]
})
export class OperadorinstitucionalModule { }
