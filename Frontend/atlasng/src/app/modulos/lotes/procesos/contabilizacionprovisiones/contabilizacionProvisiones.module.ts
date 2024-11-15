import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ContabilizacionProvisionesRoutingModule } from './contabilizacionProvisiones.routing';

import { ContabilizacionProvisionesComponent } from './componentes/contabilizacionProvisiones.component';
import { LovTransaccionesModule } from '../../../generales/lov/transacciones/lov.transacciones.module';

@NgModule({
  imports: [SharedModule, ContabilizacionProvisionesRoutingModule, LovTransaccionesModule ],
  declarations: [ContabilizacionProvisionesComponent]
})
export class ContabilizacionProvisionesModule { }
