import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { DestrezasRoutingModule } from './destrezas.routing';

import { DestrezasComponent } from './componentes/destrezas.component';


@NgModule({
  imports: [SharedModule, DestrezasRoutingModule ],
  declarations: [DestrezasComponent]
})
export class DestrezasModule { }
