import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { InicioDiaRoutingModule } from './inicioDia.routing';

import { InicioDiaComponent } from './componentes/inicioDia.component';

@NgModule({
  imports: [SharedModule, InicioDiaRoutingModule ],
  declarations: [InicioDiaComponent]
})
export class InicioDiaModule { }
