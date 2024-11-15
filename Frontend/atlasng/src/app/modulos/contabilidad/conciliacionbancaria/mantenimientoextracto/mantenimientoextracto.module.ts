import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { MantenimientoextractoRoutingModule } from './mantenimientoextracto.routing';

import { MantenimientoextractoComponent } from './componentes/mantenimientoextracto.component';

import { LovCuentasContablesModule } from '../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';

@NgModule({
  imports: [SharedModule, MantenimientoextractoRoutingModule, LovCuentasContablesModule ],
  declarations: [MantenimientoextractoComponent],
  exports: [MantenimientoextractoComponent]
})
export class MantenimientoextractoModule { }
