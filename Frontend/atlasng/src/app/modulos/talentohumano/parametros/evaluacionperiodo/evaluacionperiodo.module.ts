import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EvaluacionperiodoRoutingModule } from './evaluacionperiodo.routing';

import { EvaluacionperiodoComponent } from './componentes/evaluacionperiodo.component';


@NgModule({
  imports: [SharedModule, EvaluacionperiodoRoutingModule ],
  declarations: [EvaluacionperiodoComponent]
})
export class EvaluacionperiodoModule { }
