import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { SbsRoutingModule } from './sbs.routing';
import { LovAgentesbolsaModule } from '../../../../../inversiones/lov/agentesbolsa/lov.agentesbolsa.module';
import { LovCuentasContablesModule } from '../../../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';

import { SbsComponent } from './componentes/sbs.component';

@NgModule({
  imports: [
    SharedModule
    , SbsRoutingModule
    , LovAgentesbolsaModule, LovCuentasContablesModule ],
  declarations: [SbsComponent],
  exports: [SbsComponent]
})
export class SbsModule { }
