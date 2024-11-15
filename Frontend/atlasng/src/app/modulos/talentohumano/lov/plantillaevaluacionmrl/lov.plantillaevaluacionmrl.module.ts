import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovPlantillaEvaluacionMrlRoutingModule } from './lov.plantillaevaluacionmrl.routing';
import { LovPlantillaEvaluacionMrlComponent } from './componentes/lov.plantillaevaluacionmrl.component';

@NgModule({
  imports: [SharedModule, LovPlantillaEvaluacionMrlRoutingModule],
  declarations: [LovPlantillaEvaluacionMrlComponent],
  exports: [LovPlantillaEvaluacionMrlComponent]
})
export class LovPlantillaEvaluacionMrlModule { }

