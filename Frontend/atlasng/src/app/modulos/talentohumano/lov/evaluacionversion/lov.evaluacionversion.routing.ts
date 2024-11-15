import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovEvaluacionversionComponent } from './componentes/lov.evaluacionversion.component';

const routes: Routes = [
  {
    path: '', component: LovEvaluacionversionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovEvaluacionversionRoutingModule {}
