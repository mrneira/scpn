import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CalificacionActivosRoutingModule } from './calificacionActivos.routing';

import { CalificacionActivosComponent } from './componentes/calificacionActivos.component';
import { LovTransaccionesModule } from '../../../generales/lov/transacciones/lov.transacciones.module';

@NgModule({
  imports: [SharedModule, CalificacionActivosRoutingModule, LovTransaccionesModule ],
  declarations: [CalificacionActivosComponent]
})
export class CalificacionActivosModule { }
