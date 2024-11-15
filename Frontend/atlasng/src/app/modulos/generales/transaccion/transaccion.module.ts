import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { TransaccionRoutingModule } from './transaccion.routing';

import { TransaccionComponent } from './componentes/transaccion.component';


@NgModule({
  imports: [SharedModule, TransaccionRoutingModule ],
  declarations: [TransaccionComponent]
})
export class TransaccionModule { }
