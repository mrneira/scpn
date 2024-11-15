import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { LogTransaccionRoutingModule } from './logtransaccion.routing';

import { LogTransaccionComponent } from './componentes/logTransaccion.component';


@NgModule({
  imports: [SharedModule, LogTransaccionRoutingModule ],
  declarations: [LogTransaccionComponent]
})
export class LogTransaccionModule { }
