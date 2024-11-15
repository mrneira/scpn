import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovEvaluacionversionRoutingModule } from './lov.evaluacionversion.routing';
import { LovEvaluacionversionComponent } from './componentes/lov.evaluacionversion.component';

@NgModule({
  imports: [SharedModule, LovEvaluacionversionRoutingModule],
  declarations: [LovEvaluacionversionComponent],
  exports: [LovEvaluacionversionComponent]
})
export class LovEvaluacionversionModule { }

