import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { EtapaProcesalRoutingModule } from './etapaProcesal.routing';

import { EtapaProcesalComponent } from './componentes/etapaProcesal.component';

import { LovPersonasModule } from '../../personas/lov/personas/lov.personas.module';
import {LovOperacionCobranzaModule} from '../lov/operacion/lov.operacionCobranza.module';
@NgModule({
  imports: [SharedModule, EtapaProcesalRoutingModule, LovPersonasModule, LovOperacionCobranzaModule],
  declarations: [EtapaProcesalComponent]
})
export class EtapaProcesalModule { }
