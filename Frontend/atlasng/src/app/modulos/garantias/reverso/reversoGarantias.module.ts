import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { ReversoGarantiasRoutingModule } from './reversoGarantias.routing';

import { ReversoGarantiasComponent } from './componentes/reversoGarantias.component';

import { LovPersonasModule } from '../../personas/lov/personas/lov.personas.module';
import { LovOperacionGarModule } from '../lov/operacion/lov.operacionGar.module';
import { LovTransaccionesModule } from '../../generales/lov/transacciones/lov.transacciones.module';

@NgModule({
  imports: [SharedModule, ReversoGarantiasRoutingModule, LovPersonasModule, LovOperacionGarModule, LovTransaccionesModule],
  declarations: [ReversoGarantiasComponent]
})
export class ReversoGarantiasModule { }
