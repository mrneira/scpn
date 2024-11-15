import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { LoteResultadoIndividualRoutingModule } from './_loteResultadoIndividual.routing';

import { LoteResultadoIndividualComponent } from './componentes/_loteResultadoIndividual.component';

@NgModule({
  imports: [SharedModule, LoteResultadoIndividualRoutingModule],
  declarations: [LoteResultadoIndividualComponent],
  exports: [LoteResultadoIndividualComponent]
})
export class LoteResultadoIndividualModule { }
