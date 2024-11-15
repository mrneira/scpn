import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { ConsultaPagoRoutingModule } from './consultaPago.routing';

import { ConsultaPagoComponent } from './componentes/consultaPago.component';

@NgModule({
  imports: [SharedModule, ConsultaPagoRoutingModule],
  declarations: [ConsultaPagoComponent]
})
export class ConsultaPagoModule { }
