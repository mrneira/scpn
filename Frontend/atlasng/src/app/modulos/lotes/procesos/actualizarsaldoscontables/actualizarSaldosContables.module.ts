import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ActualizarSaldosContablesRoutingModule } from './actualizarSaldosContables.routing';

import { ActualizarSaldosContablesComponent } from './componentes/actualizarSaldosContables.component';
import { LovTransaccionesModule } from '../../../generales/lov/transacciones/lov.transacciones.module';

@NgModule({
  imports: [SharedModule, ActualizarSaldosContablesRoutingModule, LovTransaccionesModule],
  declarations: [ActualizarSaldosContablesComponent]
})
export class ActualizarSaldosContablesModule { }
