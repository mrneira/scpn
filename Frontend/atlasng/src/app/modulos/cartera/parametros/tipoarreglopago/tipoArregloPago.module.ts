import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { TipoArregloPagoRoutingModule } from './tipoArregloPago.routing';

import { TipoArregloPagoComponent } from './componentes/tipoArregloPago.component';


@NgModule({
  imports: [SharedModule, TipoArregloPagoRoutingModule ],
  declarations: [TipoArregloPagoComponent]
})
export class TipoArregloPagoModule { }
