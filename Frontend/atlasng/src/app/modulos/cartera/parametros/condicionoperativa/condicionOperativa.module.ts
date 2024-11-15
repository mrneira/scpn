import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CondicionOperativaRoutingModule } from './condicionOperativa.routing';

import { CondicionOperativaComponent } from './componentes/condicionOperativa.component';

@NgModule({
  imports: [SharedModule, CondicionOperativaRoutingModule ],
  declarations: [CondicionOperativaComponent]
})
export class CondicionOperativaModule { }
