import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EvaluacionAtributoRoutingModule } from './evaluacionAtributo.routing';

import { EvaluacionAtributoComponent } from './componentes/evaluacionAtributo.component';


@NgModule({
  imports: [SharedModule, EvaluacionAtributoRoutingModule ],
  declarations: [EvaluacionAtributoComponent]
})
export class EvaluacionAtributoModule { }
