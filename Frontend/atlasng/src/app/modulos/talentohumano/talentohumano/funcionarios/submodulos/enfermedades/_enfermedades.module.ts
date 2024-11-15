import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { EnfermedadesRoutingModule } from './_enfermedades.routing';

import { EnfermedadesComponent } from './componentes/_enfermedades.component';

@NgModule({
  imports: [SharedModule, EnfermedadesRoutingModule],
  declarations: [EnfermedadesComponent],
  exports: [EnfermedadesComponent]
})
export class EnfermedadesModule { }
