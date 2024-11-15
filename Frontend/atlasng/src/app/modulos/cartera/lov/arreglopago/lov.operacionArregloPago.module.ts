import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovOperacionArregloPagoRoutingModule } from './lov.operacionArregloPago.routing';
import { LovOperacionArregloPagoComponent } from './componentes/lov.operacionArregloPago.component';

@NgModule({
  imports: [SharedModule, LovOperacionArregloPagoRoutingModule],
  declarations: [LovOperacionArregloPagoComponent],
  exports: [LovOperacionArregloPagoComponent]
})
export class LovOperacionArregloPagoModule { }

