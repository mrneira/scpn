import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ModulosRoutingModule } from './porcentajesRetencionAir.routing';

import { PorcentajesRetencionAirComponent } from './componentes/porcentajesRetencionAir.component';

import { LovCuentasContablesModule } from '../../lov/cuentascontables/lov.cuentasContables.module';


@NgModule({
  imports: [SharedModule, ModulosRoutingModule, LovCuentasContablesModule],
  declarations: [PorcentajesRetencionAirComponent]
})
export class PorcentajesRetencionAirModule { }
