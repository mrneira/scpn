import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { LoteResultadoPrevioRoutingModule } from './_loteResultadoPrevio.routing';

import { LoteResultadoPrevioComponent } from './componentes/_loteResultadoPrevio.component';

@NgModule({
  imports: [SharedModule, LoteResultadoPrevioRoutingModule],
  declarations: [LoteResultadoPrevioComponent],
  exports: [LoteResultadoPrevioComponent]
})
export class LoteResultadoPrevioModule { }
