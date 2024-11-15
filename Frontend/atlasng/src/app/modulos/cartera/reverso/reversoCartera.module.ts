import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { ReversoCarteraRoutingModule } from './reversoCartera.routing';

import { ReversoCarteraComponent } from './componentes/reversoCartera.component';

import { LovPersonasModule } from '../../personas/lov/personas/lov.personas.module';
import { LovOperacionCarteraModule } from '../lov/operacion/lov.operacionCartera.module';
import { LovTransaccionesModule } from '../../generales/lov/transacciones/lov.transacciones.module';

@NgModule({
  imports: [SharedModule, ReversoCarteraRoutingModule, LovPersonasModule, LovOperacionCarteraModule, LovTransaccionesModule],
  declarations: [ReversoCarteraComponent]
})
export class ReversoCarteraModule { }
