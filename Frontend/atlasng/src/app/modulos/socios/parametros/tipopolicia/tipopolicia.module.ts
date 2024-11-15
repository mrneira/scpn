import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { TipoPoliciaRoutingModule } from './tipopolicia.routing';

import { TipoPoliciaComponent } from './componentes/tipopolicia.component';


@NgModule({
  imports: [SharedModule, TipoPoliciaRoutingModule ],
  declarations: [TipoPoliciaComponent]
})
export class TipoPoliciaModule { }
