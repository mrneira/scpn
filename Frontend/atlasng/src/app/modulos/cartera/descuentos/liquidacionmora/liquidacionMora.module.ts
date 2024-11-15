import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LiquidacionMoraRoutingModule } from './liquidacionMora.routing';
import { LiquidacionMoraComponent } from './componentes/liquidacionMora.component';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovPersonaVistaModule } from '../../../personas/lov/personavista/lov.personaVista.module';
import { LovOperacionCarteraModule } from '../../lov/operacion/lov.operacionCartera.module';

@NgModule({
  imports: [SharedModule, LiquidacionMoraRoutingModule, LovPersonasModule, LovPersonaVistaModule, LovOperacionCarteraModule],
  declarations: [LiquidacionMoraComponent]
})
export class LiquidacionMoraModule { }
