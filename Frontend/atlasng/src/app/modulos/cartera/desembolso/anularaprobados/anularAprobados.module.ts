import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovOperacionCarteraModule } from '../../lov/operacion/lov.operacionCartera.module';
import { AnularCarteraRoutingModule } from './anularAprobados.routing';
import { AnularAprobadosComponent } from './componentes/anularAprobados.component';

@NgModule({
  imports: [SharedModule, AnularCarteraRoutingModule, LovPersonasModule, LovOperacionCarteraModule],
  declarations: [AnularAprobadosComponent ]
})
export class AnularAprobadosModule { }
