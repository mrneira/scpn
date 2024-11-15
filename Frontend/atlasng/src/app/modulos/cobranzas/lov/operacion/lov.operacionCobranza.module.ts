import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovOperacionCobranzaRoutingModule } from './lov.operacionCobranza.routing';

import { LovOperacionCobranzaComponent } from './componentes/lov.operacionCobranza.component';


@NgModule({
  imports: [SharedModule, LovOperacionCobranzaRoutingModule],
  declarations: [LovOperacionCobranzaComponent],
  exports: [LovOperacionCobranzaComponent]
})
export class LovOperacionCobranzaModule { }

