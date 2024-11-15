import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { RubrosArregloPagoRoutingModule } from './rubrosArregloPago.routing';
import { LovSaldoModule } from '../../../monetario/lov/saldo/lov.saldo.module';

import { RubrosArregloPagoComponent } from './componentes/rubrosArregloPago.component';


@NgModule({
  imports: [SharedModule, RubrosArregloPagoRoutingModule, LovSaldoModule ],
  declarations: [RubrosArregloPagoComponent]
})
export class RubrosArregloPagoModule { }
