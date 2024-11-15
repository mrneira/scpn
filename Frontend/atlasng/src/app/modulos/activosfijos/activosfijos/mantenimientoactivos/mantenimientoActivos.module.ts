import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { MantenimientoActivosRoutingModule } from './mantenimientoActivos.routing';
import { MantenimientoActivosComponent } from './componentes/mantenimientoActivos.component';
import { LovCuentasContablesModule } from '../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';

import { GestorDocumentalModule } from '../../../gestordocumental/gestordocumental.module';
@NgModule({
  imports: [SharedModule, MantenimientoActivosRoutingModule, LovCuentasContablesModule,GestorDocumentalModule ],
  declarations: [MantenimientoActivosComponent]
})
export class MantenimientoActivosModule { }
