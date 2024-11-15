import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ContabilidadagenteRoutingModule } from './contabilidadagente.routing';

import { ContabilidadagenteComponent } from './componentes/contabilidadagente.component';
import { LovAgentesbolsaModule } from '../../lov/agentesbolsa/lov.agentesbolsa.module';
import { LovCuentasContablesModule } from '../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';

@NgModule({
  imports: [SharedModule, ContabilidadagenteRoutingModule, LovAgentesbolsaModule, LovCuentasContablesModule ],
  declarations: [ContabilidadagenteComponent]
})
export class ContabilidadagenteModule { }
