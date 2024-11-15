import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { LoteResultadoFinRoutingModule } from './_loteResultadoFin.routing';

import { LoteResultadoFinComponent } from './componentes/_loteResultadoFin.component';

@NgModule({
  imports: [SharedModule, LoteResultadoFinRoutingModule],
  declarations: [LoteResultadoFinComponent],
  exports: [LoteResultadoFinComponent]
})
export class LoteResultadoFinModule { }
