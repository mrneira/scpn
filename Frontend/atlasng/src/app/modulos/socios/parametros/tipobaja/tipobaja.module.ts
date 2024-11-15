import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { TipoBajaRoutingModule } from './tipobaja.routing';

import { TipoBajaComponent } from './componentes/tipobaja.component';


@NgModule({
  imports: [SharedModule, TipoBajaRoutingModule ],
  declarations: [TipoBajaComponent]
})
export class TipoBajaModule { }
