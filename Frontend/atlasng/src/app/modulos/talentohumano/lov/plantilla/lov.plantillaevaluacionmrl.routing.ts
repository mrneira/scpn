import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovPlantillaEvaluacion } from './componentes/lov.plantillaevaluacionmrl.component';

const routes: Routes = [
  {
    path: '', component: LovPlantillaEvaluacion,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovPlantillaEvaluacionMrlRoutingModule {}
