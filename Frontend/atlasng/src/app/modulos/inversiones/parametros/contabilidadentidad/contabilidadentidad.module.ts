import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ContabilidadentidadRoutingModule } from './contabilidadentidad.routing';

import { ContabilidadentidadComponent } from './componentes/contabilidadentidad.component';
import { LovCuentasContablesModule } from '../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';

@NgModule({
  imports: [SharedModule, ContabilidadentidadRoutingModule, LovCuentasContablesModule],
  declarations: [ContabilidadentidadComponent]
})
export class ContabilidadentidadModule { }
