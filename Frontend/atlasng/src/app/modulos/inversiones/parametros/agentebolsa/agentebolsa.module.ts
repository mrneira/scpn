import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AgenteBolsaRoutingModule } from './agentebolsa.routing';

import { AgenteBolsaComponent } from './componentes/agentebolsa.component';


@NgModule({
  imports: [SharedModule, AgenteBolsaRoutingModule ],
  declarations: [AgenteBolsaComponent]
})
export class AgenteBolsaModule { }
