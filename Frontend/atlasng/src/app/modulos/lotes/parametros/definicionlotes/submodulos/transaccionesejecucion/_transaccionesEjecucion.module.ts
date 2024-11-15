import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { TransaccionesEjecucionRoutingModule } from './_transaccionesEjecucion.routing';

import { TransaccionesEjecucionComponent } from './componentes/_transaccionesEjecucion.component';
import { LovTransaccionesModule } from '../../../../../generales/lov/transacciones/lov.transacciones.module';

@NgModule({
  imports: [SharedModule, TransaccionesEjecucionRoutingModule, LovTransaccionesModule],
  declarations: [TransaccionesEjecucionComponent],
  exports: [TransaccionesEjecucionComponent]
})
export class TransaccionesEjecucionModule { }
