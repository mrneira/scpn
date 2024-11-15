import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EvaluacionVersionRoutingModule } from './evaluacionVersion.routing';

import { EvaluacionVersionComponent } from './componentes/evaluacionVersion.component';


@NgModule({
  imports: [SharedModule, EvaluacionVersionRoutingModule ],
  declarations: [EvaluacionVersionComponent]
})
export class EvaluacionVersionModule { }
