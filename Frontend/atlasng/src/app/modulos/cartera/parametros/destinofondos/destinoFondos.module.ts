import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { DestinoFondosRoutingModule } from './destinoFondos.routing';

import { DestinoFondosComponent } from './componentes/destinoFondos.component';


@NgModule({
  imports: [SharedModule, DestinoFondosRoutingModule ],
  declarations: [DestinoFondosComponent]
})
export class DestinoFondosModule { }
