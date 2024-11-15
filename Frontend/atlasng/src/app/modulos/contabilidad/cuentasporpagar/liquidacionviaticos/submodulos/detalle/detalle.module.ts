import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { DetalleRoutingModule } from './detalle.routing';
import { DetalleComponent } from './componentes/_detalle.component';

import { LovCuentasContablesModule } from '../../../../lov/cuentascontables/lov.cuentasContables.module';
import { LovPartidaGastoModule } from 'app/modulos/presupuesto/lov/partidagasto/lov.partidagasto.module';


@NgModule({
  imports: [SharedModule, DetalleRoutingModule, LovPartidaGastoModule, LovCuentasContablesModule ],
  declarations: [DetalleComponent],
  exports: [DetalleComponent]
})
export class DetalleModule { }
