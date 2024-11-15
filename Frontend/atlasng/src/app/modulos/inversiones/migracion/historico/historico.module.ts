import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { HistoricoRoutingModule } from './historico.routing';
import { HistoricoComponent } from './componentes/historico.component';

import { ResultadoCargaModule } from './submodulos/resultadocarga/resultadocarga.module';

@NgModule({
  imports: [SharedModule, HistoricoRoutingModule, ResultadoCargaModule],
  declarations: [HistoricoComponent]
})
export class HistoricoModule { }
