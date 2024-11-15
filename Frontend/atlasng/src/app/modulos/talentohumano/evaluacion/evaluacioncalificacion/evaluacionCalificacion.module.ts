import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EvaluacionCalificacionRoutingModule } from './evaluacionCalificacion.routing';

import { EvaluacionCalificacionComponent } from './componentes/evaluacionCalificacion.component';


@NgModule({
  imports: [SharedModule, EvaluacionCalificacionRoutingModule ],
  declarations: [EvaluacionCalificacionComponent]
})
export class EvaluacionCalificacionModule { }
