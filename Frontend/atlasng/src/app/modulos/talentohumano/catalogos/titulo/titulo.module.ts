import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { TituloRoutingModule } from './titulo.routing';

import { TituloComponent } from './componentes/titulo.component';

@NgModule({
  imports: [SharedModule, TituloRoutingModule ],
  declarations: [TituloComponent]
})
export class TituloModule { }
