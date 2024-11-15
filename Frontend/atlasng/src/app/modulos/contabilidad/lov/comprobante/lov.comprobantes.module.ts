import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovComprobantesRoutingModule } from './lov.comprobantes.routing';

import { LovComprobantesComponent } from './componentes/lov.comprobantes.component';


@NgModule({
  imports: [SharedModule, LovComprobantesRoutingModule],
  declarations: [LovComprobantesComponent],
  exports: [LovComprobantesComponent]
})
export class LovComprobantesModule { }

