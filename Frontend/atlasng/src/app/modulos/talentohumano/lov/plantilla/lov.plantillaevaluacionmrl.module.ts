import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovPlantillaEvaluacionMrlRoutingModule } from './lov.plantillaevaluacionmrl.routing';
import { LovPlantillaEvaluacion } from './componentes/lov.plantillaevaluacionmrl.component';

@NgModule({
  imports: [SharedModule, LovPlantillaEvaluacionMrlRoutingModule],
  declarations: [LovPlantillaEvaluacion],
  exports: [LovPlantillaEvaluacion]
})
export class LovPlantillaModule { }

