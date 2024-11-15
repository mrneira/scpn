import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { DestrezaRoutingModule } from './destreza.routing';

import { DestrezaComponent } from './componentes/destreza.component';


@NgModule({
  imports: [SharedModule, DestrezaRoutingModule ],
  declarations: [DestrezaComponent]
})
export class DestrezaDetalleModule { }
