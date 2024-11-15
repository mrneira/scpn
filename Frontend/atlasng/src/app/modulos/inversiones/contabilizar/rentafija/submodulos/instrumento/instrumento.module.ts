import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { InstrumentoRoutingModule } from './instrumento.routing';
import { LovAgentesbolsaModule } from '../../../../../inversiones/lov/agentesbolsa/lov.agentesbolsa.module';
import { LovCuentasContablesModule } from '../../../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';

import { InstrumentoComponent } from './componentes/instrumento.component';

@NgModule({
  imports: [
    SharedModule
    , InstrumentoRoutingModule
    , LovAgentesbolsaModule, LovCuentasContablesModule ],
  declarations: [InstrumentoComponent],
  exports: [InstrumentoComponent]
})
export class InstrumentoModule { }
