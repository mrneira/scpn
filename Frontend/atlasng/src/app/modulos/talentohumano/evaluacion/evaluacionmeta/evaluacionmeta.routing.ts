import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EvaluacionmetaComponent } from './componentes/evaluacionmeta.component';

const routes: Routes = [
  { path: '', component: EvaluacionmetaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluacionmetaRoutingModule {}
