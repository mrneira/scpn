import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovEvaluacionRoutingModule } from './lov.evaluacion.routing';
import { LovEvaluacionComponent } from './componentes/lov.evaluacion.component';

@NgModule({
  imports: [SharedModule, LovEvaluacionRoutingModule],
  declarations: [LovEvaluacionComponent],
  exports: [LovEvaluacionComponent]
})
export class LovEvaluacionModule { }

