import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CalificacionArregloPagoRoutingModule } from './calificacionArregloPago.routing';

import { CalificacionArregloPagoComponent } from './componentes/calificacionArregloPago.component';


@NgModule({
  imports: [SharedModule, CalificacionArregloPagoRoutingModule ],
  declarations: [CalificacionArregloPagoComponent]
})
export class CalificacionArregloPagoModule { }
