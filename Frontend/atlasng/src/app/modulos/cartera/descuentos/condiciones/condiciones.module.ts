import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CondicionesDescuentosRoutingModule } from './condiciones.routing';
import { CondicionesDescuentosComponent } from './componentes/condiciones.component';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovOperacionCarteraModule } from '../../lov/operacion/lov.operacionCartera.module';

@NgModule({
  imports: [SharedModule, CondicionesDescuentosRoutingModule, LovPersonasModule, LovOperacionCarteraModule],
  declarations: [CondicionesDescuentosComponent]
})
export class CondicionesDescuentosModule { }
