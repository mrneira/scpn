import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovTransaccionesRoutingModule } from './lov.transacciones.routing';

import { LovTransaccionesComponent } from './componentes/lov.transacciones.component';
import { ModulosModule } from '../../modulos/modulos.module';

@NgModule({
  imports: [SharedModule, LovTransaccionesRoutingModule, ModulosModule],
  declarations: [LovTransaccionesComponent],
  exports: [LovTransaccionesComponent]
})
export class LovTransaccionesModule { }

