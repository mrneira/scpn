import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { CompletarCarteraRoutingModule } from './completarCartera.routing';

import { CompletarCarteraComponent } from './componentes/completarCartera.component';

@NgModule({
  imports: [SharedModule, CompletarCarteraRoutingModule],
  declarations: [CompletarCarteraComponent]
})
export class CompletarCarteraModule { }
