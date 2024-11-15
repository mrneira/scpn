import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConsultaDescuentosRoutingModule } from './consultaDescuentos.routing';
import { ConsultaDescuentosComponent } from './componentes/consultaDescuentos.component';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovPersonaVistaModule } from '../../../personas/lov/personavista/lov.personaVista.module';
import { LovOperacionCarteraModule } from '../../lov/operacion/lov.operacionCartera.module';

@NgModule({
  imports: [SharedModule, ConsultaDescuentosRoutingModule, LovPersonasModule, LovPersonaVistaModule, LovOperacionCarteraModule],
  declarations: [ConsultaDescuentosComponent]
})
export class ConsultaDescuentosModule { }
