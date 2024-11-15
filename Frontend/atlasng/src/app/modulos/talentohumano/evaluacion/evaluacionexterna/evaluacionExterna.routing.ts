import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EvaluacionExternaComponent } from './componentes/evaluacionExterna.component';

const routes: Routes = [
  { path: '', component: EvaluacionExternaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluacionExternaRoutingModule {}
