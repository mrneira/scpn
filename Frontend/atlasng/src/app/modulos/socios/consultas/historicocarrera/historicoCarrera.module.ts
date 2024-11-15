import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { HistoricoCarreraRoutingModule } from './historicoCarrera.routing';

import { HistoricoCarreraComponent } from './componentes/historicoCarrera.component';

import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';


@NgModule({
  imports: [SharedModule, HistoricoCarreraRoutingModule, LovPersonasModule ],
  declarations: [HistoricoCarreraComponent]
})
export class HistoricoCarreraModule { }
