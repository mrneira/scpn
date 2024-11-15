import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovProcesoRoutingModule } from './lov.proceso.routing';

import { LovProcesoComponent } from './componentes/lov.proceso.component';

@NgModule({
  imports: [SharedModule, LovProcesoRoutingModule],
  declarations: [LovProcesoComponent],
  exports: [LovProcesoComponent],
})
export class LovProcesoModule { }

