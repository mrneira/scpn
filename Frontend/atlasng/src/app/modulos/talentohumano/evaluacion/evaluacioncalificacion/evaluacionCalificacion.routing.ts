import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EvaluacionCalificacionComponent } from './componentes/evaluacionCalificacion.component';

const routes: Routes = [
  { path: '', component: EvaluacionCalificacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluacionCalificacionRoutingModule {}
