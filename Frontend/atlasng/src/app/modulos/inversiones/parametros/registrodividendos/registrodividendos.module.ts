import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { RegistrodividendosRoutingModule } from './registrodividendos.routing';

import { RegistrodividendosComponent } from './componentes/registrodividendos.component';

@NgModule({
  imports: [SharedModule, RegistrodividendosRoutingModule],
  declarations: [RegistrodividendosComponent]
})
export class RegistrodividendosModule { }
