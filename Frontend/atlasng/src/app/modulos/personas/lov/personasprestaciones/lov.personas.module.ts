import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovPersonasRoutingModule } from './lov.personas.routing';

import { LovPersonasComponent } from './componentes/lov.personas.component';

@NgModule({
  imports: [SharedModule, LovPersonasRoutingModule],
  declarations: [LovPersonasComponent],
  exports: [LovPersonasComponent],
})
export class LovPersonasPrestacionesModule { }

