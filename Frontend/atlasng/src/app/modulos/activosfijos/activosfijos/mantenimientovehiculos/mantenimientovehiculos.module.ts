import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { MantenimientoVehiculosRoutingModule } from './mantenimientovehiculos.routing';
import { MantenimientoVehiculosComponent } from './componentes/mantenimientovehiculos.component';
import { LovCuentasContablesModule } from '../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';

import { GestorDocumentalModule } from '../../../gestordocumental/gestordocumental.module';
@NgModule({
  imports: [SharedModule, MantenimientoVehiculosRoutingModule, LovCuentasContablesModule,GestorDocumentalModule ],
  declarations: [MantenimientoVehiculosComponent]
})
export class MantenimientoVehiculosModule { }
