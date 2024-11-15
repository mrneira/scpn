import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { AvaluoRoutingModule } from './_avaluo.routing';

import { AvaluoComponent } from './componentes/_avaluo.component';
import { LovPersonasModule } from '../../../../../personas/lov/personas/lov.personas.module';

@NgModule({
  imports: [SharedModule, AvaluoRoutingModule, LovPersonasModule],
  declarations: [AvaluoComponent],
  exports: [AvaluoComponent]
})
export class AvaluoModule { }
