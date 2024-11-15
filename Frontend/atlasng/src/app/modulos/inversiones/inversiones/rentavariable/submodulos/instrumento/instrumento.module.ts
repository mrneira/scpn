import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { InstrumentoRoutingModule } from './instrumento.routing';
import { LovAgentesbolsaModule } from '../../../../../inversiones/lov/agentesbolsa/lov.agentesbolsa.module';

import { InstrumentoComponent } from './componentes/instrumento.component';

@NgModule({
  imports: [
    SharedModule
    , InstrumentoRoutingModule
    , LovAgentesbolsaModule ],
  declarations: [InstrumentoComponent],
  exports: [InstrumentoComponent]
})
export class InstrumentoModule { }
