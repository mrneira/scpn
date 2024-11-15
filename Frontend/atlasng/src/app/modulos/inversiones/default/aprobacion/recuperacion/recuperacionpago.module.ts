import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { RecuperacionPagoRoutingModule } from './recuperacionpago.routing';

import { RecuperacionPagoComponent } from './componentes/recuperacionpago.component';

import { SplitButtonModule } from 'primeng/components/splitbutton/splitbutton';

@NgModule({
  imports: [SharedModule, RecuperacionPagoRoutingModule,SplitButtonModule ],
  declarations: [RecuperacionPagoComponent]
})
export class RecuperacionPagoModule { }
