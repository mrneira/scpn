import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovEvaluacionComponent } from './componentes/lov.evaluacion.component';

const routes: Routes = [
  {
    path: '', component: LovEvaluacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovEvaluacionRoutingModule {}
