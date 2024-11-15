import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovAgentesbolsaRoutingModule } from './lov.agentesbolsa.routing';

import { LovAgentesbolsaComponent } from './componentes/lov.agentesbolsa.component';

@NgModule({
  imports: [SharedModule, LovAgentesbolsaRoutingModule],
  declarations: [LovAgentesbolsaComponent],
  exports: [LovAgentesbolsaComponent],
})
export class LovAgentesbolsaModule { }