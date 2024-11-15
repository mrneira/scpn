import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { MantenimientomayorRoutingModule } from './mantenimientomayor.routing';

import { MantenimientomayorComponent } from './componentes/mantenimientomayor.component';

import { LovCuentasContablesModule } from '../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';


@NgModule({
  imports: [SharedModule, 
    MantenimientomayorRoutingModule, 
    LovCuentasContablesModule ],
  declarations: [MantenimientomayorComponent],
  exports: [MantenimientomayorComponent]
})
export class MantenimientomayorModule { }
