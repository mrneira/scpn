import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { RangosTasaMoraRoutingModule } from './rangosTasaMora.routing';

import { RangosTasaMoraComponent } from './componentes/rangosTasaMora.component';


@NgModule({
  imports: [SharedModule, RangosTasaMoraRoutingModule ],
  declarations: [RangosTasaMoraComponent]
})
export class RangosTasaMoraModule { }
