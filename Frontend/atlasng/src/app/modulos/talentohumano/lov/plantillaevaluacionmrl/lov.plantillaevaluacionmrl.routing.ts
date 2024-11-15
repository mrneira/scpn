import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovPlantillaEvaluacionMrlComponent } from './componentes/lov.plantillaevaluacionmrl.component';

const routes: Routes = [
  {
    path: '', component: LovPlantillaEvaluacionMrlComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovPlantillaEvaluacionMrlRoutingModule {}
