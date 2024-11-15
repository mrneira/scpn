import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { TipoBienRoutingModule } from './tipoBien.routing';

import { TipoBienComponent } from './componentes/tipoBien.component';


@NgModule({
  imports: [SharedModule, TipoBienRoutingModule ],
  declarations: [TipoBienComponent]
})
export class TipoBienModule { }
