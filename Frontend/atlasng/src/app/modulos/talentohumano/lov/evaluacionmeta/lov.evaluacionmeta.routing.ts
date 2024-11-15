import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovEvaluacionMetaComponent } from './componentes/lov.evaluacionmeta.component';

const routes: Routes = [
  {
    path: '', component: LovEvaluacionMetaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovEvaluacionmetaRoutingModule {}
