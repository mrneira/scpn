import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { SimulacionDescuentosRoutingModule } from './simulacionDescuentos.routing';
import { SimulacionDescuentosComponent } from './componentes/simulacionDescuentos.component';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovOperacionCarteraModule } from '../../lov/operacion/lov.operacionCartera.module';

@NgModule({
  imports: [SharedModule, SimulacionDescuentosRoutingModule, LovPersonasModule, LovOperacionCarteraModule],
  declarations: [SimulacionDescuentosComponent]
})
export class SimulacionDescuentosModule { }
