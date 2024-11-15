import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovConceptoContablesRoutingModule } from './lov.conceptoContables.routing';

import { LovConceptoContablesComponent } from './componentes/lov.conceptoContables.component';


@NgModule({
  imports: [SharedModule, LovConceptoContablesRoutingModule],
  declarations: [LovConceptoContablesComponent],
  exports: [LovConceptoContablesComponent]
})
export class LovConceptoContablesModule { }

