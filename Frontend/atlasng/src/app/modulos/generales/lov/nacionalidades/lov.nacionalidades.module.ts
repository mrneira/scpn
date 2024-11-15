import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovNacionalidadesRoutingModule } from './lov.nacionalidades.routing';

import { LovNacionalidadesComponent } from './componentes/lov.nacionalidades.component';

@NgModule({
  imports: [SharedModule, LovNacionalidadesRoutingModule],
  declarations: [LovNacionalidadesComponent],
  exports: [LovNacionalidadesComponent],
})
export class LovNacionalidadesModule { }

