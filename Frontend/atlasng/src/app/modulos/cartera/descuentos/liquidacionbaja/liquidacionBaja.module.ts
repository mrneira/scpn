import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LiquidacionBajaRoutingModule } from './liquidacionBaja.routing';
import { LiquidacionBajaComponent } from './componentes/liquidacionBaja.component';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovPersonaVistaModule } from '../../../personas/lov/personavista/lov.personaVista.module';
import { LovOperacionCarteraModule } from '../../lov/operacion/lov.operacionCartera.module';

@NgModule({
  imports: [SharedModule, LiquidacionBajaRoutingModule, LovPersonasModule, LovPersonaVistaModule, LovOperacionCarteraModule],
  declarations: [LiquidacionBajaComponent]
})
export class LiquidacionBajaModule { }
