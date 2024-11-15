import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovCuentasContablesModule } from '../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';
import { DesembolsoCarteraRoutingModule } from './desembolsoCartera.routing';
import { DesembolsoCarteraComponent } from './componentes/desembolsoCartera.component';
import { DesembolsoTransferenciaComponent } from './componentes/_desembolsoTransferencia.component';
import { DesembolsoOtrosComponent } from './componentes/_desembolsoOtros.component';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovOperacionCarteraModule } from '../../lov/operacion/lov.operacionCartera.module';

@NgModule({
  imports: [SharedModule, DesembolsoCarteraRoutingModule, LovPersonasModule, LovOperacionCarteraModule, LovCuentasContablesModule],
  declarations: [DesembolsoCarteraComponent, DesembolsoTransferenciaComponent, DesembolsoOtrosComponent]
})
export class DesembolsoCarteraModule { }
