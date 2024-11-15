import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovCiudadesRoutingModule } from './lov.ciudades.routing';

import { LovCiudadesComponent } from './componentes/lov.ciudades.component';

@NgModule({
  imports: [SharedModule, LovCiudadesRoutingModule],
  declarations: [LovCiudadesComponent],
  exports: [LovCiudadesComponent],
})
export class LovCiudadesModule { }
